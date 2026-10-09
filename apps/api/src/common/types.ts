export type WriteLogInfoType = {
  url: string,
  method: string,
  statusCode: number,
  duration: number
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type TSessionTokens = {
  access_token: string;
  refresh_token: string;
}
