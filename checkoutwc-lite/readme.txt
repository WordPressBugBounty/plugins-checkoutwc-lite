=== CheckoutWC Lite ===
Contributors: clifgriffin
Donate link: https://www.checkoutwc.com
Tags: woocommerce checkout, woocommerce checkout template, woocommerce checkout theme, woo checkout, shopify
Requires at least: 5.2
Tested up to: 6.8
Stable tag: 10.1.17
Requires PHP: 7.3
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Replace your WooCommerce checkout page with a beautiful, mobile friendly, conversion optimized, Shopify like checkout template.

== Description ==

CheckoutWC Lite replaces your checkout page with a beautiful, conversion optimized, mobile friendly checkout template. We align the best features of Shopify with the best features of WooCommerce. Enhance your checkout and grow your profits. 📈

Streamline and optimize the checkout process for your customers. Don’t waste your time with page and funnel builders – our templates are ready to deploy in minutes!

> <strong>CheckoutWC Pro</strong><br />
> This plugin is the lite version of CheckoutWC that provides all the functionality you need for you WooCommerce cart, checkout, thank you page, etc. Including more templates, a floating side cart, address autocomplete, local pickup, one page checkout, user matching, trust badges, etc.  <a href="https://www.checkoutwc.com/?utm_source=wprepo&utm_medium=link&utm_campaign=liteplugin" title="CheckoutWC">Click here to purchase the best premium WooCommerce checkout optimization plugin now!</a>

## Why upgrade your checkout page? ##

Which do you think is easier: <strong>doubling your traffic</strong> or <strong>doubling your conversion rate from 1% to 2%?</strong> 🤔

The answer is probably obvious: it's much easier and less expensive to fix a leaky checkout page than it is to double the number of people who visit your site. Lead generation is expensive!

At its core, CheckoutWC Lite is a conversion optimization plugin that helps you increase your conversion rate and reduce cart abandonment. In a few clicks you can replace your ugly default checkout page with one that is beautiful, mobile friendly, and optimized for conversions.

## The best SaaS features with the best of WooCommerce ##

You shouldn’t have to compromise. We provide the simplicity of Shopify with the power of WooCommerce. We’ve taken the best features of both platforms and combined them into one beautiful checkout template.

## Applied research. Best practices. ##

CheckoutWC Lite is designed to convert more customers using the best available user testing and e-commerce research.

## Sensible defaults. Endless possibilities. ##

We pick the best options for most stores out of the box while keeping you in the driver’s seat. Our thoughtful options and developer API give you limitless options.

We hate complicated configurations and page builders. CheckoutWC Lite is opinionated and simple. We’ve done the hard work for you so you can focus on growing your business.

## The Best Checkout Page for WooCommerce ##

Our checkout page is simply better than the default WooCommerce checkout page. Here are some of the reasons why:
* **Express checkout** - Skip the checkout form and pay with Apple Pay, Google Pay, PayPal, etc. We integrate with all the best payment gateways.
* **Immediate feedback** - Validate fields as customers fill them out so they know if they are doing it right.
* **Mobile friendly** - Our checkout page is mobile friendly and looks great on any device.
* **Conversion optimized** - Multistep checkout flows keep customers in one domain of knowledge at a time, prioritizing the right information at the right time. They also provide customers with a sense of progress and reduce form fatigue.
* **Accessible** - We follow WCAG 2.0 AA guidelines for accessibility.
* **Superior UI/UX** - Your ecommerce flow should match your products.
* **Works with every theme** - You shouldn't have to pick your theme based on your checkout page. Our checkout page works with any theme.

## Who is CheckoutWC Lite for? ##

✔ eCommerce store owners
✔ Subscription box service providers
✔ Dropshippers
✔ Solopreneurs
✔ Course creators
✔ Agencies that service WooCommerce stores

## Compatibility ##

We strive to make CheckoutWC Lite compatible with all themes and plugins where possible. Some noteable plugins we support:

* WooCommerce Subscriptions
* WooCommerce Memberships
* WooCommerce Checkout Field Editor
* CartFlows
* EU VAT Number
* Klaviyo
* Mailchimp for WooCommerce
* NL Postcode Checker
* ThemeHigh Checkout Field Editor
* WooCommerce Germanized
* WooCommerce Points and Rewards
* WooCommerce Gift Cards
* Elementor
* Beaver Builder
* Oxygen Builder
* Divi
* **All payment gateways!**
* **All shipping providers!**

## External services ##

This plugin connects to the Google Fonts API to retrieve a list of available web fonts and to load the font selected by the user on the checkout page.

It sends a request to Google Fonts each time the CheckoutWC > Appearance > Design settings page is loaded (to fetch font options) and on the frontend checkout page (to load the selected font).

Note: If you do NOT select a Google font in CheckoutWC > Appearance > Design, then no calls to Google will be made on the checkout page.

This service is provided by Google: [terms of use](https://policies.google.com/terms), [privacy policy](https://policies.google.com/privacy).

== Frequently Asked Questions ==

= Which languages do you support? =

CheckoutWC Lite is translated into over 20 languages. <a href="https://www.checkoutwc.com/documentation/localization/">More info here.</a>

= Will CheckoutWC slow down my site? =

We take performance very seriously. CheckoutWC should be as fast as the regular WooCommerce templates, if not faster.

= Can I use my theme's header and footer? =

By default, your checkout and thank you pages will load in our distraction free portal. This is optimal for the best conversion rate. We also support using Elementor and Beaver Builder's header and footer template parts.

= Will it work with my payment gateway? =

CheckoutWC works with virtually all payment gateways out of the box. If you have a problem, let us know and we’ll fix it.

== Screenshots ==

1. The first checkout step collects the customer shipping information.
2. The second checkout step lets customers choose their shipping method. (For shipped orders - skipped for digital orders)
3. The third checkout step lets customers enter their payment information.
4. The checkout template is also optimized for mobile devices.
5. Checkout settings let you customize your checkout page.
6. Design settings let you customize your logo, colors, and CSS.

== Changelog ==

Free version updates are non-sequential due to the unified development branch we use with the premium versions.

= Version 10.1.17 =
* Fix - Enable enter key on login modal
* Fix - Add missing Parsley field validation locales
* Fix - Fix filter callback that broke Brazilian Market integration
* Fix - Fix fatal error with Braintree integration and new version
* Fix - Fix PHP warnings from incompletely configured Order Bump rules
* Fix - Update outdated dependencies

= Version 10.1.16 =
* Fix - Fix translations path that prevented translations loading in WordPress 6.8

= Version 10.1.15 =
* Fix - Downgraded SweetAlert dependency for security reasons
* Fix - Fix bug that prevented thank you page from loading properly when downgrading from Pro
* Dev - Plugin now ships with composer files
* Dev - Updated tested versions
* Dev - Removed some unused files from build
* Dev - Various tweaks for WordPress.org standards compliance

= Version 10.1.14 =
* New - Added de_CH translations
* Fix - Fix issue with WooCommerce Gift Cards and use gift card balance checkbox
* Fix - Fix cart breadcrumb appearing with skip cart step is enabled.
* Dev - Added new cfw_form_field_suppress_optional_in_placeholder filter
* Dev - Deprecated cfw_form_field_append_optional_to_placeholder filter

= Version 10.1.13 =
* Fix - Fix CSS issue with Stripe Link button
* Dev - Cleaned up PHP warnings

= Version 10.1.12 =
* Fix - Fix race condition with React rendered action hooks and scripts listening to updated_checkout event
* Fix - Fix issue with remove item button appearing when it should not

= Version 10.1.11 =
* Fix - Handle failed logo import errors more gracefully during settings import.
* Fix - Fix field style label CSS issue
* Fix - Fix caching issues by setting cfw_cart_hash less frequently
* Fix - Fix issue where gateway detected the block checkout when CheckoutWC was active
* Fix - Fix missing container class for billing fields when forced to different billing address
* Fix - Fix issue with toggling accordions programmatically

= Version 10.1.10 =
* Fix - Fix issue with ship-to-different-address checkbox that caused issues with shippig/billing address.
* Dev - Fix PHP warnings.

= Version 10.1.8 =
 * Fix - Fix missing capabilities for migrated installations.

= Version 10.1.7 =
 * Improved - Handle forced billing address as shipping address scenario with ship-to-different-address-checkbox
 * Fix - Fix issue with YITH Delivery Dates pickup times select refresh
 * Fix - Fix issue that prevented usernames for login
 * Fix - Fix potential JS error with totals on the side cart and checkout
 * Fix - Fix hide coupon behind link setting for checkout.
 * Fix - Disable conflicting tailwind container class
 * Fix - Exclude terms and conditions checkbox from field persistence
 * Fix - Refactor payment request / express checkout button styling to fix multiple issues
 * Fix - Fix design link in Start Here
 * Fix - Fix potential JS error on trust badges settings page
 * Dev - Allow itemized shipping costs with cfw_totals_itemize_shipping_costs filter

= Version 10.1.6 =
* Fix - Fix fatal error for users who downgrade from CheckoutWC premium to Lite from an older version of premium.

= Version 10.1.4 =
* New - New unified version to allow more frequent updates and bug fixes going forward.

= Version 1.1.13 =
* Fix - Fix CSS bug with Customizer
* Improved - Remove customizer controls as the customizer is deprecated and these settings are best handled in the admin settings area.

= Version 1.1.12 =
* Fix - Update some incorrect info in admin settings
- Fix - Remove unused code

= Version 1.1.11 =
* Fix - Fix missing order attribution data

= Version 1.1.10 =
* Fix - Fixes for Brazilian Market for WooCommerce

= Version 1.1.9 =
* Fix - Fix issue that prevented Mailerlite checkbox from outputting
* Dev - Declare WooCommerce as required plugin for WP 6.5

= Version 1.1.8 =
* Fix - Fix wording of French translation for 'Use different billing address' radio

= Version 1.1.7 =
* Important Hotfix - Fix bug that prevented error notices from showing during checkout submit and caused page to hang.

= Version 1.1.6 =
* Fix - Fix Klarna Payments 3.x support

= Version 1.1.5 =
* Fix - Fix notice handling with WooCommerce 8.5.x

= Version 1.1.4 =
* Fix - Fix issue with WP Engine that caused the deactivation survey to open when updating any plugin

= Version 1.1.3 =
* Fix - Fix issue with Portugal DPD Pickup and Lockers network for WooCommerce

= Version 1.1.2 =
* Fix - Fix issues with Brazilian Market for WooCommerce

= Version 1.1.1 =
* Updated - Update info on premium plan.
* Misc - Collect info on deactivation.

= Version 1.1.0 =
* Improved - Switch from update_checkout to update_order_review and add logic for detecting our requests versus others.
* Fix - Fix issue with WooCommerce Pakettikauppa and the shipping email field during billing field sync.
* Fix - Add messages since this is part of the default data package on updated_checkout
* Fix - Fix accidental compatibility issue with Stripe for WooCommerce (Payment Plugins)
* Fix - Add the ability to pass alert temporary status from PHP side and handle that better when there are no new alerts to replace existing alerts
* Dev - Get rid of symfony/finder so we can better support PHP 8.1

= Version 1.0.7 =
* Fix - Fix another incorrect Polish translation

= Version 1.0.6 =
* Improved - Remove unused polyfills
* Fix - Fix incorrect Polish translation
* Fix - Speed up the timing of the shadow root removal on the Amazon button to reduce flash of old button
* Fix - Fix password reset modal
* Fix - Switch to native name for complete order AJAX action hook to improve compatibility with other plugins
* Fix - Fix improperly escaped HTML on admin pages.
* Fix - Fix bug with login and sanitization. Can’t use santize_email because it nukes non email addresses and replaces with empty string.
* Dev - Remove unused functions
* Dev - Declare support for HPOS


= Version 1.0.5 =
* Fix - Fix bug that caused the login required message to show up even when login is not allowed at checkout.
* Fix - Fix escaping of payment method title to match WooCommerce core
* Fix - Fix Amazon Pay button doubling when quantity is changed
* Dev - Disable WC Fields Factory notice because it really isn’t that relevant anymore

= Version 1.0.4 =
* Fix - Add Czech and Lithuanian inline field validation translations.

= Version 1.0.3 =
* Fix - Fix author info

= Version 1.0.2 =
* Fix - Fix improperly escaped HTML in account already registered notice.

= Version 1.0.1 =
* Improved - Add WooCommerce core detection protection.

= Version 1.0.0 =
* Initial Release