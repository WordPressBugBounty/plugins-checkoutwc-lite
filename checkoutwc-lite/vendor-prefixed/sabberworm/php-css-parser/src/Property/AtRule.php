<?php
/**
 * @license MIT
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\Sabberworm\CSS\Property;

use CheckoutWC\Sabberworm\CSS\Comment\Commentable;
use CheckoutWC\Sabberworm\CSS\Renderable;

interface AtRule extends Renderable, Commentable
{
    /**
     * Since there are more set rules than block rules,
     * we’re whitelisting the block rules and have anything else be treated as a set rule.
     *
     * @var string
     *
     * @internal since 8.5.2
     */
    const BLOCK_RULES = 'media/document/supports/region-style/font-feature-values';

    /**
     * … and more font-specific ones (to be used inside font-feature-values)
     *
     * @var string
     *
     * @internal since 8.5.2
     */
    const SET_RULES = 'font-face/counter-style/page/swash/styleset/annotation';

    /**
     * @return string|null
     */
    public function atRuleName();

    /**
     * @return string|null
     */
    public function atRuleArgs();
}
