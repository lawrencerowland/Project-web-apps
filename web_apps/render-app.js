(function(){
  window.renderApp = function(componentName){
    var rootEl = document.getElementById('root');
    if(!rootEl){
      console.error('Root element not found');
      return;
    }
    var Component = window[componentName];
    if(typeof Component !== 'function'){
      console.error('Component', componentName, 'is not available');
      return;
    }
    var root = ReactDOM.createRoot(rootEl);
    root.render(React.createElement(Component));
  };
})();
