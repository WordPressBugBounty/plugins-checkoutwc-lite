<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment\GeoReference;
use CheckoutWC\SmartyStreets\PhpSdk\ArrayUtil;

class CensusBlockEntry {
    //region [ Fields ]

    public $accuracy,
    $geoid;

    //endregion

    public function __construct($obj = null){
        if ($obj == null)
            return;
        $this->accuracy = ArrayUtil::setField($obj, "accuracy");
        $this->geoid = ArrayUtil::setField($obj, "geoid");
    }
}