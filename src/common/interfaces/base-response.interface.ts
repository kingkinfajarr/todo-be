export interface BaseResponse<T> {
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}
