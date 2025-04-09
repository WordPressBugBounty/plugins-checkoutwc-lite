<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment;
use CheckoutWC\SmartyStreets\PhpSdk\ArrayUtil;

class MatchedAddress {

    //region [ Fields ]

    public $street,
    $city,
    $state,
    $zipcode;

    //endregion

    public function __construct($obj = null) {
        $this->street = ArrayUtil::setField($obj, "street");
        $this->city = ArrayUtil::setField($obj, "city");
        $this->state = ArrayUtil::setField($obj, "state");
        $this->zipcode = ArrayUtil::setField($obj, "zipcode");
    }
}