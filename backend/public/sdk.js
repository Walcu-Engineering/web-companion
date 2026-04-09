(function(window) {
  const HelloSDK = {
    init() {
      return "HelloSDK incializado"
    },

    saludar(name) {
      return "Holaaaa " + name;
    }
  };

  window.HelloSDK = HelloSDK;
})(window);
