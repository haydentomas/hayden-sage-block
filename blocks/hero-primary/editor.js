(function (blocks, element, blockEditor, components, i18n) {
    var registerBlockType = blocks.registerBlockType;
    var el                = element.createElement;
    var __                = i18n.__;

    var useBlockProps     = blockEditor.useBlockProps;
    var RichText          = blockEditor.RichText;
    var InspectorControls = blockEditor.InspectorControls;

    var PanelColorSettings = blockEditor.PanelColorSettings || components.PanelColorSettings;
    var PanelBody          = components.PanelBody;
    var TextControl        = components.TextControl;
    var SelectControl      = components.SelectControl;
    var RadioControl       = components.RadioControl;

    registerBlockType('smart/hero-primary', {
        edit: function (props) {
            var attrs = props.attributes;
            var HB    = window.HaydenBlocks && window.HaydenBlocks.shared
                ? window.HaydenBlocks.shared
                : null;

            var headingScale = attrs.headingScale || '';
            var bodyScale    = attrs.bodyScale || '';
            var innerSpacing = attrs.innerSpacing || 'global';

            /* -------------------------------------------------
               Wrapper classes + data attributes
            ------------------------------------------------- */
            var classNames = ['hayden-hero-primary', 'hayden-type'];

            if (headingScale) {
                classNames.push('hayden-type--heading-' + headingScale);
            }

            if (bodyScale) {
                classNames.push('hayden-type--body-' + bodyScale);
            }

            var blockProps = useBlockProps({
                className: classNames.join(' '),
                ...(innerSpacing !== 'global' ? { 'data-spacing': innerSpacing } : {})
            });

            /* -------------------------------------------------
               Button inline styles (optional)
            ------------------------------------------------- */
            var buttonStyle = {};

            if (attrs.buttonBgColor) {
                buttonStyle.backgroundColor = attrs.buttonBgColor;
            }

            if (attrs.buttonTextColor) {
                buttonStyle.color = attrs.buttonTextColor;
            }

            var buttonRichTextProps = {
                tagName: 'a',
                className: 'hayden-hero-button hayden-type-body',
                value: attrs.buttonLabel,
                href: attrs.buttonUrl,
                allowedFormats: [],
                placeholder: __('Button label', 'hayden-blocks'),
                onChange: function (value) {
                    props.setAttributes({ buttonLabel: value });
                },
                ...(Object.keys(buttonStyle).length ? { style: buttonStyle } : {})
            };

            return [
                /* =================================================
                   STYLES TAB (Layout → Typography → Colours)
                ================================================= */
                el(
                    InspectorControls,
                    { group: 'styles' },

                    /* ---------- Layout (shared) ---------- */
                    HB && HB.spacingPanel(
                        el,
                        PanelBody,
                        RadioControl,
                        __,
                        {
                            value: innerSpacing,
                            attrKey: 'innerSpacing',
                            setAttributes: props.setAttributes
                        }
                    ),

                    /* ---------- Typography ---------- */
                    el(
                        PanelBody,
                        { title: __('Typography', 'hayden-blocks'), initialOpen: false },

                        el(SelectControl, {
                            label: __('Heading font size', 'hayden-blocks'),
                            value: headingScale,
                            options: [
                                { label: __('Theme default', 'hayden-blocks'), value: '' },
                                { label: 'XL', value: 'xl' },
                                { label: '2XL', value: '2xl' },
                                { label: '3XL', value: '3xl' },
                                { label: '4XL', value: '4xl' },
                                { label: '5XL', value: '5xl' },
                                { label: '6XL', value: '6xl' }
                            ],
                            onChange: function (value) {
                                props.setAttributes({ headingScale: value });
                            }
                        }),

                        el(SelectControl, {
                            label: __('Body font size', 'hayden-blocks'),
                            value: bodyScale,
                            options: [
                                { label: __('Theme default', 'hayden-blocks'), value: '' },
                                { label: 'Small', value: 'sm' },
                                { label: 'Base', value: 'base' },
                                { label: 'Large', value: 'lg' },
                                { label: 'XL', value: 'xl' },
                                { label: '2XL', value: '2xl' },
                                { label: '3XL', value: '3xl' }
                            ],
                            onChange: function (value) {
                                props.setAttributes({ bodyScale: value });
                            }
                        })
                    ),

                    /* ---------- Colours ---------- */
                    HB && HB.colorPanelSingle(el, PanelColorSettings, __, {
                        title: __('Heading colour', 'hayden-blocks'),
                        label: __('Heading text', 'hayden-blocks'),
                        value: attrs.headingColor,
                        attrKey: 'headingColor',
                        setAttributes: props.setAttributes
                    }),

                    HB && HB.colorPanelButtons(el, PanelColorSettings, __, {
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
                    })
                ),

                /* =================================================
                   SETTINGS TAB
                ================================================= */
                el(
                    InspectorControls,
                    { group: 'settings' },
                    el(
                        PanelBody,
                        { title: __('Hero settings', 'hayden-blocks'), initialOpen: true },
                        el(TextControl, {
                            label: __('Button URL', 'hayden-blocks'),
                            value: attrs.buttonUrl,
                            onChange: function (value) {
                                props.setAttributes({ buttonUrl: value });
                            }
                        })
                    )
                ),

                /* =================================================
                   BLOCK CONTENT (EDITOR)
                ================================================= */
                el(
                    'section',
                    blockProps,
                    el(
                        'div',
                        { className: 'hayden-hero-inner' },

                        el(RichText, {
                            tagName: 'p',
                            className: 'hayden-hero-eyebrow',
                            value: attrs.eyebrow,
                            placeholder: __('Pre-heading', 'hayden-blocks'),
                            onChange: function (value) {
                                props.setAttributes({ eyebrow: value });
                            }
                        }),

                        el(RichText, {
                            tagName: 'h1',
                            className: 'hayden-hero-heading hayden-type-heading',
                            value: attrs.heading,
                            placeholder: __('Hero heading…', 'hayden-blocks/or'),
                            style: attrs.headingColor ? { color: attrs.headingColor } : null,
                            onChange: function (value) {
                                props.setAttributes({ heading: value });
                            }
                        }),

                        el(RichText, {
                            tagName: 'p',
                            className: 'hayden-hero-text hayden-type-body',
                            value: attrs.text,
                            placeholder: __('Short description…', 'hayden-blocks'),
                            onChange: function (value) {
                                props.setAttributes({ text: value });
                            }
                        }),

                        el(
                            'div',
                            { className: 'hayden-hero-actions' },
                            el(RichText, buttonRichTextProps)
                        )
                    )
                )
            ];
        },

        save: function (props) {
            var attrs = props.attributes;

            var headingScale = attrs.headingScale || '';
            var bodyScale    = attrs.bodyScale || '';
            var innerSpacing = attrs.innerSpacing || 'global';

            var classNames = ['hayden-hero-primary', 'hayden-type'];

            if (headingScale) {
                classNames.push('hayden-type--heading-' + headingScale);
            }

            if (bodyScale) {
                classNames.push('hayden-type--body-' + bodyScale);
            }

            var blockProps = blockEditor.useBlockProps.save({
                className: classNames.join(' '),
                ...(innerSpacing !== 'global' ? { 'data-spacing': innerSpacing } : {})
            });

            var buttonStyle = {};

            if (attrs.buttonBgColor) {
                buttonStyle.backgroundColor = attrs.buttonBgColor;
            }

            if (attrs.buttonTextColor) {
                buttonStyle.color = attrs.buttonTextColor;
            }

            return el(
                'section',
                blockProps,
                el(
                    'div',
                    { className: 'hayden-hero-inner' },

                    attrs.eyebrow &&
                        el('p', { className: 'hayden-hero-eyebrow' }, attrs.eyebrow),

                    attrs.heading &&
                        el(
                            'h1',
                            {
                                className: 'hayden-hero-heading hayden-type-heading',
                                style: attrs.headingColor ? { color: attrs.headingColor } : {}
                            },
                            attrs.heading
                        ),

                    attrs.text &&
                        el(
                            'p',
                            { className: 'hayden-hero-text hayden-type-body' },
                            attrs.text
                        ),

                    attrs.buttonLabel &&
                        el(
                            'div',
                            { className: 'hayden-hero-actions' },
                            el(
                                'a',
                                {
                                    className: 'hayden-hero-button hayden-type-body',
                                    href: attrs.buttonUrl || '#',
                                    ...(Object.keys(buttonStyle).length ? { style: buttonStyle } : {})
                                },
                                attrs.buttonLabel
                            )
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
