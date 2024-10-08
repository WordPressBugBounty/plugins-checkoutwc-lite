<?php

namespace Objectiv\Plugins\Checkout\Admin\Pages;

use Objectiv\Plugins\Checkout\Managers\SettingsManager;

/**
 * Class Admin
 *
 * @link checkoutwc.com
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core
 */
abstract class PageAbstract {
	protected $title;
	protected $capability;
	protected $slug;
	protected $priority           = 100;
	protected static $parent_slug = 'cfw-settings';

	/**
	 * PageAbstract constructor.
	 *
	 * @param $title
	 * @param $capability
	 * @param string|null $slug
	 */
	public function __construct( $title, $capability, string $slug = null ) {
		$this->title      = $title;
		$this->capability = $capability;
		$this->slug       = join( '-', array_filter( array( self::$parent_slug, $slug ) ) );
	}

	/**
	 * Set priority of page in menu
	 *
	 * @param int $priority
	 * @return $this
	 */
	public function set_priority( int $priority ): PageAbstract {
		$this->priority = $priority;

		return $this;
	}

	public function init() {
		add_action( 'admin_menu', array( $this, 'setup_menu' ), $this->priority );
		add_action( 'admin_bar_menu', array( $this, 'add_admin_bar_menu_node' ), 100 + $this->priority );
	}

	public function setup_menu() {
		add_submenu_page( self::$parent_slug, $this->title, $this->title, $this->capability, $this->slug, array( $this, 'output_with_wrap' ), $this->priority );
	}

	public function get_url(): string {
		$url = add_query_arg( 'page', $this->slug, admin_url( 'admin.php' ) );

		return esc_url( $url );
	}

	public function is_current_page(): bool {
		return sanitize_text_field( $_GET['page'] ?? '' ) === $this->slug;
	}

	abstract public function output();

	/**
	 * The admin page wrap
	 *
	 * @since 1.0.0
	 */
	public function output_with_wrap() {
		$hide_settings_button = ( isset( $_GET['subpage'] ) && 'templates' === $_GET['subpage'] ) || ( isset( $_GET['page'] ) && 'cfw-settings-support' === $_GET['page'] );
		?>
		<div class="cfw-admin-notices-container">
			<div class="wp-header-end"></div>
		</div>
		<div class="cfw-tw">
			<div id="cfw_admin_page_header" class="fixed top-0 divide-y shadow z-50">
				<?php do_action( 'cfw_before_admin_page_header', $this ); ?>
				<div class="min-h-[64px] bg-white flex items-center pl-8 justify-between">
					<div class="flex items-center">
						<span>
							<?php echo file_get_contents( CFW_PATH . '/assets/admin/images/icon.svg' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</span>
						<nav class="flex" aria-label="Breadcrumb">
							<ol role="list" class="flex items-center space-x-2">
								<li class="m-0">
									<div class="flex items-center">
										<span class="ml-2 text-sm font-medium text-gray-800">
											<?php cfw_e( 'CheckoutWC', 'checkout-wc' ); ?>
										</span>
									</div>
								</li>
								<li class="m-0">
									<div class="flex items-center">
										<!-- Heroicon name: solid/chevron-right -->
										<svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
										</svg>
										<span class="ml-2 text-sm font-medium text-gray-500" aria-current="page">
											<?php echo esc_html( $this->title ); ?>
										</span>
									</div>
								</li>
							</ol>
						</nav>
					</div>

					<button type="button" id="cfw_admin_header_save_button" class="cfw-save-inactive cfw-shake-animation <?php echo $hide_settings_button ? 'invisible' : ''; ?> mr-10 inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
						<?php cfw_e( 'Save Changes' ); ?>
					</button>
				</div>
				<?php do_action( 'cfw_after_admin_page_header', $this ); ?>
			</div>

			<div class="cfw-admin-content-wrap cfw-admin-screen-<?php echo esc_attr( sanitize_title_with_dashes( $this->title ) ); ?> p-10 z-10">
				<?php $this->output(); ?>
			</div>
		</div>
		<?php
	}

	public function maybe_show_overridden_setting_notice( $show = false, $replacement_text = '' ) {
		if ( ! $show ) {
			return;
		}
		?>
		<div class='cfw-notification-message'>
			<strong><?php cfw_e( 'Setting Overridden', 'checkout-wc' ); ?></strong> &mdash;

			<?php if ( empty( $replacement_text ) ) : ?>
				<?php cfw_e( 'This setting is currently programmatically overridden. To enable it remove your custom code.', 'checkout-wc' ); ?>
			<?php else : ?>
				<?php echo esc_html( $replacement_text ); ?>
			<?php endif; ?>
		</div>
		<?php
	}

	public function output_form_open() {
		?>
		<form name="settings" action="<?php echo esc_attr( wc_clean( $_SERVER['REQUEST_URI'] ?? '' ) ); ?>" method="post">
			<?php
			SettingsManager::instance()->the_nonce();
	}

	public function output_form_close() {
		?>
			<input type="submit" name="submit" id="cfw_admin_page_submit" class="hidden" value="submit" />
		</form>
		<?php
	}

	/**
	 * Output radio group row
	 *
	 * @param string $setting
	 * @param string $label
	 * @param string $description
	 * @param mixed $default_value
	 * @param array $options
	 * @param array $descriptions
	 * @param array $args
	 */
	public function output_radio_group_row( string $setting, string $label, string $description, $default_value, array $options, array $descriptions, array $args = array() ) {
		$settings   = SettingsManager::instance();
		$value      = $settings->get_setting( $setting );
		$field_name = $settings->get_field_name( $setting );
		$defaults   = array(
			'enabled'                => true,
			'notice'                 => null,
			'show_overridden_notice' => false,
			'nested'                 => false,
		);

		$args = wp_parse_args( $args, $defaults );
		?>
		<div class="cfw-admin-field-container cfw-admin-field-radio-group <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<legend class="text-base font-medium text-gray-900">
				<?php echo esc_html( $label ); ?>
			</legend>
			<p class="text-sm leading-5 text-gray-500">
				<?php echo wp_kses_post( $description ); ?>
			</p>
			<div class="space-y-5 mt-4">
				<?php foreach ( $options as $option_value => $option_label ) : ?>
					<div class="relative flex items-start">
						<div class="flex items-center h-5">
							<input <?php echo ! $args['enabled'] ? 'disabled' : ''; ?> id="<?php echo esc_attr( "{$setting}_{$option_value}" ); ?>" type="radio" name="<?php echo esc_attr( $field_name ); ?>" value="<?php echo esc_attr( $option_value ); ?>" class="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300" <?php echo $option_value === $value || ( empty( $value ) && $option_value === $default_value ) ? 'checked' : ''; ?> />
						</div>
						<div class="ml-3 text-sm">
							<label for="<?php echo esc_attr( "{$setting}_{$option_value}" ); ?>" style="vertical-align: unset;" class="font-medium text-gray-700">
								<?php echo esc_html( $option_label ); ?>
							</label>

							<?php if ( isset( $descriptions[ $option_value ] ) ) : ?>
								<p id="small-description" class="text-gray-500">
									<?php echo esc_html( $descriptions[ $option_value ] ); ?>
								</p>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>

			<?php $this->maybe_show_overridden_setting_notice( $args['show_overridden_notice'] ); ?>
		</div>
		<?php
	}

	/**
	 * Output horizontal icon radio group row
	 *
	 * @param string $setting
	 * @param string $label
	 * @param string $description
	 * @param mixed $default_value
	 * @param array $options
	 * @param array $descriptions
	 * @param array $args
	 */
	public function output_horizontal_icon_radio_group_row( string $setting, string $label, string $description, $default_value, array $options, array $descriptions, array $args = array() ) {
		$settings   = SettingsManager::instance();
		$value      = $settings->get_setting( $setting );
		$field_name = $settings->get_field_name( $setting );
		$defaults   = array(
			'enabled'                => true,
			'notice'                 => null,
			'show_overridden_notice' => false,
			'nested'                 => false,
		);

		$args = wp_parse_args( $args, $defaults );
		?>
		<div class="cfw-admin-field-container cfw-admin-field-horizontal-icon-radio-group <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<?php echo wp_kses_post( $args['notice'] ); ?>
			<legend class="text-base font-medium text-gray-900">
				<?php echo esc_html( $label ); ?>
			</legend>
			<p class="text-sm leading-5 text-gray-500">
				<?php echo wp_kses_post( $description ); ?>
			</p>
			<div class="mt-4 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
				<?php foreach ( $options as $option_value => $option_label ) : ?>
					<div class="relative flex items-start">
						<div class="flex items-center h-8">
							<input <?php echo ! $args['enabled'] ? 'disabled' : ''; ?> type="radio" id="<?php echo esc_attr( "{$setting}_{$option_value}" ); ?>" name="<?php echo esc_attr( $field_name ); ?>" value="<?php echo esc_attr( $option_value ); ?>" class="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300" <?php echo $option_value === $value || ( empty( $value ) && $option_value === $default_value ) ? 'checked' : ''; ?> />
						</div>
						<div class="ml-3 text-sm">
							<label for="<?php echo esc_attr( "{$setting}_{$option_value}" ); ?>" style="vertical-align: unset;" class="font-medium text-gray-700">
								<?php echo esc_html( $option_label ); ?>
							</label>

							<?php if ( isset( $descriptions[ $option_value ] ) ) : ?>
								<p id="small-description" class="text-gray-500">
									<?php echo esc_html( $descriptions[ $option_value ] ); ?>
								</p>
							<?php endif; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>

			<?php $this->maybe_show_overridden_setting_notice( $args['show_overridden_notice'] ); ?>
		</div>
		<?php
	}

	public function output_countries_multiselect( string $setting, string $label, string $description, array $selected_options, array $args = array() ): void {
		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting );
		$countries  = WC()->countries->countries;

		asort( $countries );
		?>
		<div class="cfw-admin-field-container <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<label for="<?php echo esc_attr( $setting ); ?>" class="block text-sm font-medium text-gray-700">
				<?php echo esc_html( $label ); ?>
			</label>
			<input type="hidden" name="<?php echo esc_attr( $field_name ); ?>" value="">
			<select multiple="multiple" name="<?php echo esc_attr( $field_name ); ?>[]" style="width:350px" data-placeholder="<?php cfw_esc_attr_e( 'Choose countries / regions&hellip;', 'woocommerce' ); ?>" aria-label="<?php cfw_esc_attr_e( 'Country / Region', 'woocommerce' ); ?>" class="wc-enhanced-select">
				<?php
				if ( ! empty( $countries ) ) {
					foreach ( $countries as $key => $val ) {
						echo '<option value="' . esc_attr( $key ) . '"' . wc_selected( $key, $selected_options ) . '>' . esc_html( $val ) . '</option>'; // WPCS: XSS ok.
					}
				}
				?>
			</select>
			<p class="mt-2 text-sm text-gray-500">
				<?php echo wp_kses_post( $description ); ?>
			</p>
		</div>
		<?php
	}

	public function output_checkbox_group( string $setting, string $label, string $description, array $options, array $selected_options, array $args = array() ) {
		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting );
		$defaults   = array(
			'enabled'                => true,
			'notice'                 => null,
			'show_overridden_notice' => false,
			'nested'                 => false,
		);

		$args = wp_parse_args( $args, $defaults );
		?>
		<div class="cfw-admin-field-container <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<input type="hidden" name="<?php echo esc_attr( $field_name ); ?>" value="" />
			<?php echo wp_kses_post( $args['notice'] ); ?>
			<legend class="text-base font-medium text-gray-900">
				<?php echo esc_html( $label ); ?>
			</legend>
			<p class="text-sm leading-5 text-gray-500">
				<?php echo wp_kses_post( $description ); ?>
			</p>
			<div id="<?php echo esc_attr( $setting ); ?>">
				<?php foreach ( $options as $option_value => $option_label ) : ?>
					<?php $checked = in_array( $option_value, $selected_options, true ); ?>
					<div class="flex items-start mt-3">
						<div class="h-5 flex items-center">
							<input <?php echo ! $args['enabled'] ? 'disabled' : ''; ?> type="checkbox" name="<?php echo esc_attr( $field_name ); ?>[]" value="<?php echo esc_attr( $option_value ); ?>" id="<?php echo esc_attr( "{$setting}_{$option_value}" ); ?>" class="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300 rounded" <?php echo $checked ? 'checked' : ''; ?> <?php echo ! $args['enabled'] ? 'disabled="disabled"' : ''; ?> />
						</div>
						<div class="ml-3 text-sm">
							<label for="<?php echo esc_attr( "{$setting}_{$option_value}" ); ?>" style="vertical-align: unset;" class="font-medium text-gray-700">
								<?php echo esc_html( $option_label ); ?>
							</label>
						</div>
					</div>
				<?php endforeach; ?>
			</div>

			<?php $this->maybe_show_overridden_setting_notice( $args['show_overridden_notice'] ); ?>
		</div>
		<?php
	}

	/**
	 * Output checkbox row
	 *
	 * @param string $setting
	 * @param string $long_label
	 * @param string $description
	 * @param array $args
	 */
	public function output_checkbox_row( string $setting, string $long_label, string $description = '', array $args = array() ) {
		$defaults = array(
			'enabled'                => true,
			'notice'                 => null,
			'show_overridden_notice' => false,
			'overridden_notice'      => '',
			'nested'                 => false,
		);

		$args = wp_parse_args( $args, $defaults );

		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting );
		$value      = $settings->get_setting( $setting );
		$checked    = 'yes' === $value && $args['enabled'];
		?>
		<div class="cfw-admin-field-container relative flex items-start <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<div class="flex items-center h-5">
				<input type="hidden" name="<?php echo esc_attr( $field_name ); ?>" value="no" />
				<input <?php echo ! $args['enabled'] ? 'disabled' : ''; ?> type="checkbox" class="focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:border cfw-checkbox-<?php echo esc_attr( $setting ); ?>" name="<?php echo esc_attr( $field_name ); ?>" id="<?php echo esc_attr( 'cfw_checkbox_' . $setting ); ?>" value="yes" <?php echo $checked ? 'checked' : ''; ?> />
			</div>

			<div class="ml-3 text-sm">
				<label class="font-medium text-gray-700 cfw-checkbox-label-<?php echo esc_attr( $setting ); ?>" style="vertical-align: unset;" for="<?php echo esc_attr( 'cfw_checkbox_' . $setting ); ?>">
					<?php echo esc_html( $long_label ); ?>
				</label>

				<?php if ( ! empty( $description ) ) : ?>
					<p class="text-gray-500">
						<?php echo wp_kses_post( $description ); ?>
					</p>
				<?php endif; ?>
				<?php echo wp_kses_post( $args['notice'] ); ?>
			</div>
		</div>
		<?php $this->maybe_show_overridden_setting_notice( $args['show_overridden_notice'], $args['overridden_notice'] ); ?>
		<?php
	}

	/**
	 * Output toggle checkbox
	 *
	 * @param string $setting
	 * @param string $label
	 * @param string $description
	 * @param bool $enabled
	 * @param bool $show_overridden_notice
	 * @param string $overridden_notice
	 */
	public function output_toggle_checkbox( string $setting, string $label, string $description, bool $enabled = true, bool $show_overridden_notice = false, string $overridden_notice = '' ) {
		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting );
		$value      = $settings->get_setting( $setting );
		$field_id   = "cfw_{$setting}";
		?>
		<div class="cfw-admin-field-container cfw-toggle-container relative flex items-start">
			<div class="flex items-center h-11">
				<input type="hidden" name="<?php echo esc_attr( $field_name ); ?>" value="no" />
				<input <?php echo ! $enabled ? 'disabled' : ''; ?> type="checkbox" class="cfw-toggle-checkbox cfw-toggle-checkbox-<?php echo esc_attr( $setting ); ?>" name="<?php echo esc_attr( $field_name ); ?>" id="<?php echo esc_attr( $field_id ); ?>" value="yes" <?php echo 'yes' === $value ? 'checked' : ''; ?> />

				<label class="cfw-toggle-checkbox-label cfw-toggle-checkbox-label-<?php echo esc_attr( $setting ); ?>" for="<?php echo esc_attr( $field_id ); ?>">
					<?php echo esc_html( $label ); ?>
				</label>
			</div>

			<div class="ml-3 text-sm">
				<label class="cfw-toggle-checkbox-text-label font-medium text-gray-700" for="<?php echo esc_attr( $field_id ); ?>"><?php echo esc_html( $label ); ?></label>

				<p class="text-gray-500">
					<?php echo wp_kses_post( $description ); ?>
				</p>
			</div>
		</div>
		<?php $this->maybe_show_overridden_setting_notice( $show_overridden_notice, $overridden_notice ); ?>
		<?php
	}

	/**
	 * Output text input row
	 *
	 * @param string $setting
	 * @param string $label
	 * @param string $description
	 */
	public function output_text_input_row( string $setting, string $label, string $description, array $args = array() ) {
		$default = array(
			'nested' => false,
		);

		$args = wp_parse_args( $args, $default );

		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting );
		$value      = $settings->get_setting( $setting );
		?>
		<div class="cfw-admin-field-container <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<label for="<?php echo esc_attr( $setting ); ?>" class="block text-sm font-medium text-gray-700">
				<?php echo esc_html( $label ); ?>
			</label>
			<input type="text" value="<?php echo esc_attr( $value ); ?>" name="<?php echo esc_attr( $field_name ); ?>" id="<?php echo esc_attr( $setting ); ?>" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md" />
			<p class="mt-2 text-sm text-gray-500">
				<?php echo wp_kses_post( $description ); ?>
			</p>
		</div>
		<?php
	}

	public function output_color_picker_input( string $setting, string $label, string $default_value, $args = array() ) {
		$default = array(
			'nested'             => false,
			'setting_seed'       => array(),
			'additional_classes' => array(),
		);

		$args = wp_parse_args( $args, $default );

		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting, $args['setting_seed'] );
		$value      = $settings->get_setting( $setting, $args['setting_seed'] );
		?>
		<div class="cfw-admin-field-container <?php echo esc_attr( join( ' ', $args['additional_classes'] ) ); ?> <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<div class="text-sm mb-2">
				<label class="font-medium text-gray-700" for="<?php echo esc_attr( $field_name ); ?>">
					<?php echo esc_html( $label ); ?>
				</label>
			</div>


			<input class="cfw-admin-color-picker" type="text" id="<?php echo esc_attr( $setting ); ?>" name="<?php echo esc_attr( $field_name ); ?>" value="<?php echo esc_attr( empty( $value ) ? $default_value : $value ); ?>" data-default-color="<?php echo esc_attr( $default_value ); ?>" />
		</div>
		<?php
	}

	/**
	 * Output number input row
	 *
	 * @param string $setting
	 * @param string $label
	 * @param string $description
	 * @param array $args
	 */
	public function output_number_input_row( string $setting, string $label, string $description, array $args = array() ) {
		$default = array(
			'nested' => false,
		);

		$args = wp_parse_args( $args, $default );

		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting );
		$value      = $settings->get_setting( $setting );
		?>
		<div class="cfw-admin-field-container <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<label for="about" class="block text-sm font-medium text-gray-700">
				<?php echo esc_html( $label ); ?>
			</label>
			<input type="number" value="<?php echo esc_attr( $value ); ?>" name="<?php echo esc_attr( $field_name ); ?>" id="<?php echo esc_attr( $setting ); ?>" class="w-64 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md" />
			<p class="mt-2 text-sm text-gray-500">
				<?php echo wp_kses_post( $description ); ?>
			</p>
		</div>
		<?php
	}

	/**
	 * Output textarea row
	 *
	 * @param string $setting
	 * @param string $label
	 * @param string $description
	 * @param array $args
	 */
	public function output_textarea_row( string $setting, string $label, string $description, array $args = array() ) {
		$defaults = array(
			'enabled'       => true,
			'textarea_rows' => 6,
			'notice'        => null,
			'nested'        => false,
			'quicktags'     => false,
			'tinymce'       => false,
			'media_buttons' => false,
			'setting_seed'  => array(),
		);

		$args       = wp_parse_args( $args, $defaults );
		$settings   = SettingsManager::instance();
		$field_name = $settings->get_field_name( $setting, $args['setting_seed'] );
		$value      = $settings->get_setting( $setting, $args['setting_seed'] );
		?>
		<div class="cfw-admin-field-container <?php echo $args['nested'] ? 'ml-7 p-4 bg-gray-100' : ''; ?>">
			<label for="<?php echo esc_attr( sanitize_title_with_dashes( $field_name ) ); ?>" class="block text-sm font-medium text-gray-700">
				<?php echo esc_html( $label ); ?>
			</label>
			<?php
			echo wp_kses_post( $args['notice'] );

			if ( ! $args['enabled'] ) {
				echo '<div class="cfw_textarea_placeholder"></div>';
			} else {
				wp_editor(
					$value,
					sanitize_title_with_dashes( $field_name ),
					array(
						'textarea_rows' => $args['textarea_rows'],
						'quicktags'     => $args['quicktags'],
						'media_buttons' => $args['media_buttons'],
						'textarea_name' => $field_name,
						'tinymce'       => $args['tinymce'],
					)
				);
			}
			?>
			<p class="mt-2 text-sm text-gray-500">
				<?php echo wp_kses_post( $description ); ?>
			</p>
		</div>
		<?php
	}

	/**
	 * Add admin bar menu node
	 *
	 * @param \WP_Admin_Bar $admin_bar
	 */
	public function add_admin_bar_menu_node( \WP_Admin_Bar $admin_bar ) {
		if ( ! $this->can_show_admin_bar_button() ) {
			return;
		}

		$admin_bar->add_node(
			array(
				'id'     => $this->slug,
				'title'  => $this->title,
				'href'   => $this->get_url(),
				'parent' => self::$parent_slug,
			)
		);
	}

	/**
	 * Can show admin bar button?
	 *
	 * @return bool
	 */
	public function can_show_admin_bar_button(): bool {
		if ( ! apply_filters( 'cfw_do_admin_bar', current_user_can( 'manage_options' ) && ( SettingsManager::instance()->get_setting( 'hide_admin_bar_button' ) !== 'yes' || is_cfw_page() ) ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get parent slug
	 *
	 * @return string
	 */
	public static function get_parent_slug(): string {
		return self::$parent_slug;
	}

	/**
	 * Get slug
	 *
	 * @return string
	 */
	public function get_slug(): string {
		return $this->slug;
	}
}
