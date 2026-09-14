export function checkHttps(url) {
  if (url.startsWith("https://")) {
    return {
      id: "https",
      name: "HTTPS",
      status: "Passed",
      message: "Website is using HTTPS",
    };
  } else {
    return {
      id: "https",
      name: "HTTPS",
      status: "Failed",
      message: "Website is not using HTTPS",
    };
  }
}
