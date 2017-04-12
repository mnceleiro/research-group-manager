// var localStorageMock = (function() {
//   var store = {}
//   return {
//     getItem: function(key) {
//       return store[key]
//     },
//     setItem: function(key, value) {
//       store[key] = value.toString()
//     },
//     clear: function() {
//       store = {}
//     }
//   }
// })()
// Object.defineProperty(window, "localStorage", { value: localStorageMock })

class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key]
  }

  setItem(key, value) {
    this.store[key] = value.toString()
  }
}

global.localStorage = new LocalStorageMock
