var app = angular.module("myApp", ["ui.router","ui.bootstrap"]);

//Remove #! from the url
app.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('');
}]);

//Routing for the website
        app.config(function($stateProvider) {
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
              templateUrl:'ITCS4155/html/profile.html'
            }
            var catelogState = {
                name: 'catelog',
                url: '/catelog',
                templateUrl:'ITCS4155/html/home.html'
              }
              var recommendState = {
                name: 'recommend',
                url: '/recommend',
                templateUrl:'ITCS4155/html/recommend.html'
              }
              var favoriteState = {
                name: 'favorites',
                url: '/favorites',
                templateUrl:'ITCS4155/html/favorites.html'
              }
            //Allow the website to access the state.
            $stateProvider.state(indexState);
            $stateProvider.state(listState);
            $stateProvider.state(profileState);
            $stateProvider.state(catelogState);
            $stateProvider.state(recommendState);
            $stateProvider.state(favoriteState);
});

