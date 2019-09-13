import { Injectable } from '@angular/core';
import { Contact } from '@app/classes/contact';
import {
	ApiService,
	SocketService,
} from '@services';
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

	constructor(private apiService: ApiService, private socketService: SocketService) {

		this.initialize();
	}

	async initialize() {
		await this.loadContacts();
		this.startListen();
		console.log('socketService: ', this.socketService)
	}
	startListen() {
		console.log('startlisten events...')
		this.socketService.socket.on('whitelist_added').subscribe((event: any) => {
	      console.log('got contact event: ', event);
		  const contact = this.getContact(event.JWR.id);
		  if(!contact) {
			  return console.log('contact is not existing...');
		  }
		  contact.confirmed();
		  console.log('this\n', this)
	    });
	}
	getContact(id: string): Contact {
		const contact = (this.myContact.filter(contact => contact.peerId == id)).pop();
		return contact;
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
			console.log('Contacts service: \n', this)
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
