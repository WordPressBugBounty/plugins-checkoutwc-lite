<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace CheckoutWC\Symfony\Component\RateLimiter;

use CheckoutWC\Symfony\Component\RateLimiter\Exception\ReserveNotSupportedException;

/**
 * @author Wouter de Jong <wouter@wouterj.nl>
 */
final class CompoundLimiter implements LimiterInterface
{
    private $limiters;

    /**
     * @param LimiterInterface[] $limiters
     */
    public function __construct(array $limiters)
    {
        if (!$limiters) {
            throw new \LogicException(sprintf('"%s::%s()" require at least one limiter.', self::class, __METHOD__));
        }
        $this->limiters = $limiters;
    }

    public function reserve(int $tokens = 1, ?float $maxTime = null): Reservation
    {
        throw new ReserveNotSupportedException(__CLASS__);
    }

    public function consume(int $tokens = 1): RateLimit
    {
        $minimalRateLimit = null;
        foreach ($this->limiters as $limiter) {
            $rateLimit = $limiter->consume($tokens);

            if (null === $minimalRateLimit || $rateLimit->getRemainingTokens() < $minimalRateLimit->getRemainingTokens()) {
                $minimalRateLimit = $rateLimit;
            }
        }

        return $minimalRateLimit;
    }

    public function reset(): void
    {
        foreach ($this->limiters as $limiter) {
            $limiter->reset();
        }
    }
}
