<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Factories\BumpFactory;
use Objectiv\Plugins\Checkout\Features\ABTesting;
use Objectiv\Plugins\Checkout\SingletonAbstract;

/**
 * Manages the Checkout Editor slot system.
 *
 * Slots are named hook positions (e.g. "below_cart_items", "top_of_footer") that
 * store ordered lists of item assignments (order bumps, A/B tests, trust badges,
 * review badges, custom HTML blocks). The slot registry is stored as a single JSON
 * option so it can be fully overlaid by the editor preview transient.
 *
 * @link checkoutwc.com
 * @since 11.2.0
 * @package Objectiv\Plugins\Checkout\Managers
 */
class SlotManager extends SingletonAbstract {

	/**
	 * WordPress option key for slot assignments.
	 *
	 * @var string
	 */
	const SLOTS_OPTION = '_cfw_checkout_slots';

	/**
	 * WordPress option key for inline custom HTML blocks.
	 *
	 * @var string
	 */
	const HTML_BLOCKS_OPTION = '_cfw_checkout_slot_html_blocks';

	/**
	 * WordPress option key that records whether migration has run.
	 *
	 * @var string
	 */
	const MIGRATED_FLAG = '_cfw_checkout_slots_migrated';

	/**
	 * Slot a new trust badge is assigned to by default — the equivalent of the
	 * legacy "Below the checkout cart summary" position.
	 *
	 * @var string
	 */
	const TRUST_BADGE_DEFAULT_SLOT = 'after_cart_summary_totals';

	/**
	 * Sentinel value used for a badge that is placed in more than one slot. The
	 * Trust Badges settings dropdown is single-select, so multi-slot badges are
	 * shown locked and skipped during reconciliation (the editor stays authoritative).
	 *
	 * @var string
	 */
	const TRUST_BADGE_MULTIPLE_SLOT = '__multiple__';


	// ------------------------------------------------------------------
	// Slot hook map
	// ------------------------------------------------------------------

	/**
	 * Returns the canonical map of slot IDs to their WordPress hook + priority.
	 *
	 * Slot IDs intentionally reuse the legacy order-bump location names so the
	 * existing JS container-div convention (cfw_bumps_{location}) keeps working
	 * without frontend changes.
	 *
	 * @return array<string, array{hook: string, priority: int, label: string}>
	 */
	public static function get_slot_hook_map(): array {
		return [
			'before_express_checkout'    => [
				'hook'     => 'cfw_checkout_customer_info_tab',
				'priority' => 5,
				'label'    => __( 'Before Express Checkout', 'checkout-wc' ),
			],
			'after_customer_account'     => [
				'hook'     => 'cfw_after_customer_info_account_details',
				'priority' => 10,
				'label'    => __( 'After Customer Account', 'checkout-wc' ),
			],
			'after_delivery_method'      => [
				'hook'     => 'cfw_checkout_before_customer_info_address',
				'priority' => 20,
				'label'    => __( 'After Delivery Method', 'checkout-wc' ),
			],
			'after_shipping_address'     => [
				'hook'     => 'cfw_checkout_after_shipping_address',
				'priority' => 10,
				'label'    => __( 'After Shipping Address', 'checkout-wc' ),
			],
			'after_shipping_methods'     => [
				'hook'     => 'cfw_after_shipping_packages',
				'priority' => 10,
				'label'    => __( 'After Shipping Methods', 'checkout-wc' ),
			],
			'after_payment_methods'        => [
				'hook'     => 'cfw_after_payment_methods_block',
				'priority' => 10,
				'label'    => __( 'After Payment Methods', 'checkout-wc' ),
			],
			'after_billing_address'        => [
				'hook'     => 'cfw_checkout_after_payment_tab_billing_address',
				'priority' => 10,
				'label'    => __( 'After Billing Address', 'checkout-wc' ),
			],
			'before_terms_and_conditions'  => [
				'hook'     => 'cfw_checkout_before_payment_method_terms_checkbox',
				'priority' => 10,
				'label'    => __( 'Before Terms & Conditions', 'checkout-wc' ),
			],
			'after_terms_and_conditions'   => [
				'hook'     => 'cfw_checkout_payment_method_tab',
				'priority' => 42,
				'label'    => __( 'After Terms & Conditions', 'checkout-wc' ),
			],
			'after_complete_order'         => [
				'hook'     => 'cfw_checkout_payment_method_tab',
				'priority' => 55,
				'label'    => __( 'After Complete Order', 'checkout-wc' ),
			],
			'before_cart_summary_items'    => [
				'hook'     => 'cfw_checkout_cart_summary',
				'priority' => 35,
				'label'    => __( 'Before Cart Summary Items', 'checkout-wc' ),
			],
			'after_cart_summary_items'     => [
				'hook'     => 'cfw_checkout_cart_summary',
				'priority' => 45,
				'label'    => __( 'After Cart Summary Items', 'checkout-wc' ),
			],
			'before_cart_summary_totals'   => [
				'hook'     => 'cfw_checkout_cart_summary',
				'priority' => 65,
				'label'    => __( 'Before Cart Summary Totals', 'checkout-wc' ),
			],
			'after_cart_summary_totals'    => [
				'hook'     => 'cfw_checkout_cart_summary',
				'priority' => 72,
				'label'    => __( 'After Cart Summary Totals', 'checkout-wc' ),
			],
			'before_footer'                => [
				'hook'     => 'cfw_before_footer',
				'priority' => 5,
				'label'    => __( 'Before Footer', 'checkout-wc' ),
			],
			'after_footer'                 => [
				'hook'     => 'cfw_after_footer',
				'priority' => 10,
				'label'    => __( 'After Footer', 'checkout-wc' ),
			],
		];
	}

	/**
	 * Returns the canonical human label for any order-bump display-location value.
	 *
	 * Single source of truth for the admin surfaces (the order bumps list column
	 * and the A/B test variants grid) so their labels always match the bump
	 * editor's Display Location dropdown. Handles current slot IDs, the non-slot
	 * "Other" locations, and legacy location IDs (normalised to their current slot).
	 *
	 * @param string $location The stored cfw_ob_display_location value.
	 * @return string
	 */
	public static function get_location_label( string $location ): string {
		if ( '' === $location ) {
			return __( '— No Slot Assigned —', 'checkout-wc' );
		}

		// Non-slot "Other" locations — labels mirror the bump editor dropdown.
		$other = [
			'below_cart_items'        => __( 'After Cart Summary Items (Checkout and Side Cart)', 'checkout-wc' ),
			'below_side_cart_items'   => __( 'After Cart Summary Items (Side Cart Only)', 'checkout-wc' ),
			'complete_order'          => __( 'Place Order Click (Checkout)', 'checkout-wc' ),
			'post_purchase_one_click' => __( 'Post Purchase One-Click (Thank You)', 'checkout-wc' ),
		];
		if ( isset( $other[ $location ] ) ) {
			return $other[ $location ];
		}

		// Current slot IDs.
		$hook_map = self::get_slot_hook_map();
		if ( isset( $hook_map[ $location ] ) ) {
			return $hook_map[ $location ]['label'];
		}

		// Legacy IDs — show the label of the slot they migrate to.
		$legacy = [
			'below_checkout_cart_items'   => 'after_cart_summary_items',
			'above_express_checkout'      => 'before_express_checkout',
			'bottom_information_tab'       => 'after_shipping_address',
			'bottom_shipping_tab'          => 'after_shipping_methods',
			'above_terms_and_conditions'   => 'before_terms_and_conditions',
			'after_complete_order_button'  => 'after_complete_order',
			'below_complete_order_button'  => 'after_complete_order',
		];
		if ( isset( $legacy[ $location ], $hook_map[ $legacy[ $location ] ] ) ) {
			return $hook_map[ $legacy[ $location ] ]['label'];
		}

		// Unknown value — best-effort readable label.
		return ucwords( str_replace( '_', ' ', $location ) );
	}

	// ------------------------------------------------------------------
	// Reading / writing slot assignments
	// ------------------------------------------------------------------

	/**
	 * Returns the current slot assignments.
	 *
	 * When running inside an editor preview iframe the assignments from the
	 * preview transient override the saved database values.
	 *
	 * @return array<string, list<array{type: string, id?: int|string, sort_order: int, name?: string, content?: string}>>
	 */
	public function get_slots(): array {
		if ( $this->is_preview_mode() ) {
			$transient = $this->get_preview_transient();
			if ( isset( $transient[ self::SLOTS_OPTION ] ) && is_array( $transient[ self::SLOTS_OPTION ] ) ) {
				return $transient[ self::SLOTS_OPTION ];
			}
		}

		$raw = get_option( self::SLOTS_OPTION, null );

		if ( null === $raw ) {
			return [];
		}

		if ( is_string( $raw ) ) {
			$decoded = json_decode( $raw, true );
			return is_array( $decoded ) ? $decoded : [];
		}

		return is_array( $raw ) ? $raw : [];
	}

	/**
	 * Persists slot assignments.
	 *
	 * @param array $slots Slot assignments keyed by slot ID.
	 */
	public function save_slots( array $slots ): void {
		update_option( self::SLOTS_OPTION, wp_json_encode( $slots ) );
	}

	// ------------------------------------------------------------------
	// Custom HTML blocks
	// ------------------------------------------------------------------

	/**
	 * Returns all custom HTML blocks keyed by their UUID.
	 *
	 * @return array<string, array{name: string, content: string}>
	 */
	public function get_custom_html_blocks(): array {
		if ( $this->is_preview_mode() ) {
			$transient = $this->get_preview_transient();
			if ( isset( $transient[ self::HTML_BLOCKS_OPTION ] ) && is_array( $transient[ self::HTML_BLOCKS_OPTION ] ) ) {
				return $transient[ self::HTML_BLOCKS_OPTION ];
			}
		}

		$raw = get_option( self::HTML_BLOCKS_OPTION, null );

		if ( null === $raw ) {
			return [];
		}

		if ( is_string( $raw ) ) {
			$decoded = json_decode( $raw, true );
			return is_array( $decoded ) ? $decoded : [];
		}

		return is_array( $raw ) ? $raw : [];
	}

	/**
	 * Persists custom HTML blocks.
	 *
	 * @param array $blocks Blocks keyed by UUID.
	 */
	public function save_custom_html_blocks( array $blocks ): void {
		update_option( self::HTML_BLOCKS_OPTION, wp_json_encode( $blocks ) );
	}

	/**
	 * Syncs the cfw_ob_display_location post meta for all published order bumps
	 * to match the provided slot assignments.
	 *
	 * Called after the Checkout Editor saves so that the bump editor and admin
	 * list always reflect the authoritative slot assignment rather than stale meta.
	 *
	 * - Bumps assigned to a slot get their meta set to that slot ID.
	 * - Bumps removed from all slots get their meta cleared to '' (if it was a
	 *   slot-managed value) so the bump editor shows "No Slot Assigned".
	 * - Out-of-scope locations (complete_order, post_purchase_one_click,
	 *   below_side_cart_items) are never modified.
	 *
	 * @param array $new_assignments Slot assignments keyed by slot ID, as just saved.
	 */
	public function sync_bump_location_meta( array $new_assignments ): void {
		// Build bump_id → slot_id map from direct order_bump assignments.
		$bump_slot_map = [];
		foreach ( $new_assignments as $slot_id => $items ) {
			foreach ( $items as $item ) {
				if ( ( $item['type'] ?? '' ) === 'order_bump' && ! empty( $item['id'] ) ) {
					$bump_slot_map[ (int) $item['id'] ] = $slot_id;
				}
			}
		}

		if ( ! $this->bumps_available() ) {
			return;
		}

		// All slot IDs that the system manages, including the legacy alias.
		$slot_managed   = array_keys( $this->get_slot_hook_map() );
		$slot_managed[] = 'below_checkout_cart_items';

		foreach ( BumpFactory::get_all( 'publish' ) as $bump ) {
			$bump_id          = $bump->get_id();
			$current_location = $bump->get_display_location();

			if ( isset( $bump_slot_map[ $bump_id ] ) ) {
				$new_location = $bump_slot_map[ $bump_id ];
				if ( $current_location !== $new_location ) {
					update_post_meta( $bump_id, 'cfw_ob_display_location', $new_location );
				}
			} elseif ( in_array( $current_location, $slot_managed, true ) ) {
				// Bump was removed from all slots — clear the stale meta so the bump
				// editor shows "No Slot Assigned" rather than the old location.
				update_post_meta( $bump_id, 'cfw_ob_display_location', '' );
			}
			// Out-of-scope locations are left untouched.
		}
	}

	// ------------------------------------------------------------------
	// Available items (for the editor picker)
	// ------------------------------------------------------------------

	/**
	 * Returns all items that can be placed in slots, for use in the editor UI.
	 *
	 * @return array{
	 *   order_bumps:           list<array{id: int, title: string, display_location: string}>,
	 *   trust_badges:          list<array{id: string, title: string}>,
	 *   review_badges_enabled: bool,
	 *   custom_html_blocks:    array<string, array{name: string, content: string}>
	 * }
	 */
	public function get_available_items(): array {
		$settings = SettingsManager::instance();

		// Build the bump-to-A/B-test lookup used to flag locked order bumps below.
		// Order bumps and A/B testing are Pro only, so skip in the lite build.
		$bump_to_ab_test = [];
		if ( $this->bumps_available() ) {
			$ab_test_posts = get_posts(
				[
					'post_type'   => ABTesting::get_post_type(),
					'numberposts' => -1,
					'post_status' => 'publish',
				]
			);
			foreach ( $ab_test_posts as $post ) {
				$parent_bump_id = (int) get_post_meta( $post->ID, 'cfw_ab_test_order_bump', true );
				if ( $parent_bump_id ) {
					$bump_to_ab_test[ $parent_bump_id ] = [
						'id'     => $post->ID,
						'status' => get_post_meta( $post->ID, 'cfw_ab_test_status', true ) ?: 'active',
					];
				}
			}
		}

		// Order bumps — only include those that can be placed in checkout slots.
		// Out-of-scope locations (complete_order, post_purchase_one_click, below_side_cart_items)
		// have their own dedicated rendering paths and cannot be assigned to slots.
		$out_of_scope = [ 'complete_order', 'post_purchase_one_click', 'below_side_cart_items' ];
		$bumps        = $this->bumps_available() ? BumpFactory::get_all( 'publish' ) : [];
		$bump_items   = [];
		foreach ( $bumps as $bump ) {
			$location = $bump->get_display_location();
			if ( in_array( $location, $out_of_scope, true ) ) {
				continue;
			}
			$bump_id   = $bump->get_id();
			$rules     = get_post_meta( $bump_id, 'cfw_ob_rules', true );
			$raw_offer = get_post_meta( $bump_id, 'cfw_ob_offer_product_v9', true );
			$offer_ids = [];
			if ( is_array( $raw_offer ) ) {
				foreach ( $raw_offer as $item ) {
					if ( ! empty( $item['key'] ) ) {
						$offer_ids[] = (int) $item['key'];
					}
				}
			}

			$bump_entry = [
				'id'               => $bump_id,
				'title'            => get_the_title( $bump_id ),
				'has_conditions'   => ! empty( $rules ),
				'offer_product_ids' => $offer_ids,
				'display_location' => $location,
			];
			if ( isset( $bump_to_ab_test[ $bump_id ] ) ) {
				$bump_entry['ab_test_id']     = $bump_to_ab_test[ $bump_id ]['id'];
				$bump_entry['ab_test_status'] = $bump_to_ab_test[ $bump_id ]['status'];
			}
			$bump_items[] = $bump_entry;
		}

		// Individual trust badges (empty when feature is disabled).
		// WC customer review badges are injected dynamically via the cfw_trust_badges filter
		// (their IDs start with "wc_review_") and cannot be individually placed in slots — exclude them.
		$trust_badges_list = [];
		if ( $settings->get_setting( 'enable_trust_badges' ) === 'yes' ) {
			$raw_badges = cfw_get_trust_badges( false );
			foreach ( $raw_badges as $index => $badge ) {
				$badge_id = ( isset( $badge['id'] ) && $badge['id'] && $badge['id'] !== 0 )
					? (string) $badge['id']
					: 'tb-' . $index;
				// Skip dynamically-injected WC customer reviews.
				if ( str_starts_with( $badge_id, 'wc_review_' ) ) {
					continue;
				}
				$trust_badges_list[] = [
					'id'             => $badge_id,
					/* translators: %d is the badge number */
					'title'          => ( $badge['title'] ?? '' ) ?: sprintf( __( 'Badge %d', 'checkout-wc' ), $index + 1 ),
					'template'       => $badge['template'] ?? 'guarantee',
					'has_conditions' => ! empty( $badge['rules'] ),
				];
			}
		}

		return [
			'order_bumps'           => $bump_items,
			'trust_badges'          => $trust_badges_list,
			'review_badges_enabled' => $settings->get_setting( 'enable_wc_review_badges' ) === 'yes',
			'custom_html_blocks'    => $this->get_custom_html_blocks(),
		];
	}

	// ------------------------------------------------------------------
	// Trust badge cleanup
	// ------------------------------------------------------------------

	/**
	 * Removes deleted trust badges from slot assignments.
	 *
	 * Hooked to cfw_updated_setting__cfw_trust_badges. Compares the new badge list
	 * against slot assignments and drops any trust-badge items whose ID is no longer
	 * present.
	 *
	 * @param array $new_badges The incoming trust badges array.
	 * @param mixed $old_badges The previous trust badges value (unused).
	 */
	public function remove_deleted_trust_badges_from_slots( $new_badges, $old_badges ): void {
		if ( ! is_array( $new_badges ) ) {
			return;
		}

		// Build the set of IDs present in the new badge list.
		$new_badge_ids = [];
		foreach ( $new_badges as $index => $badge ) {
			$badge_id        = ( isset( $badge['id'] ) && $badge['id'] && $badge['id'] !== 0 )
				? (string) $badge['id']
				: 'tb-' . $index;
			$new_badge_ids[] = $badge_id;
		}

		$slots   = $this->get_slots();
		$changed = false;

		foreach ( $slots as $slot_id => &$items ) {
			$filtered = array_values(
				array_filter(
					$items,
					function ( $item ) use ( $new_badge_ids ) {
						if ( ( $item['type'] ?? '' ) !== 'trust_badges' || empty( $item['id'] ) ) {
							return true;
						}
						return in_array( (string) $item['id'], $new_badge_ids, true );
					}
				)
			);

			if ( count( $filtered ) !== count( $items ) ) {
				foreach ( $filtered as $i => &$s_item ) {
					$s_item['sort_order'] = $i;
				}
				unset( $s_item );
				$items   = $filtered;
				$changed = true;
			}
		}
		unset( $items );

		if ( $changed ) {
			$this->save_slots( $slots );
		}
	}

	// ------------------------------------------------------------------
	// Trust badge slot dropdown (settings page)
	// ------------------------------------------------------------------

	/**
	 * Returns the single-slot assignment for each trust badge, for seeding the
	 * Trust Badges settings dropdown.
	 *
	 * For each badge the value is one of:
	 *   - a slot ID                  → placed in exactly that slot;
	 *   - ''                         → not placed anywhere;
	 *   - TRUST_BADGE_MULTIPLE_SLOT  → resolves to more than one slot.
	 *
	 * @param array $badges The trust badges array (as passed to the settings UI).
	 * @return array<string, string> Map of badge ID → slot value.
	 */
	public function get_trust_badge_slot_assignments( array $badges ): array {
		$slots            = $this->get_slots();
		$individual_slots = []; // badge id → list of slots it is placed in.

		foreach ( $slots as $slot_id => $items ) {
			foreach ( $items as $item ) {
				if ( ( $item['type'] ?? '' ) !== 'trust_badges' || empty( $item['id'] ) ) {
					continue;
				}
				$individual_slots[ (string) $item['id'] ][] = $slot_id;
			}
		}

		$assignments = [];
		foreach ( $badges as $index => $badge ) {
			$badge_id = $this->trust_badge_id_for_index( $badge, $index );

			$placed = array_values( array_unique( $individual_slots[ $badge_id ] ?? [] ) );

			if ( count( $placed ) === 1 ) {
				$assignments[ $badge_id ] = $placed[0];
			} elseif ( count( $placed ) > 1 ) {
				$assignments[ $badge_id ] = self::TRUST_BADGE_MULTIPLE_SLOT;
			} else {
				$assignments[ $badge_id ] = '';
			}
		}

		return $assignments;
	}

	/**
	 * Reconciles slot assignments from the per-badge slot dropdown on the Trust
	 * Badges settings page.
	 *
	 * Hooked to cfw_updated_setting__cfw_trust_badges. Each badge may carry a
	 * transient `slot` key set by the settings UI. Each badge's individual items are
	 * moved to its chosen slot (or removed when no slot is selected). Locked
	 * multi-slot badges are left to the editor. Runs only when badges actually carry
	 * slot data.
	 *
	 * @param mixed $new_badges The incoming trust badges array.
	 * @param mixed $old_badges The previous value (unused).
	 */
	public function reconcile_trust_badge_slots( $new_badges, $old_badges ): void {
		if ( ! is_array( $new_badges ) ) {
			return;
		}

		$has_slot_data = false;
		foreach ( $new_badges as $badge ) {
			if ( is_array( $badge ) && array_key_exists( 'slot', $badge ) ) {
				$has_slot_data = true;
				break;
			}
		}
		if ( ! $has_slot_data ) {
			return;
		}

		$slots       = $this->get_slots();
		$valid_slots = array_keys( self::get_slot_hook_map() );

		$changed = false;

		foreach ( $new_badges as $index => $badge ) {
			if ( ! is_array( $badge ) || ! array_key_exists( 'slot', $badge ) ) {
				continue;
			}

			$desired = (string) $badge['slot'];

			// Locked multi-slot badges are managed in the editor — leave untouched.
			if ( self::TRUST_BADGE_MULTIPLE_SLOT === $desired ) {
				continue;
			}
			if ( '' !== $desired && ! in_array( $desired, $valid_slots, true ) ) {
				continue;
			}

			$badge_id = $this->trust_badge_id_for_index( $badge, $index );

			// Where is this badge currently placed (individual items only)?
			$current = [];
			foreach ( $slots as $slot_id => $items ) {
				foreach ( $items as $item ) {
					if ( ( $item['type'] ?? '' ) === 'trust_badges' && ! empty( $item['id'] ) && (string) $item['id'] === $badge_id ) {
						$current[] = $slot_id;
					}
				}
			}
			$current = array_values( array_unique( $current ) );

			// No change needed — preserves existing order for untouched badges.
			if ( ( '' === $desired && empty( $current ) ) || ( [ $desired ] === $current ) ) {
				continue;
			}

			// Remove this badge's individual items from every slot.
			foreach ( $slots as $slot_id => &$items ) {
				$items = array_values(
					array_filter(
						$items,
						function ( $item ) use ( $badge_id ) {
							return ! ( ( $item['type'] ?? '' ) === 'trust_badges' && ! empty( $item['id'] ) && (string) $item['id'] === $badge_id );
						}
					)
				);
			}
			unset( $items );

			// Re-add to the chosen slot when one is selected.
			if ( '' !== $desired ) {
				$slots[ $desired ]   = $slots[ $desired ] ?? [];
				$slots[ $desired ][] = [
					'type' => 'trust_badges',
					'id'   => $badge_id,
				];
			}

			$changed = true;
		}

		if ( ! $changed ) {
			return;
		}

		// Normalise sort_order within each slot.
		foreach ( $slots as $slot_id => &$items ) {
			$items = array_values( $items );
			foreach ( $items as $i => &$item ) {
				$item['sort_order'] = $i;
			}
			unset( $item );
		}
		unset( $items );

		$this->save_slots( $slots );
	}

	/**
	 * Resolves a badge's slot-item ID, matching the convention used by the
	 * renderer and cleanup: the badge's own ID when set, otherwise "tb-{index}".
	 *
	 * @param mixed $badge The badge array.
	 * @param int   $index The badge's position in the list.
	 * @return string
	 */
	private function trust_badge_id_for_index( $badge, int $index ): string {
		if ( is_array( $badge ) && isset( $badge['id'] ) && $badge['id'] && $badge['id'] !== 0 ) {
			return (string) $badge['id'];
		}
		return 'tb-' . $index;
	}

	// ------------------------------------------------------------------
	// Auto-assign on save
	// ------------------------------------------------------------------

	/**
	 * Syncs the slot assignment for a single order bump whenever it is saved.
	 *
	 * The bump editor's location dropdown is the authoritative source: the slot
	 * assignment in the Checkout Editor is updated to match whatever the user
	 * selects and saves in the bump editor.
	 *
	 * - Selecting a slot-managed location moves the bump to that slot (removing
	 *   it from any other slot it was in).
	 * - Selecting "No Slot Assigned" (empty) or an out-of-scope location removes
	 *   the bump from whichever slot it occupied.
	 * - Only published bumps are assigned to slots. Trashing, drafting, or any other
	 *   non-published status removes the bump from its slot. This means a bump restored
	 *   from trash (which lands in draft) stays out of slots until explicitly published,
	 *   at which point save_post fires and this method syncs the location meta to the
	 *   correct slot automatically.
	 *
	 * The Checkout Editor's own save also calls sync_bump_location_meta() which
	 * keeps the meta in step, so the two UIs stay in sync in both directions.
	 *
	 * Hooked to save_post_cfw_order_bumps at priority 20 (after meta is saved).
	 *
	 * @param int      $post_id The saved post ID.
	 * @param \WP_Post $post    The saved post object.
	 * @param bool     $update  True if updating an existing post, false for a new insert.
	 */
	public function maybe_auto_assign_bump_to_slot( int $post_id, \WP_Post $post, bool $update ): void {
		// Only applicable once migration has run.
		if ( ! get_option( self::MIGRATED_FLAG ) ) {
			return;
		}

		// Skip revisions and auto-drafts; ignore child posts (post_parent > 0).
		if ( in_array( $post->post_status, [ 'auto-draft', 'inherit' ], true ) || $post->post_parent > 0 ) {
			return;
		}

		$location = get_post_meta( $post_id, 'cfw_ob_display_location', true );

		// Only published bumps belong in slots. Draft, trash, pending, etc. are excluded
		// so that e.g. a bump restored from trash (which lands in draft) is not re-inserted
		// until the user explicitly publishes it.
		$desired_slot_id = 'publish' === $post->post_status
			? $this->bump_location_to_slot( (string) $location )
			: null;

		// Find which slot (if any) this bump currently occupies.
		$slots              = $this->get_slots();
		$current_slot_id    = null;
		$current_item_index = null;

		foreach ( $slots as $slot_id => $items ) {
			foreach ( $items as $index => $item ) {
				if ( ( $item['type'] ?? '' ) === 'order_bump' && (int) ( $item['id'] ?? 0 ) === $post_id ) {
					$current_slot_id    = $slot_id;
					$current_item_index = $index;
					break 2;
				}
			}
		}

		// Nothing to do if already in the desired slot.
		if ( $current_slot_id === $desired_slot_id ) {
			return;
		}

		// Remove from current slot.
		if ( null !== $current_slot_id && null !== $current_item_index ) {
			array_splice( $slots[ $current_slot_id ], $current_item_index, 1 );
			foreach ( $slots[ $current_slot_id ] as $i => &$s_item ) {
				$s_item['sort_order'] = $i;
			}
			unset( $s_item );
		}

		// Add to the desired slot (only if it is a valid slot-managed location).
		if ( null !== $desired_slot_id && array_key_exists( $desired_slot_id, $this->get_slot_hook_map() ) ) {
			$slots[ $desired_slot_id ]   = $slots[ $desired_slot_id ] ?? [];
			$slots[ $desired_slot_id ][] = [
				'type'       => 'order_bump',
				'id'         => $post_id,
				'sort_order' => count( $slots[ $desired_slot_id ] ),
			];
		}

		$this->save_slots( $slots );
	}

	/**
	 * Removes a permanently-deleted order bump from all slot assignments.
	 *
	 * Hooked to before_delete_post so the location meta is still readable.
	 * This primarily handles force-deletions that bypass the trash; normal
	 * trash → delete flows already remove the bump via maybe_auto_assign_bump_to_slot().
	 *
	 * @param int $post_id The post being permanently deleted.
	 */
	public function on_bump_before_delete( int $post_id ): void {
		if ( ! get_option( self::MIGRATED_FLAG ) ) {
			return;
		}
		if ( 'cfw_order_bumps' !== get_post_type( $post_id ) ) {
			return;
		}

		$slots   = $this->get_slots();
		$changed = false;

		foreach ( $slots as $slot_id => &$items ) {
			$filtered = array_values(
				array_filter(
					$items,
					function ( $item ) use ( $post_id ) {
						return ! ( ( $item['type'] ?? '' ) === 'order_bump' && (int) ( $item['id'] ?? 0 ) === $post_id );
					}
				)
			);

			if ( count( $filtered ) !== count( $items ) ) {
				foreach ( $filtered as $i => &$s_item ) {
					$s_item['sort_order'] = $i;
				}
				unset( $s_item );
				$items   = $filtered;
				$changed = true;
			}
		}
		unset( $items );

		if ( $changed ) {
			$this->save_slots( $slots );
		}
	}

	// ------------------------------------------------------------------
	// One-time migration from legacy location settings
	// ------------------------------------------------------------------

	/**
	 * Runs the migration from legacy per-object location settings to the slot
	 * registry exactly once per site. Safe to call on every page load — it
	 * short-circuits immediately if the flag is already set.
	 */
	public function maybe_migrate(): void {
		if ( get_option( self::MIGRATED_FLAG ) ) {
			return;
		}

		$slots = [];

		// --- Trust badges ---
		$settings             = SettingsManager::instance();
		$trust_badge_enabled  = $settings->get_setting( 'enable_trust_badges' ) === 'yes';
		$review_badge_enabled = $settings->get_setting( 'enable_wc_review_badges' ) === 'yes';

		if ( $trust_badge_enabled || $review_badge_enabled ) {
			$position = $settings->get_setting( 'trust_badge_position' );
			$slot_id  = $this->trust_badge_position_to_slot( $position );

			$sort_order = 0;

			if ( $trust_badge_enabled ) {
				// Seed a heading (from the configured title) plus one item per badge so
				// each badge is an individually-editable slot item.
				$title = (string) $settings->get_setting( 'trust_badges_title' );
				if ( '' !== $title ) {
					$slots[ $slot_id ][] = [
						'type'       => 'heading',
						'text'       => $title,
						'level'      => 4,
						'sort_order' => $sort_order++,
					];
				}

				foreach ( cfw_get_trust_badges( false ) as $index => $badge ) {
					$badge_id = $this->trust_badge_id_for_index( $badge, $index );
					// WC review badges are injected dynamically and placed via the
					// review_badges item below — never as individual trust badges.
					if ( str_starts_with( $badge_id, 'wc_review_' ) ) {
						continue;
					}
					$slots[ $slot_id ][] = [
						'type'       => 'trust_badges',
						'id'         => $badge_id,
						'sort_order' => $sort_order++,
					];
				}
			}

			if ( $review_badge_enabled ) {
				// Review badges share the same location setting.
				$slots[ $slot_id ][] = [
					'type'       => 'review_badges',
					'sort_order' => $sort_order++,
				];
			}
		}

		// --- Order bumps --- (Pro only)
		$bumps = $this->bumps_available() ? BumpFactory::get_all( 'any' ) : [];

		foreach ( $bumps as $bump ) {
			$location = $bump->get_display_location();
			$slot_id  = $this->bump_location_to_slot( $location );

			if ( null === $slot_id ) {
				// Out-of-scope locations (side cart, modals) — skip.
				continue;
			}

			$bump_id = $bump->get_id();
			$item    = [
				'type'       => 'order_bump',
				'id'         => $bump_id,
				'sort_order' => count( $slots[ $slot_id ] ?? [] ),
			];

			$slots[ $slot_id ][] = $item;
		}

		$this->save_slots( $slots );
		update_option( self::MIGRATED_FLAG, '1' );
	}

	// ------------------------------------------------------------------
	// Internal helpers
	// ------------------------------------------------------------------

	/**
	 * Whether order bumps are available. Bumps are a Pro-only feature, so the
	 * BumpFactory class is absent from the lite build.
	 */
	private function bumps_available(): bool {
		return class_exists( '\Objectiv\Plugins\Checkout\Factories\BumpFactory' );
	}

	/**
	 * Maps a legacy trust-badge position value to a slot ID.
	 *
	 * @param string|false $position The stored position value.
	 * @return string
	 */
	private function trust_badge_position_to_slot( $position ): string {
		$map = [
			'below_cart_summary'   => 'after_cart_summary_totals',
			'below_checkout_form'  => 'before_footer',
			'in_footer'            => 'after_footer',
		];

		return $map[ (string) $position ] ?? 'after_cart_summary_totals';
	}

	/**
	 * Maps a legacy order-bump display location to a slot ID.
	 *
	 * Returns null for out-of-scope locations that should not be migrated.
	 *
	 * @param string $location The cfw_ob_display_location value.
	 * @return string|null
	 */
	private function bump_location_to_slot( string $location ): ?string {
		$map = [
			// Current slot IDs — pass through.
			'before_express_checkout'     => 'before_express_checkout',
			'after_customer_account'      => 'after_customer_account',
			'after_delivery_method'       => 'after_delivery_method',
			'after_shipping_address'      => 'after_shipping_address',
			'after_shipping_methods'      => 'after_shipping_methods',
			'after_payment_methods'        => 'after_payment_methods',
			'after_billing_address'        => 'after_billing_address',
			'before_terms_and_conditions'  => 'before_terms_and_conditions',
			'after_terms_and_conditions'   => 'after_terms_and_conditions',
			'after_complete_order'         => 'after_complete_order',
			'before_footer'                => 'before_footer',
			'after_footer'                 => 'after_footer',
			'before_cart_summary_items'   => 'before_cart_summary_items',
			'after_cart_summary_items'    => 'after_cart_summary_items',
			'before_cart_summary_totals'  => 'before_cart_summary_totals',
			'after_cart_summary_totals'   => 'after_cart_summary_totals',
			// Legacy IDs — map to nearest current equivalent.
			'below_checkout_cart_items'   => 'after_cart_summary_items',
			'above_express_checkout'      => 'before_express_checkout',
			'bottom_information_tab'      => 'after_shipping_address',
			'bottom_shipping_tab'         => 'after_shipping_methods',
			'above_terms_and_conditions'  => 'before_terms_and_conditions',
			'after_complete_order_button' => 'after_complete_order',
			'below_complete_order_button' => 'after_complete_order',
			// Out-of-scope — return null so these are left as non-slot locations.
			// below_cart_items renders in both the checkout cart summary and the
			// side cart, so it is not a checkout-editor slot.
			'below_cart_items'            => null,
			'below_side_cart_items'       => null,
			'complete_order'              => null,
			'post_purchase_one_click'     => null,
		];

		return $map[ $location ] ?? null;
	}

	/**
	 * Reads the editor preview transient for the current user.
	 *
	 * @return array
	 */
	private function get_preview_transient(): array {
		$user_id  = get_current_user_id();
		$settings = get_transient( '_cfw_editor_preview_' . $user_id );

		return is_array( $settings ) ? $settings : [];
	}

	/**
	 * Whether the current request is an editor preview — either a full page load
	 * of the preview iframe (GET params) or an AJAX request originating from it
	 * (POST params, e.g. update_order_review).
	 *
	 * @return bool
	 */
	private function is_preview_mode(): bool {
		if ( function_exists( 'cfw_is_editor_preview' ) && cfw_is_editor_preview() ) {
			return true;
		}

		// AJAX requests from the preview iframe send the flag via POST.
		// Mirrors EditorPreviewSettingsOverride::is_update_order_review_with_editor_preview().
		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if (
			isset( $_POST['cfw_editor_preview'] ) && '1' === $_POST['cfw_editor_preview']
			&& isset( $_POST['_cfw_preview_nonce'] )
			&& wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_cfw_preview_nonce'] ) ), 'cfw-editor-preview' )
			&& current_user_can( 'cfw_manage_pages' )
		) {
			return true;
		}
		// phpcs:enable WordPress.Security.NonceVerification.Missing

		return false;
	}
}
