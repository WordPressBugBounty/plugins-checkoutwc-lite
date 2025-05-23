<?php /** @noinspection ALL */ // phpcs:ignore WordPress.Files.FileName
/**
 * Handles dismissing admin notices.
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
 * The Dismiss class, responsible for dismissing and checking the status of admin notices.
 *
 * @since 1.0.0
 */
class Dismiss {

	/**
	 * The notice-ID.
	 *
	 * @access private
	 * @since 1.0
	 * @var string
	 */
	private $id;

	/**
	 * The prefix we'll be using for the option/user-meta.
	 *
	 * @access private
	 * @since 1.0
	 * @var string
	 */
	private $prefix;

	/**
	 * The notice's scope. Can be "user" or "global".
	 *
	 * @access private
	 * @since 1.0
	 * @var string
	 */
	private $scope;

	/**
	 * Constructor.
	 *
	 * @access public
	 * @param string $id A unique ID for this notice. Can contain lowercase characters and underscores.
	 * @param string $prefix The prefix that will be used for the option/user-meta.
	 * @param string $scope Whether the notification is a global or user type.
	 * @since 1.0
	 */
	public function __construct( $id, $prefix, $scope = 'global' ) {

		// Set the object properties.
		$this->id     = sanitize_key( $id );
		$this->prefix = sanitize_key( $prefix );
		$this->scope  = ( in_array( $scope, array( 'global', 'user' ), true ) ) ? $scope : 'global';

		// Handle AJAX requests to dismiss the notice.
		add_action( 'wp_ajax_pressmodo_dismiss_notice', array( $this, 'ajax_maybe_dismiss_notice' ) );
	}

	/**
	 * Print the script for dismissing the notice.
	 *
	 * @access private
	 * @since 1.0
	 * @return void
	 */
	public function print_script() {

		// Create a nonce.
		$nonce = wp_create_nonce( 'pressmodo_dismiss_notice_' . $this->id );
		?>
		<script>
		window.addEventListener( 'load', function() {
			var dismissBtn  = jQuery( '#pressmodo-notice-<?php echo esc_attr( $this->id ); ?> .notice-dismiss' );

			if ( dismissBtn === null ) {
				return
			}

			// Add an event listener to the dismiss button.
			dismissBtn.on( 'click', function( event ) {
				var httpRequest = new XMLHttpRequest(),
					postData    = '';

				// Build the data to send in our request.
				// Data has to be formatted as a string here.
				postData += 'id=<?php echo esc_attr( rawurlencode( $this->id ) ); ?>';
				postData += '&action=pressmodo_dismiss_notice';
				postData += '&nonce=<?php echo esc_html( $nonce ); ?>';

				httpRequest.open( 'POST', '<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>' );
				httpRequest.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
				httpRequest.send( postData );
			});
		});
		</script>
		<?php
	}

	/**
	 * Check if the notice has been dismissed or not.
	 *
	 * @access public
	 * @since 1.0
	 * @return bool
	 */
	public function is_dismissed() {

		// Check if the notice has been dismissed when using user-meta.
		if ( 'user' === $this->scope ) {
			return ( get_user_meta( get_current_user_id(), "{$this->prefix}_{$this->id}", true ) );
		}

		return ( get_option( "{$this->prefix}_{$this->id}" ) );
	}

	/**
	 * Run check to see if we need to dismiss the notice.
	 * If all tests are successful then call the dismiss_notice() method.
	 *
	 * @access public
	 * @since 1.0
	 * @return void
	 */
	public function ajax_maybe_dismiss_notice() {

		// Sanity check: Early exit if we're not on a pressmodo_dismiss_notice action.
		if ( ! isset( $_POST['action'] ) || 'pressmodo_dismiss_notice' !== $_POST['action'] ) {
			return;
		}

		// Sanity check: Early exit if the ID of the notice is not the one from this object.
		if ( ! isset( $_POST['id'] ) || $this->id !== $_POST['id'] ) {
			return;
		}

		// Security check: Make sure nonce is OK.
		check_ajax_referer( 'pressmodo_dismiss_notice_' . $this->id, 'nonce', true );

		// If we got this far, we need to dismiss the notice.
		$this->dismiss_notice();
	}

	/**
	 * Actually dismisses the notice.
	 *
	 * @access private
	 * @since 1.0
	 * @return void
	 */
	private function dismiss_notice() {
		if ( 'user' === $this->scope ) {
			update_user_meta( get_current_user_id(), "{$this->prefix}_{$this->id}", true );
			return;
		}
		update_option( "{$this->prefix}_{$this->id}", true, false );
	}
}
