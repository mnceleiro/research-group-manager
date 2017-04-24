import { PromiseMock } from "../__mocks__/PromiseMock"

const ENV_LOCAL = "local"
const ENV_DEVELOP = "development"
const ENV_TEST = "test"
const ENV_PRODUCTION = "production"

// const API_DEV_URL = "http://localhost:9000/"
// const API_PROD_URL = "http://localhost:9000/"

if (process.env.NODE_ENV === ENV_LOCAL || process.env.NODE_ENV === ENV_TEST) { // eslint-disable-line
  global.window.fetch = PromiseMock

} else if (process.env.NODE_ENV === ENV_DEVELOP) { // eslint-disable-line
  // globalConfig.baseURL = API_DEV_URL

} else if (process.env.NODE_ENV === ENV_PRODUCTION) { // eslint-disable-line
  // globalConfig.baseURL = API_PROD_URL
}

// export default globalConfig
