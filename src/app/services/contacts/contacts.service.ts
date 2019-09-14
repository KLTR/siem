import { Injectable } from '@angular/core';
import { Contact } from '@app/classes/contact';
import {
	ApiService,
	SocketService,
} from '@services';
import { SailsResponse } from 'ngx-sails-socketio';
import {
	Observable,
	BehaviorSubject
} from 'rxjs';


interface IContactsService {
	createNewContact(peerId: string, email?: string, username?: string): Contact;
	saveContact(contact: ContactModel.IContact): any;
	loadContacts(): any;
	removePendingContact(peerId: string): ContactModel.IContact;
	pendingConfirmed(peerId: string);
	removeContactRequest(reqId: string);
}

@Injectable({
	providedIn: 'root'
})
export class ContactsService implements IContactsService {
	contacts: Contact[] = [];
	contactsSubject: BehaviorSubject<Contact[]>;
	contactsSubject$: Observable<Contact[]>;

	pendingContacts: ContactModel.IContact[] = [];
	pendingsSubject: BehaviorSubject<ContactModel.IContact[]>;
	pendingsSubject$: Observable<ContactModel.IContact[]>;

	externalContacts: ContactModel.IContact[] = [];
	externalsSubject: BehaviorSubject<ContactModel.IContact[]>;
	externalsSubject$: Observable<ContactModel.IContact[]>;

	contactRequests: ContactModel.IContactRequest[] = [];
	requestsSubject: BehaviorSubject<ContactModel.IContactRequest[]>;
	requestsSubject$: Observable<ContactModel.IContactRequest[]>;

	constructor(private apiService: ApiService, private socketService: SocketService) {
		this.contactsSubject = new BehaviorSubject(null);
		this.contactsSubject$ = this.contactsSubject.asObservable();

		this.pendingsSubject = new BehaviorSubject(null);
		this.pendingsSubject$ = this.pendingsSubject.asObservable();

		this.externalsSubject = new BehaviorSubject(null);
		this.externalsSubject$ = this.externalsSubject.asObservable();

		this.requestsSubject = new BehaviorSubject(null);
		this.requestsSubject$ = this.requestsSubject.asObservable();

		this.initialize();
		this.startListen();
	}

	initialize() {
		this.loadContacts();
	}
	startListen() {
		this.socketService.socket.on('whitelist_added').subscribe((event: any) => {
			console.log('got whitelist_added event: ', event);
			this.pendingConfirmed(event.JWR.id);
		});
		this.socketService.socket.on('peer').subscribe(event => {
	      const res: any = event.getData();
	      if (res.eventName === 'newWhitelistRequest' && res.hasOwnProperty('eventData')) {
			  this.contactRequests.push(res.eventData.whitelistRequest);
			  this.requestsSubject.next(this.contactRequests);
	      }
	    });
	}
	pendingConfirmed(peerId: string) {
		const pendingContact = this.removePendingContact(peerId);
		if (!pendingContact) {
			return console.log('contact is not existing...');
		}
		const newContact = this.createNewContact(pendingContact.id, pendingContact.email, pendingContact.username);
		this.contacts.push(newContact);
		this.contactsSubject.next(this.contacts);
	}
	removePendingContact(id: string): ContactModel.IContact {
		let pendingContact: ContactModel.IContact;

		this.pendingContacts = this.pendingContacts.filter(pending => {
			if (pending.id != id) {
				return true;
			}
			pendingContact = pending;
			return false;
		});
		this.pendingsSubject.next(this.pendingContacts);
		return pendingContact;
	}
	removeContactRequest(id: string) {
		this.contactRequests = this.contactRequests.filter(req => req.id != id);
		this.requestsSubject.next(this.contactRequests);
	}
	createNewContact(peerId: string, email: string, username: string): Contact {
		let contact = new Contact(peerId, email, username);
		return contact;
	}
	loadContacts() {
		this.apiService.loadContacts().subscribe((res: SailsResponse) => {
			const contactsData = res.getBody();
			for (let mContact of contactsData.contacts) {
				this.contacts.push(this.createNewContact(mContact.id, mContact.email, mContact.username))
			}
			this.contactsSubject.next(this.contacts);
			this.pendingContacts = contactsData.pendingContacts;
			this.pendingsSubject.next(this.pendingContacts);

			this.externalContacts = contactsData.externalContacts;
			this.externalsSubject.next(this.externalContacts);

			this.contactRequests = contactsData.contactRequests;
			this.requestsSubject.next(this.contactRequests);

		}, (err) => {
			console.log('err', err)
			// this.errorService.logError(err)
		});
	}

	/*saveContact will either send or confirm a contact request.
	* expects: either the selected peer from searchPeer function results or the IContactRequest.from after confirm request.
	* when done, this function will either add to pending or to contact*/
	saveContact(contact: ContactModel.IContact, contactReqId?: string) {
		const postBody: ApiModel.IContactRequest = {
			peerId: contact.id
		};
		this.apiService.contactRequest(postBody).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			if (body.addedFlag) {
				this.pendingContacts.push(contact);
				if (contactReqId) {
					this.removeContactRequest(contactReqId);
				}
				if (body.pending) {
					this.pendingsSubject.next(this.pendingContacts);
				} else {
					this.pendingConfirmed(contact.id);
				}
			}
		}, (err) => {
			console.log('err', err)
			// this.errorService.logError(err)
		});
	}
}
