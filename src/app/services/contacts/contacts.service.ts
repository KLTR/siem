import { Injectable } from '@angular/core';
import { Contact } from '@app/classes/contact';
import { ApiService } from '@app/services/api/api.service';
import { SailsResponse } from 'ngx-sails-socketio';


interface IContactsService {

	createNewContact(peerId: string, email?: string, username?: string): Contact;
	saveContact(contact: Contact): any;
	loadContacts(): any;
	searchPeer(property: string): Promise<any>
}

@Injectable({
	providedIn: 'root'
})
export class ContactsService implements IContactsService {
	myContact: Contact[] = [];
	externalContact: ContactModel.IExternalContact[] = [];
	contactRequests: ContactModel.IContactRequest[] = [];

	constructor(private apiService: ApiService) {

		this.initialize();
	}

	async initialize() {
		await this.loadContacts();
	}
	createNewContact(peerId: string, email: string, username: string, pending?: boolean): Contact {
		let contact = new Contact(peerId, email, username, pending);
		return contact;
	}
	async loadContacts(): Promise<void> {
		this.apiService.loadContacts().subscribe((res: SailsResponse) => {
			const contactsData = res.getBody();
			for (let mContact of contactsData.myContact) {
				this.myContact.push(this.createNewContact(mContact.id, mContact.email, mContact.username))
			}
			for (let pending of contactsData.pendingContact) {
				this.myContact.push(this.createNewContact(pending.id, pending.email, pending.username, true))
			}
			this.externalContact = contactsData.externalContact;
			this.contactRequests = contactsData.contactRequests;
		}, (err) => {
			console.log('err', err)
			// this.errorService.logError(err)
		});
	}

	async searchPeer(property: string): Promise<any> {
		return this.apiService.searchPeer({
			property
		}).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			console.log('search results: ', body)
			return body;
		}, (err) => {
			console.log('search err', err)
			// this.errorService.logError(err)
		});
	}

	saveContact(contact: Contact) {

		let postBody: ApiModel.IContactRequest = contact.getJson();
		this.apiService.contactRequest(postBody).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			console.log('body', body)
		}, (err) => {
			console.log('err', err)
			// this.errorService.logError(err)
		});
	}
}
