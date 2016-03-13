/**
 * Services that persists and retrieves todos from localStorage
 * returning promises for all changes to the model
 */

class TodoStorage {
	/*@ngInject*/
	constructor($q, $injector) {
		this.$injector = $injector;
		this.$q = $q;
	}

	getStorage() {
		return this.$q(resolve => {
			resolve(this.$injector.get('localStorage'))
		});
	}
}

class LocalStorage {
	/*@ngInject*/
	constructor($q) {
		this.$q = $q;
		this.STORAGE_ID = 'todos-angularjs';

		this.todos = [];
	}

	_getFromLocalStorage() {
		return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
	}

	_saveToLocalStorage(todos) {
		localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
	}

	get() {
		angular.copy(this._getFromLocalStorage(), this.todos);

		return this.$q(resolve => {
			resolve(this.todos);
		});
	}

	insert(todo) {
		this.todos.push(todo);
		this._saveToLocalStorage(this.todos);

		return this.$q(resolve => {
			resolve(this.todos);
		});
	}

	put(todo, index) {
		this.todos[index] = todo;
		this._saveToLocalStorage(this.todos);

		return this.$q(resolve => {
			resolve(this.todos);
		});
	}

	delete(todo, index) {
		this.todos = [...this.todos.slice(0, index), ...this.todos.slice(index + 1)];

		this._saveToLocalStorage(this.todos);
		return this.$q(resolve => {
			resolve(this.todos);
		});
	}

	clearCompleted() {
		const incompleteTodos = this.todos.filter(todo => !todo.completed);
		angular.copy(incompleteTodos, this.todos);
		this._saveToLocalStorage(this.todos);

		return this.$q(resolve => {
			resolve(this.todos);
		});
	}
}

angular.module('todo-app')
	// factory can't be classes
	.service('todoStorage', TodoStorage)
	.service('localStorage', LocalStorage);
