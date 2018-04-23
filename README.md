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
    <script src="script.js"></script>
  </head>

  <body ng-app="myApp" ng-controller="myController as vm">
    <h1>{{vm.selectedDate}}</h1>
    <button ng-click="vm.updateTest()">Update Test</button>
    
    <hol-calendar returned-day="Monday" on-change="vm.dateChange(dt)" initial-date="vm.myDate"></hol-calendar>
    
    <h1>Hello!</h1>
  </body>

</html>
```

JS:
```javascript
var app = angular.module("myApp", []);

app.service("GetData", function($q){
  this.GetStartingDate = function(){
    return $q.when(new Date(2018, 0, 5));
  }
});

// test controller
app.controller("myController", function(GetData) {
  var vm = this;

  vm.selectedDate = "";

  // testing date
  GetData.GetStartingDate()
    .then(function(data){
      vm.myDate = data;
    });

  vm.dateChange = function(dt) {
    vm.selectedDate = dt;
    console.log("Date Model: " + vm.selectedDate);
  }
  
  vm.updateTest = function(){
    vm.myDate = new Date(2018, 10, 4);
  }
});
});
```
