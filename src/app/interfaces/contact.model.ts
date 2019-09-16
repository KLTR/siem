namespace ContactModel {
	export interface IContact {
		id: string;
		email: string;
		username?: string;
		need2FA?: boolean;
		s3?: boolean;
	}
	export interface IContactRequest {
		id: string;
		email: string;
		need2FA: boolean;
		s3: boolean;
		createdAt: Date;
		from: IContact;
		/*fromIsExist explanation:
		* when FALSE, this is a new contact request.
		* when TURE, this is a request confirmed notification.*/
		fromIsExist: boolean;
		seen: boolean;
		to: string;
		updatedAt: Date;
	}
	export interface IExternalContact {
		id?: string;
		email: string;
		need2FA: boolean;
		s3: boolean;
		phone?: string;
		countryCode?: ICountryCode;
	}
	export interface ICountryCode {
		id: string;
		code: string;
	}
}
