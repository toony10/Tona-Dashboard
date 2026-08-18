export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  tags?: string[];
  revalidate?: number;
  cache?: RequestCache;
}

export interface ApiResponse<TData = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: TData;
  errors?: string[];
}

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
