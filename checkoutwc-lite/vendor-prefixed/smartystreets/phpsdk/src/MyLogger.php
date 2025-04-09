<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

include_once('Logger.php');

class MyLogger implements Logger {
    public function log($message) {
        error_log($message);
    }
}
