// This is loaded for the side-effect of getting the css file loading onto the page.
var css = require('./hello.css');

var currentState = function () {
  return {};
}
var helloWorld = function(el,opts) {
  el.innerHTML = '<h2>Hello World</h2><div class="logo"></div>';
  var img = document.createElement('img');
  img.src = require('./logo.png');
  el.appendChild(img);
  return currentState;
};

module.exports = helloWorld;
