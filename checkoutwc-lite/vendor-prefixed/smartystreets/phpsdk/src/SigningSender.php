<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

include_once('Sender.php');

class SigningSender implements Sender {
    private $signer,
            $inner;

    public function __construct(Credentials $signer, Sender $inner) {
        $this->signer = $signer;
        $this->inner = $inner;
    }

    function send(Request $request) {
        $this->signer->sign($request);
        return $this->inner->send($request);
    }
}