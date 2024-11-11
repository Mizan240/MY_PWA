// Define the AngularJS application module
var app = angular.module('myApp', []);

// Define the controller
app.controller('MainController', function($scope) {
  // Initialize an array of items
  $scope.items = ['Item List'];

  // Function to add a new item
  $scope.addItem = function() {
    if ($scope.newItem) {
      $scope.items.push($scope.newItem);
      $scope.newItem = ''; // Clear the input field after adding the item
    }
  };
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js').then(registration => {
  	console.log('ServiceWorker registration successful with scope: ', registration.scope);
	}, err => {
  	console.log('ServiceWorker registration failed: ', err);
	});
  });
}