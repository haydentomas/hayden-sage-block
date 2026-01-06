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
 * Register shared + auto-discovered block assets.
 */
function hayden_blocks_register_assets() {

    $dir_url   = plugin_dir_url( __FILE__ );
    $blocks_dir = __DIR__ . '/blocks';

    // Shared typography utilities (used by multiple blocks)
    wp_register_style(
        'hayden-blocks-typography',
        $dir_url . 'blocks/assets/typography.css',
        array(),
        '0.1.0'
    );

    // Shared editor helpers (colour panels, var mappers, etc.)
    wp_register_script(
        'hayden-blocks-shared',
        $dir_url . 'blocks/assets/shared.js',
        array( 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
        '0.1.0',
        true
    );


    // Auto-register assets for each block folder: blocks/<slug>/{editor.js,style.css}
    if ( is_dir( $blocks_dir ) && class_exists( 'DirectoryIterator' ) ) {
        foreach ( new DirectoryIterator( $blocks_dir ) as $item ) {

            if ( $item->isDot() || ! $item->isDir() ) {
                continue;
            }

            $slug = $item->getFilename();

            // Skip non-block folders
            if ( $slug === 'assets' || $slug === 'scaffolds' ) {
                continue;
            }

            $editor_js = $item->getPathname() . '/editor.js';
            $style_css = $item->getPathname() . '/style.css';

            // Register style if present
            if ( file_exists( $style_css ) ) {
                wp_register_style(
                    'hayden-' . $slug . '-style',
                    $dir_url . 'blocks/' . $slug . '/style.css',
                    array( 'hayden-blocks-typography' ),
                    '0.1.0'
                );
            }

            // Register editor script if present
            if ( file_exists( $editor_js ) ) {
                wp_register_script(
                    'hayden-' . $slug . '-editor',
                    $dir_url . 'blocks/' . $slug . '/editor.js',
                    array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'hayden-blocks-shared' ),
                    '0.1.0',
                    true
                );
            }
        }
    }
}
add_action( 'init', 'hayden_blocks_register_assets', 5 );

/**
 * Enqueue shared typography everywhere blocks appear (editor + front end).
 */
function hayden_blocks_enqueue_shared_assets() {
    wp_enqueue_style( 'hayden-blocks-typography' );
}
add_action( 'enqueue_block_assets', 'hayden_blocks_enqueue_shared_assets' );

/**
 * Auto-register ALL blocks in /blocks/* that contain a block.json
 */
function hayden_blocks_register_blocks() {

    if ( ! function_exists( 'register_block_type' ) ) {
        return;
    }

    $blocks_dir = __DIR__ . '/blocks';

    if ( ! is_dir( $blocks_dir ) ) {
        return;
    }

    if ( class_exists( 'DirectoryIterator' ) ) {
        foreach ( new DirectoryIterator( $blocks_dir ) as $item ) {

            if ( $item->isDot() || ! $item->isDir() ) {
                continue;
            }

            $slug = $item->getFilename();

            // Skip non-block folders
            if ( $slug === 'assets' || $slug === 'scaffolds' ) {
                continue;
            }

            $block_json = $item->getPathname() . '/block.json';
            if ( file_exists( $block_json ) ) {
                // WP supports passing a block folder path here; it will read block.json metadata.
                register_block_type( $item->getPathname() );
            }
        }
    }
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
