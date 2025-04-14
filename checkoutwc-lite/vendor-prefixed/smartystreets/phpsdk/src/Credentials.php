<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

/**
 * Credentials are classes that 'sign' requests by adding SmartyStreets authentication keys.
 */
interface Credentials {
    function sign(Request $request);
}