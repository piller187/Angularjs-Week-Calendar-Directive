# Angularjs-Week-Calendar-Directive
I couldn't really find a week selection calendar that I liked so for a project I created this one. Styles are in-line at the moment.

Usage:

Html:
```html
<!DOCTYPE html>
<html>

  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.20/angular.js"></script>
    <link rel="stylesheet" href="style.css" />
    <script src="HolWeekCalendar.js"></script>
  </head>

  <body ng-app="myApp" ng-controller="myController as vm">
    <h1>{{vm.selectedDate}}</h1>
    
    <hol-calendar returned-day="Monday" on-change="vm.dateChange(dt)"></hol-calendar>
    
    <h1>Hello!</h1>
  </body>

</html>
```

JS:
```javascript
var app = angular.module("myApp", []);

// test controller
app.controller("myController", function() {
  var vm = this;

  vm.selectedDate = "";

  vm.dateChange = function(dt) {
    vm.selectedDate = dt;
    console.log("Date Model: " + vm.selectedDate);
  }
});
```
