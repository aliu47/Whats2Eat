var app = angular.module("myApp", ["ui.router", "ui.bootstrap", "firebase"]);
var phonecatApp = angular.module('recipesList', []);

//Services function as global functions *kinda
//if you need a global function add a service
app.factory('myService', function () {
  return {
    initFirebase: function () {
      // Firebase configuration *Move this
      var config = {
        apiKey: "AIzaSyDt2mdynnzknmPIy0Nd5lJ7sC4y-HD2Jbo",
        authDomain: "whats2eat-fdec9.firebaseapp.com",
        databaseURL: "https://whats2eat-fdec9.firebaseio.com",
        projectId: "whats2eat-fdec9",
        storageBucket: "whats2eat-fdec9.appspot.com",
        messagingSenderId: "255141114478"
      };
      firebase.initializeApp(config);
    },
    userList: function () {
    },
    checkUser: function () {
      if (firebase.auth().currentUser != null)
        return firebase.auth().currentUser;
    },
  };
});
app.factory('recipeService', function($firebaseArray){
  var recipes;
  return {
    getRecipes: getRecipes,
 
    initRecipeList: function () {
      recipes = $firebaseArray(firebase.database().ref("/recipes").limitToFirst(40));
      return recipes;
    },   
    
  };
  function getRecipes(){
    return recipes;
  }
})
//Remove #! from the url
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('');
}]);
//Routing for the website
app.config(function ($stateProvider) {
  //Create a state for the website to go to.  
  var indexState = {
    name: 'index', //name for accessing this state
    url: '/ITCS4155/',//how the url will look
    templateUrl: 'ITCS4155/html/home.html' //location of file
  }
  var listState = {
    name: 'list',
    url: 'list',
    templateUrl: 'ITCS4155/html/list.html'
  }
  var profileState = {
    name: 'profile',
    url: '/profile',
    templateUrl: 'ITCS4155/html/profile.html',
  }
  var catalogState = {
    name: 'catalog',
    url: '/catalog',
    templateUrl: 'ITCS4155/html/home.html'
  }
  var recommendState = {
    name: 'recommend',
    url: '/recommend',
    templateUrl: 'ITCS4155/html/recommend.html'
  }
  var favoriteState = {
    name: 'favorites',
    url: '/favorites',
    templateUrl: 'ITCS4155/html/favorites.html'
  }
  var loginState = {
    name: 'login',
    url: '/login',
    templateUrl: 'ITCS4155/html/login.html'
  }
  var recipeState = {
    name: 'recipe',
    url: '/recipe/:id',
    templateUrl: 'ITCS4155/html/recipe.html',
    controller: function ($stateParams, $scope) {
      $scope.id = $stateParams.id;
    },
  }
  //Allow the website to access the state.
  $stateProvider.state(indexState);
  $stateProvider.state(listState);
  $stateProvider.state(profileState);
  $stateProvider.state(catalogState);
  $stateProvider.state(recommendState);
  $stateProvider.state(favoriteState);
  $stateProvider.state(loginState);
  $stateProvider.state(recipeState);
});

//Index Controller
app.controller('initCtrl', function ($scope, myService, $state, $firebaseArray, $window,recipeService) {
  myService.initFirebase();
  $scope.user = myService.checkUser();
  $scope.recipesList = recipeService.initRecipeList();
  console.log($scope.recipesList);

});
//Home Controller
app.controller('homeCtrl', function ($scope, $state, myService) {
  $scope.user = myService.checkUser();
  $scope.recipesList;
});
//Recipe Controller
app.controller('recipeCtrl', function ($scope, $state, myService, $firebaseArray,recipeService) {
  $scope.user = myService.checkUser();
  $scope.recipesList = recipeService.getRecipes();
  console.log($scope.recipesList);

  $scope.favorited = function () {
    console.log("Add to favorites");
  };

  $scope.completed = function () {
    console.log("Add to completed");
  }
});

//List Controller
app.controller('listCtrl', function ($scope, $state, myService, $firebaseArray) {
  $scope.user = myService.checkUser();
  var list;
  if ($scope.user != null) {
    list = firebase.database().ref("/list/" + $scope.user.uid);
  } else {
    list = firebase.database().ref("/list/0");
  }
  $scope.userList = $firebaseArray(list);
  $scope.add = function () {
    console.log($scope.userList.$add($scope.ingredient));
    $scope.ingredient.name = null;
  }
  $scope.remove = function (ingredient) {
    var remove = ingredient;
    $scope.userList.$remove(remove);
  }
  $scope.removeAll = function () {
    $scope.userList.$remove();
  }
});
//Recomendation Controller
app.controller('recommendCtrl', function ($scope, $state, myService, $firebaseArray,recipeService) {
  $scope.user = myService.checkUser();
  $scope.recipesList = recipeService.getRecipes();
  var list = firebase.database().ref("/list/0");
  var userList = $firebaseArray(list);
});

//Login Controller
app.controller('loginCtrl', function ($scope, $state, myService) {
  $scope.user = myService.checkUser();
  //Firebase Login
  $scope.login = function ($scope) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user.providerData[0];
      $state.reload('profile');
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  $scope.loggedIn = function ($scope) {
    firebase.auth().currentUser;
    return firebase.auth().currentUser;
  }
  $scope.logout = function ($scope) {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      $state.reload('profile');
    }).catch(function (error) {
      // An error happened.
    });
  }
}); 
