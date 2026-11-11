<?php

declare( strict_types = 1 );

namespace Objectiv\Plugins\Checkout\Admin;

/**
 * Reports what merchants do with the Dashboard cards: the starter order bump, Turnstile and address autocomplete.
 *
 * Fires `cfw_dashboard_card_action`, which the paid build's telemetry listens to. UI code never talks to the telemetry service itself.
 *
 * @since 11.5.0
 */
final class DashboardCardEvent {

	/** @var string[] the cards */
	public const CARDS = [ 'starter_bump', 'turnstile', 'address_autocomplete' ];

	/** @var string[] what can happen to a card; `shown` is the denominator for the rest */
	public const ACTIONS = [ 'shown', 'create', 'choose_product', 'setup', 'dismiss' ];

	/** @var string[] where the card was */
	public const LOCATIONS = [ 'dashboard', 'order_bumps' ];

	/**
	 * Fires the action for a known card, action and location. Anything else is ignored, so no free text reaches telemetry.
	 *
	 * @since 11.5.0
	 *
	 * @param string $card one of CARDS
	 * @param string $action one of ACTIONS
	 * @param string $location one of LOCATIONS
	 *
	 * @return bool whether the action fired
	 */
	public static function fire( string $card, string $action, string $location ): bool {
		if ( ! self::is_valid( $card, $action, $location ) ) {
			return false;
		}

		/**
		 * Fires when a Dashboard card is shown or used. For telemetry.
		 *
		 * Internal: only CheckoutWC's own telemetry should listen. Its name and arguments may change without notice.
		 *
		 * @internal
		 *
		 * @since 11.5.0
		 *
		 * @param string $card `starter_bump`, `turnstile` or `address_autocomplete`
		 * @param string $action `shown`, `create`, `choose_product`, `setup` or `dismiss`
		 * @param string $location `dashboard` or `order_bumps`
		 */
		do_action( 'cfw_dashboard_card_action', $card, $action, $location );

		return true;
	}

	/**
	 * Whether the card, action and location are all known.
	 *
	 * @since 11.5.0
	 *
	 * @param string $card the card
	 * @param string $action the action
	 * @param string $location the location
	 *
	 * @return bool
	 */
	public static function is_valid( string $card, string $action, string $location ): bool {
		return in_array( $card, self::CARDS, true ) && in_array( $action, self::ACTIONS, true ) && in_array( $location, self::LOCATIONS, true );
	}
}
