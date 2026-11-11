<?php

namespace Objectiv\Plugins\Checkout\Admin\Pages;

/**
 * The old Support address. Support now lives in the Dashboard's Support card.
 *
 * Still registered as `support` so code that links to it lands on that card.
 *
 * @link checkoutwc.com
 * @since 5.0.0
 * @package Objectiv\Plugins\Checkout\Admin\Pages
 */
class Support extends PageAbstract {

	/**
	 * CheckoutWC Lite's support forum on WordPress.org.
	 *
	 * @since 11.5.0
	 *
	 * @var string
	 */
	public const LITE_FORUM_URL = 'https://wordpress.org/support/plugin/checkoutwc-lite/#new-topic-0';

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct( __( 'Support', 'checkout-wc' ), 'cfw_manage_general', 'support' );
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
	 * Sends a visit to the old address to the Dashboard's Support card.
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
	 * Returns the Dashboard's Support card.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public function get_url(): string {
		return esc_url( $this->get_redirect_url() );
	}

	/**
	 * Returns the unescaped URL of the Dashboard's Support card.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public function get_redirect_url(): string {
		return add_query_arg( 'page', self::$parent_slug, admin_url( 'admin.php' ) ) . '#support';
	}

	/**
	 * Not a page any more: visits redirect before it would render.
	 *
	 * @return void
	 */
	public function output() {}
}
