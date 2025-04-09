<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk;

include_once('Logger.php');

/**
 * Log adapter for a PSR-3 compatible logging channel, such as Monolog.
 *
 * @package SmartyStreets\PhpSdk
 */
class Psr3Logger implements Logger
{
    private $logger;

    function __construct(\CheckoutWC\Psr\Log\LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    function log($message)
    {
        $this->logger->info($message);
    }
}
