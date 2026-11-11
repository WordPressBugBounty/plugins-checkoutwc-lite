<?php

namespace Objectiv\Plugins\Checkout\Admin\Notices;

use Objectiv\Plugins\Checkout\Admin\Pages\AdminPagesRegistry;
use Objectiv\Plugins\Checkout\Admin\UpgradeUrl;
use Objectiv\Plugins\Checkout\Managers\UpdatesManager;

class InactiveLicenseNotice extends NoticeAbstract {
	public function add() {
		parent::maybe_add(
			'cfw_inactive_license',
			__( 'CheckoutWC license not activated', 'checkout-wc' ),
			$this->get_message(),
			[
				'type'        => 'error',
				'dismissible' => false,
			]
		);
	}

	/**
	 * Returns the notice message, linking to the Dashboard's Your plan card.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public function get_message(): string {
		return sprintf(
			/* translators: %1$s: URL to the Dashboard's Your plan card, %2$s: "Activate it on the CheckoutWC Dashboard" link text, %3$s: Pricing URL, %4$s: "buy a license" link text */
			__( 'Premium features are off because your license isn\'t activated on this site. <a href="%1$s">%2$s</a> or <a href="%3$s" target="_blank">%4$s</a> for this site.', 'checkout-wc' ),
			AdminPagesRegistry::get( 'plan' )->get_url(),
			__( 'Activate it on the CheckoutWC Dashboard', 'checkout-wc' ),
			esc_url( UpgradeUrl::get( 'notice-license-inactive', 'https://www.checkoutwc.com/pricing/' ) ),
			__( 'buy a license', 'checkout-wc' )
		);
	}

	protected function should_add(): bool {
		$key_status  = UpdatesManager::instance()->get_field_value( 'key_status' );
		$license_key = UpdatesManager::instance()->get_field_value( 'license_key' );

		if ( empty( $license_key ) || ! in_array( $key_status, [ 'inactive', 'site_inactive' ], true ) ) {
			return false;
		}

		// The Dashboard's Your plan card already covers the license.
		if ( ! empty( $_GET['page'] ) && in_array( $_GET['page'], [ 'cfw-settings', 'cfw-settings-plan' ], true ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return false;
		}

		return true;
	}
}
