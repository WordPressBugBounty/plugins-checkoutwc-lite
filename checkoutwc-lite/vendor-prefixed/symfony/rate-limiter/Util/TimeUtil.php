<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace CheckoutWC\Symfony\Component\RateLimiter\Util;

/**
 * @author Wouter de Jong <wouter@wouterj.nl>
 *
 * @internal
 */
final class TimeUtil
{
    public static function dateIntervalToSeconds(\DateInterval $interval): int
    {
        $now = \DateTimeImmutable::createFromFormat('U', time());

        return $now->add($interval)->getTimestamp() - $now->getTimestamp();
    }
}
