var http = require('http');

function Tester() {
  this.helloWorld = function () {
    console.log("Hello World");
  }
}

module.exports = Tester;