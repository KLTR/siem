
export class Contact {

	constructor(public id: string, public email: string, public username?: string) {

	}

	getJson(): ApiModel.IContactRequest {
		return {
			peerId: this.id
		}
	}
}
