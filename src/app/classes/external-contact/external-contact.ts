import { Contact } from '@app/classes/contact/contact';

export class ExternalContact extends Contact{
    constructor(public id: string, public email: string, public need2FA: boolean, public s3: boolean, public username?: string, public phone?: string, public countryCode?: ContactModel.ICountryCode) {
        super(id, email, username);
	}
    // set s3(uploadToServer: boolean) {
    //     this.s3 =  uploadToServer;
    // }

}
