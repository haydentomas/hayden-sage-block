(function (win) {
  // Global namespace
  win.HaydenBlocks = win.HaydenBlocks || {};
  var HB = win.HaydenBlocks;

  /**
   * Shared helpers for Hayden Blocks editor UIs.
   * Designed for wp_register_script deps: wp-element, wp-block-editor, wp-components, wp-i18n.
   */
  HB.shared = HB.shared || {};

  HB.shared.pick = function (val, fallback) {
    return (val === undefined || val === null || val === '') ? fallback : val;
  };

  /**
   * Build a PanelColorSettings element for a single colour setting.
   * @param {Function} el createElement
   * @param {Object} PanelColorSettings component
   * @param {Function} __ i18n function
   * @param {Object} opts { title, label, value, attrKey, setAttributes }
   */
  HB.shared.colorPanelSingle = function (el, PanelColorSettings, __, opts) {
    if (!PanelColorSettings) return null;
    return el(PanelColorSettings, {
      title: opts.title,
      initialOpen: false,
      colorSettings: [
        {
          value: opts.value,
          onChange: function (color) {
            var obj = {};
            obj[opts.attrKey] = color || '';
            opts.setAttributes(obj);
          },
          label: opts.label
        }
      ]
    });
  };

  /**
   * Build a PanelColorSettings element for button colour settings.
   * Supports 1+ buttons by passing an array of button configs.
   * Each button config: { title, bgKey, textKey, bgLabel, textLabel, valueBg, valueText }
   */
  HB.shared.colorPanelButtons = function (el, PanelColorSettings, __, opts) {
    if (!PanelColorSettings) return null;

    var colorSettings = [];
    (opts.buttons || []).forEach(function (b) {
      colorSettings.push({
        value: b.valueBg,
        onChange: function (color) {
          var obj = {};
          obj[b.bgKey] = color || '';
          opts.setAttributes(obj);
        },
        label: b.bgLabel
      });
      colorSettings.push({
        value: b.valueText,
        onChange: function (color) {
          var obj = {};
          obj[b.textKey] = color || '';
          opts.setAttributes(obj);
        },
        label: b.textLabel
      });
    });

    return el(PanelColorSettings, {
      title: opts.title,
      initialOpen: false,
      colorSettings: colorSettings
    });
  };

  /**
   * Standard CSS var mapping for 2-button patterns used across blocks.
   * Uses your existing token names:
   *  --hb-heading-color, --hb-btn1-bg, --hb-btn1-text, --hb-btn2-bg, --hb-btn2-text
   */
  HB.shared.buildTwoButtonVars = function (attrs) {
    return {
      '--hb-heading-color': attrs.headingColor || undefined,
      '--hb-btn1-bg': attrs.button1BgColor || undefined,
      '--hb-btn1-text': attrs.button1TextColor || undefined,
      '--hb-btn2-bg': attrs.button2BgColor || undefined,
      '--hb-btn2-text': attrs.button2TextColor || undefined
    };
  };

})(window);
