export type AuthLogin = {
  access_token: string;
  refresh_token: string;
  expires: string;
  __typename: string;
};

export type LoginData = {
  email: string;
  password: string;
};
