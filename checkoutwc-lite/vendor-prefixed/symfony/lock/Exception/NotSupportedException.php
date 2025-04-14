<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\Symfony\Component\Lock\Exception;

trigger_deprecation('symfony/lock', '5.2', '%s is deprecated, You should stop using it, as it will be removed in 6.0.', NotSupportedException::class);

/**
 * NotSupportedException is thrown when an unsupported method is called.
 *
 * @author Jérémy Derussé <jeremy@derusse.com>
 *
 * @deprecated since Symfony 5.2
 */
class NotSupportedException extends \LogicException implements ExceptionInterface
{
}
