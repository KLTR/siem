
export class Contact {

	constructor(public peerId: string, public email: string) {

	}

	getJson(): ApiModel.IContactRequest {
		return {
			peerId: this.peerId
		}
	}
}
