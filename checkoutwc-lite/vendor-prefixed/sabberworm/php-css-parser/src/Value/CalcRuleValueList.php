<?php
/**
 * @license MIT
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\Sabberworm\CSS\Value;

use CheckoutWC\Sabberworm\CSS\OutputFormat;

class CalcRuleValueList extends RuleValueList
{
    /**
     * @param int $iLineNo
     */
    public function __construct($iLineNo = 0)
    {
        parent::__construct(',', $iLineNo);
    }

    /**
     * @param OutputFormat|null $oOutputFormat
     *
     * @return string
     */
    public function render($oOutputFormat)
    {
        return $oOutputFormat->implode(' ', $this->aComponents);
    }
}
