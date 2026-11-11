<?php

declare( strict_types = 1 );

namespace Objectiv\Plugins\Checkout\Admin;

/**
 * Builds checkoutwc.com links from inside the plugin, tagged with our UTM parameters.
 *
 * @since 11.5.0
 */
final class UpgradeUrl {

	/** @var string */
	public const LITE_UPGRADE_URL = 'https://www.checkoutwc.com/lite-upgrade/';

	/** @var string */
	public const ACCOUNT_URL = 'https://www.checkoutwc.com/account/';

	/** @var string utm_campaign in CheckoutWC Lite */
	public const LITE_CAMPAIGN = 'liteplugin';

	/** @var string utm_campaign in the paid build */
	public const PAID_CAMPAIGN = 'plugin';

	/** @var bool|null overrides the build check, for tests; null checks for the paid build's plan IDs */
	private static ?bool $is_paid_build = null;

	/**
	 * Returns the URL tagged with the UTM parameters for the given placement.
	 *
	 * The placement is lowercased and hyphenated, so GA4 stores one value per placement.
	 *
	 * @since 11.5.0
	 *
	 * @param string $placement where the link sits in the plugin, e.g. `admin-menu`
	 * @param string $url checkoutwc.com URL to tag
	 *
	 * @return string
	 */
	public static function get( string $placement, string $url = self::LITE_UPGRADE_URL ): string {
		$query = http_build_query(
			[
				'utm_source'   => 'checkoutwc',
				'utm_medium'   => 'app',
				'utm_campaign' => self::get_campaign(),
				'utm_content'  => trim( (string) preg_replace( '/[^a-z0-9]+/', '-', strtolower( $placement ) ), '-' ),
			],
			'',
			'&',
			PHP_QUERY_RFC3986
		);

		return $url . ( false === strpos( $url, '?' ) ? '?' : '&' ) . $query;
	}

	/**
	 * Returns the utm_campaign for this build: `plugin` in the paid build, `liteplugin` in Lite.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public static function get_campaign(): string {
		$is_paid_build = self::$is_paid_build ?? defined( 'CFW_PREMIUM_PLAN_IDS' );

		return $is_paid_build ? self::PAID_CAMPAIGN : self::LITE_CAMPAIGN;
	}

	/**
	 * Sets which build the campaign is for, or null to detect it. For tests: the unit suite defines the paid build's constant for the whole process.
	 *
	 * @since 11.5.0
	 *
	 * @internal
	 *
	 * @param bool|null $is_paid_build true for the paid build, false for Lite, null to detect it
	 *
	 * @return void
	 */
	public static function set_paid_build( ?bool $is_paid_build ): void {
		self::$is_paid_build = $is_paid_build;
	}
}
