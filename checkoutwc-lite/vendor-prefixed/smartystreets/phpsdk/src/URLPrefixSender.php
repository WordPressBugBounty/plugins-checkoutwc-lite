<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

include_once('Sender.php');

class URLPrefixSender implements Sender {
    private $urlPrefix,
            $inner;

    public function __construct($urlPrefix, Sender $inner) {
        $this->urlPrefix = $urlPrefix;
        $this->inner = $inner;
    }

    public function send(Request $request) {
        $request->setUrlPrefix($this->urlPrefix);
        return $this->inner->send($request);
    }
}