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

namespace CheckoutWC\Symfony\Component\OptionsResolver\Exception;

/**
 * Thrown when an argument is invalid.
 *
 * @author Bernhard Schussek <bschussek@gmail.com>
 */
class InvalidArgumentException extends \InvalidArgumentException implements ExceptionInterface
{
}
