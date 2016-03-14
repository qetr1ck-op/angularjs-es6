/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
class TodoList {
	/*@ngInject*/
	constructor($scope, $routeParams, store) {
		this.$scope = $scope;
		this.$routeParams = $routeParams;
		this.store = store;

		this.todos = this.store.todos;

		this.newTodo = '';
		this.editedTodo = null;

		this.$scope.$watch(() => this.todos, function () {
			this.remainingCount = this.todos.filter(todo => !todo.completed).length;
			this.completedCount = this.todos.length - this.remainingCount;
			this.allChecked = !this.remainingCount;
		}.bind(this), true);

		// Monitor the current route for changes and adjust the filter accordingly.
		this.$scope.$on('$routeChangeSuccess', () => {
			const status = this.status = this.$routeParams.status || '';

			this.statusFilter = (status === 'active') ?	{completed: false}
				: (status === 'completed') ? {completed: true} : {};
		});
	}

	addTodo() {
		const newTodo = {
			title: this.newTodo.trim(),
			completed: false
		};

		if (!newTodo.title) {
			return;
		}

		this.saving = true;
		this.store.insert(newTodo)
			.then(() => {
				this.newTodo = '';
			})
			.finally(() => {
				this.saving = false;
			});
	}

	editTodo(todo) {
		this.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		this.originalTodo = angular.extend({}, todo);
	}

	saveEdits(todo, event, index) {
		// Blur events are automatically triggered after the form submit event.
		// This does some unfortunate logic handling to prevent saving twice.
		if (event === 'blur' && this.saveEvent === 'submit') {
			this.saveEvent = null;
			return;
		}

		this.saveEvent = event;

		if (this.reverted) {
			// Todo edits were reverted-- don't save.
			this.reverted = null;
			return;
		}

		todo.title = todo.title.trim();

		if (todo.title === this.originalTodo.title) {
			this.editedTodo = null;
			return;
		}

		this.store[todo.title ? 'put' : 'delete'](todo, index)
			.then(() => {
			}, () => {
				todo.title = this.originalTodo.title;
			})
			.finally(() => {
				this.editedTodo = null;
			});
	}

	revertEdits(todo) {
		this.todos[this.todos.indexOf(todo)] = this.originalTodo;
		this.editedTodo = null;
		this.originalTodo = null;
		this.reverted = true;
	}

	removeTodo(todo) {
		this.store.delete(todo).then(_ => {
			this.todos = this.store.todos;
		});
	}

	saveTodo(todo) {
		this.store.put(todo);
	}

	toggleCompleted(todo, completed) {
		if (angular.isDefined(completed)) {
			todo.completed = completed;
		}
		this.store.put(todo, this.todos.indexOf(todo))
			.then(() => {
			}, () => {
				todo.completed = !todo.completed;
			});
	}

	clearCompletedTodos() {
		this.store.clearCompleted();
	}

	markAll(completed) {
		this.todos.forEach(todo => {
			if (todo.completed !== completed) {
				this.toggleCompleted(todo, completed);
			}
		});
	}
}
angular.module('todo-app')
	.controller('TodoList', TodoList);

function TodoCtrlFactory($scope, $routeParams, $filter, store) {

	var todos = $scope.todos = store.todos;

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function () {
		$scope.remainingCount = $filter('filter')(todos, {completed: false}).length;
		$scope.completedCount = todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
	}, true);

	// Monitor the current route for changes and adjust the filter accordingly.
	$scope.$on('$routeChangeSuccess', function () {
		var status = $scope.status = $routeParams.status || '';
		$scope.statusFilter = (status === 'active') ?
		{completed: false} : (status === 'completed') ?
		{completed: true} : {};
	});

	$scope.addTodo = function () {
		var newTodo = {
			title: $scope.newTodo.trim(),
			completed: false
		};

		if (!newTodo.title) {
			return;
		}

		$scope.saving = true;
		store.insert(newTodo)
			.then(function success() {
				$scope.newTodo = '';
			})
			.finally(function () {
				$scope.saving = false;
			});
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

	$scope.saveEdits = function (todo, event) {
		// Blur events are automatically triggered after the form submit event.
		// This does some unfortunate logic handling to prevent saving twice.
		if (event === 'blur' && $scope.saveEvent === 'submit') {
			$scope.saveEvent = null;
			return;
		}

		$scope.saveEvent = event;

		if ($scope.reverted) {
			// Todo edits were reverted-- don't save.
			$scope.reverted = null;
			return;
		}

		todo.title = todo.title.trim();

		if (todo.title === $scope.originalTodo.title) {
			$scope.editedTodo = null;
			return;
		}

		store[todo.title ? 'put' : 'delete'](todo)
			.then(function success() {
			}, function error() {
				todo.title = $scope.originalTodo.title;
			})
			.finally(function () {
				$scope.editedTodo = null;
			});
	};

	$scope.revertEdits = function (todo) {
		todos[todos.indexOf(todo)] = $scope.originalTodo;
		$scope.editedTodo = null;
		$scope.originalTodo = null;
		$scope.reverted = true;
	};

	$scope.removeTodo = function (todo) {
		store.delete(todo).then(_ => {
			$scope.todos = store.todos;
		});
	};

	$scope.saveTodo = function (todo) {
		store.put(todo);
	};

	$scope.toggleCompleted = function (todo, completed) {
		if (angular.isDefined(completed)) {
			todo.completed = completed;
		}
		store.put(todo, todos.indexOf(todo))
			.then(function success() {
			}, function error() {
				todo.completed = !todo.completed;
			});
	};

	$scope.clearCompletedTodos = function () {
		store.clearCompleted();
	};

	$scope.markAll = function (completed) {
		todos.forEach(function (todo) {
			if (todo.completed !== completed) {
				$scope.toggleCompleted(todo, completed);
			}
		});
	};
}
