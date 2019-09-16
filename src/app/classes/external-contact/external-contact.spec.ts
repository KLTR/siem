import { ExternalContact } from './external-contact';

describe('ExternalContact', () => {
  it('should create an instance', () => {
    expect(new ExternalContact('2332421', 'a@a.com', false, true)).toBeTruthy();
  });
});
