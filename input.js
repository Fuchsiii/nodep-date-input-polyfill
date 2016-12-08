import Picker from './picker.js';
import locales from './locales.js';

export default class Input {
  constructor(input) {
    this.element = input;
    this.element.setAttribute(`data-has-picker`, ``);

    let langEl = this.element,
        lang = ``;

    while(langEl.parentNode) {
      lang = langEl.getAttribute(`lang`);

      if(lang) {
        break;
      }

      langEl = langEl.parentNode;
    }

    this.locale = lang || `en`;

    this.localeText = this.getLocaleText();

    Object.defineProperties(
      this.element,
      {
        'value': {
          get: ()=> this.element.polyfillValue,
          set: val=> {
            if(!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
              this.element.polyfillValue = ``;
              return false;
            }

            this.element.polyfillValue = val;

            const YMD = val.split(`-`);

            /*this.element.setAttribute(
              `value`,
              this.localeText.format
                .replace(`Y`, YMD[0])
                .replace(`M`, YMD[1])
                .replace(`D`, YMD[2])
            );*/
            this.element.setAttribute(
              `value`, YMD[0] + "-" + YMD[1] + "-" + YMD[2]
            );
          }
        },
        'setData': {
          get: ()=> this.element.polyfillValue,
          set: val=> {
            if(!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
              this.element.polyfillValue = ``;
              return false;
            }

            this.element.polyfillValue = val;

            const YMD = val.split(`-`);

            this.element.setAttribute(
              `data-has-picker`,
              this.localeText.format
                .replace(`Y`, YMD[0])
                .replace(`M`, YMD[1])
                .replace(`D`, YMD[2])
            );

            var event = document.createEvent('Event');
            event.initEvent('nodep-date-input-update', true, true);
            this.element.dispatchEvent(event);
          }
        },
        'valueAsDate': {
          get: ()=> {
            if(!this.element.polyfillValue) {
              return null;
            }

            return new Date(this.element.polyfillValue);
          },
          set: val=> {
            this.element.value = val.toISOString().slice(0,10);
          }
        },
        'valueAsNumber': {
          get: ()=> {
            if(!this.element.value) {
              return NaN;
            }

            return this.element.valueAsDate.getTime();
          },
          set: val=> {
            this.element.valueAsDate = new Date(val);
          }
        }
      }
    );

    // Initialize value for display.
    this.element.value = this.element.getAttribute(`value`);
    //this.element.setAttribute(`data-has-picker`, this.element.polyfillValue);
    this.element.setData = this.element.value;

    // Create the event.
    var event = document.createEvent('Event');
    // Define that the event name is 'build'.
    event.initEvent('nodep-date-input-update', true, true);
    // target can be any Element or other EventTarget.
    this.element.dispatchEvent(event);

    // Open the picker when the input get focus,
    // also on various click events to capture it in all corner cases.
    const showPicker = ()=> {
      Picker.instance.attachTo(this);
    };
    this.element.addEventListener(`focus`, showPicker);
    this.element.addEventListener(`mousedown`, showPicker);
    this.element.addEventListener(`mouseup`, showPicker);

    // Update the picker if the date changed manually in the input.
    this.element.addEventListener(`keydown`, e=> {
      const date = new Date();

      switch(e.keyCode) {
        case 27:
          Picker.instance.hide();
          break;
        case 38:
          if(this.element.valueAsDate) {
            date.setDate(this.element.valueAsDate.getDate() + 1);
            this.element.valueAsDate = date;
            Picker.instance.pingInput();
          }
          break;
        case 40:
          if(this.element.valueAsDate) {
            date.setDate(this.element.valueAsDate.getDate() - 1);
            this.element.valueAsDate = date;
            Picker.instance.pingInput();
          }
          break;
        default:
          break;
      }

      Picker.instance.sync();
    });
  }

  getLocaleText() {
    const locale = this.locale.toLowerCase();

    for(const localeSet in locales) {
      const localeList = localeSet.split(`_`);
      localeList.map(el=>el.toLowerCase());

      if(
        !!~localeList.indexOf(locale)
        || !!~localeList.indexOf(locale.substr(0,2))
      ) {
        return locales[localeSet];
      }
    }
  }

  // Return false if the browser does not support input[type="date"].
  static supportsDateInput() {
    // improved feature detection
    var support;
    const input = document.createElement('input');

    try {
      input.type = "date";

      if (input.type === "date") {
        support = true;
      } else {
        support = false
      }
    } catch (e){
      support = false;
    }

    return ((document.currentScript && !document.currentScript.hasAttribute(`data-nodep-date-input-polyfill-debug`)) && (support));
  }

  // Will add the Picker to all inputs in the page.
  static addPickerToDateInputs() {
    // Get and loop all the input[type="date"]s in the page that do not have `[data-has-picker]` yet.
    const dateInputs = document.querySelectorAll(`input[type="date"]:not([data-has-picker])`);
    const length = dateInputs.length;

    if(!length) {
      return false;
    }

    for(let i = 0; i < length; ++i) {
      new Input(dateInputs[i]);
    }
  }
}
