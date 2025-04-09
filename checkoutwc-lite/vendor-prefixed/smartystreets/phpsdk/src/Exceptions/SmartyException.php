<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk\Exceptions;

class SmartyException extends \Exception {
    public function __construct($message, $code = 0, Throwable $previous = null) {

        parent::__construct($message, $code, $previous);
    }
}