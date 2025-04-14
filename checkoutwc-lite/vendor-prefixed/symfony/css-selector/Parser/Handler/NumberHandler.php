<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Modified by Clifton Griffin on 14-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\Symfony\Component\CssSelector\Parser\Handler;

use CheckoutWC\Symfony\Component\CssSelector\Parser\Reader;
use CheckoutWC\Symfony\Component\CssSelector\Parser\Token;
use CheckoutWC\Symfony\Component\CssSelector\Parser\Tokenizer\TokenizerPatterns;
use CheckoutWC\Symfony\Component\CssSelector\Parser\TokenStream;

/**
 * CSS selector comment handler.
 *
 * This component is a port of the Python cssselect library,
 * which is copyright Ian Bicking, @see https://github.com/SimonSapin/cssselect.
 *
 * @author Jean-François Simon <jeanfrancois.simon@sensiolabs.com>
 *
 * @internal
 */
class NumberHandler implements HandlerInterface
{
    private $patterns;

    public function __construct(TokenizerPatterns $patterns)
    {
        $this->patterns = $patterns;
    }

    /**
     * {@inheritdoc}
     */
    public function handle(Reader $reader, TokenStream $stream): bool
    {
        $match = $reader->findPattern($this->patterns->getNumberPattern());

        if (!$match) {
            return false;
        }

        $stream->push(new Token(Token::TYPE_NUMBER, $match[0], $reader->getPosition()));
        $reader->moveForward(\strlen($match[0]));

        return true;
    }
}
