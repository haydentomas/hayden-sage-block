(function (blocks, element, blockEditor, components, i18n) {
    var registerBlockType  = blocks.registerBlockType;
    var createElement      = element.createElement;
    var __                 = i18n.__;

    var useBlockProps      = blockEditor.useBlockProps;
    var RichText           = blockEditor.RichText;
    var InspectorControls  = blockEditor.InspectorControls;
    var PanelColorSettings = blockEditor.PanelColorSettings || components.PanelColorSettings;
    var PanelBody          = components.PanelBody;
    var TextControl        = components.TextControl;
    var SelectControl      = components.SelectControl;

    registerBlockType('smart/hero-primary', {
        edit: function (props) {
            var attrs        = props.attributes;
            var HB = (window.HaydenBlocks && window.HaydenBlocks.shared) ? window.HaydenBlocks.shared : null;

            // May be empty string = "Theme default"
            var headingScale = attrs.headingScale || '';
            var bodyScale    = attrs.bodyScale || '';

            // Build class list conditionally – note .hayden-type
            var classNames = ['hayden-hero-primary', 'hayden-type'];
            if (headingScale) {
                classNames.push('hayden-type--heading-' + headingScale);
            }
            if (bodyScale) {
                classNames.push('hayden-type--body-' + bodyScale);
            }

            var blockProps = useBlockProps({
                className: classNames.join(' ')
            });

            // --- Button style (only apply if user has set a colour) ---
            var buttonStyle    = {};
            var hasButtonStyle = false;

            if (attrs.buttonBgColor) {
                buttonStyle.backgroundColor = attrs.buttonBgColor;
                hasButtonStyle = true;
            }

            if (attrs.buttonTextColor) {
                buttonStyle.color = attrs.buttonTextColor;
                hasButtonStyle = true;
            }

            var buttonRichTextProps = {
                tagName: 'a',
                className: 'hayden-hero-button hayden-type-body',
                value: attrs.buttonLabel,
                onChange: function (value) {
                    props.setAttributes({ buttonLabel: value });
                },
                placeholder: __('Button label', 'hayden-blocks'),
                href: attrs.buttonUrl,
                allowedFormats: []
            };

            if (hasButtonStyle) {
                buttonRichTextProps.style = buttonStyle;
            }

            return [
                // -------------------------------
                // STYLES TAB: colours + typography
                // -------------------------------
                createElement(
                    InspectorControls,
                    { group: 'styles' },

                    // Heading colour panel
                    HB && HB.colorPanelSingle(createElement, PanelColorSettings, __, {
                        title: __('Heading colour', 'hayden-blocks'),
                        label: __('Heading text', 'hayden-blocks'),
                        value: attrs.headingColor,
                        attrKey: 'headingColor',
                        setAttributes: props.setAttributes
                    }),

                    // Button colours panel
                    HB && HB.colorPanelButtons(createElement, PanelColorSettings, __, {
                        title: __('Button colours', 'hayden-blocks'),
                        setAttributes: props.setAttributes,
                        buttons: [
                            {
                                bgKey: 'buttonBgColor',
                                textKey: 'buttonTextColor',
                                bgLabel: __('Button background', 'hayden-blocks'),
                                textLabel: __('Button text', 'hayden-blocks'),
                                valueBg: attrs.buttonBgColor,
                                valueText: attrs.buttonTextColor
                            }
                        ]
                    }),

                    // Typography: Tailwind-based heading + body font sizes
                    createElement(
                        PanelBody,
                        { title: __('Typography', 'hayden-blocks'), initialOpen: false },

                        // Heading font size (Tailwind scale)
                        createElement(SelectControl, {
                            label: __('Heading font size', 'hayden-blocks'),
                            help: __('Based on Tailwind font-size scale.', 'hayden-blocks'),
                            value: headingScale,
                            options: [
                                { label: __('Theme default', 'hayden-blocks'), value: '' },
                                { label: 'XL (Tailwind text-xl)',   value: 'xl' },
                                { label: '2XL (Tailwind text-2xl)', value: '2xl' },
                                { label: '3XL (Tailwind text-3xl)', value: '3xl' },
                                { label: '4XL (Tailwind text-4xl)', value: '4xl' },
                                { label: '5XL (Tailwind text-5xl)', value: '5xl' },
                                { label: '6XL (Tailwind text-6xl)', value: '6xl' }
                            ],
                            onChange: function (value) {
                                props.setAttributes({ headingScale: value });
                            }
                        }),

                        // Body font size (Tailwind scale)
                        createElement(SelectControl, {
                            label: __('Body font size', 'hayden-blocks'),
                            help: __('Based on Tailwind font-size scale.', 'hayden-blocks'),
                            value: bodyScale,
                            options: [
                                { label: __('Theme default', 'hayden-blocks'), value: '' },
                                { label: 'Small (Tailwind text-sm)',  value: 'sm' },
                                { label: 'Base (Tailwind text-base)', value: 'base' },
                                { label: 'Large (Tailwind text-lg)',  value: 'lg' },
                                { label: 'XL (Tailwind text-xl)',     value: 'xl' },
                                { label: '2XL (Tailwind text-2xl)',   value: '2xl' },
                                { label: '3XL (Tailwind text-3xl)',   value: '3xl' }
                            ],
                            onChange: function (value) {
                                props.setAttributes({ bodyScale: value });
                            }
                        })
                    )
                ),

                // -------------------------------
                // SETTINGS TAB: functional stuff
                // -------------------------------
                createElement(
                    InspectorControls,
                    { group: 'settings' },
                    createElement(
                        PanelBody,
                        { title: __('Hero settings', 'hayden-blocks'), initialOpen: true },
                        createElement(TextControl, {
                            label: __('Button URL', 'hayden-blocks'),
                            value: attrs.buttonUrl,
                            onChange: function (value) {
                                props.setAttributes({ buttonUrl: value });
                            }
                        })
                    )
                ),

                // -------------------------------
                // Block content (editor canvas)
                // -------------------------------
                createElement(
                    'section',
                    blockProps,
                    createElement(
                        'div',
                        { className: 'hayden-hero-inner' },

                        createElement(RichText, {
                            tagName: 'p',
                            className: 'hayden-hero-eyebrow',
                            value: attrs.eyebrow,
                            onChange: function (value) {
                                props.setAttributes({ eyebrow: value });
                            },
                            placeholder: __('Pre-heading', 'hayden-blocks')
                        }),

                        createElement(RichText, {
                            tagName: 'h1',
                            className: 'hayden-hero-heading hayden-type-heading',
                            value: attrs.heading,
                            onChange: function (value) {
                                props.setAttributes({ heading: value });
                            },
                            placeholder: __('Hero heading…', 'hayden-blocks'),
                            style: attrs.headingColor ? { color: attrs.headingColor } : null
                        }),

                        createElement(RichText, {
                            tagName: 'p',
                            className: 'hayden-hero-text hayden-type-body',
                            value: attrs.text,
                            onChange: function (value) {
                                props.setAttributes({ text: value });
                            },
                            placeholder: __('Short description…', 'hayden-blocks')
                        }),

                        createElement(
                            'div',
                            { className: 'hayden-hero-actions' },
                            createElement(RichText, buttonRichTextProps)
                        )
                    )
                )
            ];
        },

        save: function (props) {
            var attrs        = props.attributes;
            var HB = (window.HaydenBlocks && window.HaydenBlocks.shared) ? window.HaydenBlocks.shared : null;
            var headingScale = attrs.headingScale || '';
            var bodyScale    = attrs.bodyScale || '';

            var classNames = ['hayden-hero-primary', 'hayden-type'];
            if (headingScale) {
                classNames.push('hayden-type--heading-' + headingScale);
            }
            if (bodyScale) {
                classNames.push('hayden-type--body-' + bodyScale);
            }

            var blockProps = blockEditor.useBlockProps.save({
                className: classNames.join(' ')
            });

            // --- Button colours on the front end ---
            var buttonStyle    = {};
            var hasButtonStyle = false;

            if (attrs.buttonBgColor) {
                buttonStyle.backgroundColor = attrs.buttonBgColor;
                hasButtonStyle = true;
            }

            if (attrs.buttonTextColor) {
                buttonStyle.color = attrs.buttonTextColor;
                hasButtonStyle = true;
            }

            var buttonProps = {
                className: 'hayden-hero-button hayden-type-body',
                href: attrs.buttonUrl || '#'
            };

            if (hasButtonStyle) {
                buttonProps.style = buttonStyle;
            }

            return createElement(
                'section',
                blockProps,
                createElement(
                    'div',
                    { className: 'hayden-hero-inner' },

                    attrs.eyebrow &&
                        createElement('p', { className: 'hayden-hero-eyebrow' }, attrs.eyebrow),

                    attrs.heading &&
                        createElement(
                            'h1',
                            {
                                className: 'hayden-hero-heading hayden-type-heading',
                                style: attrs.headingColor ? { color: attrs.headingColor } : {}
                            },
                            attrs.heading
                        ),

                    attrs.text &&
                        createElement(
                            'p',
                            { className: 'hayden-hero-text hayden-type-body' },
                            attrs.text
                        ),

                    attrs.buttonLabel &&
                        createElement(
                            'div',
                            { className: 'hayden-hero-actions' },
                            createElement('a', buttonProps, attrs.buttonLabel)
                        )
                )
            );
        }
    });
})(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor || window.wp.editor,
    window.wp.components,
    window.wp.i18n
);
