<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */
namespace CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment;

use CheckoutWC\SmartyStreets\PhpSdk\ArrayUtil;

require_once(dirname(dirname(__FILE__)) . '/US_Enrichment/Secondary/RootAddressEntry.php');
require_once(dirname(dirname(__FILE__)) . '/US_Enrichment/Secondary/AliasesEntry.php');
require_once(dirname(dirname(__FILE__)) . '/US_Enrichment/Secondary/SecondariesEntry.php');

use CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment\Secondary\RootAddressEntry;
use CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment\Secondary\AliasesEntry;
use CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment\Secondary\SecondariesEntry;

class SecondaryAttributes {

    //region [ Fields ]

    public $rootAddress,
    $aliases,
    $secondaries;

    //endregion

    public function __construct($obj = null) {
        if ($obj == null)
            return;
            $this->createRootAddress(ArrayUtil::setField($obj, "root_address"));
            $this->createAliases(ArrayUtil::setField($obj, "aliases"));
            $this->createSecondaries(ArrayUtil::setField($obj, "secondaries"));
    }

    private function createRootAddress($rootAddress){
        $this->rootAddress = new RootAddressEntry($rootAddress);
    }

    private function createAliases($aliasesArray){
        if ($aliasesArray != null) {
            foreach($aliasesArray as $value){
                $this->aliases[] = new AliasesEntry($value);
            }
        }
    }
    
    private function createSecondaries($secondariesArray){
        foreach($secondariesArray as $value){
            $this->secondaries[] = new SecondariesEntry($value);
        }
    }
}