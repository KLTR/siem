import { Injectable } from '@angular/core';
import { Contact } from '@app/classes/contact';
import { ApiService } from '@app/services/api/api.service';
import { SailsResponse } from 'ngx-sails-socketio';


interface IContactsService {

	createNewContact(peerId: string, email?: string): Contact;
	saveContact(contact: Contact): any;
	loadContacts(): any;
}

@Injectable({
	providedIn: 'root'
})
export class ContactsService implements IContactsService {

	constructor(private apiService: ApiService) {

	}

	createNewContact(peerId: string, email: string): Contact {
		let contact = new Contact(peerId, email);
		return contact;
	}

	saveContact(contact: Contact) {
		
		let postBody : ApiModel.IContactRequest = contact.getJson();
		this.apiService.contactRequest(postBody).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			console.log('body', body)
		}, (err) => {
			console.log('err', err)
			// this.errorService.logError(err)
		});
	}

	loadContacts() { }


}
