/*
*	Interfaces for Contacts APIs
*/
namespace ApiModel {
	export interface IContactRequest {
		peerId: string
	}
	export interface IDenyContactRequest {
		ownerId: string
	}
	export interface IDeleteContact {
		removePeer: ContactModel.IContact
	}
	export interface IDeleteContactRequest {
		whitelistId: string
	}
	// TODO: need to modify contact apis below to accept the same parameters
	export interface IAddExternal {
		nonPeer: {
			email: string;
			need2FA: boolean;
			s3: boolean;
			phone?: string;
			countryCode?: ContactModel.ICountryCode;
		}
	}
	export interface IDeleteExternal {
		removePeer: {
			id: string;
			email: string;
			need2FA: boolean;
			s3: boolean;
			phone?: string;
			countryCode?: ContactModel.ICountryCode;
		}
	}
	export interface IResetExternalPassowrd {
		id: string;
		email: string;
		need2FA: boolean;
		s3: boolean;
		phone?: string;
		countryCode?: ContactModel.ICountryCode;
	}
	export interface IUpdateExternal {
		peer: {
			id: string;
			email: string;
			need2FA: boolean;
			s3: boolean;
			phone?: string;
			countryCode?: ContactModel.ICountryCode;
		}
	}
}
