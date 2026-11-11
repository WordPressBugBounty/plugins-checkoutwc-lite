<?php

declare( strict_types = 1 );

namespace Objectiv\Plugins\Checkout\Admin\Notices;

/**
 * Renders the Black Friday annual and Lifetime offer cards for the Black Friday notices.
 *
 * The notice message goes through wp_kses_post() and wpautop(), and no admin stylesheet loads on every notice screen, so the markup uses inline styles and no line breaks.
 * The few rules inline styles can't express (narrow screens, the notice's own logo and title) live in client/scss/admin/global.scss, keyed on the cfw-bf-cards and cfw-bf-card classes.
 *
 * @since 11.5.0
 */
final class BFOfferCards {

	/** @var string the Black Friday page */
	private const URL = 'https://www.checkoutwc.com/black-friday-cyber-monday/';

	/** @var string the colour of the Lifetime badge and border, matching the primary buttons */
	private const HIGHLIGHT_COLOR = '#3858e9';

	/** @var string the inline style of the discount amount in the card headings */
	private const AMOUNT_STYLE = 'font-size:26px;font-weight:700;line-height:1.1;color:' . self::HIGHLIGHT_COLOR . ';';

	/** @var string the inline style of the Lifetime badge, which sits on the card's top border */
	private const BADGE_STYLE = 'position:absolute;top:-10px;left:16px;padding:2px 8px;border-radius:999px;background:' . self::HIGHLIGHT_COLOR . ';color:#fff;font-size:11px;font-weight:700;line-height:16px;text-transform:uppercase;letter-spacing:.5px;';

	/**
	 * Gets the annual and Lifetime offer cards: two equal columns with bottom-aligned buttons on wide screens, stacked on narrow ones.
	 *
	 * The Lifetime card is highlighted with a badge on its top border and a thicker border. The annual card gets 1px more padding, so both cards' content lines up.
	 *
	 * @since 11.5.0
	 *
	 * @param string $utm_campaign the utm_campaign of both links
	 * @param string $utm_content_prefix the utm_content of both links, before -annual or -lifetime
	 * @return string
	 */
	public static function get_html( string $utm_campaign, string $utm_content_prefix ): string {
		$cards = [
			[
				/* translators: %s: discount amount, such as 40%. */
				'heading'   => sprintf( esc_html__( '%s off a new annual plan', 'checkout-wc' ), '<span style="' . self::AMOUNT_STYLE . '">40%</span>' ),
				/* translators: %s: discount code. */
				'text'      => sprintf( esc_html__( 'Every feature, on 1, 3, 10, 25 or 50 sites. Use code %s.', 'checkout-wc' ), '<strong>BF40</strong>' ),
				'button'    => __( 'See annual plans', 'checkout-wc' ),
				'content'   => 'annual',
				'code'      => 'BF40',
				'highlight' => false,
			],
			[
				/* translators: %s: discount amount, such as $100. */
				'heading'   => sprintf( esc_html__( '%s off Lifetime', 'checkout-wc' ), '<span style="' . self::AMOUNT_STYLE . '">$100</span>' ),
				/* translators: %s: discount code. */
				'text'      => sprintf( esc_html__( 'Our first-ever Lifetime deal. Every feature, on one site. Pay once, with no renewals. Use code %s.', 'checkout-wc' ), '<strong>LIFETIMESPECIAL</strong>' ),
				'button'    => __( 'Get Lifetime', 'checkout-wc' ),
				'content'   => 'lifetime',
				'code'      => 'LIFETIMESPECIAL',
				'highlight' => true,
			],
		];

		$badge = esc_html__( 'First time ever', 'checkout-wc' );
		$html  = '';

		foreach ( $cards as $card ) {
			$url = add_query_arg(
				[
					'utm_source'   => 'checkoutwc',
					'utm_medium'   => 'app',
					'utm_campaign' => $utm_campaign,
					'utm_content'  => $utm_content_prefix . '-' . $card['content'],
					// EDD applies a discount passed in the URL.
					'discount'     => $card['code'],
				],
				self::URL
			);

			if ( $card['highlight'] ) {
				// The badge is a div, not a span: wpautop() would wrap a leading inline element in a paragraph.
				$box_style  = 'position:relative;padding:16px;border:2px solid ' . self::HIGHLIGHT_COLOR . ';';
				$badge_html = '<div style="' . self::BADGE_STYLE . '">' . $badge . '</div>';
			} else {
				$box_style  = 'padding:17px;border:1px solid #c3c4c7;';
				$badge_html = '';
			}

			$html .= sprintf(
				'<div class="cfw-bf-card" style="flex:1 1 0;min-width:220px;display:flex;flex-direction:column;%sborder-radius:4px;background:#fff;">%s<h3 style="margin:0 0 4px;font-size:16px;font-weight:600;line-height:1.4;">%s</h3><p style="margin:0 0 16px;font-size:13px;line-height:1.5;">%s</p><p style="margin:auto 0 0;"><a href="%s" target="_blank" class="button button-primary" style="display:block;width:100%%;text-align:center;">%s</a></p></div>',
				$box_style,
				$badge_html,
				$card['heading'],
				$card['text'],
				esc_url( $url ),
				esc_html( $card['button'] )
			);
		}

		return '<div class="cfw-bf-cards" style="display:flex;flex-wrap:wrap;align-items:stretch;gap:20px 12px;max-width:760px;margin:16px 0 12px;">' . $html . '</div>';
	}

}
