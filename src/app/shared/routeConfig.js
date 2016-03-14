import todoView from "../todo/todoView.html"

export default function routeConfig($routeProvider) {
    const routeConfig = {
        controller: 'TodoList',
        controllerAs: 'TodoList',
        template: todoView,
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
        .when('/:status', routeConfig) // statuses
        .otherwise({
            redirectTo: '/'
        });
}