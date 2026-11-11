<?php

namespace Objectiv\Plugins\Checkout\Admin\Pages;

use Objectiv\Plugins\Checkout\Admin\DashboardCardEvent;
use Objectiv\Plugins\Checkout\Admin\Pages\Premium\OrderBumps;
use Objectiv\Plugins\Checkout\Admin\Pages\Traits\TabbedAdminPageTrait;
use Objectiv\Plugins\Checkout\Admin\UpgradeUrl;
use Objectiv\Plugins\Checkout\Managers\PlanManager;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\Managers\UpdatesManager;
use WP_Admin_Bar;

/**
 * Dashboard admin page: the setup steps, the license or upgrade card, and support. It replaced Start Here, Your Plan and Support.
 *
 * @link checkoutwc.com
 * @since 5.0.0
 * @package Objectiv\Plugins\Checkout\Admin\Pages
 */
class General extends PageAbstract {
	use TabbedAdminPageTrait;

	/** @var string */
	private const PRICING_URL = 'https://www.checkoutwc.com/pricing/';

	/** @var string */
	private const ACCOUNT_URL = 'https://www.checkoutwc.com/account/';

	/** @var string */
	private const DOCS_URL = 'https://www.checkoutwc.com/documentation/';

	/** @var array<string, string> the user meta that hides each feature card once dismissed */
	public const FEATURE_CARD_DISMISSED_META = [
		'turnstile'            => 'cfw_dashboard_turnstile_card_dismissed',
		'address_autocomplete' => 'cfw_dashboard_address_autocomplete_card_dismissed',
	];

	protected $appearance_page;

	/**
	 * Constructor.
	 *
	 * @param Appearance $appearance_page the Appearance page, for the template links
	 */
	public function __construct( Appearance $appearance_page ) {
		$this->appearance_page = $appearance_page;
		parent::__construct( __( 'Dashboard', 'checkout-wc' ), 'cfw_manage_general' );
	}

	public function init() {
		parent::init();

		add_action( 'admin_bar_menu', [ $this, 'add_parent_node' ], 100 );
		add_action( 'admin_menu', [ $this, 'setup_main_menu_page' ], $this->priority - 5 );
	}

	public function setup_menu() {
		add_submenu_page( self::$parent_slug, $this->title, $this->title, $this->capability, $this->slug, null, $this->priority );

		add_submenu_page(
			self::$parent_slug,
			__( 'Checkout Editor', 'checkout-wc' ),
			__( 'Checkout Editor', 'checkout-wc' ),
			'cfw_manage_pages',
			'admin.php?page=cfw-settings-checkout-editor',
			null
		);
	}

	public function setup_main_menu_page() {
		add_menu_page( 'CheckoutWC', 'CheckoutWC', 'cfw_manage_general', self::$parent_slug, array( $this, 'output_with_wrap' ), 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( CFW_PATH . '/assets/images/cfw.svg' ) ) ); // phpcs:ignore
	}

	/**
	 * Outputs the Dashboard, or the 10.0 welcome page right after upgrading to 10.0.
	 *
	 * @return void
	 */
	public function output() {
		if ( isset( $_GET['upgrade'] ) && '10' === $_GET['upgrade'] ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$this->output_upgrade_notice();
			return;
		}

		$this->output_dashboard();
	}

	/**
	 * Whether this is the paid build, which can hold a license.
	 *
	 * @since 11.5.0
	 *
	 * @return bool
	 */
	protected function is_paid_build(): bool {
		return defined( 'CFW_PREMIUM_PLAN_IDS' );
	}

	/**
	 * Whether CheckoutWC templates are on for every visitor.
	 *
	 * @since 11.5.0
	 *
	 * @return bool
	 */
	protected function is_live(): bool {
		return 'yes' === SettingsManager::instance()->get_setting( 'enable' );
	}

	/**
	 * Returns the license state the Your plan card and Step 1 show.
	 *
	 * @since 11.5.0
	 *
	 * @return string `lite`, `valid`, `missing`, `expired`, `inactive` or `invalid`
	 */
	public function get_license_state(): string {
		if ( ! $this->is_paid_build() ) {
			return 'lite';
		}

		$updates     = UpdatesManager::instance();
		$license_key = $updates->get_field_value( 'license_key' );
		$key_status  = (string) $updates->get_field_value( 'key_status' );

		if ( empty( $license_key ) ) {
			return 'missing';
		}

		if ( 'valid' === $key_status ) {
			return 'valid';
		}

		if ( 'expired' === $key_status ) {
			return 'expired';
		}

		// An empty status means the license server couldn't be reached, which the Activate button retries.
		if ( in_array( $key_status, [ 'inactive', 'site_inactive', '' ], true ) ) {
			return 'inactive';
		}

		return 'invalid';
	}

	/**
	 * Returns the setup steps with their state.
	 *
	 * @since 11.5.0
	 *
	 * @param string $license_state from get_license_state()
	 *
	 * @return array<int, array{title: string, description: string, state: string, content: string}> state is `done`, `todo` or `error`
	 */
	public function get_setup_steps( string $license_state ): array {
		$steps = [];

		if ( 'lite' === $license_state ) {
			$steps[] = [
				'title'       => __( 'Pick a template', 'checkout-wc' ),
				'description' => __( 'CheckoutWC Lite uses the Default template.', 'checkout-wc' ),
				'state'       => 'done',
				'content'     => '',
			];
		} else {
			$descriptions = [
				'valid'    => __( 'Your license is active on this site.', 'checkout-wc' ),
				'missing'  => __( 'Enter your license key in the Your plan card.', 'checkout-wc' ),
				'expired'  => __( 'Your license has expired. Renew it in the Your plan card.', 'checkout-wc' ),
				'inactive' => __( 'Your license isn\'t activated on this site. Activate it in the Your plan card.', 'checkout-wc' ),
				'invalid'  => __( 'Your key is missing or invalid. Fix it in the Your plan card.', 'checkout-wc' ),
			];

			$steps[] = [
				'title'       => __( 'Activate your license', 'checkout-wc' ),
				'description' => $descriptions[ $license_state ] ?? $descriptions['invalid'],
				'state'       => 'valid' === $license_state ? 'done' : 'error',
				'content'     => '',
			];
		}

		$steps[] = [
			'title'       => __( 'Customize checkout', 'checkout-wc' ),
			'description' => __( 'Use the Checkout Editor for your checkout layout, fields and content.', 'checkout-wc' ),
			'state'       => 'yes' === get_option( CheckoutEditor::OPENED_OPTION ) ? 'done' : 'todo',
			'content'     => $this->get_checkout_editor_content(),
		];

		$steps[] = [
			'title'       => __( 'Go live', 'checkout-wc' ),
			'description' => __( 'Turn on CheckoutWC templates for every visitor.', 'checkout-wc' ),
			'state'       => $this->is_live() ? 'done' : 'todo',
			'content'     => $this->get_go_live_button(),
		];

		return $steps;
	}

	/**
	 * Outputs the Dashboard: setup steps and the starter order bump in the main column, plan and support cards beside them.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	public function output_dashboard() {
		$license_state = $this->get_license_state();
		$steps         = $this->get_setup_steps( $license_state );
		$done          = count( array_filter( $steps, fn( $step ) => 'done' === $step['state'] ) );
		$all_done      = count( $steps ) === $done;

		if ( $all_done ) {
			$heading = __( 'Welcome back', 'checkout-wc' );
		} else {
			$heading = $this->is_paid_build() ? __( 'Welcome to CheckoutWC', 'checkout-wc' ) : __( 'Welcome to CheckoutWC Lite', 'checkout-wc' );
		}
		?>
		<p class="text-3xl font-bold text-gray-900"><?php echo esc_html( $heading ); ?></p>

		<div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
			<div class="md:col-span-2 space-y-6">
				<?php
				if ( $all_done ) {
					$this->output_starter_bump_card();
					$this->output_feature_cards();
				}

				// The Dashboard has no page-level Save: the Go live button submits this form, and the license panel has its own.
				$this->output_form_open();
				$all_done ? $this->output_live_summary() : $this->output_steps( $steps, $done );
				$this->output_form_close( false );

				if ( ! $all_done ) {
					$this->output_starter_bump_card();
					$this->output_feature_cards();
				}
				?>
			</div>
			<div class="space-y-6">
				<?php
				$this->output_plan_card( $license_state );
				$this->output_support_card();
				?>
			</div>
		</div>
		<?php
	}

	/**
	 * Outputs the setup steps with a progress bar.
	 *
	 * @since 11.5.0
	 *
	 * @param array<int, array{title: string, description: string, state: string, content: string}> $steps from get_setup_steps()
	 * @param int                                                                                    $done  how many are done
	 *
	 * @return void
	 */
	private function output_steps( array $steps, int $done ) {
		?>
		<div class="bg-white rounded-lg shadow divide-y">
			<div class="p-6">
				<p class="text-lg font-semibold text-gray-900"><?php esc_html_e( 'Get your checkout live', 'checkout-wc' ); ?></p>
				<p class="mt-1 text-sm text-gray-500">
					<?php
					/* translators: %1$d: number of steps done, %2$d: number of steps */
					echo esc_html( sprintf( __( '%1$d of %2$d done', 'checkout-wc' ), $done, count( $steps ) ) );
					?>
				</p>
				<div class="mt-3 h-2 w-full bg-gray-100 rounded-full">
					<div class="h-2 bg-blue-600 rounded-full" style="width: <?php echo esc_attr( (string) round( 100 * $done / max( 1, count( $steps ) ) ) ); ?>%"></div>
				</div>
			</div>
			<?php foreach ( $steps as $step ) : ?>
				<div class="p-6 flex gap-3 items-start">
					<?php $this->output_step_marker( $step['state'] ); ?>
					<div class="flex-1">
						<p class="text-base font-medium text-gray-900"><?php echo esc_html( $step['title'] ); ?></p>
						<p class="mt-1 text-sm text-gray-500"><?php echo esc_html( $step['description'] ); ?></p>
						<?php if ( 'done' !== $step['state'] && '' !== $step['content'] ) : ?>
							<div class="mt-3">
								<?php echo $step['content']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built and escaped by this class. ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php
	}

	/**
	 * Outputs the one line that replaces the steps once they are all done.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	private function output_live_summary() {
		?>
		<div class="bg-white rounded-lg shadow p-6 flex gap-3 items-start">
			<?php $this->output_step_marker( 'done' ); ?>
			<?php // Stacks below 768px so the text keeps its width. items-start stops the link stretching to the row height. ?>
			<div class="flex-1 flex flex-col md:flex-row gap-3 items-start">
				<div class="flex-1">
					<p class="text-base font-medium text-gray-900"><?php esc_html_e( 'Your checkout is live', 'checkout-wc' ); ?></p>
					<p class="mt-1 text-sm text-gray-500"><?php esc_html_e( 'Templates are on for every visitor.', 'checkout-wc' ); ?></p>
				</div>
				<a class="whitespace-nowrap text-sm leading-6 text-blue-600 underline" href="<?php echo esc_url( admin_url( 'admin.php?page=cfw-settings-checkout-editor' ) ); ?>"><?php esc_html_e( 'Open Checkout Editor', 'checkout-wc' ); ?></a>
			</div>
		</div>
		<?php
	}

	/**
	 * Outputs a step's status icon, centred on the first line of its title.
	 *
	 * @since 11.5.0
	 *
	 * @param string $state done, todo or error
	 *
	 * @return void
	 */
	private function output_step_marker( string $state ) {
		$icons = [
			'done'  => [ 'text-green-600', '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />' ],
			'todo'  => [ 'text-gray-300', '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />' ],
			'error' => [ 'text-red-600', '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />' ],
		];

		[ $color, $path ] = $icons[ $state ] ?? $icons['todo'];
		?>
		<span class="shrink-0 flex h-6 items-center" aria-hidden="true">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 <?php echo esc_attr( $color ); ?>" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><?php echo $path; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static markup. ?></svg>
		</span>
		<?php
	}

	/**
	 * Outputs the starter order bump card from the Order Bumps page, on plans that include order bumps.
	 *
	 * The Order Bumps page class only exists in the paid build, so Lite never reaches the card.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	private function output_starter_bump_card() {
		$order_bumps = AdminPagesRegistry::get_optional( 'order_bumps' );

		if ( $order_bumps instanceof OrderBumps ) {
			$order_bumps->output_starter_bump_card( '', 'dashboard' );
		}
	}

	/**
	 * Returns the pricing page URL for the plan card's Buy or Renew button, tagged with our UTM parameters.
	 *
	 * @since 11.5.0
	 *
	 * @param string $license_state the license state from get_license_state()
	 *
	 * @return string
	 */
	public function get_license_purchase_url( string $license_state ): string {
		return UpgradeUrl::get( 'expired' === $license_state ? 'dashboard-renew-license' : 'dashboard-buy-license', self::PRICING_URL );
	}

	/**
	 * Whether the license's plan includes the given tier, as the Integrations page decides it.
	 *
	 * @since 11.5.0
	 *
	 * @param string $plan a key of PlanManager::PLAN_HIERARCHY
	 *
	 * @return bool
	 */
	protected function plan_includes( string $plan ): bool {
		return PlanManager::has_admin_plan_or_higher( $plan );
	}

	/**
	 * Returns a setting as a trimmed string.
	 *
	 * @since 11.5.0
	 *
	 * @param string $setting the setting key
	 *
	 * @return string
	 */
	protected function get_setting_string( string $setting ): string {
		$value = SettingsManager::instance()->get_setting( $setting );

		return is_scalar( $value ) ? trim( (string) $value ) : '';
	}

	/**
	 * Returns the feature cards to show, in order: Turnstile, then address autocomplete.
	 *
	 * Paid build only. Each shows while its feature isn't set up and the plan includes it, until the user dismisses it.
	 *
	 * @since 11.5.0
	 *
	 * @return string[] card keys
	 */
	public function get_feature_cards(): array {
		if ( ! $this->is_paid_build() ) {
			return [];
		}

		$cards   = [];
		$user_id = get_current_user_id();

		$turnstile_set_up = 'yes' === $this->get_setting_string( 'turnstile_enabled' ) && '' !== $this->get_setting_string( 'turnstile_site_key' ) && '' !== $this->get_setting_string( 'turnstile_secret_key' );

		// The Integrations page unlocks Turnstile from Pro.
		if ( $this->plan_includes( 'pro' ) && ! $turnstile_set_up && empty( get_user_meta( $user_id, self::FEATURE_CARD_DISMISSED_META['turnstile'], true ) ) ) {
			$cards[] = 'turnstile';
		}

		$autocomplete_set_up = 'yes' === $this->get_setting_string( 'enable_address_autocomplete' ) && '' !== $this->get_setting_string( 'google_places_api_key' );
		$fetchify_on         = 'yes' === $this->get_setting_string( 'enable_fetchify_address_autocomplete' );

		if ( $this->plan_includes( 'basic' ) && ! $autocomplete_set_up && ! $fetchify_on && empty( get_user_meta( $user_id, self::FEATURE_CARD_DISMISSED_META['address_autocomplete'], true ) ) ) {
			$cards[] = 'address_autocomplete';
		}

		return $cards;
	}

	/**
	 * Outputs the feature cards, full width under the starter order bump card.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	private function output_feature_cards() {
		$cards = $this->get_feature_cards();

		if ( empty( $cards ) ) {
			return;
		}

		$integrations = admin_url( 'admin.php?page=cfw-settings-integrations' );

		// Autocomplete needs a key (Integrations) and its switch (Pages › Checkout): send the user to the missing step.
		$has_google_key      = '' !== $this->get_setting_string( 'google_places_api_key' );
		$autocomplete_button = $has_google_key ? __( 'Turn on Google autocomplete', 'checkout-wc' ) : __( 'Set up Google autocomplete', 'checkout-wc' );
		$autocomplete_url    = $has_google_key
			? add_query_arg( [ 'subpage' => 'checkout' ], AdminPagesRegistry::get( 'woocommerce_pages' )->get_url() ) . '#address-completion-and-validation_content'
			: $integrations . '#google-api_content';

		$content = [
			'turnstile'            => [
				// Shield: bot protection.
				'icon'        => '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />',
				'badge_class' => 'bg-orange-100 text-orange-600',
				'title'       => __( 'Stop bot orders', 'checkout-wc' ),
				'text'        => __( 'Cloudflare Turnstile blocks spam and card-testing orders without a CAPTCHA. It\'s free and takes a few minutes to set up.', 'checkout-wc' ),
				'button'      => __( 'Set up Turnstile', 'checkout-wc' ),
				'url'         => $integrations . '#cloudflare-turnstile_content',
			],
			'address_autocomplete' => [
				// Map pin: addresses.
				'icon'        => '<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />',
				'badge_class' => 'bg-green-100 text-green-700',
				'title'       => __( 'Faster address entry', 'checkout-wc' ),
				'text'        => __( 'Address autocomplete suggests addresses from Google as shoppers type, so checkout is quicker and has fewer typos.', 'checkout-wc' ),
				'button'      => $autocomplete_button,
				'url'         => $autocomplete_url,
			],
		];

		foreach ( $cards as $card ) {
			$item = $content[ $card ];
			DashboardCardEvent::fire( $card, 'shown', 'dashboard' );
			?>
			<div class="cfw-dashboard-feature-card p-6 bg-white shadow rounded-md" data-card="<?php echo esc_attr( $card ); ?>">
				<div class="flex items-center gap-2 mb-2">
					<span class="shrink-0 w-7 h-7 rounded-md flex items-center justify-center <?php echo esc_attr( $item['badge_class'] ); ?>" aria-hidden="true">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor"><?php echo $item['icon']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Static markup. ?></svg>
					</span>
					<h2 class="text-lg font-bold"><?php echo esc_html( $item['title'] ); ?></h2>
				</div>
				<p class="text-base mb-4"><?php echo esc_html( $item['text'] ); ?></p>
				<div class="flex flex-col md:flex-row flex-wrap gap-3">
					<a href="<?php echo esc_url( $item['url'] ); ?>" class="cfw-dashboard-card-setup whitespace-nowrap w-full md:w-auto justify-center inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"><?php echo esc_html( $item['button'] ); ?></a>
					<button type="button" class="cfw-dashboard-card-dismiss whitespace-nowrap cursor-pointer text-base text-gray-500 underline"><?php esc_html_e( 'Dismiss', 'checkout-wc' ); ?></button>
				</div>
			</div>
			<?php
		}

		$script_data = [
			'url'   => esc_url_raw( rest_url( 'checkoutwc/v1/dashboard-card' ) ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
		];

		wp_register_script( 'cfw-dashboard-feature-cards', false, [], false, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.NoExplicitVersion -- Inline-only handle with no file to version.
		wp_enqueue_script( 'cfw-dashboard-feature-cards' );
		wp_add_inline_script(
			'cfw-dashboard-feature-cards',
			'var cfwDashboardCards = ' . wp_json_encode( $script_data ) . ';' . <<<'JS'
( function () {
	function send( card, action ) {
		// keepalive lets the request finish after the Set up link has changed the page.
		return fetch( cfwDashboardCards.url, {
			method: 'POST',
			credentials: 'same-origin',
			keepalive: true,
			headers: { 'X-WP-Nonce': cfwDashboardCards.nonce, 'Content-Type': 'application/json' },
			body: JSON.stringify( { card: card, action: action, location: 'dashboard' } ),
		} );
	}

	document.querySelectorAll( '.cfw-dashboard-feature-card' ).forEach( function ( el ) {
		var card = el.getAttribute( 'data-card' );

		el.querySelector( '.cfw-dashboard-card-setup' ).addEventListener( 'click', function () {
			send( card, 'setup' ).catch( function () {} );
		} );

		el.querySelector( '.cfw-dashboard-card-dismiss' ).addEventListener( 'click', function ( event ) {
			event.target.disabled = true;
			send( card, 'dismiss' ).then( function ( response ) {
				if ( response.ok ) {
					el.remove();
				} else {
					event.target.disabled = false;
				}
			} ).catch( function () {
				event.target.disabled = false;
			} );
		} );
	} );
} )();
JS
		);
	}

	/**
	 * Outputs the Your plan card: the license in the paid build, the upgrade offer in Lite.
	 *
	 * @since 11.5.0
	 *
	 * @param string $license_state from get_license_state()
	 *
	 * @return void
	 */
	public function output_plan_card( string $license_state ) {
		if ( 'lite' === $license_state ) {
			$this->output_upgrade_card();

			return;
		}

		$is_error = 'valid' !== $license_state;
		$badges   = [
			'valid'    => [ __( 'Active', 'checkout-wc' ), 'bg-green-100 text-green-800' ],
			'missing'  => [ __( 'No key', 'checkout-wc' ), 'bg-red-100 text-red-800' ],
			'expired'  => [ __( 'Expired', 'checkout-wc' ), 'bg-red-100 text-red-800' ],
			'inactive' => [ __( 'Not activated', 'checkout-wc' ), 'bg-red-100 text-red-800' ],
			'invalid'  => [ __( 'Invalid key', 'checkout-wc' ), 'bg-red-100 text-red-800' ],
		];
		$badge    = $badges[ $license_state ] ?? $badges['invalid'];
		$plan     = 'valid' === $license_state ? UpdatesManager::instance()->get_plan_name() : __( 'No active license', 'checkout-wc' );

		ob_start();
		UpdatesManager::instance()->admin_page_fields();
		$license_fields = (string) ob_get_clean();
		?>
		<div id="license" style="scroll-margin-top: 7rem;" class="bg-white rounded-lg shadow p-6 <?php echo $is_error ? 'border-2 border-red-500' : ''; ?>">
			<p class="text-xs font-semibold uppercase tracking-wide text-gray-400"><?php esc_html_e( 'Your plan', 'checkout-wc' ); ?></p>
			<div class="mt-1 flex items-center gap-2">
				<span class="text-base font-medium text-gray-900"><?php echo esc_html( $plan ); ?></span>
				<span class="rounded-full px-2 py-0.5 text-xs font-medium <?php echo esc_attr( $badge[1] ); ?>"><?php echo esc_html( $badge[0] ); ?></span>
			</div>
			<?php if ( $is_error ) : ?>
				<p class="mt-1 text-sm text-gray-500"><?php esc_html_e( 'Premium features are off.', 'checkout-wc' ); ?></p>
			<?php endif; ?>
			<details class="mt-3" <?php echo $is_error ? 'open' : ''; ?>>
				<summary class="text-sm text-blue-600 underline cursor-pointer"><?php esc_html_e( 'Manage license', 'checkout-wc' ); ?></summary>
				<?php $this->output_form_open( 'cfw_license_form' ); ?>
				<?php // The settings handler only fires the license save when the form carries a settings field. ?>
				<input type="hidden" name="<?php echo esc_attr( SettingsManager::instance()->prefix . '_setting' ); ?>" value="" />
				<div id="cfw-license-form" class="mt-3"><?php echo $license_fields; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped by UpdatesManager. ?></div>
				<?php // Not named "submit": that path returns early on an empty settings field, before the license save runs. ?>
				<button type="submit" name="cfw_save_license" value="1" class="mt-3 whitespace-nowrap cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500"><?php esc_html_e( 'Save license', 'checkout-wc' ); ?></button>
				<?php $this->output_form_close( false ); ?>
			</details>
			<?php if ( in_array( $license_state, [ 'missing', 'invalid', 'expired' ], true ) ) : ?>
				<p class="mt-3">
					<a href="<?php echo esc_url( $this->get_license_purchase_url( $license_state ) ); ?>" target="_blank" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
						<?php 'expired' === $license_state ? esc_html_e( 'Renew your license', 'checkout-wc' ) : esc_html_e( 'Buy a license', 'checkout-wc' ); ?>
					</a>
				</p>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Outputs the Lite upgrade card and the steps for merchants who already bought a plan.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	private function output_upgrade_card() {
		$features = [
			__( 'Four more templates', 'checkout-wc' ),
			__( 'Side cart and order bumps', 'checkout-wc' ),
			__( 'Cart recovery and A/B tests', 'checkout-wc' ),
			__( 'Direct email support', 'checkout-wc' ),
		];
		?>
		<div id="license" style="scroll-margin-top: 7rem;" class="bg-white rounded-lg shadow p-6 border-2 border-blue-600">
			<p class="text-xs font-semibold uppercase tracking-wide text-blue-600"><?php esc_html_e( 'Unlock every feature', 'checkout-wc' ); ?></p>
			<ul class="mt-2 space-y-1 text-sm text-gray-700">
				<?php foreach ( $features as $feature ) : ?>
					<li>&#10003; <?php echo esc_html( $feature ); ?></li>
				<?php endforeach; ?>
			</ul>
			<p class="mt-4">
				<a href="<?php echo esc_url( UpgradeUrl::get( 'dashboard-plan-card' ) ); ?>" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 hover:text-white">
					<?php esc_html_e( 'See CheckoutWC plans', 'checkout-wc' ); ?>
				</a>
			</p>
			<details class="mt-3">
				<summary class="text-sm text-blue-600 underline cursor-pointer"><?php esc_html_e( 'Already bought a plan?', 'checkout-wc' ); ?></summary>
				<ol class="mt-2 list-decimal pl-6 text-sm text-gray-700 space-y-1">
					<li>
						<?php
						echo wp_kses_post(
							sprintf(
								/* translators: %s: checkoutwc.com account URL */
								__( 'Download CheckoutWC from <a class="text-blue-600 underline" target="_blank" href="%s">your account</a>.', 'checkout-wc' ),
								esc_url( UpgradeUrl::get( 'dashboard-plan-card-account', self::ACCOUNT_URL ) )
							)
						);
						?>
					</li>
					<li>
						<?php
						echo wp_kses_post(
							sprintf(
								/* translators: %s: Add Plugins screen URL */
								__( 'Upload it under <a class="text-blue-600 underline" href="%s">Plugins &rsaquo; Add New Plugin &rsaquo; Upload Plugin</a> and activate it. This deactivates CheckoutWC Lite, and your settings carry over.', 'checkout-wc' ),
								esc_url( admin_url( 'plugin-install.php?tab=upload' ) )
							)
						);
						?>
					</li>
					<li><?php esc_html_e( 'Enter your license key on CheckoutWC › Dashboard.', 'checkout-wc' ); ?></li>
				</ol>
			</details>
		</div>
		<?php
	}

	/**
	 * Outputs the Support card: Help Scout in the paid build, the WordPress.org forum in Lite.
	 *
	 * @since 11.5.0
	 *
	 * @return void
	 */
	private function output_support_card() {
		?>
		<div id="support" style="scroll-margin-top: 7rem;" class="bg-white rounded-lg shadow p-6">
			<p class="text-xs font-semibold uppercase tracking-wide text-gray-400"><?php esc_html_e( 'Support', 'checkout-wc' ); ?></p>
			<p class="mt-3">
				<?php if ( $this->is_paid_build() ) : ?>
					<button type="button" id="checkoutwc-support-button" class="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500"><?php esc_html_e( 'Contact support', 'checkout-wc' ); ?></button>
				<?php else : ?>
					<a href="<?php echo esc_url( Support::LITE_FORUM_URL ); ?>" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 hover:text-white"><?php esc_html_e( 'Get support on our forums at WordPress.org', 'checkout-wc' ); ?></a>
				<?php endif; ?>
			</p>
			<ul class="mt-4 space-y-1 text-sm">
				<li><a class="text-blue-600 underline" target="_blank" href="<?php echo esc_url( self::DOCS_URL ); ?>"><?php esc_html_e( 'Documentation', 'checkout-wc' ); ?></a></li>
				<li><a class="text-blue-600 underline" target="_blank" href="<?php echo esc_url( self::DOCS_URL . 'getting-started/' ); ?>"><?php esc_html_e( 'Getting Started', 'checkout-wc' ); ?></a></li>
				<li><a class="text-blue-600 underline" target="_blank" href="<?php echo esc_url( self::DOCS_URL . 'troubleshooting/' ); ?>"><?php esc_html_e( 'Troubleshooting', 'checkout-wc' ); ?></a></li>
			</ul>
		</div>
		<?php
		if ( ! $this->is_paid_build() ) {
			return;
		}
		?>
		<script type="text/javascript">!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});</script>
		<script type="text/javascript">window.Beacon('init', '355a5a54-eb9d-4b64-ac5f-39c95644ad36')</script>
		<script>
			jQuery( '#checkoutwc-support-button' ).on( 'click', function() {
				Beacon( 'open' );
			} );
		</script>
		<?php
	}

	public function output_upgrade_notice() {
		?>
		<div class="max-w-5xl pb-8">
			<div>
				<p class="text-5xl font-bold text-gray-900">
					<?php _e( 'Welcome to CheckoutWC 10.0', 'checkout-wc' ); ?>
				</p>
				<p class="max-w-xl mt-5 text-2xl text-gray-500">
					<?php _e( 'CheckoutWC 10.0 is a major update with new features and optimizations to make your WooCommerce store run better.', 'checkout-wc' ); ?>
				</p>

				<div class="grid grid-cols-2 gap-8 mt-12">
					<div>
						<p class="text-4xl font-bold text-gray-900">
							<?php _e( 'Just Say When', 'checkout-wc' ); ?>
						</p>
						<p class="max-w-xl mt-5 text-2xl text-gray-500">
							<?php _e( 'Our new rules engine puts you in charge. Want to show an Order Bump only to first time customers who use a specific coupon code? You can do that. Want to show specific trust badges based on what is in the cart? You can do that too!', 'checkout-wc' ); ?>
						</p>
					</div>
					<div>
						<img src="<?php echo trailingslashit( CFW_PATH_URL_BASE ); ?>assets/images/rules.png" alt="Rules Engine" />
					</div>
				</div>

				<div class="grid grid-cols-2 gap-8 mt-12">
					<div>
						<img src="<?php echo trailingslashit( CFW_PATH_URL_BASE ); ?>assets/images/quick-start.avif" alt="Order Bumps Quick Start" />
					</div>
					<div>
						<p class="text-4xl font-bold text-gray-900">
							<?php _e( 'Get Started Faster', 'checkout-wc' ); ?>
						</p>
						<p class="max-w-xl mt-5 text-2xl text-gray-500">
							<?php _e( 'Creating Order Bumps has lots of options. Our new Quick Start will help you get started faster.', 'checkout-wc' ); ?>
						</p>
						<p class="mt-5">
							<a href="<?php echo esc_attr( add_query_arg( [ 'page' => 'cfw-settings-order_bumps' ], admin_url( 'admin.php' ) ) ); ?>" target="_blank" class="inline-flex items-center px-6 py-3 border border-transparent text-lg shadow font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<?php _e( 'Configure Order Bumps', 'checkout-wc' ); ?>
							</a>
						</p>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-8 mt-12">
					<div>
						<p class="text-4xl font-bold text-gray-900">
							<?php _e( 'And a lot more', 'checkout-wc' ); ?>
						</p>
						<p class="max-w-xl mt-5 text-2xl text-gray-500">
							<?php _e( 'To view the full list of changes, checkout our change log.', 'checkout-wc' ); ?>
						</p>
						<p class="mt-5">
							<a href="https://www.checkoutwc.com/documentation/change-log/" target="_blank" class="inline-flex items-center px-6 py-3 border border-transparent text-lg shadow font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<?php _e( 'Read Our Change Log', 'checkout-wc' ); ?>
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	public function getting_started_tab() {
		$this->output_form_open();
		?>
		<div class="space-y-8 mt-4">
			<?php
			$is_premium_build = defined( 'CFW_PREMIUM_PLAN_IDS' );

			if ( ! $is_premium_build ) {
				$step_one_title       = __( 'Step 1: Unlock every feature with a CheckoutWC plan', 'checkout-wc' );
				$step_one_description = __( 'Supercharge your WooCommerce store.', 'checkout-wc' );
			} elseif ( in_array( UpdatesManager::instance()->get_field_value( 'key_status' ), [ 'expired', 'invalid', 'disabled' ], true ) ) {
				$step_one_title       = __( 'Step 1: Renew Your License', 'checkout-wc' );
				$step_one_description = __( 'Your license has expired. Renew it to keep premium features working.', 'checkout-wc' );
			} else {
				$step_one_title       = __( 'Step 1: Activate Your License', 'checkout-wc' );
				$step_one_description = __( 'Enter your license key and activate it for this site to turn on premium features.', 'checkout-wc' );
			}

			cfw_admin_page_section(
				$step_one_title,
				$step_one_description,
				$is_premium_build ? $this->get_license_link() : $this->trial_offer()
			);

			cfw_admin_page_section(
				__( 'Step 2: Customize Checkout', 'checkout-wc' ),
				__( 'Use the Checkout Editor to customize your checkout layout, fields, and content.', 'checkout-wc' ),
				$this->get_checkout_editor_content()
			);

			cfw_admin_page_section(
				__( 'Step 3: Go Live', 'checkout-wc' ),
				__( 'Enable templates for all visitors.', 'checkout-wc' ),
				$this->get_activation_settings()
			);
			?>
		</div>
		<?php
		$this->output_form_close();

		if ( isset( $_GET['cfw_debug_settings'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$all_settings = SettingsManager::instance()->get_settings_obj();

			echo '<div class="max-w-lg">';
			foreach ( $all_settings as $key => $value ) {
				echo '<h3 class="text-base font-bold mb-4">' . $key . '</h3>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<pre class="shadow-sm bg-white p-6 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-6">' . $value . '</pre>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			echo '</div>';
		}
	}

	/**
	 * Returns the Go live button, which turns templates on for every visitor.
	 *
	 * The settings handler saves only when the submit button is named `submit`.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public function get_go_live_button(): string {
		ob_start();
		?>
		<input type="hidden" name="<?php echo esc_attr( SettingsManager::instance()->get_field_name( 'enable' ) ); ?>" value="yes" />
		<button type="submit" name="submit" value="submit" class="whitespace-nowrap cursor-pointer inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500"><?php esc_html_e( 'Go live', 'checkout-wc' ); ?></button>
		<p class="mt-2 text-sm text-gray-500"><?php esc_html_e( 'CheckoutWC templates are always on for administrators.', 'checkout-wc' ); ?></p>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Returns the Go live toggle.
	 *
	 * @return string
	 */
	public function get_activation_settings() {
		ob_start();

		$free_plan = ! defined( 'CFW_PREMIUM_PLAN_IDS' );

		$prefix = '';

		if ( ! $free_plan ) {
			$prefix = __( 'Requires a valid and active license key.', 'checkout-wc' ) . ' ';
		}

		$this->output_toggle_checkbox(
			'enable',
			__( 'Activate CheckoutWC Templates', 'checkout-wc' ),
			$prefix . __( 'CheckoutWC Templates are always activated for admin users.', 'checkout-wc' )
		);

		?>
		<p class="mt-1 text-sm text-gray-500 font-bold">
			<?php echo esc_html__( 'This step can also be completed directly from the Checkout Editor!', 'checkout-wc' ); ?>
		</p>
		<?php

		return ob_get_clean();
	}

	/**
	 * Returns a link to the Dashboard's Your plan card, where the license form lives.
	 *
	 * @since 11.5.0
	 *
	 * @return string
	 */
	public function get_license_link(): string {
		ob_start();
		?>
		<div class="flex flex-row items-center">
			<a href="<?php echo esc_url( AdminPagesRegistry::get( 'plan' )->get_url() ); ?>" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
				<?php esc_html_e( 'Manage your license', 'checkout-wc' ); ?>
			</a>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	public function trial_offer() {
		ob_start();
		?>
		<div class="flex flex-row items-center">
			<a href="<?php echo esc_url( UpgradeUrl::get( 'start-here-step1' ) ); ?>" target="_blank" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
				<?php esc_html_e( 'See CheckoutWC plans', 'checkout-wc' ); ?>
			</a>
			<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="<?php _e( 'Opens in new tab' ); ?>">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</div>
		<?php
		return ob_get_clean();
	}

	public function get_checkout_editor_content() {
		ob_start();
		?>
		<div class="flex flex-row items-center">
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=cfw-settings-checkout-editor' ) ); ?>" class="whitespace-nowrap inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
				<?php esc_html_e( 'Open Checkout Editor', 'checkout-wc' ); ?>
			</a>
		</div>
		<?php
		return ob_get_clean();
	}

	public function get_pick_template_content() {
		ob_start();
		?>
		<div class="flex flex-row items-center">
			<a href="<?php echo esc_attr( add_query_arg( [ 'subpage' => 'templates' ], $this->appearance_page->get_url() ) ); ?>" target="_blank" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
				<?php _e( 'Choose a Template', 'checkout-wc' ); ?>
			</a>
			<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="<?php _e( 'Opens in new tab' ); ?>">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</div>
		<?php
		return ob_get_clean();
	}

	public function get_design_content() {
		ob_start();
		?>
		<div class="flex flex-row items-center">
			<a href="<?php echo esc_attr( add_query_arg( 'subpage', 'design', $this->appearance_page->get_url() ) ); ?>" target="_blank" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
				<?php _e( 'Customize Logo and Colors', 'checkout-wc' ); ?>
			</a>
			<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="<?php _e( 'Opens in new tab' ); ?>">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</div>
		<?php
		return ob_get_clean();
	}

	public function get_preview_content() {
		$url = wc_get_checkout_url();

		$products = wc_get_products(
			[
				'limit'        => 1,
				'status'       => 'publish',
				'type'         => [ 'simple' ],
				'stock_status' => 'instock',
			]
		);

		if ( empty( $products ) ) {
			$products = wc_get_products(
				[
					'parent_exclude' => 0,
					'limit'          => 1,
					'status'         => 'publish',
					'type'           => [ 'variable' ],
					'stock_status'   => 'instock',
				]
			);
		}

		// Get any simple or variable woocommerce product
		if ( ! empty( $products ) ) {
			$product = $products[0];

			$url = add_query_arg( [ 'add-to-cart' => $product->get_id() ], $url );
		}

		ob_start();
		?>
		<div class="flex flex-row items-center">
			<a href="<?php echo esc_attr( $url ); ?>" target="_blank" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
				<?php _e( 'Preview Your Checkout Page', 'checkout-wc' ); ?>
			</a>
			<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="<?php _e( 'Opens in new tab' ); ?>">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Add parent node
	 *
	 * @param WP_Admin_Bar $admin_bar The admin bar object.
	 */
	public function add_parent_node( WP_Admin_Bar $admin_bar ) {
		if ( ! $this->can_show_admin_bar_button() ) {
			return;
		}

		if ( cfw_is_checkout() ) {
			// Remove irrelevant buttons
			$admin_bar->remove_node( 'new-content' );
			$admin_bar->remove_node( 'updates' );
			$admin_bar->remove_node( 'edit' );
			$admin_bar->remove_node( 'comments' );
		}

		$url = $this->get_url();

		$admin_bar->add_node(
			[
				'id'     => self::$parent_slug,
				'title'  => '<span class="ab-icon dashicons dashicons-cart"></span>' . __( 'CheckoutWC', 'checkout-wc' ),
				'href'   => $url,
				'parent' => false,
			]
		);

		if ( ! is_cfw_page() ) {
			return;
		}

		$admin_bar->add_node(
			[
				'id'     => self::$parent_slug . '-bypass',
				'title'  => isset( $_GET['bypass-cfw'] ) ? '<span class="ab-icon dashicons dashicons-controls-play"></span>' . __( 'Unbypass CheckoutWC Template', 'checkout-wc' ) : '<span class="ab-icon dashicons dashicons-controls-pause"></span>' . __( 'Bypass CheckoutWC Template', 'checkout-wc' ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				'href'   => isset( $_GET['bypass-cfw'] ) ? remove_query_arg( 'bypass-cfw' ) : add_query_arg( 'bypass-cfw', 'true' ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				'parent' => false,
				'meta'   => [
					'onclick' => ! isset( $_GET['bypass-cfw'] ) ? 'alert("' . esc_js( __( 'CheckoutWC template and functionality will be temporarily bypassed (just for you!). This is helpful for testing and debugging. You can click Unbypass CheckoutWC Template once you are done.', 'checkout-wc' ) ) . '")' : '', // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				],
			]
		);
	}

	/**
	 * Add admin bar menu node
	 *
	 * @param WP_Admin_Bar $admin_bar The admin bar object.
	 */
	public function add_admin_bar_menu_node( WP_Admin_Bar $admin_bar ) {
		if ( ! $this->can_show_admin_bar_button() ) {
			return;
		}

		$admin_bar->add_node(
			[
				'id'     => $this->slug . '-general',
				'title'  => $this->title,
				'href'   => $this->get_url(),
				'parent' => self::$parent_slug,
			]
		);
	}
}
