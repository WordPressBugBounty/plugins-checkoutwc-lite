<?php

namespace CheckoutWC\SmartyStreets\PhpSdk;

use CheckoutWC\SmartyStreets\PhpSdk\US_Autocomplete\Client as USAutoCompleteApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\US_Autocomplete_Pro\Client as USAutoCompleteProApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\US_Extract\Client as USExtractApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\International_Street\Client as InternationalStreetApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\International_Autocomplete\Client as InternationalAutocompleteApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\US_Street\Client as USStreetApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\US_ZIPCode\Client as USZIPCodeApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\US_Reverse_Geo\Client as USReverseGeoApiClient;
use CheckoutWC\SmartyStreets\PhpSdk\US_Enrichment\Client as USEnrichmentApiClient;

require_once('Serializer.php');
require_once('Request.php');
require_once('NativeSerializer.php');
require_once('NativeSender.php');
require_once('StatusCodeSender.php');
require_once('SigningSender.php');
require_once('LicenseSender.php');
require_once('RetrySender.php');
require_once('URLPrefixSender.php');
require_once('Batch.php');
require_once('MyLogger.php');
require_once('MySleeper.php');
require_once('Proxy.php');
require_once(dirname(__FILE__) . '/US_Street/Client.php');
require_once(dirname(__FILE__) . '/US_ZIPCode/Client.php');
require_once(dirname(__FILE__) . '/US_Extract/Client.php');
require_once(dirname(__FILE__) . '/US_Autocomplete_Pro/Client.php');
require_once(dirname(__FILE__) . '/International_Street/Client.php');
require_once(dirname(__FILE__) . '/International_Autocomplete/Client.php');
require_once(dirname(__FILE__) . '/US_Reverse_Geo/Client.php');
require_once(dirname(__FILE__) . '/US_Enrichment/Client.php');

/**
 * The ClientBuilder class helps you build a client object for one of the supported SmartyStreets APIs.<br>
 * You can use ClientBuilder's methods to customize settings like maximum retries or timeout duration. These methods<br>
 * are chainable, so you can usually get set up with one line of code.
 */
class ClientBuilder {
    const INTERNATIONAL_STREET_API_URL = "https://international-street.api.smarty.com/verify";
    const INTERNATIONAL_AUTOCOMPLETE_API_URL = "https://international-autocomplete.api.smarty.com/v2/lookup";
    const US_AUTOCOMPLETE_API_URL = "https://us-autocomplete.api.smarty.com/suggest";
    const US_AUTOCOMPLETE_PRO_API_URL = "https://us-autocomplete-pro.api.smarty.com/lookup";
    const US_EXTRACT_API_URL = "https://us-extract.api.smarty.com";
    const US_STREET_API_URL = "https://us-street.api.smarty.com/street-address";
    const US_ZIP_CODE_API_URL = "https://us-zipcode.api.smarty.com/lookup";
    const US_REVERSE_GEO_API_URL = "https://us-reverse-geo.api.smarty.com/lookup";
    const US_ENRICHMENT_API_URL = "https://us-enrichment.api.smarty.com/lookup/";

    private $signer,
            $serializer,
            $httpSender,
            $maxRetries,
            $maxTimeout,
            $urlPrefix,
            $proxy,
            $logger,
            $debugMode,
            $licenses,
            $ip;

    public function __construct(Credentials $signer = null) {
        $this->serializer = new NativeSerializer();
        $this->maxRetries = 5;
        $this->maxTimeout = 10000;
        $this->signer = $signer;
        $this->logger = new MyLogger();
        $this->debugMode = false;
        $this->licenses = [];
        $this->ip = null;
    }

    /**
     * @param int $maxRetries The maximum number of times to retry sending the request to the API. (Default is 5)
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function retryAtMost($maxRetries) {
        $this->maxRetries = $maxRetries;
        return $this;
    }

    /**
     * @param int $maxTimeout The maximum time (in milliseconds) to wait for a connection, and also to wait for <br>
     *                   the response to be read. (Default is 10000)
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withMaxTimeout($maxTimeout) {
        $this->maxTimeout = $maxTimeout;
        return $this;
    }

    /**
     * ViaProxy saves the address of your proxy server through which to send all requests.
     * @param string $proxyAddress Proxy address of your proxy server.
     * @param string $proxyUsername Username for proxy authentication.
     * @param string $proxyPassword Password for proxy authentication.
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function viaProxy($proxyAddress, $proxyUsername = null, $proxyPassword = null) {
        $this->proxy = new Proxy($proxyAddress);

        if ($proxyUsername != null && $proxyPassword != null)
            $this->proxy->setCredentials($proxyUsername, $proxyPassword);

        return $this;
    }

    /**
     * @param Sender $sender Default is a series of nested senders. See <b>buildSender()</b>.
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withSender(Sender $sender) {
        $this->httpSender = $sender;
        return $this;
    }

    /**
     * Changes the <b>Serializer</b> from the default <b>NativeSerializer</b>.
     * @param Serializer $serializer An object that implements the <b>Serializer</b> interface.
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withSerializer(Serializer $serializer) {
        $this->serializer = $serializer;
        return $this;
    }

    /**
     * This may be useful when using a local installation of the SmartyStreets APIs.
     * @param string $urlPrefix Defaults to the URL for the API corresponding to the <b>Client</b> object being built.
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withUrl($urlPrefix) {
        $this->urlPrefix = $urlPrefix;
        return $this;
    }

    /**
     * Set a logger instance to be used by the default Sender implementation.
     * @param Logger $logger the new default logger
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withDefaultLogger(Logger $logger) {
        $this->logger = $logger;
        return $this;
    }

    /**
     * Enables debug mode, which will print information about the HTTP request and response to STDERR
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withDebug() {
        $this->debugMode = true;
        return $this;
    }

    /**
     * Allows the caller to specify the subscription license(s) (aka "track") they wish to use.
     * @param $licenses [String] An array of license strings
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withLicenses($licenses) {
        $this->licenses = array_merge($this->licenses, $licenses);
        return $this;
    }

    /**
     * Allows the caller to include an X-Forwarded-For header in their request, passing on the end user's IP address
     * @param string $ip The IP of the end user
     * @return $this Returns <b>this</b> to accommodate method chaining.
     */
    public function withXForwardedFor($ip) {
        $this->ip = $ip;
        return $this;
    }

    public function buildUSAutocompleteProApiClient() {
        $this->ensureURLPrefixNotNull(self::US_AUTOCOMPLETE_PRO_API_URL);
        return new USAutoCompleteProApiClient($this->buildSender(), $this->serializer);
    }

    public function buildUSExtractApiClient() {
        $this->ensureURLPrefixNotNull(self::US_EXTRACT_API_URL);
        return new USExtractApiClient($this->buildSender(), $this->serializer);
    }

    public function buildInternationalStreetApiClient() {
        $this->ensureURLPrefixNotNull(self::INTERNATIONAL_STREET_API_URL);
        return new InternationalStreetApiClient($this->buildSender(), $this->serializer);
    }

    public function buildInternationalAutocompleteApiClient() {
        $this->ensureURLPrefixNotNull(self::INTERNATIONAL_AUTOCOMPLETE_API_URL);
        return new InternationalAutocompleteApiClient($this->buildSender(), $this->serializer);
    }

    public function buildUsStreetApiClient() {
        $this->ensureURLPrefixNotNull(self::US_STREET_API_URL);
        return new USStreetApiClient($this->buildSender(), $this->serializer);
    }

    public function buildUsZIPCodeApiClient() {
        $this->ensureURLPrefixNotNull(self::US_ZIP_CODE_API_URL);
        return new USZIPCodeApiClient($this->buildSender(), $this->serializer);
    }

    public function buildUsReverseGeoApiClient() {
        $this->ensureURLPrefixNotNull(self::US_REVERSE_GEO_API_URL);
        return new USReverseGeoApiClient($this->buildSender(), $this->serializer);
    }

    public function buildUsEnrichmentApiClient() {
        $this->ensureURLPrefixNotNull(self::US_ENRICHMENT_API_URL);
        return new USEnrichmentApiClient($this->buildSender(), $this->serializer);
    }

    private function buildSender() {
        if ($this->httpSender != null)
            return $this->httpSender;

        $sender = new NativeSender($this->maxTimeout, $this->proxy, $this->debugMode, $this->ip);

        $sender = new StatusCodeSender($sender);

        if ($this->maxRetries > 0)
            $sender = new RetrySender($this->maxRetries, new MySleeper(), $this->logger, $sender);

        if ($this->signer != null)
            $sender = new SigningSender($this->signer, $sender);

        $sender = new URLPrefixSender($this->urlPrefix, $sender);

        $sender = new LicenseSender($this->licenses, $sender);

        return $sender;
    }

    private function ensureURLPrefixNotNull($url) {
        if ($this->urlPrefix == null)
            $this->urlPrefix = $url;
    }
}