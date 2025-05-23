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

use CheckoutWC\Symfony\Component\RateLimiter\Exception\RateLimitExceededException;

/**
 * @author Valentin Silvestre <vsilvestre.pro@gmail.com>
 */
class RateLimit
{
    private $availableTokens;
    private $retryAfter;
    private $accepted;
    private $limit;

    public function __construct(int $availableTokens, \DateTimeImmutable $retryAfter, bool $accepted, int $limit)
    {
        $this->availableTokens = $availableTokens;
        $this->retryAfter = $retryAfter;
        $this->accepted = $accepted;
        $this->limit = $limit;
    }

    public function isAccepted(): bool
    {
        return $this->accepted;
    }

    /**
     * @return $this
     *
     * @throws RateLimitExceededException if not accepted
     */
    public function ensureAccepted(): self
    {
        if (!$this->accepted) {
            throw new RateLimitExceededException($this);
        }

        return $this;
    }

    public function getRetryAfter(): \DateTimeImmutable
    {
        return $this->retryAfter;
    }

    public function getRemainingTokens(): int
    {
        return $this->availableTokens;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function wait(): void
    {
        $delta = $this->retryAfter->format('U.u') - microtime(true);
        if ($delta <= 0) {
            return;
        }

        usleep((int) ($delta * 1e6));
    }
}
