(function (blocks, element, blockEditor, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var createElement = element.createElement;
  var __ = (i18n && i18n.__) ? i18n.__ : function (s) { return s; };

  var useBlockProps = blockEditor.useBlockProps;
  var RichText = blockEditor.RichText;

  registerBlockType('smart/{{slug}}', {
    edit: function (props) {
      var attrs = props.attributes;
      var setAttributes = props.setAttributes;

      var blockProps = useBlockProps({
        className: 'hb-{{slug}}'
      });

      return createElement(
        'section',
        blockProps,
        createElement(RichText, {
          tagName: 'h2',
          className: 'hb-{{slug}}__heading hayden-type-heading',
          value: attrs.heading,
          onChange: function (v) { setAttributes({ heading: v }); },
          placeholder: __('Heading…', 'hayden-blocks')
        }),
        createElement(RichText, {
          tagName: 'p',
          className: 'hb-{{slug}}__text hayden-type-body',
          value: attrs.text,
          onChange: function (v) { setAttributes({ text: v }); },
          placeholder: __('Text…', 'hayden-blocks')
        })
      );
    },

    save: function (props) {
      var attrs = props.attributes;
      var blockProps = blockEditor.useBlockProps.save({
        className: 'hb-{{slug}}'
      });

      return createElement(
        'section',
        blockProps,
        attrs.heading ? createElement('h2', { className: 'hb-{{slug}}__heading hayden-type-heading' }, attrs.heading) : null,
        attrs.text ? createElement('p', { className: 'hb-{{slug}}__text hayden-type-body' }, attrs.text) : null
      );
    }
  });
})(
  window.wp.blocks,
  window.wp.element,
  window.wp.blockEditor || window.wp.editor,
  window.wp.i18n
);
