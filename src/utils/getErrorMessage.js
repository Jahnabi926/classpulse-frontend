export const getErrorMessage = (err) => {
  if (err.response) {
    return typeof err.response.data === "string"
      ? err.response.data
      : "Something went wrong. Please try again.";
  }
  if (err.request) return "Network error — please check your connection.";
  return "Something went wrong. Please try again.";
};
