<?php // phpcs:ignore WordPress.Files.FileName
/**
 * Admin-Notices class.
 *
 * Creates an admin notice with consistent styling.
 *
 * @package   pressmodo/wp-admin-notices
 * @author    WPTRT <themes@wordpress.org>
 * @author    Pressmodo <hello@pressmodo.com>
 * @copyright 2019 WPTRT
 * @copyright 2020 Sematico LTD
 * @license   https://www.gnu.org/licenses/gpl-3.0.html GPL-3.0-or-later
 * @link      https://github.com/pressmodo/wp-admin-notices
 */

namespace CheckoutWC\Pressmodo\AdminNotices;

/**
 * The Admin_Notice class, responsible for creating admin notices.
 *
 * Each notice is a new instance of the object.
 *
 * @since 1.0.0
 */
class Notice {

	/**
	 * The notice-ID.
	 *
	 * @access private
	 * @since 1.0
	 * @var string
	 */
	private $id;

	/**
	 * The notice message.
	 *
	 * @access private
	 * @since 1.0
	 * @var string
	 */
	private $message;

	/**
	 * An instance of the \Pressmodo\AdminNotices\Dismiss object.
	 *
	 * @access public
	 * @since 1.0
	 * @var Dismiss
	 */
	public $dismiss;

	/**
	 * The notice arguments.
	 *
	 * @access private
	 * @since 1.0
	 * @var array
	 */
	private $options = array(
		'scope'         => 'global',
		'type'          => 'info',
		'alt_style'     => false,
		'capability'    => 'edit_theme_options',
		'option_prefix' => 'pressmodo_notice_dismissed',
		'screens'       => array(),
		'dismissible'   => true,
		'mode'          => 'regular',
	);

	/**
	 * An array of allowed types.
	 *
	 * @access private
	 * @since 1.0
	 * @var array
	 */
	private $allowed_types = array(
		'info',
		'success',
		'error',
		'warning',
	);

	/**
	 * The title for our notice.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * Constructor.
	 *
	 * @access public
	 * @since 1.0
	 * @param string $id      A unique ID for this notice. Can contain lowercase characters and underscores.
	 * @param string $title   The title for our notice.
	 * @param string $message The message for our notice.
	 * @param array  $options An array of additional options to change the defaults for this notice.
	 *                        [
	 *                            'screens'       => (array)  An array of screens where the notice will be displayed.
	 *                                                        Leave empty to always show.
	 *                                                        Defaults to an empty array.
	 *                            'scope'         => (string) Can be "global" or "user".
	 *                                                        Determines if the dismissed status will be saved as an option or user-meta.
	 *                                                        Defaults to "global".
	 *                            'type'          => (string) Can be one of "info", "success", "warning", "error".
	 *                                                        Defaults to "info".
	 *                            'alt_style'     => (bool)   Whether we want to use alt styles or not.
	 *                                                        Defaults to false.
	 *                            'capability'    => (string) The user capability required to see the notice.
	 *                                                        Defaults to "edit_theme_options".
	 *                            'option_prefix' => (string) The prefix that will be used to build the option (or post-meta) name.
	 *                                                        Can contain lowercase latin letters and underscores.
	 *                            'dismissible'   => (bool)   Whether or not the notice can be dismissed. Defaults to true.
	 *                            'mode'          => (string) The mode. Defaults to regular. Can be 'regular' or 'deferred'
	 *                        ].
	 */
	public function __construct( $id, $title, $message, $options = array() ) {

		// Set the object properties.
		$this->id      = $id;
		$this->title   = $title;
		$this->message = $message;
		$this->options = wp_parse_args( $options, $this->options );

		// Sanity check: Early exit if ID or message are empty.
		if ( ! $this->id || ! $this->message ) {
			return;
		}

		// Instantiate the Dismiss object.
		$this->dismiss = new Dismiss( $this->id, $this->options['option_prefix'], $this->options['scope'] );
	}

	/**
	 * Prints the notice.
	 *
	 * @access public
	 * @since 1.0
	 * @return void
	 */
	public function the_notice() {

		// Early exit if we don't want to show this notice.
		if ( ! $this->show() ) {
			return;
		}

		$content = sprintf( '<div class="pressmodo-notice-content">%s</div>', $this->get_title() . $this->get_message() );

		if ( $this->options['image'] ) {
			$image = sprintf( '<div class="pressmodo-notice-image">%s</div>', $this->options['image'] );

			$content = $image . $content;
		}

		// Print the notice.
		printf(
			'<div id="%1$s" class="%2$s">%3$s</div>',
			'pressmodo-notice-' . esc_attr( $this->id ), // The ID.
			esc_attr( $this->get_classes() ), // The classes.
			$content // The HTML.
		);
	}

	/**
	 * Determine if the notice should be shown or not.
	 *
	 * @access public
	 * @since 1.0
	 * @return bool
	 */
	public function show() {

		// Don't show if the user doesn't have the required capability.
		if ( ! current_user_can( $this->options['capability'] ) ) {
			return false;
		}

		// Don't show if we're not on the right screen.
		if ( ! $this->is_screen() ) {
			return false;
		}

		// Don't show if notice has been dismissed.
		if ( $this->dismiss->is_dismissed() ) {
			return false;
		}

		return true;
	}

	/**
	 * Get the notice classes.
	 *
	 * @access public
	 * @since 1.0
	 * @return string
	 */
	public function get_classes() {
		$classes = array(
			'notice',
			'is-dismissible',
		);

		// Make sure the defined type is allowed.
		$this->options['type'] = in_array( $this->options['type'], $this->allowed_types, true ) ? $this->options['type'] : 'info';

		// Add the class for notice-type.
		$classes[] = 'notice-' . $this->options['type'];

		// Do we want alt styles?
		if ( $this->options['alt_style'] ) {
			$classes[] = 'notice-alt';
		}

		if ( ! $this->options['dismissible'] ) {
			if ( ( $key = array_search( 'is-dismissible', $classes, true ) ) !== false ) {
				unset( $classes[ $key ] );
			}
		}

		if ( $this->get_option( 'mode' ) === 'deferred' ) {
			$classes[] = 'below-h2';
		}

		// Combine classes to a string.
		return implode( ' ', $classes );
	}

	/**
	 * Returns the title.
	 *
	 * @access public
	 * @since 1.0
	 * @return string
	 */
	public function get_title() {

		// Sanity check: Early exit if no title is defined.
		if ( ! $this->title ) {
			return '';
		}

		return sprintf(
			'<h2 class="notice-title">%s</h2>',
			wp_strip_all_tags( $this->title )
		);
	}

	/**
	 * Returns the message.
	 *
	 * @access public
	 * @since 1.0
	 * @return string
	 */
	public function get_message() {
		return wpautop( wp_kses_post( $this->message ) );
	}

	public function get_options() {
		return $this->options;
	}

	public function get_option( $key ) {
		return $this->options[ $key ] ?? false;
	}

	/**
	 * Evaluate if we're on the right place depending on the "screens" argument.
	 *
	 * @access private
	 * @since 1.0
	 * @return bool
	 */
	private function is_screen() {

		// If screen is empty we want this shown on all screens.
		if ( ! $this->options['screens'] || empty( $this->options['screens'] ) ) {
			return true;
		}

		// Make sure the get_current_screen function exists.
		if ( ! function_exists( 'get_current_screen' ) ) {
			require_once ABSPATH . 'wp-admin/includes/screen.php';
		}

		// Check if we're on one of the defined screens.
		return ( in_array( get_current_screen()->id, $this->options['screens'], true ) );
	}
}
