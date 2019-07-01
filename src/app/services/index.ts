import { SailsInterceptorService } from './interceptors/sails-interceptor.service';
export * from './api/api.service';
// The order in which they appear is also important
export const INTERCEPTORS = [
  SailsInterceptorService
];
