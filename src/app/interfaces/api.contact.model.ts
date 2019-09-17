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
	export interface ICreateExternal {
		email: string;
		need2FA: boolean;
		s3: boolean;
		phone?: string;
		countryCode?: ContactModel.ICountryCode;
	}
	export interface IExternal extends ICreateExternal {
		id: string;
	}
	export interface IAddExternal {
		nonPeer: ICreateExternal
	}
	export interface IDeleteExternal {
		removePeer: IExternal
	}
	export interface IUpdateExternal {
		peer: IExternal
	}
}
