export function checkHttpStatus(status) {
  if (status >= 200 && status <= 299) {
    return {
      id: 'http-status',
      name: 'HTTP Status',
      status: 'Passed',
      message: `HTTP status code ${status} is successful.`
    };
  }

  if (status >= 300 && status <= 399) {
    return {
      id: 'http-status',
      name: 'HTTP Status',
      status: 'Warning',
      message: `HTTP status code ${status} is a redirect.`
    };
  }

  if (status >= 400 && status <= 599) {
    return {
      id: 'http-status',
      name: 'HTTP Status',
      status: 'Failed',
      message: `HTTP status code ${status} indicates an error.`
    };
  }

  return {
    id: 'http-status',
    name: 'HTTP Status',
    status: 'Failed',
    message: `HTTP status code ${status} is not recognized.`
  };
}
