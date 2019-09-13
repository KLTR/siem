
export class Contact {

	constructor(public peerId: string, public email: string, public username: string, public pending: boolean = false) {

	}

	getJson(): ApiModel.IContactRequest {
		return {
			peerId: this.peerId
		}
	}
}
