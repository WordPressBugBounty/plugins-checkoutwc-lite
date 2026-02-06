<?php

namespace Objectiv\Plugins\Checkout\Admin\Notices;

/**
 * Pending Offer Orders Notice
 *
 * Displays a notice when there are orders in pending offer status.
 *
 * @since 7.0.0
 */
class PendingOfferOrdersNotice extends NoticeAbstract {

	/**
	 * Cached pending orders
	 *
	 * @var array|null
	 */
	private $pending_orders = null;

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( 'pending_offer_orders' );
	}

	/**
	 * Get pending offer orders
	 *
	 * @return array
	 */
	private function get_pending_orders(): array {
		if ( null === $this->pending_orders ) {
			$this->pending_orders = wc_get_orders( array(
				'status' => 'cfw-pending-offer',
				'limit'  => -1,
			) );
		}
		return is_array( $this->pending_orders ) ? $this->pending_orders : array();
	}

	/**
	 * Check if notice should be enabled
	 *
	 * @return bool
	 */
	protected function enabled(): bool {
		return ! empty( $this->get_pending_orders() );
	}

	/**
	 * Maybe show the notice
	 */
	public function maybe_show() {
		$orders = $this->get_pending_orders();

		if ( empty( $orders ) ) {
			return;
		}

		$orders_count = count( $orders );

		$message = sprintf(
			__( 'You have %d order(s) in "Pending Offer" status awaiting post-purchase offer completion.', 'checkout-wc' ),
			$orders_count
		);

		$this->maybe_add(
			'pending_offer_orders',
			__( 'Post-Purchase Offers Active', 'checkout-wc' ),
			$message,
			array(
				'type' => 'info',
				'mode' => 'deferred',
			)
		);
	}
}