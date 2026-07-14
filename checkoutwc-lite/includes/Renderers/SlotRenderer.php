<?php

namespace Objectiv\Plugins\Checkout\Renderers;

use Objectiv\Plugins\Checkout\Managers\SlotManager;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\SingletonAbstract;

/**
 * Registers WordPress action hooks for each populated slot and renders the
 * assigned items at the correct position in the checkout template.
 *
 * The renderer deliberately keeps its output in sync with the container-div
 * convention used by the existing JS checkout bundle:
 *
 *   - Order bumps → <div id="cfw_bumps_{location}"></div>
 *   - Trust/review badges → reuses TrustBadges HTML structure
 *   - Custom HTML → <div class="cfw-slot-html-block"> … </div>
 *
 * @link checkoutwc.com
 * @since 11.2.0
 * @package Objectiv\Plugins\Checkout\Renderers
 */
class SlotRenderer extends SingletonAbstract {

	/**
	 * Registers the WordPress action hooks for all non-empty slots.
	 *
	 * In editor preview mode every slot is registered (even empty ones) so that
	 * the admin panel can highlight their position in the iframe on hover.
	 *
	 * Call this on the `init` action (after SlotManager migration has run).
	 */
	public function init(): void {
		$slot_manager = SlotManager::instance();
		$assignments  = $slot_manager->get_slots();
		$hook_map     = SlotManager::get_slot_hook_map();
		$is_preview   = $this->is_editor_preview();

		foreach ( $hook_map as $slot_id => $hook_config ) {
			$has_items = ! empty( $assignments[ $slot_id ] );

			// In normal (non-preview) mode skip slots with no assigned items.
			if ( ! $has_items && ! $is_preview ) {
				continue;
			}

			add_action(
				$hook_config['hook'],
				function () use ( $slot_id, $has_items, $is_preview ) {
					$classes = 'cfw-slot-wrap';
					if ( $is_preview ) {
						$classes .= ' cfw-slot-marker';
					}
					echo '<div class="' . esc_attr( $classes ) . '" data-cfw-slot="' . esc_attr( $slot_id ) . '"';
					if ( $is_preview ) {
						echo ' data-cfw-slot-marker="' . esc_attr( $slot_id ) . '"';
					}
					echo '>';
					if ( $has_items ) {
						$this->render_slot( $slot_id );
					}
					echo '</div>';
				},
				$hook_config['priority']
			);
		}
	}

	/**
	 * Returns true when the current request is an editor preview iframe load.
	 *
	 * @return bool
	 */
	private function is_editor_preview(): bool {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return isset( $_GET['cfw-editor-preview'] ) && '1' === $_GET['cfw-editor-preview'];
	}

	// ------------------------------------------------------------------
	// Slot rendering
	// ------------------------------------------------------------------

	/**
	 * Renders all items assigned to a slot in sort_order sequence.
	 *
	 * Consecutive trust-badge items are grouped into a single container so that
	 * they share the same CSS grid and multi-column layout.  Non-consecutive runs
	 * (e.g. trust badge → review badge → trust badge) each get their own
	 * container with a unique mount-point ID so they render at the correct
	 * position in the output, respecting sort order.
	 *
	 * @param string $slot_id The slot identifier.
	 */
	public function render_slot( string $slot_id ): void {
		$assignments               = SlotManager::instance()->get_slots();
		$html_blocks               = SlotManager::instance()->get_custom_html_blocks();
		$slot_items                = $assignments[ $slot_id ] ?? [];
		$output_bump_ids           = []; // Prevent processing the same bump/test twice per slot.
		$slot_bump_container_rendered = false; // All order bumps in a slot share one container div.

		usort( $slot_items, fn( $a, $b ) => ( $a['sort_order'] ?? 0 ) - ( $b['sort_order'] ?? 0 ) );

		$slot_items = array_values( $slot_items );
		$count      = count( $slot_items );
		$group_idx  = 0; // Disambiguates multiple trust-badge group containers.
		$i          = 0;

		while ( $i < $count ) {
			$item   = $slot_items[ $i ];
			$type   = $item['type'] ?? '';
			$margin = sanitize_text_field( $item['margin'] ?? '' );

			// Group consecutive individual trust-badge items that share the same margin into one container.
			// A margin change breaks the group so each badge can have its own spacing.
			if ( 'trust_badges' === $type && ! empty( $item['id'] ) ) {
				$run_ids      = [];
				$group_margin = $margin;
				while ( $i < $count && ( $slot_items[ $i ]['type'] ?? '' ) === 'trust_badges' && ! empty( $slot_items[ $i ]['id'] ) && sanitize_text_field( $slot_items[ $i ]['margin'] ?? '' ) === $group_margin ) {
					$run_ids[] = (string) $slot_items[ $i ]['id'];
					$i++;
				}
				if ( ! empty( $run_ids ) ) {
					if ( $group_margin ) {
						echo '<div style="margin: ' . esc_attr( $group_margin ) . '">';
					}
					$this->render_trust_badges_group( $slot_id, $run_ids, $group_idx );
					if ( $group_margin ) {
						echo '</div>';
					}
					$group_idx++;
				}
				continue;
			}

			switch ( $type ) {
				case 'order_bump':
					$bump_id = (int) ( $item['id'] ?? 0 );
					if ( $bump_id && ! in_array( $bump_id, $output_bump_ids, true ) ) {
						// All order bumps in the same slot share a single container div.
						// Per-bump margins are applied by the React OrderBumpsList component
						// using the margin value carried in the JS bump data.
						if ( ! $slot_bump_container_rendered ) {
							$this->render_order_bump_container( $slot_id );
							$slot_bump_container_rendered = true;
						}
						$output_bump_ids[] = $bump_id;
					}
					break;

				case 'review_badges':
					if ( $margin ) {
						echo '<div style="margin: ' . esc_attr( $margin ) . '">';
					}
					$this->render_review_badges( $slot_id );
					if ( $margin ) {
						echo '</div>';
					}
					break;

				case 'heading':
					if ( $margin ) {
						echo '<div style="margin: ' . esc_attr( $margin ) . '">';
					}
					$this->render_heading( $item );
					if ( $margin ) {
						echo '</div>';
					}
					break;

				case 'custom_html':
					$block_id = (string) ( $item['id'] ?? '' );
					if ( $block_id ) {
						if ( $margin ) {
							echo '<div style="margin: ' . esc_attr( $margin ) . '">';
						}
						$this->render_custom_html( $block_id, $html_blocks );
						if ( $margin ) {
							echo '</div>';
						}
					}
					break;
			}

			$i++;
		}
	}

	// ------------------------------------------------------------------
	// Type-specific renderers
	// ------------------------------------------------------------------

	/**
	 * Outputs the single bump container div for an entire slot.
	 *
	 * The div ID uses the slot_id (e.g. "above_terms_and_conditions") so that
	 * each slot gets its own unique mount point regardless of the bumps' legacy
	 * cfw_ob_display_location meta values. checkout.tsx mounts an OrderBumpsList
	 * component here and cfw_get_order_bumps_data() sets each bump's location to
	 * its assigned slot so the list filters correctly.
	 *
	 * All order_bump items inside the same slot share this single
	 * container – it is rendered only once per slot by render_slot().
	 *
	 * @param string $slot_id The slot identifier (e.g. "above_terms_and_conditions").
	 */
	private function render_order_bump_container( string $slot_id ): void {
		echo '<div id="' . esc_attr( 'cfw_bumps_' . $slot_id ) . '"></div>';
	}

	/**
	 * Outputs a single grouped container for a consecutive run of individually-
	 * assigned trust badges in a slot.  checkout.tsx mounts one TrustBadges
	 * component here and passes the badge-ID array so all badges share the same
	 * CSS grid, producing the correct multi-column layout.
	 *
	 * Multiple non-consecutive runs within the same slot each get a unique mount
	 * ID via $group_idx (0 = first run, 1 = second, …).
	 *
	 * @param string   $slot_id   The slot this block is being rendered in.
	 * @param string[] $badge_ids Ordered list of badge IDs in this run.
	 * @param int      $group_idx Zero-based index of this trust-badge group within the slot.
	 */
	private function render_trust_badges_group( string $slot_id, array $badge_ids, int $group_idx = 0 ): void {
		if ( empty( $badge_ids ) ) {
			return;
		}
		if ( SettingsManager::instance()->get_setting( 'enable_trust_badges' ) !== 'yes' ) {
			return;
		}

		$suffix         = $group_idx > 0 ? '-' . $group_idx : '';
		$mount_id       = 'cfw-trust-badges-' . $slot_id . $suffix;
		$badge_ids_json = wp_json_encode( array_values( $badge_ids ) );
		?>
		<div class="cfw-module cfw-trust-badges-position-<?php echo esc_attr( $slot_id ); ?>">
			<div class="cfw-tw">
				<div
					id="<?php echo esc_attr( $mount_id ); ?>"
					data-cfw-badge-ids="<?php echo esc_attr( $badge_ids_json ); ?>"
					data-cfw-slot-id="<?php echo esc_attr( $slot_id ); ?>"
				></div>
			</div>
		</div>
		<?php
	}

	/**
	 * Outputs the review-badges container.
	 *
	 * Renders a dedicated container that the React ReviewBadges component mounts
	 * into.  This is separate from the trust-badges container so that review badges
	 * and guarantee/trust badges can live in different slots and use independent
	 * column settings.
	 *
	 * @param string $slot_id The slot this block is being rendered in.
	 */
	private function render_review_badges( string $slot_id ): void {
		if ( SettingsManager::instance()->get_setting( 'enable_wc_review_badges' ) !== 'yes' ) {
			return;
		}

		$mount_id = 'cfw-review-badges-' . $slot_id;
		?>
		<div class="cfw-module cfw-review-badges-position-<?php echo esc_attr( $slot_id ); ?>">
			<div class="cfw-tw">
				<div
					id="<?php echo esc_attr( $mount_id ); ?>"
					data-cfw-review-badges="true"
					data-cfw-slot-id="<?php echo esc_attr( $slot_id ); ?>"
				></div>
			</div>
		</div>
		<?php
	}

	/**
	 * Outputs a heading block.
	 *
	 * Uses the same CSS class as the legacy trust-badges heading so existing
	 * theme styles are inherited automatically.  The heading level (h1–h6) is
	 * taken from the block data; defaults to h4.
	 *
	 * @param array{text: string, level?: int} $block The heading block data.
	 */
	private function render_heading( array $block ): void {
		$text  = $block['text'] ?? '';
		$level = max( 1, min( 6, (int) ( $block['level'] ?? 4 ) ) );
		$tag   = 'h' . $level;
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag is validated above
		echo '<' . $tag . ' class="cfw-trust-badges-list-title">' . wp_kses_post( do_shortcode( $text ) ) . '</' . $tag . '>';
	}

	/**
	 * Outputs an inline custom HTML block.
	 *
	 * Content is passed through wp_kses_post to allow standard HTML but strip
	 * potentially dangerous markup (scripts, event handlers, etc.).
	 *
	 * @param string $block_id   The UUID of the custom HTML block.
	 * @param array  $html_blocks The full blocks array from SlotManager.
	 */
	private function render_custom_html( string $block_id, array $html_blocks ): void {
		$block = $html_blocks[ $block_id ] ?? null;

		if ( ! $block || empty( $block['content'] ) ) {
			return;
		}

		echo '<div class="cfw-slot-html-block cfw-slot-html-block--' . esc_attr( $block_id ) . '">';
		echo wp_kses_post( do_shortcode( $block['content'] ) );
		echo '</div>';
	}
}
