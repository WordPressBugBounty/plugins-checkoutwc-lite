<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\CompatibilityAbstract;
use Objectiv\Plugins\Checkout\Model\DetectedPaymentGateway;
use Objectiv\Plugins\Checkout\Model\GatewaySupport;

class StripeWooCommerce extends CompatibilityAbstract {
	public function is_available(): bool {
		return class_exists( '\\WC_Stripe_Manager' );
	}

	public function pre_init() {
		if ( ! $this->is_available() ) {
			return;
		}

		add_filter(
			'cfw_detected_gateways',
			function ( $gateways ) {
				$gateways[] = new DetectedPaymentGateway(
					'Payment Plugins for Stripe WooCommerce',
					GatewaySupport::FULLY_SUPPORTED
				);

				return $gateways;
			}
		);
	}

	public function run() {
		if ( ! class_exists( '\\WC_Stripe_Field_Manager' ) ) {
			return;
		}

		// Remove theirs
		remove_action( 'woocommerce_checkout_before_customer_details', array( \WC_Stripe_Field_Manager::class, 'output_banner_checkout_fields' ) );

		// Add our own stripe requests
		add_action( 'cfw_payment_request_buttons', array( '\\WC_Stripe_Field_Manager', 'output_banner_checkout_fields' ), 1 );
	}
}
