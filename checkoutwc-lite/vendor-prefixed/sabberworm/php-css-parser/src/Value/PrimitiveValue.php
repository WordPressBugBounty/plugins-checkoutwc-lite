<?php
/**
 * @license MIT
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\Sabberworm\CSS\Value;

abstract class PrimitiveValue extends Value
{
    /**
     * @param int $iLineNo
     */
    public function __construct($iLineNo = 0)
    {
        parent::__construct($iLineNo);
    }
}
