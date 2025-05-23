<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace CheckoutWC\Symfony\Component\RateLimiter\Policy;

use CheckoutWC\Symfony\Component\Lock\LockInterface;
use CheckoutWC\Symfony\Component\Lock\NoLock;
use CheckoutWC\Symfony\Component\RateLimiter\Exception\MaxWaitDurationExceededException;
use CheckoutWC\Symfony\Component\RateLimiter\LimiterInterface;
use CheckoutWC\Symfony\Component\RateLimiter\RateLimit;
use CheckoutWC\Symfony\Component\RateLimiter\Reservation;
use CheckoutWC\Symfony\Component\RateLimiter\Storage\StorageInterface;
use CheckoutWC\Symfony\Component\RateLimiter\Util\TimeUtil;

/**
 * @author Wouter de Jong <wouter@wouterj.nl>
 */
final class FixedWindowLimiter implements LimiterInterface
{
    use ResetLimiterTrait;

    private $limit;

    /**
     * @var int seconds
     */
    private $interval;

    public function __construct(string $id, int $limit, \DateInterval $interval, StorageInterface $storage, ?LockInterface $lock = null)
    {
        if ($limit < 1) {
            throw new \InvalidArgumentException(sprintf('Cannot set the limit of "%s" to 0, as that would never accept any hit.', __CLASS__));
        }

        $this->storage = $storage;
        $this->lock = $lock ?? new NoLock();
        $this->id = $id;
        $this->limit = $limit;
        $this->interval = TimeUtil::dateIntervalToSeconds($interval);
    }

    public function reserve(int $tokens = 1, ?float $maxTime = null): Reservation
    {
        if ($tokens > $this->limit) {
            throw new \InvalidArgumentException(sprintf('Cannot reserve more tokens (%d) than the size of the rate limiter (%d).', $tokens, $this->limit));
        }

        $this->lock->acquire(true);

        try {
            $window = $this->storage->fetch($this->id);
            if (!$window instanceof Window) {
                $window = new Window($this->id, $this->interval, $this->limit);
            }

            $now = microtime(true);
            $availableTokens = $window->getAvailableTokens($now);
            if ($availableTokens >= $tokens) {
                $window->add($tokens, $now);

                $reservation = new Reservation($now, new RateLimit($window->getAvailableTokens($now), \DateTimeImmutable::createFromFormat('U', floor($now)), true, $this->limit));
            } else {
                $waitDuration = $window->calculateTimeForTokens($tokens, $now);

                if (null !== $maxTime && $waitDuration > $maxTime) {
                    // process needs to wait longer than set interval
                    throw new MaxWaitDurationExceededException(sprintf('The rate limiter wait time ("%d" seconds) is longer than the provided maximum time ("%d" seconds).', $waitDuration, $maxTime), new RateLimit($window->getAvailableTokens($now), \DateTimeImmutable::createFromFormat('U', floor($now + $waitDuration)), false, $this->limit));
                }

                $window->add($tokens, $now);

                $reservation = new Reservation($now + $waitDuration, new RateLimit($window->getAvailableTokens($now), \DateTimeImmutable::createFromFormat('U', floor($now + $waitDuration)), false, $this->limit));
            }
            $this->storage->save($window);
        } finally {
            $this->lock->release();
        }

        return $reservation;
    }

    /**
     * {@inheritdoc}
     */
    public function consume(int $tokens = 1): RateLimit
    {
        try {
            return $this->reserve($tokens, 0)->getRateLimit();
        } catch (MaxWaitDurationExceededException $e) {
            return $e->getRateLimit();
        }
    }

    public function getAvailableTokens(int $hitCount): int
    {
        return $this->limit - $hitCount;
    }
}
