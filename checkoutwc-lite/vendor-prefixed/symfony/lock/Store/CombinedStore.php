<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace CheckoutWC\Symfony\Component\Lock\Store;

use CheckoutWC\Psr\Log\LoggerAwareInterface;
use CheckoutWC\Psr\Log\LoggerAwareTrait;
use CheckoutWC\Psr\Log\NullLogger;
use CheckoutWC\Symfony\Component\Lock\Exception\InvalidArgumentException;
use CheckoutWC\Symfony\Component\Lock\Exception\LockConflictedException;
use CheckoutWC\Symfony\Component\Lock\Key;
use CheckoutWC\Symfony\Component\Lock\PersistingStoreInterface;
use CheckoutWC\Symfony\Component\Lock\SharedLockStoreInterface;
use CheckoutWC\Symfony\Component\Lock\Strategy\StrategyInterface;

/**
 * CombinedStore is a PersistingStoreInterface implementation able to manage and synchronize several StoreInterfaces.
 *
 * @author Jérémy Derussé <jeremy@derusse.com>
 */
class CombinedStore implements SharedLockStoreInterface, LoggerAwareInterface
{
    use ExpiringStoreTrait;
    use LoggerAwareTrait;

    /** @var PersistingStoreInterface[] */
    private $stores;
    /** @var StrategyInterface */
    private $strategy;

    /**
     * @param PersistingStoreInterface[] $stores The list of synchronized stores
     *
     * @throws InvalidArgumentException
     */
    public function __construct(array $stores, StrategyInterface $strategy)
    {
        foreach ($stores as $store) {
            if (!$store instanceof PersistingStoreInterface) {
                throw new InvalidArgumentException(sprintf('The store must implement "%s". Got "%s".', PersistingStoreInterface::class, get_debug_type($store)));
            }
        }

        $this->stores = $stores;
        $this->strategy = $strategy;
        $this->logger = new NullLogger();
    }

    /**
     * {@inheritdoc}
     */
    public function save(Key $key)
    {
        $successCount = 0;
        $failureCount = 0;
        $storesCount = \count($this->stores);

        foreach ($this->stores as $store) {
            try {
                $store->save($key);
                ++$successCount;
            } catch (\Exception $e) {
                $this->logger->debug('One store failed to save the "{resource}" lock.', ['resource' => $key, 'store' => $store, 'exception' => $e]);
                ++$failureCount;
            }

            if (!$this->strategy->canBeMet($failureCount, $storesCount)) {
                break;
            }
        }

        $this->checkNotExpired($key);

        if ($this->strategy->isMet($successCount, $storesCount)) {
            return;
        }

        $this->logger->info('Failed to store the "{resource}" lock. Quorum has not been met.', ['resource' => $key, 'success' => $successCount, 'failure' => $failureCount]);

        // clean up potential locks
        $this->delete($key);

        throw new LockConflictedException();
    }

    public function saveRead(Key $key)
    {
        $successCount = 0;
        $failureCount = 0;
        $storesCount = \count($this->stores);

        foreach ($this->stores as $store) {
            try {
                if ($store instanceof SharedLockStoreInterface) {
                    $store->saveRead($key);
                } else {
                    $store->save($key);
                }
                ++$successCount;
            } catch (\Exception $e) {
                $this->logger->debug('One store failed to save the "{resource}" lock.', ['resource' => $key, 'store' => $store, 'exception' => $e]);
                ++$failureCount;
            }

            if (!$this->strategy->canBeMet($failureCount, $storesCount)) {
                break;
            }
        }

        $this->checkNotExpired($key);

        if ($this->strategy->isMet($successCount, $storesCount)) {
            return;
        }

        $this->logger->info('Failed to store the "{resource}" lock. Quorum has not been met.', ['resource' => $key, 'success' => $successCount, 'failure' => $failureCount]);

        // clean up potential locks
        $this->delete($key);

        throw new LockConflictedException();
    }

    /**
     * {@inheritdoc}
     */
    public function putOffExpiration(Key $key, float $ttl)
    {
        $successCount = 0;
        $failureCount = 0;
        $storesCount = \count($this->stores);
        $expireAt = microtime(true) + $ttl;

        foreach ($this->stores as $store) {
            try {
                if (0.0 >= $adjustedTtl = $expireAt - microtime(true)) {
                    $this->logger->debug('Stores took to long to put off the expiration of the "{resource}" lock.', ['resource' => $key, 'store' => $store, 'ttl' => $ttl]);
                    $key->reduceLifetime(0);
                    break;
                }

                $store->putOffExpiration($key, $adjustedTtl);
                ++$successCount;
            } catch (\Exception $e) {
                $this->logger->debug('One store failed to put off the expiration of the "{resource}" lock.', ['resource' => $key, 'store' => $store, 'exception' => $e]);
                ++$failureCount;
            }

            if (!$this->strategy->canBeMet($failureCount, $storesCount)) {
                break;
            }
        }

        $this->checkNotExpired($key);

        if ($this->strategy->isMet($successCount, $storesCount)) {
            return;
        }

        $this->logger->notice('Failed to define the expiration for the "{resource}" lock. Quorum has not been met.', ['resource' => $key, 'success' => $successCount, 'failure' => $failureCount]);

        // clean up potential locks
        $this->delete($key);

        throw new LockConflictedException();
    }

    /**
     * {@inheritdoc}
     */
    public function delete(Key $key)
    {
        foreach ($this->stores as $store) {
            try {
                $store->delete($key);
            } catch (\Exception $e) {
                $this->logger->notice('One store failed to delete the "{resource}" lock.', ['resource' => $key, 'store' => $store, 'exception' => $e]);
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function exists(Key $key)
    {
        $successCount = 0;
        $failureCount = 0;
        $storesCount = \count($this->stores);

        foreach ($this->stores as $store) {
            try {
                if ($store->exists($key)) {
                    ++$successCount;
                } else {
                    ++$failureCount;
                }
            } catch (\Exception $e) {
                $this->logger->debug('One store failed to check the "{resource}" lock.', ['resource' => $key, 'store' => $store, 'exception' => $e]);
                ++$failureCount;
            }

            if ($this->strategy->isMet($successCount, $storesCount)) {
                return true;
            }
            if (!$this->strategy->canBeMet($failureCount, $storesCount)) {
                return false;
            }
        }

        return false;
    }
}
