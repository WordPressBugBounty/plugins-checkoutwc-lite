<?php

namespace Objectiv\Plugins\Checkout\Admin\Notices;

use Objectiv\Plugins\Checkout\Managers\NoticesManager;

abstract class NoticeAbstract {
	public function __construct() {}

	public function maybe_add( string $id, string $title, string $message, array $options = [] ) {
		if ( ! $this->should_add() ) {
			return;
		}

		$options['image'] = file_get_contents( CFW_PATH . '/assets/images/cfw.svg' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$options['mode']  = $options['mode'] ?? 'regular';
		$options['scope'] = $options['scope'] ?? 'user';

		NoticesManager::instance()->add( $id, $title, $message, $options );
	}

	protected function should_add(): bool {
		return true;
	}

	/**
	 * Checks whether this request is the AJAX request that dismisses a notice.
	 *
	 * Pressmodo only handles the dismissal if the notice is added on that request, which has no admin page.
	 *
	 * @since 11.5.0
	 *
	 * @param string $id the notice ID
	 * @return bool
	 */
	protected function is_dismiss_request( string $id ): bool {
		// phpcs:disable WordPress.Security.NonceVerification.Missing -- Pressmodo checks the nonce before dismissing.
		return wp_doing_ajax()
			&& isset( $_POST['action'], $_POST['id'] )
			&& 'pressmodo_dismiss_notice' === $_POST['action']
			&& $id === $_POST['id'];
		// phpcs:enable WordPress.Security.NonceVerification.Missing
	}
}
