import data from "../db/db.json"

export const PromiseMock = (request) => {
  return new Promise((resolve) => {
    setTimeout(function() {
      var currentObject = data.find(x => { return request.url.endsWith(x.url) })
      resolve(new ResponseMock(JSON.stringify(currentObject.data)))

    }, 250)
  })
}

export class ResponseMock {
  constructor(response) {
    this.response = response
  }
  json() {
    let response = this.response
    return new Promise((resolve) => {
      setTimeout(function() {
        resolve(JSON.parse(response))
      }, 250)
    })
  }
}
