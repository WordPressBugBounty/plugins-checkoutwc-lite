<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\Symfony\Component\CssSelector;

use CheckoutWC\Symfony\Component\CssSelector\Parser\Shortcut\ClassParser;
use CheckoutWC\Symfony\Component\CssSelector\Parser\Shortcut\ElementParser;
use CheckoutWC\Symfony\Component\CssSelector\Parser\Shortcut\EmptyStringParser;
use CheckoutWC\Symfony\Component\CssSelector\Parser\Shortcut\HashParser;
use CheckoutWC\Symfony\Component\CssSelector\XPath\Extension\HtmlExtension;
use CheckoutWC\Symfony\Component\CssSelector\XPath\Translator;

/**
 * CssSelectorConverter is the main entry point of the component and can convert CSS
 * selectors to XPath expressions.
 *
 * @author Christophe Coevoet <stof@notk.org>
 */
class CssSelectorConverter
{
    private $translator;

    /**
     * @param bool $html Whether HTML support should be enabled. Disable it for XML documents
     */
    public function __construct(bool $html = true)
    {
        $this->translator = new Translator();

        if ($html) {
            $this->translator->registerExtension(new HtmlExtension($this->translator));
        }

        $this->translator
            ->registerParserShortcut(new EmptyStringParser())
            ->registerParserShortcut(new ElementParser())
            ->registerParserShortcut(new ClassParser())
            ->registerParserShortcut(new HashParser())
        ;
    }

    /**
     * Translates a CSS expression to its XPath equivalent.
     *
     * Optionally, a prefix can be added to the resulting XPath
     * expression with the $prefix parameter.
     *
     * @param string $cssExpr The CSS expression
     * @param string $prefix  An optional prefix for the XPath expression
     *
     * @return string
     */
    public function toXPath($cssExpr, $prefix = 'descendant-or-self::')
    {
        return $this->translator->cssToXPath($cssExpr, $prefix);
    }
}
