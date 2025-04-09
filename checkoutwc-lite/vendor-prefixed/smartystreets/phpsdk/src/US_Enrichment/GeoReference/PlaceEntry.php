<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment\GeoReference;
use CheckoutWC\SmartyStreets\PhpSdk\ArrayUtil;

class PlaceEntry {
    //region [ Fields ]

    public $accuracy,
    $code,
    $name,
    $type;

    //endregion

    public function __construct($obj = null){
        if ($obj == null)
            return;
        $this->accuracy = ArrayUtil::setField($obj, "accuracy");
        $this->code = ArrayUtil::setField($obj, "code");
        $this->name = ArrayUtil::setField($obj, "name");
        $this->type = ArrayUtil::setField($obj, "type");
    }
}