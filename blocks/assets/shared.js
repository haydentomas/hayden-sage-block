(function (win) {
  /**
   * ---------------------------------------------------------------------
   * Hayden Blocks – Shared Editor Helpers
   * ---------------------------------------------------------------------
   *
   * Small, opinionated helpers used across multiple blocks.
   * These are UI / editor-only utilities.
   *
   * Script deps:
   *  - wp-element
   *  - wp-block-editor
   *  - wp-components
   *  - wp-i18n
   */

  // ---------------------------------------------------------------------
  // Namespace bootstrap
  // ---------------------------------------------------------------------
  win.HaydenBlocks = win.HaydenBlocks || {};
  var HB = win.HaydenBlocks;

  HB.shared = HB.shared || {};

  // ---------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------

  /**
   * Safe picker: returns fallback if value is empty.
   */
  HB.shared.pick = function (val, fallback) {
    return (val === undefined || val === null || val === '')
      ? fallback
      : val;
  };

  // ---------------------------------------------------------------------
  // Colour Panels
  // ---------------------------------------------------------------------

  /**
   * Single colour control panel.
   *
   * opts:
   *  - title
   *  - label
   *  - value
   *  - attrKey
   *  - setAttributes
   */
  HB.shared.colorPanelSingle = function (el, PanelColorSettings, __, opts) {
    if (!PanelColorSettings || !opts) return null;

    return el(PanelColorSettings, {
      title: opts.title,
      initialOpen: false,
      colorSettings: [
        {
          label: opts.label,
          value: opts.value,
          onChange: function (color) {
            var update = {};
            update[opts.attrKey] = color || '';
            opts.setAttributes(update);
          }
        }
      ]
    });
  };

  /**
   * Multi-button colour panel.
   *
   * opts:
   *  - title
   *  - setAttributes
   *  - buttons[]:
   *      { bgKey, textKey, bgLabel, textLabel, valueBg, valueText }
   */
  HB.shared.colorPanelButtons = function (el, PanelColorSettings, __, opts) {
    if (!PanelColorSettings || !opts) return null;

    var colorSettings = [];

    (opts.buttons || []).forEach(function (btn) {
      // Background
      colorSettings.push({
        label: btn.bgLabel,
        value: btn.valueBg,
        onChange: function (color) {
          var update = {};
          update[btn.bgKey] = color || '';
          opts.setAttributes(update);
        }
      });

      // Text
      colorSettings.push({
        label: btn.textLabel,
        value: btn.valueText,
        onChange: function (color) {
          var update = {};
          update[btn.textKey] = color || '';
          opts.setAttributes(update);
        }
      });
    });

    return el(PanelColorSettings, {
      title: opts.title,
      initialOpen: false,
      colorSettings: colorSettings
    });
  };

  // ---------------------------------------------------------------------
  // Layout / Spacing
  // ---------------------------------------------------------------------

  /**
   * Standard "Inner spacing" layout panel.
   *
   * Contract:
   *  - attribute: innerSpacing
   *  - values: global | compact | default | spacious
   *  - applied via data-spacing on block wrapper
   */
  HB.shared.spacingPanel = function (
    el,
    PanelBody,
    RadioControl,
    __,
    opts
  ) {
    if (!opts) return null;

    return el(
      PanelBody,
      {
        title: __('Layout', 'hayden-blocks'),
        initialOpen: false
      },
      el(RadioControl, {
        label: __('Inner spacing', 'hayden-blocks'),
        help: __('Controls internal padding for this block.', 'hayden-blocks'),
        selected: opts.value || 'global',
        options: [
          { label: __('Use global', 'hayden-blocks'), value: 'global' },
          { label: __('Compact', 'hayden-blocks'), value: 'compact' },
          { label: __('Default', 'hayden-blocks'), value: 'default' },
          { label: __('Spacious', 'hayden-blocks'), value: 'spacious' }
        ],
        onChange: function (value) {
          var update = {};
          update[opts.attrKey] = value;
          opts.setAttributes(update);
        }
      })
    );
  };

  // ---------------------------------------------------------------------
  // Style helpers
  // ---------------------------------------------------------------------

  /**
   * Standard CSS variable mapping for 2-button patterns.
   *
   * Tokens:
   *  --hb-heading-color
   *  --hb-btn1-bg
   *  --hb-btn1-text
   *  --hb-btn2-bg
   *  --hb-btn2-text
   */
  HB.shared.buildTwoButtonVars = function (attrs) {
    if (!attrs) return {};

    return {
      '--hb-heading-color': attrs.headingColor || undefined,
      '--hb-btn1-bg': attrs.button1BgColor || undefined,
      '--hb-btn1-text': attrs.button1TextColor || undefined,
      '--hb-btn2-bg': attrs.button2BgColor || undefined,
      '--hb-btn2-text': attrs.button2TextColor || undefined
    };
  };

})(window);
