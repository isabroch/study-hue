const labelStorage = (() => {
  const localStorage = window.localStorage;

  return {
    save: function() {
      console.log("Saving to LocalStorage!");
    },
    load: function() {
      console.log("Loading from LocalStorage!");
    }
  };
})();

export { labelStorage };
