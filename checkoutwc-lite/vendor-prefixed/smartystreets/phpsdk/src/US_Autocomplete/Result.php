<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 24-January-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk\US_Autocomplete;

require_once(dirname(dirname(__FILE__)) . '/ArrayUtil.php');
require_once('Suggestion.php');
use CheckoutWC\SmartyStreets\PhpSdk\ArrayUtil;

class Result {
    private $suggestions;

    public function __construct($obj = null) {
        if ($obj == null)
            return;

        $this->suggestions = ArrayUtil::setField($obj, 'suggestions', array());

        $this->suggestions = $this->convertToSuggestionObjects();
    }

    private function convertToSuggestionObjects() {
        $suggestionObjects = array();

        foreach ($this->suggestions as $suggestion)
            $suggestionObjects[] = new Suggestion($suggestion);

        return $suggestionObjects;
    }

    public function getSuggestions() {
        return $this->suggestions;
    }

    public function getSuggestion($index) {
        return $this->suggestions[$index];
    }
}