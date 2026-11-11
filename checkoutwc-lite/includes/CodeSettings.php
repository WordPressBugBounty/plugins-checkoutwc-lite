<?php

declare( strict_types = 1 );

namespace Objectiv\Plugins\Checkout;

/**
 * Decides who may change the settings that hold raw scripts and PHP snippets.
 *
 * These settings follow WordPress's unfiltered_html capability, which is off for everyone when DISALLOW_UNFILTERED_HTML is set and for everyone but super admins on multisite.
 *
 * @since 11.5.0
 */
final class CodeSettings {

	/** @var string[] option names of the script and PHP snippet settings */
	private const OPTION_NAMES = [
		'_cfw_header_scripts',
		'_cfw_footer_scripts',
		'_cfw_php_snippets',
		'_cfw_header_scripts_checkout',
		'_cfw_footer_scripts_checkout',
		'_cfw_header_scripts_thank_you',
		'_cfw_footer_scripts_thank_you',
		'_cfw_header_scripts_order_pay',
		'_cfw_footer_scripts_order_pay',
	];

	/**
	 * Determines whether the current user may change the script and PHP snippet settings.
	 *
	 * @since 11.5.0
	 *
	 * @return bool
	 */
	public static function current_user_can_edit_code(): bool {
		return current_user_can( 'unfiltered_html' );
	}

	/**
	 * Determines whether a WordPress option name is one of the script or PHP snippet settings.
	 *
	 * Compares the way the options table does: WordPress trims option names and MySQL matches them case-insensitively.
	 * MySQL also matches accented and other look-alike characters, so any name outside printable ASCII counts as one.
	 *
	 * @since 11.5.0
	 *
	 * @param string $option_name
	 * @return bool
	 */
	public static function is_code_option( string $option_name ): bool {
		$option_name = trim( $option_name );

		return 1 === preg_match( '/[^\x20-\x7e]/', $option_name ) || in_array( strtolower( $option_name ), self::OPTION_NAMES, true );
	}
}
