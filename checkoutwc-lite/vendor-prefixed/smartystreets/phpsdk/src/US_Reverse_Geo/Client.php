<?php
/**
 * @license Apache-2.0
 *
 * Modified by Clifton Griffin on 09-April-2025 using {@see https://github.com/BrianHenryIE/strauss}.
 */

namespace CheckoutWC\SmartyStreets\PhpSdk\US_Reverse_Geo;

require_once(dirname(dirname(__FILE__)) . '/Exceptions/UnprocessableEntityException.php');
require_once(dirname(dirname(__FILE__)) . '/Sender.php');
require_once(dirname(dirname(__FILE__)) . '/Serializer.php');
require_once(dirname(dirname(__FILE__)) . '/Request.php');
require_once(dirname(dirname(__FILE__)) . '/Batch.php');
require_once('Response.php');
use CheckoutWC\SmartyStreets\PhpSdk\Sender;
use CheckoutWC\SmartyStreets\PhpSdk\Serializer;
use CheckoutWC\SmartyStreets\PhpSdk\Request;

/**
 * This client sends lookups to the SmartyStreets US Reverse Geocoding API, <br>
 *     and attaches the results to the appropriate Lookup objects.
 */
class Client {
    private $sender,
            $serializer;

    public function __construct(Sender $sender, Serializer $serializer = null) {
        $this->sender = $sender;
        $this->serializer = $serializer;
    }

    public function sendLookup(Lookup $lookup) {
        $request = $this->buildRequest($lookup);
        $response = $this->sender->send($request);

        $lookupResponse = new Response($this->serializer->deserialize($response->getPayload()));

        $lookup->setResponse($lookupResponse);
    }


    private function buildRequest(Lookup $lookup) {
        $request = new Request();

        $request->setParameter("latitude", $lookup->getLatitude());
        $request->setParameter("longitude", $lookup->getLongitude());
        $request->setParameter("source", $lookup->getSource());

        foreach ($lookup->getCustomParamArray() as $key => $value) {
            $request->setParameter($key, $value);
        }

        return $request;
    }
}