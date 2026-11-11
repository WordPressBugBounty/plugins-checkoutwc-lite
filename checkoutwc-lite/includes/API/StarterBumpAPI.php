<?php

declare( strict_types = 1 );

namespace Objectiv\Plugins\Checkout\API;

use Objectiv\Plugins\Checkout\Admin\DashboardCardEvent;
use Objectiv\Plugins\Checkout\Features\StarterBump;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * REST routes behind the "Add your first order bump" card on the Order Bumps list screen and the Dashboard.
 *
 * @since 11.5.0
 */
final class StarterBumpAPI {

	/**
	 * Hooks the route registration.
	 *
	 * @since 11.5.0
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	/**
	 * Registers the create and dismiss routes.
	 *
	 * @internal
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			'checkoutwc/v1',
			'starter-bump/create',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'create' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			]
		);

		register_rest_route(
			'checkoutwc/v1',
			'starter-bump/dismiss',
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'dismiss' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			]
		);
	}

	/**
	 * Creates the suggested draft bump and returns the URL of its editor.
	 *
	 * @internal
	 *
	 * @since 11.5.0
	 *
	 * @param WP_REST_Request|null $request the request, whose `location` says where the card was
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function create( $request = null ) {
		$starter_bump = new StarterBump();
		$bump_id      = $starter_bump->create_draft( $starter_bump->suggest_product_id() );

		if ( ! $bump_id ) {
			return new WP_Error( 'cfw_starter_bump_not_created', __( 'The order bump could not be created.', 'checkout-wc' ), [ 'status' => 500 ] );
		}

		DashboardCardEvent::fire( 'starter_bump', 'create', self::get_location( $request ) );

		return new WP_REST_Response( [ 'edit_url' => get_edit_post_link( $bump_id, 'raw' ) ], 201 );
	}

	/**
	 * Hides the card for the current user.
	 *
	 * @internal
	 *
	 * @since 11.5.0
	 *
	 * @param WP_REST_Request|null $request the request, whose `location` says where the card was
	 *
	 * @return WP_REST_Response
	 */
	public function dismiss( $request = null ) {
		update_user_meta( get_current_user_id(), StarterBump::DISMISSED_META_KEY, '1' );

		DashboardCardEvent::fire( 'starter_bump', 'dismiss', self::get_location( $request ) );

		return new WP_REST_Response( null, 204 );
	}

	/**
	 * Allows the request when the REST nonce is valid and the user can manage order bumps.
	 *
	 * @internal
	 *
	 * @since 11.5.0
	 *
	 * @param WP_REST_Request $request
	 * @return bool
	 */
	public function check_permissions( $request ) {
		$nonce = $request instanceof WP_REST_Request ? (string) $request->get_header( 'X-WP-Nonce' ) : '';

		return '' !== $nonce && false !== wp_verify_nonce( $nonce, 'wp_rest' ) && current_user_can( 'cfw_manage_order_bumps' );
	}

	/**
	 * Returns where the card was: the Dashboard, or the Order Bumps list by default.
	 *
	 * @since 11.5.0
	 *
	 * @param WP_REST_Request|null $request the request
	 *
	 * @return string
	 */
	private static function get_location( $request ): string {
		return $request instanceof WP_REST_Request && 'dashboard' === $request->get_param( 'location' ) ? 'dashboard' : 'order_bumps';
	}
}
