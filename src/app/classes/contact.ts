
export class Contact {

	constructor(public peerId: string, public email: string, public username: string) {

	}

	getJson(): ApiModel.IContactRequest {
		return {
			peerId: this.peerId
		}
	}
}
