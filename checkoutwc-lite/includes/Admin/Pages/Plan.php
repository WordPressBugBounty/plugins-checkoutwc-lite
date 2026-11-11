<?php

declare( strict_types = 1 );

namespace Objectiv\Plugins\Checkout\Admin\Pages;

/**
 * The old Upgrade (Lite) and Your Plan (paid) address. The license now lives in the Dashboard's Your plan card.
 *
 * Still registered as `plan` so code that links to it, such as the license notices, lands on that card.
 *
 * @since 11.5.0
 */
final class Plan extends PageAbstract {

	/**
	 * Constructor.
	 *
	 * @since 11.5.0
	 */
	public function __construct() {
		parent::__construct( __( 'Your Plan', 'checkout-wc' ), 'cfw_manage_general', 'plan' );
	}

	/**
	 * Redirects the old address instead of adding a menu item.
	 *
	 * Without a menu item WordPress denies the page in wp-admin/menu.php, before admin_init, so the redirect runs on
	 * the access denied action instead.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_page_access_denied', [ $this, 'maybe_redirect' ] );
	}

	/**
	 * Sends a visit to the old address to the Dashboard's Your plan card.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	public function maybe_redirect() {
		if ( ! $this->is_current_page() ) {
			return;
		}

		wp_safe_redirect( $this->get_redirect_url() );
		exit;
	}

	/**
	 * Returns the Dashboard's Your plan card.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public function get_url(): string {
		return esc_url( $this->get_redirect_url() );
	}

	/**
	 * Returns the unescaped URL of the Dashboard's Your plan card.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public function get_redirect_url(): string {
		return add_query_arg( 'page', self::$parent_slug, admin_url( 'admin.php' ) ) . '#license';
	}

	/**
	 * Not a page any more: visits redirect before it would render.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	public function output() {}
}
