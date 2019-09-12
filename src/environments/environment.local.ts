export const environment = {
  production: false,
  webSocketUrl: 'http://localhost:1337',
  errorSeparator: '```',
  passwordCheck: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
};
