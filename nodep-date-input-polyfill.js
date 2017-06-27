import './nodep-date-input-polyfill.scss';
import Picker from './picker.js';
import Input from './input.js';

// Run the above code on any <input type="date"> in the document, also on dynamically created ones.
// Check if type="date" is supported.
if(!Input.supportsDateInput()) {
  const init = ()=> {
    Picker.instance = new Picker();
    Input.addPickerToDateInputs();

    var event = document.createEvent('Event');
    event.initEvent('nodep-date-input-init', true, true);
    document.dispatchEvent(event);

    // This is also on mousedown event so it will capture new inputs that might
    // be added to the DOM dynamically.
    //document.querySelector(`body`).addEventListener(`mousedown`, ()=> {
    //  Input.addPickerToDateInputs();
    //});

    document.addEventListener('nodep-date-input-onajax', function (e) {

      Input.addPickerToDateInputs();

      var event = document.createEvent('Event');
      event.initEvent('nodep-date-input-onajax-return', true, true);
      document.dispatchEvent(event);
    }, false);
    
    document.addEventListener('reset', function (e) {
      Picker.instance = undefined;
      Picker.instance = new Picker();
      Input.addPickerToDateInputs();
      
      var event = document.createEvent('Event');
      event.initEvent('nodep-date-input-init', true, true);
      document.dispatchEvent(event);
    }, false);
  };

  let DOMContentLoaded = false;

  document.addEventListener(`DOMContentLoaded`, ()=> {
    DOMContentLoaded = true;

    init();
  });

  window.addEventListener(`load`, ()=> {
    if(!DOMContentLoaded) {
      init();
    }
  });
}
