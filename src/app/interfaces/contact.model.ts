namespace ContactModel {
	export interface IExternalContact {
	  id: string;
	  email: string;
	  need2FA: boolean;
	  s3: boolean;
	}
	export interface IContactRequest {
	  id: string;
	  email: string;
	  need2FA: boolean;
	  s3: boolean;
	  createdAt: Date;
	  from: string;
	  fromIsExist: boolean;//need check this attribute logic
	  seen: boolean;
	  to: string;
	  updatedAt: Date;
	}
}
