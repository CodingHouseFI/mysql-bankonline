var app = angular.module('bankOnline', [])
.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.customers = [];
  $scope.amount = 5;

  $http.get('/customers').then(
    function(response) {
      $scope.customers = response.data;
    },
    function(err) {
      console.error(error);
    });

  $scope.send = function() {
    console.log('send');
    $http.post('/tranfer', { params: [
      $scope.from,
      $scope.to,
      $scope.amount]}).then(
    function(response) {

    },
    function(err) {
      console.error(err);
    });
  };

}]);
