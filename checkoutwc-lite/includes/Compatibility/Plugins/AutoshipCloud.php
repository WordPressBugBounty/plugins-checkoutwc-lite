<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\CompatibilityAbstract;

/**
 * Autoship Cloud compatibility.
 *
 * @since 11.5.1
 */
class AutoshipCloud extends CompatibilityAbstract {
	/**
	 * Checks whether Autoship Cloud is active.
	 *
	 * @since 11.5.1
	 *
	 * @return bool
	 */
	public function is_available(): bool {
		return defined( 'Autoship_Version' );
	}

	/**
	 * Hooks side cart updates.
	 *
	 * @since 11.5.1
	 *
	 * @return void
	 */
	public function run_immediately() {
		add_action( 'cfw_before_update_side_cart_action', [ $this, 'keep_schedule_dates' ] );
	}

	/**
	 * Stops Autoship from clearing schedule dates on side cart updates.
	 *
	 * Autoship's cart update callback reads each item's schedule from the posted cart form, which the side cart
	 * doesn't send. Autoship restores the schedule from the session, so skipping it keeps the dates.
	 *
	 * @since 11.5.1
	 *
	 * @return void
	 */
	public function keep_schedule_dates() {
		remove_filter( 'woocommerce_update_cart_action_cart_updated', 'autoship_update_cart_action' );
	}
}
