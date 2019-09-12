export const environment = {
  production: true,
  webSocketUrl: 'https://backend.copa.io',
  errorSeparator: '```',
  passwordCheck: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
};
