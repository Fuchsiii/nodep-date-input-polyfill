import './nodep-date-input-polyfill.scss';
import Picker from './picker.js';
import Input from './input.js';

// Run the above code on any <input type="date"> in the document, also on dynamically created ones.
// Check if type="date" is supported.
if(!Input.supportsDateInput()) {
  const init = ()=> {
    //console.log("nodep-date-input init");
    Picker.instance = new Picker();
    Input.addPickerToDateInputs();

    // Create the event.
    var event = document.createEvent('Event');
    // Define that the event name is 'build'.
    event.initEvent('nodep-date-input-init', true, true);
    // target can be any Element or other EventTarget.
    document.dispatchEvent(event);

    // This is also on mousedown event so it will capture new inputs that might
    // be added to the DOM dynamically.
    //document.querySelector(`body`).addEventListener(`mousedown`, ()=> {
    //  Input.addPickerToDateInputs();
    //});

    //setInterval(function(){
    //  console.log("nodep-date-input interval")
    //  Input.addPickerToDateInputs();
    //}, 500);

    // Listen for the event.
    document.addEventListener('nodep-date-input-onajax', function (e) {
      // e.target matches elem
      Input.addPickerToDateInputs();
      //console.log("nodep-date-input-onajax");

      // Create the event.
      var event = document.createEvent('Event');
      // Define that the event name is 'build'.
      event.initEvent('nodep-date-input-onajax-sucess', true, true);
      // target can be any Element or other EventTarget.
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
