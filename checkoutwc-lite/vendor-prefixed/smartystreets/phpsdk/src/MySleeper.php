<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

include_once('Sleeper.php');

class MySleeper implements Sleeper {
    public function sleep($seconds) {
        sleep($seconds);
    }
}