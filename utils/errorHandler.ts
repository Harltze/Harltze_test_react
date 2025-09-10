// export const errorHandler = (error: any) => {
//     if(error.error) {
//         return error.error;
//     } else if(error.result) {
//         return error.result
//     } if(typeof(error) == "string") {
//         return error;
//     } else {
//         return "Something went wrong... Kindly try again later.";
//     }
// }

export const errorHandler = (error: any, customMessage?: string) => {
  if (import.meta.env.VITE_ENVIROMENT != "production") {
    console.log(error);
  }

  if (error?.response?.data?.message) {
    return error?.response?.data?.message;
  } else if (error?.error) {
    return error?.error;
  } else if (error?.response?.data?.errorMessage) {
    return error?.response?.data?.errorMessage;
  } else if (error?.response?.data?.result?.message) {
    return error?.response?.data?.result?.message;
  } else if (customMessage) {
    return customMessage;
  } else {
    return "An error occurred";
  }
};

export const log = (...args: any[]) => {
  if (
    import.meta.env.VITE_ENVIROMENT == "development" ||
    !import.meta.env.VITE_ENVIROMENT
  ) {
    console.log(args);
  }
};
