<?php

namespace Objectiv\Plugins\Checkout\Admin\Notices;

use DateTimeImmutable;
use DateTimeZone;
use Exception;

/**
 * Black Friday notice for CheckoutWC Lite, shown during the campaign window.
 */
class BFNotice extends NoticeAbstract {
	/**
	 * When the Black Friday notice starts showing (America/New_York).
	 *
	 * @since 11.5.0
	 */
	const CAMPAIGN_START = '2026-11-05 00:00:00';

	/**
	 * When the Black Friday notice stops showing (America/New_York).
	 *
	 * @since 11.5.0
	 */
	const CAMPAIGN_END = '2026-11-30 23:59:59';

	/**
	 * The notice ID.
	 *
	 * @since 11.5.0
	 */
	private const NOTICE_ID = 'cfw_black_friday_2026';

	/**
	 * Adds the Black Friday notice.
	 *
	 * @param string $id      Unused; the notice sets its own ID.
	 * @param string $title   Unused; the notice sets its own title.
	 * @param string $message Unused; the notice sets its own message.
	 * @param array  $options Unused; the notice sets its own options.
	 * @return void
	 */
	public function maybe_add( string $id = '', string $title = '', string $message = '', array $options = [] ) {
		$id      = self::NOTICE_ID;
		$title   = __( 'Black Friday: 40% off CheckoutWC', 'checkout-wc' );
		$message = '<p>' . esc_html__( 'Get order bumps, the side cart, abandoned cart recovery and every other CheckoutWC feature.', 'checkout-wc' ) . '</p>';

		$message .= BFOfferCards::get_html( 'liteplugin', 'bfnotice' );
		$message .= '<p>' . esc_html__( 'Ends November 30th.', 'checkout-wc' ) . '</p>';

		parent::maybe_add(
			$id,
			$title,
			$message,
			[
				'type'        => 'info',
				'dismissible' => true,
			]
		);
	}

	/**
	 * Shows the notice to sites without a full CheckoutWC licence, on CheckoutWC screens and WooCommerce Orders, during the campaign.
	 *
	 * @return bool
	 */
	protected function should_add(): bool {
		// Lite only: the paid build defines the plan IDs.
		if ( defined( 'CFW_PREMIUM_PLAN_IDS' ) ) {
			return false;
		}

		$page = sanitize_text_field( wp_unslash( $_GET['page'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		// The dismiss request has no page, but needs the notice to dismiss it.
		if ( 'wc-orders' !== $page && stripos( $page, 'cfw-' ) === false && ! $this->is_dismiss_request( self::NOTICE_ID ) ) {
			return false;
		}

		try {
			return self::is_campaign_active( new DateTimeImmutable( 'now', new DateTimeZone( 'America/New_York' ) ) );
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Checks whether a moment falls inside the Black Friday campaign window.
	 *
	 * @since 11.5.0
	 *
	 * @param DateTimeImmutable $now The moment to check.
	 * @return bool
	 * @throws Exception If the campaign dates can't be parsed.
	 */
	public static function is_campaign_active( DateTimeImmutable $now ): bool {
		$timezone = new DateTimeZone( 'America/New_York' );
		$start    = new DateTimeImmutable( self::CAMPAIGN_START, $timezone );
		$end      = new DateTimeImmutable( self::CAMPAIGN_END, $timezone );

		return $now >= $start && $now <= $end;
	}
}
