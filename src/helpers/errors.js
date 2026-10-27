export const toRejectValue = error => ({
  status: error.response?.status ?? null,
  message: error.response?.data?.message ?? error.message,
});
