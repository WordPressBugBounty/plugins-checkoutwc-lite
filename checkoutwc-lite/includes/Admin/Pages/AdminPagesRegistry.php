<?php

namespace Objectiv\Plugins\Checkout\Admin\Pages;

class AdminPagesRegistry {
	private static $pages = [];

	public static function bulk_add( $pages ) {
		self::$pages = array_merge( self::$pages, $pages );
	}

	public static function set( $key, $service ) {
		self::$pages[ $key ] = $service;
	}

	public static function get( $key ): PageAbstract {
		return self::$pages[ $key ];
	}

	/**
	 * Returns the page registered under the key, or null when there is none (some pages only exist in the paid build).
	 *
	 * @since 11.5.0
	 *
	 * @param string $key page key
	 *
	 * @return PageAbstract|null
	 */
	public static function get_optional( string $key ): ?PageAbstract {
		return self::$pages[ $key ] ?? null;
	}
}
