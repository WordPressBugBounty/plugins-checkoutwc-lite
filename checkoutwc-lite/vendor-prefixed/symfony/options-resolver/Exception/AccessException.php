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
 * Thrown when trying to read an option outside of or write it inside of
 * {@link \Symfony\Component\OptionsResolver\Options::resolve()}.
 *
 * @author Bernhard Schussek <bschussek@gmail.com>
 */
class AccessException extends \LogicException implements ExceptionInterface
{
}
