<?php

namespace Objectiv\Plugins\Checkout\Admin\Pages;

use Objectiv\Plugins\Checkout\Admin\TabNavigation;
use Objectiv\Plugins\Checkout\Admin\Pages\Traits\TabbedAdminPageTrait;
use Objectiv\Plugins\Checkout\CodeSettings;
use Objectiv\Plugins\Checkout\Managers\NoticesManager;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use WP_Error;

/**
 * @link checkoutwc.com
 * @since 5.0.0
 * @package Objectiv\Plugins\Checkout\Admin\Pages
 */
class Advanced extends PageAbstract {
	use TabbedAdminPageTrait;

	/**
	 * Options the settings export and import leave out: the main settings arrays, which the export covers
	 * option by option, credentials, which must not end up in a shared file, and internal state that is not a setting.
	 *
	 * @since 11.4.2
	 *
	 * @var string[]
	 */
	private const EXPORT_EXCLUDED_OPTIONS = [
		'_cfw__settings',
		'_cfwlite__settings',
		'_cfw_turnstile_secret_key',
		'_cfw_smartystreets_auth_token',
		'_cfw_fetchify_access_token',
		'_cfw_premium_install_checked',
		'_cfw_updated_lite_to_pro',
		'_cfw_checkout_slots_migrated',
		'_cfw_checkout_custom_fields_revision',
		'_cfw_tracking_notice',
		'_cfw_tracking_last_send',
	];

	/**
	 * Prefix of the license options (key, status, activation state), which the export and import leave out.
	 *
	 * @since 11.5.0
	 *
	 * @var string
	 */
	private const LICENSING_OPTION_PREFIX = '_cfw_licensing_';

	/**
	 * Pattern an import file entry's name must match before any other check.
	 *
	 * The options table matches names case- and accent-insensitively, so anything outside lowercase ASCII could resolve to an excluded option.
	 * Hyphens are allowed for per-template settings of theme templates.
	 *
	 * @since 11.5.0
	 *
	 * @var string
	 */
	private const IMPORTABLE_OPTION_PATTERN = '/^_cfw_[a-z0-9_-]+$/D';

	/**
	 * Image types a settings import may download as a logo.
	 *
	 * @since 11.5.0
	 *
	 * @var array<string, string>
	 */
	private const LOGO_MIME_TYPES = [
		'jpg|jpeg|jpe' => 'image/jpeg',
		'png'          => 'image/png',
		'gif'          => 'image/gif',
		'webp'         => 'image/webp',
		'avif'         => 'image/avif',
	];

	public function __construct() {
		parent::__construct( __( 'Advanced', 'checkout-wc' ), 'cfw_manage_advanced', 'cfw_manage_advanced' );
	}

	public function init() {
		parent::init();

		$this->set_tabbed_navigation( new TabNavigation( 'advanced' ) );

		$this->get_tabbed_navigation()->add_tab( __( 'Advanced', 'checkout-wc' ), add_query_arg( [ 'subpage' => 'advanced' ], $this->get_url() ), 'advanced' );
		$this->get_tabbed_navigation()->add_tab( __( 'Scripts', 'checkout-wc' ), add_query_arg( [ 'subpage' => 'scripts' ], $this->get_url() ), 'scripts' );
		$this->get_tabbed_navigation()->add_tab( __( 'Tools', 'checkout-wc' ), add_query_arg( [ 'subpage' => 'tools' ], $this->get_url() ), 'tools' );

		add_action( 'wp_ajax_cfw_generate_settings', [ $this, 'generate_settings_export' ] );
		add_action( 'admin_init', [ $this, 'maybe_upload_settings' ], 0 );
	}

	public function output() {
		$current_tab_function = $this->get_tabbed_navigation()->get_current_tab() . '_tab';
		$callable             = [ $this, $current_tab_function ];

		$this->get_tabbed_navigation()->display_tabs();

		call_user_func( $callable );
	}

	public function scripts_tab() {
		?>
		<div id="cfw-admin-pages-advanced-scripts"></div>
		<?php
	}

	public function advanced_tab() {
		?>
		<div id="cfw-admin-pages-advanced-options"></div>
		<?php
	}

	public function tools_tab() {
		?>
		<form name="settings" action="<?php echo esc_attr( sanitize_url( wp_unslash( $_SERVER['REQUEST_URI'] ?? '' ) ) ); ?>" method="post"
				enctype="multipart/form-data">
			<div class="space-y-6 mt-4">
				<?php
				cfw_admin_page_section(
					__( 'Export Settings', 'checkout-wc' ),
					__( 'Download a JSON file containing the current plugin settings.', 'checkout-wc' ),
					$this->get_export_settings()
				);
				cfw_admin_page_section(
					__( 'Import Settings', 'checkout-wc' ),
					__( 'Replace your current settings with a previous settings export.', 'checkout-wc' ),
					$this->get_import_settings()
				);
				?>
			</div>
		</form>
		<?php
	}

	public function get_export_settings() {
		ob_start();
		?>
		<input id="export_settings_button" type="button" class="button"
				data-nonce="<?php echo esc_attr( wp_create_nonce( '_cfw__export_settings' ) ); ?>"
				value="<?php _e( 'Export Settings', 'checkout-wc' ); ?>"/>

		<p id="small-description" class="text-gray-500">
			<?php _e( 'Download a backup file of your settings.', 'checkout-wc' ); ?>
		</p>
		<?php
		return ob_get_clean();
	}

	public function get_import_settings() {
		ob_start();
		?>
		<input name="uploaded_settings" type="file" class=""
				value="<?php _e( 'Import Settings', 'checkout-wc' ); ?>"/>
		<?php wp_nonce_field( 'import_cfw_settings_nonce' ); ?>
		<div>
			<input id="import_settings_button" type="submit" class="button" name="import_cfw_settings"
					value="<?php _e( 'Upload File and Import Settings', 'checkout-wc' ); ?>"/>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Generate Settings JSON file
	 *
	 * @return void
	 * @since  3.8.0
	 */
	public static function generate_settings_export() {
		global $wpdb;

		// Bail if not admin.
		if ( ! current_user_can( 'cfw_export_settings' ) ) {
			wp_die();
		}

		// Bail if nonce check fails.
		if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) ), '_cfw__export_settings' ) ) {
			wp_die();
		}

		$settings = [];

		// Get all WP options that start with cfw_.
		$placeholders = implode( ', ', array_fill( 0, count( self::EXPORT_EXCLUDED_OPTIONS ), '%s' ) );
		$query        = $wpdb->prepare(
			"SELECT option_name, option_value FROM $wpdb->options WHERE option_name LIKE %s AND option_name NOT IN ( $placeholders )", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
			array_merge( [ $wpdb->esc_like( '_cfw' ) . '_%' ], self::EXPORT_EXCLUDED_OPTIONS )
		);
		$values       = $wpdb->get_results( $query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		foreach ( $values as $value ) {
			if ( self::is_excluded_option( $value->option_name ) ) {
				continue;
			}

			$settings[ $value->option_name ] = $value->option_value;
		}

		$templates = cfw_get_available_templates();

		foreach ( $templates as $template ) {
			$key           = '_cfw_logo_attachment_id_' . $template->get_slug();
			$attachment_id = $settings[ $key ] ?? '';

			if ( ! empty( $attachment_id ) ) {
				$settings[ '_cfw_logo_attachment_url_' . $template->get_slug() ] = wp_get_attachment_url( $attachment_id );
			}
		}

		if ( ! empty( $settings ) ) {
			echo wp_json_encode( $settings );
			wp_die();
		}

		wp_die();
	}

	/**
	 * Upload Settings
	 *
	 * @return void
	 * @since  3.8.0
	 */
	public function maybe_upload_settings() {
		// Make sure we're an admin and that we have a valid request
		if ( ! current_user_can( 'cfw_import_settings' ) || empty( $_POST['import_cfw_settings'] ) ) {
			return;
		}

		if (
			! current_user_can( 'upload_files' ) ||
			! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['_wpnonce'] ?? '' ) ), 'import_cfw_settings_nonce' ) ||
			( empty( $_FILES['uploaded_settings'] ) || 0 === $_FILES['uploaded_settings']['size'] ?? 0 )
		) {

			NoticesManager::instance()->add(
				'cfw_import_settings_error',
				__( 'CheckoutWC Settings Import Failed', 'checkout-wc' ),
				__( 'Unable to import settings. Did you select a JSON file to upload?', 'checkout-wc' ),
				[
					'type'        => 'error',
					'dismissible' => false,
				]
			);
			return;
		}

		$upload = ! empty( $_FILES['uploaded_settings'] ) ? $_FILES['uploaded_settings'] : []; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( empty( $upload ) ) {
			wp_die( esc_html__( 'Error. Uploaded file appears empty.', 'checkout-wc' ) );
		}

		$file_tmp_path  = $upload['tmp_name'];
		$file_name      = $upload['name'];
		$file_name_cmps = explode( '.', $file_name );
		$file_extension = strtolower( end( $file_name_cmps ) );

		$new_file_name = md5( time() . $file_name ) . '.' . $file_extension;

		if ( 'json' !== $file_extension ) {
			wp_die( esc_html__( 'Wrong file extension. Uploaded settings must be a JSON file.', 'checkout-wc' ) );
		}

		$wp_uploads = wp_upload_dir();
		$upload_dir = trailingslashit( $wp_uploads['basedir'] );
		$dest_path  = $upload_dir . $new_file_name;

		if ( ! move_uploaded_file( $file_tmp_path, $dest_path ) ) {
			wp_die( esc_html__( 'Error moving uploaded file - check your permissions.', 'checkout-wc' ) );
		}

		$contents = file_get_contents( $dest_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$decoded  = json_decode( $contents, JSON_OBJECT_AS_ARRAY );

		if ( ! $decoded || ! is_array( $decoded ) ) {
			wp_die( esc_html__( 'Error decoding JSON file.', 'checkout-wc' ) );
		}

		$this->import_settings( $decoded );

		wp_delete_file( $dest_path );
	}

	/**
	 * Applies the settings from a decoded import file and reports the result.
	 *
	 * Only CheckoutWC options the export can produce are written; anything else in the file is ignored.
	 *
	 * @since 11.5.0
	 *
	 * @param array<mixed> $decoded option name => value from the import file
	 * @return void
	 */
	private function import_settings( array $decoded ): void {
		$active_template_slug = cfw_get_active_template( true )->get_slug();

		// Pre 9.x logo handler
		if ( ! empty( $decoded['_cfw_logo_attachment_id'] ) && ! empty( $decoded['_cfw_logo_attachment_url'] ) && ! isset( $decoded[ '_cfw_logo_attachment_id_' . $active_template_slug ] ) ) {
			$image_upload = $this->upload_logo( $decoded['_cfw_logo_attachment_url'] );

			if ( $image_upload ) {
				$decoded[ '_cfw_logo_attachment_id_' . $active_template_slug ] = $image_upload ? $image_upload : '';
			}
		} else {
			cfw_debug_log( 'Failed to upload pre 9.x logo.' );
		}

		// Handle logos
		$templates = cfw_get_available_templates();

		foreach ( $templates as $template ) {
			$key = '_cfw_logo_attachment_url_' . $template->get_slug();
			$url = $decoded[ $key ] ?? '';

			if ( ! empty( $url ) ) {
				$image_upload_attachment_id = $this->upload_logo( $url );

				if ( $image_upload_attachment_id ) {
					$decoded[ '_cfw_logo_attachment_id_' . $template->get_slug() ] = $image_upload_attachment_id ? $image_upload_attachment_id : '';
				}

				unset( $decoded[ $key ] );
			}
		}

		$ignored      = 0;
		$skipped_code = [];

		foreach ( $decoded as $key => $value ) {
			if ( ! self::is_importable_option( $key ) ) {
				++$ignored;
				continue;
			}

			if ( CodeSettings::is_code_option( $key ) && ! CodeSettings::current_user_can_edit_code() ) {
				$skipped_code[] = $key;
				continue;
			}

			update_option( $key, self::decode_imported_value( $value ) );
		}

		$message = __( 'Successfully imported settings.', 'checkout-wc' );

		if ( $ignored > 0 ) {
			$message .= ' ' . sprintf(
				/* translators: %d: number of entries in the file that were not imported */
				_n( '%d entry was ignored because it is not a CheckoutWC setting.', '%d entries were ignored because they are not CheckoutWC settings.', $ignored, 'checkout-wc' ),
				$ignored
			);
		}

		NoticesManager::instance()->add(
			'cfw_import_settings_success',
			__( 'CheckoutWC Settings Import Successful', 'checkout-wc' ),
			$message,
			[
				'type'        => 'success',
				'dismissible' => false,
			]
		);

		if ( ! empty( $skipped_code ) ) {
			NoticesManager::instance()->add(
				'cfw_import_settings_code_skipped',
				__( 'Some settings were not imported', 'checkout-wc' ),
				sprintf(
					/* translators: %s: comma-separated list of setting names */
					__( 'Scripts and PHP snippets need the unfiltered_html permission, which your account does not have. Not imported: %s', 'checkout-wc' ),
					implode( ', ', $skipped_code )
				),
				[
					'type'        => 'warning',
					'dismissible' => false,
				]
			);
		}
	}

	/**
	 * Determines whether an import file entry is a CheckoutWC option the export can produce.
	 *
	 * @since 11.5.0
	 *
	 * @param int|string $key
	 * @return bool
	 */
	private static function is_importable_option( $key ): bool {
		return is_string( $key ) && 1 === preg_match( self::IMPORTABLE_OPTION_PATTERN, $key ) && ! self::is_excluded_option( $key );
	}

	/**
	 * Determines whether an option is one the settings export and import leave out.
	 *
	 * Compares the way the options table does: WordPress trims option names and MySQL matches them case-insensitively.
	 *
	 * @since 11.5.0
	 *
	 * @param string $option_name
	 * @return bool
	 */
	private static function is_excluded_option( string $option_name ): bool {
		$option_name = strtolower( trim( $option_name ) );

		return 0 === strpos( $option_name, self::LICENSING_OPTION_PREFIX ) || in_array( $option_name, self::EXPORT_EXCLUDED_OPTIONS, true );
	}

	/**
	 * Decodes a serialized value from an import file without creating objects.
	 *
	 * The export writes array settings as serialized strings. A value that would decode to an object is kept as the raw string.
	 *
	 * @since 11.5.0
	 *
	 * @param mixed $value
	 * @return mixed
	 */
	private static function decode_imported_value( $value ) {
		if ( ! is_string( $value ) || ! is_serialized( $value ) ) {
			return $value;
		}

		$decoded = @unserialize( trim( $value ), [ 'allowed_classes' => false ] ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.PHP.DiscouragedPHPFunctions.serialize_unserialize

		if ( false === $decoded && 'b:0;' !== trim( $value ) ) {
			return $value;
		}

		return self::contains_object( $decoded ) ? $value : $decoded;
	}

	/**
	 * Determines whether a decoded value is or holds an object.
	 *
	 * @since 11.5.0
	 *
	 * @param mixed $value
	 * @return bool
	 */
	private static function contains_object( $value ): bool {
		if ( is_object( $value ) ) {
			return true;
		}

		if ( is_array( $value ) ) {
			foreach ( $value as $item ) {
				if ( self::contains_object( $item ) ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Upload Logo
	 *
	 * @param string $file_url The file URL.
	 *
	 * @return int|WP_Error|bool
	 * @since  3.8.0
	 */
	public function upload_logo( $file_url ) {
		$file_url = is_string( $file_url ) ? trim( $file_url ) : '';
		$scheme   = strtolower( (string) wp_parse_url( $file_url, PHP_URL_SCHEME ) );

		if ( ! in_array( $scheme, [ 'http', 'https' ], true ) || ! wp_http_validate_url( $file_url ) ) {
			cfw_debug_log( 'Skipped logo during settings import: URL not allowed.' );
			return false;
		}

		$filename = sanitize_file_name( basename( (string) wp_parse_url( $file_url, PHP_URL_PATH ) ) );

		if ( ! wp_check_filetype( $filename, self::LOGO_MIME_TYPES )['type'] ) {
			cfw_debug_log( 'Skipped logo during settings import: not an image file.' );
			return false;
		}

		$logo = wp_safe_remote_get( $file_url );

		if ( is_wp_error( $logo ) ) {
			wc_get_logger()->error( 'Error fetching logo during settings import: ' . $logo->get_error_message(), [ 'source' => 'checkout-wc' ] );
			return false;
		}

		$upload_file = wp_upload_bits( $filename, null, wp_remote_retrieve_body( $logo ) );

		if ( ! $upload_file['error'] ) {
			$wp_file_type = wp_check_filetype_and_ext( $upload_file['file'], $filename, self::LOGO_MIME_TYPES );
			$real_mime    = wp_get_image_mime( $upload_file['file'] );

			if ( ! $wp_file_type['type'] || ! in_array( $real_mime, self::LOGO_MIME_TYPES, true ) ) {
				wp_delete_file( $upload_file['file'] );
				cfw_debug_log( 'Skipped logo during settings import: downloaded file is not an image.' );
				return false;
			}

			$attachment = [
				'post_mime_type' => $real_mime,
				'post_parent'    => 0,
				'post_title'     => preg_replace( '/\.[^.]+$/', '', $filename ),
				'post_content'   => '',
				'post_status'    => 'inherit',
			];

			$attachment_id = wp_insert_attachment( $attachment, $upload_file['file'], 0 );

			if ( ! is_wp_error( $attachment_id ) ) {
				$attachment_data = wp_generate_attachment_metadata( $attachment_id, $upload_file['file'] );
				wp_update_attachment_metadata( $attachment_id, $attachment_data );
			}

			return $attachment_id;
		}

		return '';
	}

	public function maybe_set_script_data() {
		if ( ! $this->is_current_page() ) {
			return;
		}

		if ( 'advanced' === $this->get_tabbed_navigation()->get_current_tab() ) {
			$this->set_script_data(
				[
					'settings' => [
						'template_loader'             => SettingsManager::instance()->get_setting( 'template_loader' ),
						'enable_beta_version_updates' => SettingsManager::instance()->get_setting( 'enable_beta_version_updates' ) === 'yes',
						'hide_admin_bar_button'       => SettingsManager::instance()->get_setting( 'hide_admin_bar_button' ) === 'yes',
						'enable_debug_log'            => SettingsManager::instance()->get_setting( 'enable_debug_log' ) === 'yes',
						'allow_tracking'              => [ SettingsManager::instance()->get_setting( 'allow_tracking' ) ],
						'allow_uninstall'             => SettingsManager::instance()->get_setting( 'allow_uninstall' ) === 'yes',
					],
					'params'   => [
						'allow_tracking_hash' => md5( trailingslashit( home_url() ) ),
					],
					'plan'     => $this->get_plan_data(),
				]
			);
		}

		if ( 'scripts' === $this->get_tabbed_navigation()->get_current_tab() ) {
			$this->set_script_data(
				[
					'settings' => [
						'header_scripts'           => cfw_get_setting( 'header_scripts', null, '' ),
						'footer_scripts'           => cfw_get_setting( 'footer_scripts', null, '' ),
						'php_snippets'             => cfw_get_setting( 'php_snippets', null, '' ),
						'header_scripts_checkout'  => cfw_get_setting( 'header_scripts_checkout', null, '' ),
						'footer_scripts_checkout'  => cfw_get_setting( 'footer_scripts_checkout', null, '' ),
						'header_scripts_thank_you' => cfw_get_setting( 'header_scripts_thank_you', null, '' ),
						'footer_scripts_thank_you' => cfw_get_setting( 'footer_scripts_thank_you', null, '' ),
						'header_scripts_order_pay' => cfw_get_setting( 'header_scripts_order_pay', null, '' ),
						'footer_scripts_order_pay' => cfw_get_setting( 'footer_scripts_order_pay', null, '' ),
					],
					// Nested, because wp_localize_script() turns a top-level false into ''.
					'params'   => [
						'can_edit_code' => CodeSettings::current_user_can_edit_code(),
					],
					'plan'     => $this->get_plan_data(),
				]
			);
		}
	}
}
