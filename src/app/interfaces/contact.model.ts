namespace ContactModel {
	export interface IContact {
		id: string;
		email: string;
		username?: string;
		pending?: boolean;
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
}
