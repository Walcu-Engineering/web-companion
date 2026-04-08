(function (window) {
  const HelloSDK = {
    init() {
      console.log('HelloSDK iniciado');
    },

    saludar(name) {
      console.log(name);
      return name;
    }
  };

  window.HelloSDK = HelloSDK;
})(window);
