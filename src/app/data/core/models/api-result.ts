export type ApiError = {
  message: string;
};

export type ApiResult<T> = {
  data: T;
  error: ApiError;
};
