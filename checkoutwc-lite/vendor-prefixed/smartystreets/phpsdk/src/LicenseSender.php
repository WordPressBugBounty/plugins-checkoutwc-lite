<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

include_once('Sender.php');

class LicenseSender implements Sender {
    private $licenses,
            $inner;

    public function __construct($licenses, Sender $inner) {
        $this->licenses = $licenses;
        $this->inner = $inner;
    }

    public function send(Request $request) {
        if (count($this->licenses) > 0) {
            $request->setParameter("license", join(",", $this->licenses));
        }
        return $this->inner->send($request);
    }
}