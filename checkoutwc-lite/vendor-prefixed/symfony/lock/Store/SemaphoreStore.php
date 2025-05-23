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

use CheckoutWC\Symfony\Component\Lock\BlockingStoreInterface;
use CheckoutWC\Symfony\Component\Lock\Exception\InvalidArgumentException;
use CheckoutWC\Symfony\Component\Lock\Exception\LockConflictedException;
use CheckoutWC\Symfony\Component\Lock\Key;

/**
 * SemaphoreStore is a PersistingStoreInterface implementation using Semaphore as store engine.
 *
 * @author Jérémy Derussé <jeremy@derusse.com>
 */
class SemaphoreStore implements BlockingStoreInterface
{
    /**
     * Returns whether or not the store is supported.
     *
     * @internal
     */
    public static function isSupported(): bool
    {
        return \extension_loaded('sysvsem');
    }

    public function __construct()
    {
        if (!static::isSupported()) {
            throw new InvalidArgumentException('Semaphore extension (sysvsem) is required.');
        }
    }

    /**
     * {@inheritdoc}
     */
    public function save(Key $key)
    {
        $this->lock($key, false);
    }

    /**
     * {@inheritdoc}
     */
    public function waitAndSave(Key $key)
    {
        $this->lock($key, true);
    }

    private function lock(Key $key, bool $blocking)
    {
        if ($key->hasState(__CLASS__)) {
            return;
        }

        $keyId = unpack('i', md5($key, true))[1];
        $resource = @sem_get($keyId);
        $acquired = $resource && @sem_acquire($resource, !$blocking);

        while ($blocking && !$acquired) {
            $resource = @sem_get($keyId);
            $acquired = $resource && @sem_acquire($resource);
        }

        if (!$acquired) {
            throw new LockConflictedException();
        }

        $key->setState(__CLASS__, $resource);
        $key->markUnserializable();
    }

    /**
     * {@inheritdoc}
     */
    public function delete(Key $key)
    {
        // The lock is maybe not acquired.
        if (!$key->hasState(__CLASS__)) {
            return;
        }

        $resource = $key->getState(__CLASS__);

        sem_remove($resource);

        $key->removeState(__CLASS__);
    }

    /**
     * {@inheritdoc}
     */
    public function putOffExpiration(Key $key, float $ttl)
    {
        // do nothing, the semaphore locks forever.
    }

    /**
     * {@inheritdoc}
     */
    public function exists(Key $key)
    {
        return $key->hasState(__CLASS__);
    }
}
