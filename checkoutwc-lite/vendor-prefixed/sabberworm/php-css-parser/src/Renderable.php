<?php
/**
 * @license MIT
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\Sabberworm\CSS;

interface Renderable
{
    /**
     * @return string
     */
    public function __toString();

    /**
     * @param OutputFormat|null $oOutputFormat
     *
     * @return string
     */
    public function render($oOutputFormat);

    /**
     * @return int
     */
    public function getLineNo();
}
