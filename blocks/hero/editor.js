(function (blocks, element, blockEditor, components, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var el = element.createElement;

  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var InnerBlocks = blockEditor.InnerBlocks;
  var URLInputButton = blockEditor.URLInputButton;

  // ✅ Required so Styles panel (color/spacing) actually applies
  var useBlockProps = blockEditor.useBlockProps;

  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var ToggleControl = components.ToggleControl;
  var Button = components.Button;

  var __ = (i18n && i18n.__) ? i18n.__ : function (s) { return s; };
  var PanelColorSettings = blockEditor.PanelColorSettings || components.PanelColorSettings;

  // (Legacy) simple colour picker (no longer used here, kept for compatibility)
  var ColorPalette = components.ColorPalette;

  registerBlockType("smart/hero", {
    edit: function (props) {
      var attrs = props.attributes;
      var setAttributes = props.setAttributes;

      var layout = attrs.layout || "split";
      var mediaPosition = attrs.mediaPosition || "right";

      var wrapperClass =
        "hb-hero hb-hero--" +
        layout +
        (layout === "split" ? " hb-hero--media-" + mediaPosition : "");

      // ✅ Override vars (empty string means "use global tokens")
      var overrideStyle = {
        "--hb-heading-color": attrs.headingColor || undefined,
        "--hb-btn1-bg": attrs.button1BgColor || undefined,
        "--hb-btn1-text": attrs.button1TextColor || undefined,
        "--hb-btn2-bg": attrs.button2BgColor || undefined,
        "--hb-btn2-text": attrs.button2TextColor || undefined,
      };

      // ✅ Block props = styles panel + align + spacing etc
      var blockProps = useBlockProps({
        className: wrapperClass,
        style: overrideStyle,
      });

      var CLIENTS_TEMPLATE = [
        ["core/image", {}],
        ["core/image", {}],
        ["core/image", {}],
        ["core/image", {}],
      ];

      function onSelectImage(media) {
        if (!media || !media.url) return;
        setAttributes({
          mediaId: media.id,
          mediaUrl: media.url,
          mediaAlt: media.alt || "",
        });
      }

      function onRemoveImage() {
        setAttributes({ mediaId: 0, mediaUrl: "", mediaAlt: "" });
      }

      // Hide buttons in editor if label is empty
      var hasBtn1Label = !!(attrs.button1Label && attrs.button1Label.trim());
      var hasBtn2Label = !!(attrs.button2Label && attrs.button2Label.trim());

      return [
        el(
          InspectorControls,
          { key: "inspector" },

          // Layout panel
          el(
            PanelBody,
            { title: "Hero Layout", initialOpen: true },
            el(SelectControl, {
              label: "Layout",
              value: layout,
              options: [
                { label: "Split (text + image)", value: "split" },
                { label: "Centered (no image)", value: "centered" },
              ],
              onChange: function (value) {
                setAttributes({ layout: value });
              },
            }),

            layout === "split"
              ? el(SelectControl, {
                  label: "Image position",
                  value: mediaPosition,
                  options: [
                    { label: "Right", value: "right" },
                    { label: "Left", value: "left" },
                  ],
                  onChange: function (value) {
                    setAttributes({ mediaPosition: value });
                  },
                })
              : null,

            el(ToggleControl, {
              label: "Show client logos row",
              checked: !!attrs.showClients,
              onChange: function (val) {
                setAttributes({ showClients: !!val });
              },
            })
          ),

          // Colour overrides panel (optional)
                 ),


        // Styles tab: shared colour overrides (heading + buttons)
        el(
          InspectorControls,
          { key: "styles", group: "styles" },
          (function () {
            var HB = (window.HaydenBlocks && window.HaydenBlocks.shared) ? window.HaydenBlocks.shared : null;
            if (!HB) return null;

            var panels = [];

            // Heading colour
            panels.push(
              HB.colorPanelSingle(el, PanelColorSettings, __, {
                title: __("Heading colour", "hayden-blocks"),
                label: __("Heading text", "hayden-blocks"),
                value: attrs.headingColor,
                attrKey: "headingColor",
                setAttributes: setAttributes
              })
            );

            // Button colours (2 buttons)
            panels.push(
              HB.colorPanelButtons(el, PanelColorSettings, __, {
                title: __("Button colours", "hayden-blocks"),
                setAttributes: setAttributes,
                buttons: [
                  {
                    bgKey: "button1BgColor",
                    textKey: "button1TextColor",
                    bgLabel: __("Button 1 background", "hayden-blocks"),
                    textLabel: __("Button 1 text", "hayden-blocks"),
                    valueBg: attrs.button1BgColor,
                    valueText: attrs.button1TextColor
                  },
                  {
                    bgKey: "button2BgColor",
                    textKey: "button2TextColor",
                    bgLabel: __("Button 2 background", "hayden-blocks"),
                    textLabel: __("Button 2 text", "hayden-blocks"),
                    valueBg: attrs.button2BgColor,
                    valueText: attrs.button2TextColor
                  }
                ]
              })
            );

            // Filter nulls
            panels = panels.filter(function (p) { return !!p; });
            return panels;
          })()
        ),

        // Block markup
        el(
          "section",
          Object.assign({ key: "hero" }, blockProps),
          el(
            "div",
            { className: "hb-hero__inner" },

            el(
              "div",
              { className: "hb-hero__content" },

              el(RichText, {
                tagName: "h1",
                className: "hb-hero__heading",
                value: attrs.heading,
                placeholder: "Add heading…",
                onChange: function (value) {
                  setAttributes({ heading: value });
                },
                allowedFormats: [],
              }),

              el(RichText, {
                tagName: "p",
                className: "hb-hero__text",
                value: attrs.text,
                placeholder: "Add supporting text…",
                onChange: function (value) {
                  setAttributes({ text: value });
                },
              }),

              el(
                "div",
                { className: "hb-hero__buttons" },

                hasBtn1Label
                  ? el(
                      "div",
                      { className: "hb-hero__button" },
                      el(RichText, {
                        tagName: "span",
                        value: attrs.button1Label,
                        placeholder: "Button 1 label…",
                        onChange: function (value) {
                          setAttributes({ button1Label: value });
                        },
                        allowedFormats: [],
                      }),
                      el(URLInputButton, {
                        url: attrs.button1Url,
                        onChange: function (url) {
                          setAttributes({ button1Url: url });
                        },
                      })
                    )
                  : el(
                      "div",
                      { className: "hb-hero__button" },
                      el(RichText, {
                        tagName: "span",
                        value: attrs.button1Label,
                        placeholder: "Button 1 label… (leave empty to hide)",
                        onChange: function (value) {
                          setAttributes({ button1Label: value });
                        },
                        allowedFormats: [],
                      })
                    ),

                hasBtn2Label
                  ? el(
                      "div",
                      { className: "hb-hero__button" },
                      el(RichText, {
                        tagName: "span",
                        value: attrs.button2Label,
                        placeholder: "Button 2 label…",
                        onChange: function (value) {
                          setAttributes({ button2Label: value });
                        },
                        allowedFormats: [],
                      }),
                      el(URLInputButton, {
                        url: attrs.button2Url,
                        onChange: function (url) {
                          setAttributes({ button2Url: url });
                        },
                      })
                    )
                  : el(
                      "div",
                      { className: "hb-hero__button" },
                      el(RichText, {
                        tagName: "span",
                        value: attrs.button2Label,
                        placeholder: "Button 2 label… (leave empty to hide)",
                        onChange: function (value) {
                          setAttributes({ button2Label: value });
                        },
                        allowedFormats: [],
                      })
                    )
              )
            ),

            layout === "split"
              ? el(
                  "div",
                  { className: "hb-hero__media" },
                  attrs.mediaUrl
                    ? el(
                        "div",
                        { className: "hb-hero__media-wrap" },
                        el("img", {
                          src: attrs.mediaUrl,
                          alt: attrs.mediaAlt || "",
                        }),
                        el(
                          Button,
                          { isSecondary: true, onClick: onRemoveImage },
                          "Remove image"
                        )
                      )
                    : el(
                        MediaUploadCheck,
                        null,
                        el(MediaUpload, {
                          onSelect: onSelectImage,
                          allowedTypes: ["image"],
                          value: attrs.mediaId,
                          render: function (obj) {
                            return el(
                              Button,
                              { onClick: obj.open, isPrimary: true },
                              "Choose image"
                            );
                          },
                        })
                      )
                )
              : null
          ),

          attrs.showClients
            ? el(
                "div",
                { className: "hb-hero__clients" },
                el(RichText, {
                  tagName: "p",
                  className: "hb-hero__clients-label",
                  value: attrs.clientsLabel,
                  placeholder: "Clients label…",
                  onChange: function (value) {
                    setAttributes({ clientsLabel: value });
                  },
                  allowedFormats: [],
                }),
                el(InnerBlocks, {
                  allowedBlocks: ["core/image"],
                  template: CLIENTS_TEMPLATE,
                  templateLock: false,
                })
              )
            : null
        ),
      ];
    },

    save: function (props) {
      var attrs = props.attributes;
      var layout = attrs.layout || "split";
      var mediaPosition = attrs.mediaPosition || "right";

      var wrapperClass =
        "hb-hero hb-hero--" +
        layout +
        (layout === "split" ? " hb-hero--media-" + mediaPosition : "");

      var overrideStyle = {
        "--hb-heading-color": attrs.headingColor || undefined,
        "--hb-btn1-bg": attrs.button1BgColor || undefined,
        "--hb-btn1-text": attrs.button1TextColor || undefined,
        "--hb-btn2-bg": attrs.button2BgColor || undefined,
        "--hb-btn2-text": attrs.button2TextColor || undefined,
      };

      // ✅ Ensures Styles panel output (classes + inline styles) on frontend too
      var blockProps = blockEditor.useBlockProps.save({
        className: wrapperClass,
        style: overrideStyle,
      });

      var hasBtn1 =
        !!(attrs.button1Label && attrs.button1Label.trim()) &&
        !!(attrs.button1Url && attrs.button1Url.trim());

      var hasBtn2 =
        !!(attrs.button2Label && attrs.button2Label.trim()) &&
        !!(attrs.button2Url && attrs.button2Url.trim());

      return el(
        "section",
        blockProps,
        el(
          "div",
          { className: "hb-hero__inner" },
          el(
            "div",
            { className: "hb-hero__content" },
            el(RichText.Content, {
              tagName: "h1",
              className: "hb-hero__heading",
              value: attrs.heading,
            }),
            el(RichText.Content, {
              tagName: "p",
              className: "hb-hero__text",
              value: attrs.text,
            }),
            el(
              "div",
              { className: "hb-hero__buttons" },
              hasBtn1
                ? el(
                    "a",
                    {
                      className: "hb-hero__btn hb-hero__btn--primary",
                      href: attrs.button1Url,
                    },
                    attrs.button1Label
                  )
                : null,
              hasBtn2
                ? el(
                    "a",
                    {
                      className: "hb-hero__btn hb-hero__btn--secondary",
                      href: attrs.button2Url,
                    },
                    attrs.button2Label
                  )
                : null
            )
          ),
          layout === "split" && attrs.mediaUrl
            ? el(
                "div",
                { className: "hb-hero__media" },
                el(
                  "div",
                  { className: "hb-hero__media-wrap" },
                  el("img", { src: attrs.mediaUrl, alt: attrs.mediaAlt || "" })
                )
              )
            : null
        ),
        attrs.showClients
          ? el(
              "div",
              { className: "hb-hero__clients" },
              el(RichText.Content, {
                tagName: "p",
                className: "hb-hero__clients-label",
                value: attrs.clientsLabel,
              }),
              el(InnerBlocks.Content, null)
            )
          : null
      );
    },
  });
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
