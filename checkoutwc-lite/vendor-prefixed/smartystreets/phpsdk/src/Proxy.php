<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

class Proxy {
    //region [ Fields ]

    private $address,
            $credentials;

    //endregion

    //region [ Constructors ]

    public function __construct($address) {
        $this->address = $address;
    }

    //endregion

    public function getAddress() {
        return $this->address;
    }

    public function getCredentials() {
        return $this->credentials;
    }

    public function setCredentials($proxyUsername, $proxyPassword) {
        $this->credentials = $proxyUsername . ":" . $proxyPassword;
    }
}