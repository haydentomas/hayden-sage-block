<?php
/**
 * Plugin Name: Hayden Blocks
 * Description: Custom Gutenberg blocks for the Hayden Sage Starter theme.
 * Author: Hayden Tomas
 * Version: 0.1.0
 * Text Domain: hayden-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register shared + block-specific scripts/styles.
 */
function hayden_blocks_register_assets() {

    $dir_url = plugin_dir_url( __FILE__ );

    // Shared typography utilities (used by multiple blocks)
    wp_register_style(
        'hayden-blocks-typography',
        $dir_url . 'blocks/assets/typography.css', // <-- NOTE: blocks/assets
        array(),
        '0.1.0'
    );

    // Hero Primary block stylesheet (depends on shared typography)
    wp_register_style(
        'hayden-hero-primary-style',
        $dir_url . 'blocks/hero-primary/style.css',
        array( 'hayden-blocks-typography' ),
        '0.1.0'
    );

    // Hero Primary block editor script
    wp_register_script(
        'hayden-hero-primary-editor',
        $dir_url . 'blocks/hero-primary/editor.js',
        array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
        '0.1.0',
        true
    );
}
add_action( 'init', 'hayden_blocks_register_assets' );

/**
 * Register blocks using block.json files.
 */
function hayden_blocks_register_blocks() {

    if ( ! function_exists( 'register_block_type' ) ) {
        return;
    }

    register_block_type( __DIR__ . '/blocks/hero-primary' );
}
add_action( 'init', 'hayden_blocks_register_blocks', 20 );

/**
 * Add "Smart Blocks" inserter category and keep it at the top.
 */
function hayden_blocks_register_category( $categories, $post ) {

    $slugs = wp_list_pluck( $categories, 'slug' );
    if ( in_array( 'smart-blocks', $slugs, true ) ) {
        return $categories;
    }

    array_unshift(
        $categories,
        array(
            'slug'  => 'smart-blocks',
            'title' => __( 'Smart Blocks', 'hayden-blocks' ),
            'icon'  => 'screenoptions',
        )
    );

    return $categories;
}
add_filter( 'block_categories_all', 'hayden_blocks_register_category', 5, 2 );
