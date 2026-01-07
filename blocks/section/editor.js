(function (blocks, element, blockEditor, components, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var el = element.createElement;
  var __ = i18n.__;

  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var InnerBlocks = blockEditor.InnerBlocks;

  var PanelBody = components.PanelBody;
  var RadioControl = components.RadioControl;
  var PanelColorSettings =
    blockEditor.PanelColorSettings || components.PanelColorSettings;

  registerBlockType('smart/section', {
    attributes: {
      innerSpacing: {
        type: 'string',
        default: 'global'
      },
      headingColor: {
        type: 'string',
        default: ''
      },
      textColor: {
        type: 'string',
        default: ''
      },
      backgroundColor: {
        type: 'string',
        default: ''
      }
    },

    edit: function (props) {
      var attrs = props.attributes;
      var setAttributes = props.setAttributes;
      var HB =
        window.HaydenBlocks && window.HaydenBlocks.shared
          ? window.HaydenBlocks.shared
          : null;

      var innerSpacing = attrs.innerSpacing || 'global';

      /* ---------------------------------
         Wrapper props (KEEP COMPATIBLE)
      --------------------------------- */
      var blockProps = useBlockProps({
        className: 'hb-section',
        ...(innerSpacing !== 'global'
          ? { 'data-spacing': innerSpacing }
          : {}),
        style: {
          ...(attrs.backgroundColor
            ? { backgroundColor: attrs.backgroundColor }
            : {}),
          ...(attrs.textColor
            ? { color: attrs.textColor }
            : {}),
          ...(attrs.headingColor
            ? { '--hb-section-heading-color': attrs.headingColor }
            : {})
        }
      });

      return [
        /* =================================
           STYLES TAB
        ================================= */
        el(
          InspectorControls,
          { group: 'styles' },

          /* -------- Layout -------- */
          el(
            PanelBody,
            { title: __('Layout', 'hayden-blocks'), initialOpen: true },
            el(RadioControl, {
              label: __('Inner spacing', 'hayden-blocks'),
              help: __('Controls internal padding for this block.', 'hayden-blocks'),
              selected: innerSpacing,
              options: [
                { label: __('Use global', 'hayden-blocks'), value: 'global' },
                { label: __('Compact', 'hayden-blocks'), value: 'compact' },
                { label: __('Default', 'hayden-blocks'), value: 'default' },
                { label: __('Spacious', 'hayden-blocks'), value: 'spacious' }
              ],
              onChange: function (value) {
                setAttributes({ innerSpacing: value });
              }
            })
          ),

          /* -------- Heading colour -------- */
          HB &&
            HB.colorPanelSingle(el, PanelColorSettings, __, {
              title: __('Heading colour', 'hayden-blocks'),
              label: __('Heading text', 'hayden-blocks'),
              value: attrs.headingColor,
              attrKey: 'headingColor',
              setAttributes: setAttributes
            }),

          /* -------- Text colour -------- */
          HB &&
            HB.colorPanelSingle(el, PanelColorSettings, __, {
              title: __('Text colour', 'hayden-blocks'),
              label: __('Text', 'hayden-blocks'),
              value: attrs.textColor,
              attrKey: 'textColor',
              setAttributes: setAttributes
            }),

          /* -------- Background colour -------- */
          el(
            PanelBody,
            { title: __('Background colour', 'hayden-blocks'), initialOpen: false },
            el(PanelColorSettings, {
              colorSettings: [
                {
                  value: attrs.backgroundColor,
                  label: __('Background', 'hayden-blocks'),
                  onChange: function (color) {
                    setAttributes({ backgroundColor: color || '' });
                  }
                }
              ]
            })
          )
        ),

        /* =================================
           BLOCK CONTENT
        ================================= */
        el(
          'section',
          blockProps,
          el(
            'div',
            { className: 'hb-section__inner' },
            el(InnerBlocks, {
              placeholder: __('Add blocks inside this section…', 'hayden-blocks')
            })
          )
        )
      ];
    },

    save: function (props) {
      var attrs = props.attributes;
      var innerSpacing = attrs.innerSpacing || 'global';

      return el(
        'section',
        blockEditor.useBlockProps.save({
          className: 'hb-section',
          ...(innerSpacing !== 'global'
            ? { 'data-spacing': innerSpacing }
            : {}),
          style: {
            ...(attrs.backgroundColor
              ? { backgroundColor: attrs.backgroundColor }
              : {}),
            ...(attrs.textColor
              ? { color: attrs.textColor }
              : {}),
            ...(attrs.headingColor
              ? { '--hb-section-heading-color': attrs.headingColor }
              : {})
          }
        }),
        el(
          'div',
          { className: 'hb-section__inner' },
          el(InnerBlocks.Content)
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
