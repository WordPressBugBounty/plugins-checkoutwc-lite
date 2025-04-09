<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

include_once('Serializer.php');

class NativeSerializer implements Serializer {
    public function __construct(){

    }

    public function serialize($obj) {
        return json_encode($obj);
    }

    public function deserialize($payload) {
        return json_decode($payload, true);
    }
}