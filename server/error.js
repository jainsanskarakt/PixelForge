// eslint-disable-next-line import/prefer-default-export
export const createError = (status, message, data = null) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    err.data = data;
    return err;
  };