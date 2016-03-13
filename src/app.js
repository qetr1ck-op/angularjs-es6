angular.module('todo-app', ['ngRoute'])
	.config(function ($routeProvider) {

		const routeConfig = {
			controller: 'TodoList',
			controllerAs: 'TodoList',
			templateUrl: 'src/todo/todoView.html',
			resolve: {
				store: todoStorage => {
					// Get the localStorage module
					return todoStorage.getStorage().then(module => {
						module.get(); // Fetch the in memory persistent todos.
						return module;
					});
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)//todo:?
			.otherwise({
				redirectTo: '/'
			});
	});
