const createError = (status: number, message: string) => {
    return {
      status,
      message,
    };
  };
  
  export default createError;
  