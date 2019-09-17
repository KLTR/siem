import { Contact } from '../contact/contact';

export class ExternalContact extends Contact{
    constructor(public id: string, public email: string, public need2FA: boolean, public s3: boolean, public username?: string, public phone?: string, public countryCode?: ContactModel.ICountryCode) {
        super(id, email, username);
	}
    update(external: ContactModel.IExternalContact) {
        this.need2FA = external.need2FA || this.need2FA;
        this.s3 = external.s3 || this.s3;
        this.phone = external.phone || this.phone;
        this.countryCode = external.countryCode || this.countryCode;
    }

}
