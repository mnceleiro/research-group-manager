export default class LocalStorageMock {
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
    // console.log(this.store[key])
  }
}

// global.localStorage = new LocalStorageMock

// localStorage.setItem("current_user", '{"userId":1,"email":"mnceleiro@esei.uvigo.es","firstName":"Marcos","lastName":"Nunez Celeiro","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibW5jZWxlaXJvQGVzZWkudXZpZ28uZXMiLCJnZW5lcmF0ZWQiOjE0OTI1MDcwNTc4NzF9.tIP1bv_0g1q8gXH9IMf34mtEEsdbpiB5DxYfEMLm8i8"}') // eslint-disable-line
