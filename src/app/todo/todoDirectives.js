const todoEscape = ['todoEscape', () => {
  const ESCAPE_KEY = 27;

  return function (scope, elem, attrs) {
    elem.bind('keydown', event => {
      if (event.keyCode === ESCAPE_KEY) {
        scope.$apply(attrs.todoEscape);
      }
    });

    scope.$on('$destroy', () => {
      elem.unbind('keydown');
    });
  };
}]

/*@ngInject*/
const todoFocus = ['todoFocus', ($timeout) => {

  return function (scope, elem, attrs) {
    scope.$watch(attrs.todoFocus, newVal => {
      if (newVal) {
        $timeout(() => {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
}];

export {todoEscape, todoFocus};
