const socket = io.connect('http://192.168.1.8:8080');

var blueValue = '000';
var greenValue = '000';
var redValue = '000';

var colorPicker = new iro.ColorPicker("#picker", {
  // Set the size of the color picker
  width: 350,
});

socket.on('voice', (message) => {
  colorPicker.color.rgb = message;
});

// listen to a color picker's color:change event
// color:change callbacks receive the current color
colorPicker.on('color:change', function (color) {
  redValue = ('000' + color.rgb.r).substr(-3);
  greenValue = ('000' + color.rgb.g).substr(-3);
  blueValue = ('000' + color.rgb.b).substr(-3);
  var rgdColor = redValue + greenValue + blueValue;
  socket.emit('message', rgdColor);
});