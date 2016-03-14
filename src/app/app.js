import angular from 'angular';
import ngRoute from 'angular-route';

import routeConfig from './shared/routeConfig';
import { TodoStorage, LocalStorage } from './todo/todoStorageService';
import TodoList from './todo/todoList';
import {todoEscape, todoFocus} from './todo/todoDirectives';

import '../style/app.css';

const MODULE_NAME = 'app';

angular.module('app', ['ngRoute'])
  .config(routeConfig)
  .service('todoStorage', TodoStorage)
  .service('localStorage', LocalStorage)
  .controller('TodoList', TodoList)
  .directive(...todoEscape)
  .directive(...todoFocus);

export default MODULE_NAME;