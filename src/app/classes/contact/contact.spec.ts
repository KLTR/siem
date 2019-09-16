import { Contact } from './contact';

describe('Contact', () => {
  it('should create an instance', () => {
    expect(new Contact('123456', 'eran@copa.io', 'eranCopa')).toBeTruthy();
  });
});
