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
use CheckoutWC\Symfony\Component\RateLimiter\Storage\StorageInterface;

trait ResetLimiterTrait
{
    /**
     * @var LockInterface
     */
    private $lock;

    /**
     * @var StorageInterface
     */
    private $storage;

    private $id;

    /**
     * {@inheritdoc}
     */
    public function reset(): void
    {
        try {
            $this->lock->acquire(true);

            $this->storage->delete($this->id);
        } finally {
            $this->lock->release();
        }
    }
}
