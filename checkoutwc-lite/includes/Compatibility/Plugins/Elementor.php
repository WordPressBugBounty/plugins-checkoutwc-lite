<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\CompatibilityAbstract;
use Elementor\Plugin as ElementorPlugin;

class Elementor extends CompatibilityAbstract {
	public function is_available(): bool {
		return defined( 'ELEMENTOR_VERSION' );
	}

	public function run() {
		// Disable side cart in Elementor editor
		add_filter( 'cfw_disable_side_cart', array( $this, 'maybe_disable_side_cart' ) );

		// Because Elementor refuses to fix this bug: https://github.com/elementor/elementor/issues/18722
		add_action( 'cfw_before_get_store_policy_content', array( $this, 'prevent_store_policy_bug' ) );
		add_action( 'cfw_after_get_store_policy_content', array( $this, 'add_filters_back' ) );
	}

	public function maybe_disable_side_cart( $disable ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['action'] ) && $_GET['action'] === 'elementor' ) {
			return true;
		}

		return $disable;
	}

	public function prevent_store_policy_bug() {
		ElementorPlugin::instance()->frontend->remove_content_filter();
	}

	public function add_filters_back() {
		ElementorPlugin::instance()->frontend->add_content_filter();
	}
}
