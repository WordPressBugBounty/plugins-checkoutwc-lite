<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\CompatibilityAbstract;

/**
 * ActiveCampaign for WooCommerce compatibility.
 */
class ActiveCampaign extends CompatibilityAbstract {
	/**
	 * Whether ActiveCampaign for WooCommerce is active.
	 *
	 * @return bool
	 */
	public function is_available(): bool {
		return function_exists( 'activecampaign_for_woocommerce_build_container' );
	}

	/**
	 * Renders ActiveCampaign's opt-in checkbox where shoppers can see it.
	 *
	 * @return void
	 */
	public function run() {
		// ActiveCampaign 3.0+ also hooks the opt-in here, and CheckoutWC outputs this hook hidden. The opt-in renders once per request, so a hidden render would replace the visible one.
		$hidden = $this->get_checkout_form_handler( 'woocommerce_checkout_after_customer_details' );

		if ( null !== $hidden ) {
			remove_action( 'woocommerce_checkout_after_customer_details', [ $hidden['object'], 'handle_woocommerce_checkout_form' ], $hidden['priority'] );
		}

		$handler = $hidden ?? $this->get_checkout_form_handler( 'woocommerce_after_checkout_billing_form' );

		if ( null !== $handler ) {
			/**
			 * Filters hook to render Active Campaign checkbox output
			 *
			 * @since 2.0.0
			 *
			 * @param string $render_on The action hook to render on
			 */
			$render_on = apply_filters( 'cfw_active_campaign_checkbox_hook', 'cfw_checkout_before_payment_method_tab_nav' );

			add_action( $render_on, [ $handler['object'], 'handle_woocommerce_checkout_form' ] );
		}
	}

	/**
	 * Finds ActiveCampaign's opt-in checkbox callback on a hook, at any priority.
	 *
	 * @since 11.5.0
	 *
	 * @param string $hook action hook name
	 * @return array{object: object, priority: int}|null
	 */
	private function get_checkout_form_handler( string $hook ): ?array {
		global $wp_filter;

		if ( empty( $wp_filter[ $hook ]->callbacks ) ) {
			return null;
		}

		foreach ( $wp_filter[ $hook ]->callbacks as $priority => $callbacks ) {
			foreach ( $callbacks as $callback ) {
				$function = $callback['function'] ?? null;

				if ( is_array( $function ) && is_object( $function[0] ) && 'handle_woocommerce_checkout_form' === $function[1] ) {
					return [
						'object'   => $function[0],
						'priority' => (int) $priority,
					];
				}
			}
		}

		return null;
	}
}
