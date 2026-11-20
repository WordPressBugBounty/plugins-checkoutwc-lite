<?php

namespace Objectiv\Plugins\Checkout\Admin\Notices;

class BluehostPluginNotice extends NoticeAbstract {
	protected function should_add(): bool {
		return defined( 'BLUEHOST_PLUGIN_VERSION' ) && self::is_affected_version( (string) BLUEHOST_PLUGIN_VERSION );
	}

	/**
	 * Determines whether a Bluehost plugin version has the conflict, which Bluehost fixed in 3.9.3.
	 *
	 * @since 11.5.1
	 *
	 * @param string $version Bluehost plugin version.
	 * @return bool
	 */
	public static function is_affected_version( string $version ): bool {
		return version_compare( $version, '3.9.3', '<' );
	}
}
