<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */
namespace CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment;

use CheckoutWC\SmartyStreets\PhpSdk\ArrayUtil;

class SecondaryCountAttributes {

    //region [ Fields ]

    public $count;

    //endregion

    public function __construct($obj = null) {
        if ($obj == null)
            return;
            $this->count = ArrayUtil::setField($obj, "count");
    }
}