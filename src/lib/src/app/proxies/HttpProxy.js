import axios from 'axios';


const throwErrorWithCodeAndMsg = ({ code, message }) => {
  const error = new Error(message);

  error.code = code;

  throw error;
};
const getErrorCodeAndMsg = (errors) => ({
  code: (Array.isArray(errors) && errors[0] && errors[0].code) ||
    'UNKNOWN_ERROR',
  message: (Array.isArray(errors) && errors[0] && errors[0].message) ||
    'Something went wrong while making HTTP requests.',
});
const extractErrorListFromResponse = (error) => (
  error.response && error.response.data ? error.response.data.errors : error
);
const handleError = (error) => {
  if (Array.isArray(global.currentErrorStack)) {
    global.currentErrorStack.unshift(error);
  } else {
    global.currentErrorStack = [error];
  }

  return throwErrorWithCodeAndMsg(getErrorCodeAndMsg(extractErrorListFromResponse(error)));
};

class HttpClient {

  static createInstance(instanceConfig) {
    const axiosInstance = axios.create({
      baseURL: global.__DEV__ ? 'http://127.0.0.1:8087/api/v0' : 'https://circlus-backend.herokuapp.com/api/v0',
      withCredentials: true,
      timeout: 5000,
      ...instanceConfig,
    });

    axiosInstance.interceptors.request.use((config) => {
      const reqHeader = {
        Accept: 'application/json',
      };

      return {
        ...config,
        headers: {
          ...config.headers,
          ...reqHeader,
        },
      };
    }, null);

    axiosInstance.interceptors.response.use(null, (error) => Promise.reject(handleError(error)));

    return axiosInstance;
  }

}

export { HttpClient as default };
