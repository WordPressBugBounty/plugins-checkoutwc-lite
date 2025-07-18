<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\CompatibilityAbstract;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;

class WooCommerceCheckoutFieldEditor extends CompatibilityAbstract {
	public function is_available(): bool {
		return defined( 'WC_CHECKOUT_FIELD_EDITOR_VERSION' );
	}

	public function pre_init() {
		add_filter( 'cfw_admin_integrations_checkbox_fields', array( $this, 'admin_integration_settings' ) );
		add_filter( 'woocommerce_custom_checkout_position', array( $this, 'add_additional_field_sizes' ) );
		add_filter( 'cfw_pre_output_fieldset_field_args', array( $this, 'cfw_form_field_args' ), 100000 - 1000, 1 );

		if ( SettingsManager::instance()->get_setting( 'allow_checkout_field_editor_address_modification' ) !== 'yes' ) {
			// Add styles for WooCommerce Checkout Field Editor admin page
			add_action( 'admin_head', array( $this, 'output_custom_styles' ) );
			add_action( 'admin_init', array( $this, 'maybe_redirect_to_additional_fields_tab' ) );
		}

		add_filter( 'pre_update_option_wc_fields_additional', array( $this, 'cleanup_classes' ) );
		add_filter( 'pre_update_option_wc_fields_billing', array( $this, 'cleanup_classes' ) );
		add_filter( 'pre_update_option_wc_fields_shipping', array( $this, 'cleanup_classes' ) );
	}

	public function run_immediately() {
		add_filter( 'woocommerce_enable_order_notes_field', array( $this, 'enable_notes_field' ) );

		if ( SettingsManager::instance()->get_setting( 'allow_checkout_field_editor_address_modification' ) === 'yes' ) {
			add_filter( 'option_wc_fields_billing', array( $this, 'cleanup_classes' ) );
			add_filter( 'option_wc_fields_shipping', array( $this, 'cleanup_classes' ) );

			return;
		}

		remove_filter( 'woocommerce_billing_fields', 'wc_checkout_fields_modify_billing_fields', 1 );
		remove_filter( 'woocommerce_shipping_fields', 'wc_checkout_fields_modify_shipping_fields', 1 );
	}

	public function run() {
		remove_action( 'wp_enqueue_scripts', 'wc_checkout_fields_dequeue_address_i18n', 15 );
		add_filter( 'cfw_body_classes', array( $this, 'add_body_class' ) );
	}

	public function add_body_class( $classes ) {
		$classes[] = 'cfw-cfe-active';

		return $classes;
	}

	/**
	 * Add the admin settings
	 *
	 * @param array $integrations The integrations.
	 *
	 * @return array
	 */
	public function admin_integration_settings( array $integrations ): array {
		if ( ! $this->is_available() ) {
			return $integrations;
		}

		$integrations[] = array(
			'name'          => 'allow_checkout_field_editor_address_modification',
			'label'         => __( 'Enable Checkout Field Editor address field overrides. (Not Recommended)', 'checkout-wc' ),
			'description'   => __( 'Allow WooCommerce Checkout Field Editor to modify billing and shipping address fields. Not compatible with these features: Separate House Number and Street Name Address Fields, Full Name Field, Fetchify', 'checkout-wc' ),
			'initial_value' => SettingsManager::instance()->get_setting( 'allow_checkout_field_editor_address_modification' ) === 'yes',
		);

		return $integrations;
	}

	public function cleanup_classes( $address_fields ) {
		foreach ( $address_fields as $field_key => $field ) {
			if ( is_array( $field['class'] ) ) {
				$field['class'] = array(
					end( $field['class'] ),
				);
			}

			// Update field array
			$address_fields[ $field_key ] = $field;
		}

		return $address_fields;
	}

	public function add_additional_field_sizes(): array {
		/**
		 * These cfw-col-* classes are old but still work for our purposes
		 *
		 * @see WooCommerceCheckoutFieldEditor::cfw_form_field_args()
		 */
		return array(
			'cfw-col-3'      => '25% Width',
			'cfw-col-4'      => '33% Width',
			'form-row-first' => '50% Width',
			'cfw-col-8'      => '67% Width',
			'cfw-col-9'      => '75% Width',
			'form-row-wide'  => __( 'Full-width', 'woocommerce-checkout-field-editor' ),
		);
	}

	public function enable_notes_field(): bool {
		return 'yes' === get_option( 'woocommerce_enable_order_comments', 'yes' );
	}

	public function output_custom_styles() {
		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if ( empty( $_GET['page'] ) || 'checkout_field_editor' !== $_GET['page'] ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}
		// phpcs:enable WordPress.Security.NonceVerification.Missing
		?>
		<style type="text/css">
			/* Hide Billing and Shipping Fields */
			.woo-nav-tab-wrapper a:nth-child(1), .woo-nav-tab-wrapper a:nth-child(2) {
				display: none;
			}
		</style>
		<?php
	}

	public function maybe_redirect_to_additional_fields_tab() {
		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if ( ! empty( $_GET['page'] ) && 'checkout_field_editor' === $_GET['page'] && ( empty( $_GET['tab'] ) || 'additional' !== $_GET['tab'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			wp_safe_redirect( 'admin.php?page=checkout_field_editor&tab=additional' );
			exit();
		}
		// phpcs:enable WordPress.Security.NonceVerification.Missing
	}

	/**
	 * Legacy field classes that we need to honor for now I guess
	 *
	 * @param array $args The field args.
	 *
	 * @return array
	 */
	public function cfw_form_field_args( $args ) {
		if ( ! isset( $args['class'] ) ) {
			return $args;
		}

		if ( in_array( 'cfw-col-3', (array) $args['class'], true ) ) {
			$args['columns'] = 3;
		}

		if ( in_array( 'cfw-col-4', (array) $args['class'], true ) ) {
			$args['columns'] = 4;
		}

		if ( in_array( 'cfw-col-8', (array) $args['class'], true ) ) {
			$args['columns'] = 8;
		}

		if ( in_array( 'cfw-col-9', (array) $args['class'], true ) ) {
			$args['columns'] = 9;
		}

		if ( in_array( 'form-row-wide', (array) $args['class'], true ) ) {
			$args['columns'] = 12;
		}

		return $args;
	}
}
