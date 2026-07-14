<?php

namespace Objectiv\Plugins\Checkout\API;

use Objectiv\Plugins\Checkout\Managers\SlotManager;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST API endpoints for the Checkout Editor slot system.
 *
 * GET  /checkoutwc/v1/slots  — returns slot definitions, current assignments,
 *                              custom HTML blocks, and available items.
 * POST /checkoutwc/v1/slots  — saves slot assignments and custom HTML blocks.
 *
 * @link checkoutwc.com
 * @since 11.2.0
 * @package Objectiv\Plugins\Checkout\API
 */
class SlotsAPI {

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	public function register_routes(): void {
		register_rest_route(
			'checkoutwc/v1',
			'slots',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_slots' ],
					'permission_callback' => [ $this, 'can_manage' ],
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'save_slots' ],
					'permission_callback' => [ $this, 'can_manage' ],
					'args'                => [
						'assignments'        => [
							'type'     => 'object',
							'required' => true,
						],
						'custom_html_blocks' => [
							'type'     => 'object',
							'required' => false,
							'default'  => [],
						],
					],
				],
			]
		);
	}

	/**
	 * GET /checkoutwc/v1/slots
	 *
	 * Returns slot definitions, the current assignments, available items for
	 * the editor picker, and all custom HTML blocks.
	 *
	 * @return WP_REST_Response
	 */
	public function get_slots(): WP_REST_Response {
		$manager = SlotManager::instance();

		return rest_ensure_response(
			[
				'slot_definitions'   => SlotManager::get_slot_hook_map(),
				'assignments'        => $manager->get_slots(),
				'custom_html_blocks' => $manager->get_custom_html_blocks(),
				'available_items'  => $manager->get_available_items(),
			]
		);
	}

	/**
	 * POST /checkoutwc/v1/slots
	 *
	 * Accepts `assignments` (slot ID → list of assignment items) and
	 * `custom_html_blocks` (UUID → {name, content}), validates them lightly,
	 * then persists via SlotManager.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function save_slots( WP_REST_Request $request ): WP_REST_Response {
		$manager         = SlotManager::instance();
		$assignments     = $request->get_param( 'assignments' );
		$html_blocks     = $request->get_param( 'custom_html_blocks' ) ?? [];

		// Sanitise assignments.
		$clean_assignments = [];
		$valid_slot_ids    = array_keys( SlotManager::get_slot_hook_map() );

		foreach ( (array) $assignments as $slot_id => $items ) {
			if ( ! in_array( $slot_id, $valid_slot_ids, true ) ) {
				continue;
			}

			$clean_items = [];
			foreach ( (array) $items as $item ) {
				$type = sanitize_text_field( $item['type'] ?? '' );

				if ( ! in_array( $type, [ 'order_bump', 'trust_badges', 'review_badges', 'custom_html', 'heading' ], true ) ) {
					continue;
				}

				$clean_item = [
					'type'       => $type,
					'sort_order' => (int) ( $item['sort_order'] ?? 0 ),
				];

				if ( 'order_bump' === $type ) {
					$clean_item['id'] = (int) ( $item['id'] ?? 0 );
					if ( ! $clean_item['id'] ) {
						continue;
					}
				}

				if ( 'custom_html' === $type ) {
					$clean_item['id'] = sanitize_text_field( $item['id'] ?? '' );
					if ( ! $clean_item['id'] ) {
						continue;
					}
				}

				// Each trust badge is placed individually by its ID (e.g. "tb-0").
				if ( 'trust_badges' === $type ) {
					$clean_item['id'] = sanitize_text_field( $item['id'] ?? '' );
					if ( ! $clean_item['id'] ) {
						continue;
					}
				}

				// Heading blocks store text/level inline on the assignment.
				if ( 'heading' === $type ) {
					$clean_item['text']  = sanitize_text_field( $item['text'] ?? '' );
					$clean_item['level'] = max( 1, min( 6, (int) ( $item['level'] ?? 4 ) ) );
				}

				// Optional margin override — allow only CSS-safe characters.
				$raw_margin = sanitize_text_field( $item['margin'] ?? '' );
				if ( $raw_margin !== '' ) {
					$clean_margin = preg_replace( '/[^0-9a-zA-Z .%\s\-]/', '', $raw_margin );
					if ( $clean_margin !== '' ) {
						$clean_item['margin'] = $clean_margin;
					}
				}

				$clean_items[] = $clean_item;
			}

			$clean_assignments[ $slot_id ] = $clean_items;
		}

		// Sanitise custom HTML blocks.
		$clean_html_blocks = [];
		foreach ( (array) $html_blocks as $uuid => $block ) {
			$uuid = sanitize_text_field( $uuid );
			if ( ! $uuid ) {
				continue;
			}
			$clean_html_blocks[ $uuid ] = [
				'name'    => sanitize_text_field( $block['name'] ?? '' ),
				'content' => wp_kses_post( $block['content'] ?? '' ),
			];
		}

		$manager->save_slots( $clean_assignments );
		$manager->save_custom_html_blocks( $clean_html_blocks );
		$manager->sync_bump_location_meta( $clean_assignments );

		return rest_ensure_response( [ 'success' => true ] );
	}

	/**
	 * Permission check — mirrors the SettingsAPI capability.
	 *
	 * @return bool
	 */
	public function can_manage(): bool {
		return current_user_can( 'cfw_manage_pages' );
	}
}
