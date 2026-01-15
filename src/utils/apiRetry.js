import axios from "axios";


const apiRetry = axios.create({
  baseURL: "https://flashcardsfunction.azurewebsites.net/",
  timeout: 30000,
});

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000;

apiRetry.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }

    if (config.retry === false) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    const shouldRetry =
      !error.response || error.response.status >= 500;

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;

    // console.warn(
    // `[API RETRY] ${config.method?.toUpperCase()} ${
    //     config.url
    // } – próba ${config.__retryCount}/${MAX_RETRIES}`
    // );

    await new Promise(resolve =>
      setTimeout(resolve, RETRY_DELAY)
    );

    return apiRetry(config);
  }
);

export default apiRetry;
