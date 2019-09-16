namespace ApiModel {
	interface Duration {
		days?: number;
		hours?: number;
		minutes?: number
	}
	interface File {
		checksum: string;
		size: number;
		archived: boolean;
		type: string;
		fileId: any;
		name: any;
		url: any;
	}
	export interface RequestP2P {
		property?: string;
		id: string;
		files: File[];
		isDirect: boolean;
		fromBusiness: boolean;
		fromPublicKey: string;
		from: string;
		isMirage: boolean;
		duration: Duration;
		inWhitelist: boolean;
		isPAYG: boolean;
		newVersion?: boolean;
		version?: string;
	}
	export interface EmailExist {
		property?: string;
		id?: string;
		username?: string;
		email?: string;
		isMirage: boolean;
		duration: Duration;
		inWhitelist: boolean;
		newVersion?: boolean;
	}
	export interface ConfirmP2P {
		approvalId: string;
		password?: string;
		key: string;
		ip: string;
		localIp: string;
		netmask?: string;
		port: string;
		toPortOpen: boolean;
		jwt: string;
		isDirect: boolean;
		toBusiness: boolean;
		toPublicKey: string;
		inWhiteList: boolean;
		autoDownload?: boolean;
		newVersion?: boolean;
		version?: string;
	}
	export interface IContactRequest {
		peerId: string
	}
	export interface ISearchPeer {
		property: string
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
	export interface IAddExternal {
		nonPeer: {
			email: string;
			need2FA: boolean;
			s3: boolean;
			phone?: string;
			countryCode?: ContactModel.ICountryCode;
		}
	}
}
