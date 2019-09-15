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
	removePending(peerId: string): ContactModel.IContact;
	pendingConfirmed(peerId: string): void;
	removeRequest(reqId: string): void;
	removeContact(peerId: string): void;
	denyRequest(contactRequest: ContactModel.IContactRequest): void;

}

@Injectable({
	providedIn: 'root'
})
export class ContactsService implements IContactsService {
	private readonly _contacts = new BehaviorSubject<Contact[]>([]);
	readonly contacts$ = this._contacts.asObservable();

	private readonly _pendings = new BehaviorSubject<ContactModel.IContact[]>([]);
	readonly pendings$ = this._pendings.asObservable();

	private readonly _externals = new BehaviorSubject<ContactModel.IContact[]>([]);
	readonly externals$ = this._externals.asObservable();

	private readonly _requests = new BehaviorSubject<ContactModel.IContactRequest[]>([]);
	readonly requests$ = this._requests.asObservable();

	constructor(private apiService: ApiService, private socketService: SocketService) {
		this.initialize();
		this.startListen();
	}

	get contacts(): Contact[]{
		return this._contacts.getValue();
	}
	get pendings(): ContactModel.IContact[]{
		return this._pendings.getValue();
	}
	get externals(): ContactModel.IContact[]{
		return this._externals.getValue();
	}
	get requests(): ContactModel.IContactRequest[]{
		return this._requests.getValue();
	}
	initialize() {
		this.loadContacts();
	}
	startListen() {
		/* the event is on when a new request is coming */
		this.socketService.socket.on('peer').subscribe(event => {
			const res: any = event.getData();
			if (res.eventName === 'newWhitelistRequest' && res.hasOwnProperty('eventData')) {
				console.log('newWhitelistRequest event ....');
				console.log(res.eventData)
				this._requests.next([...this.requests, res.eventData.whitelistRequest]);
			}
		});
		/* the event is on when other side confirmed my request */
		this.socketService.socket.on('whitelist_added').subscribe((event: any) => {
			console.log('whitelist_added event ....');
			this.pendingConfirmed(event.JWR.id);
		});
		/* the event is on when an exists contact deleting me */
		this.socketService.socket.on('whitelist_removed').subscribe((event: any) => {
			if (event.JWR && event.JWR.hasOwnProperty('removePeer')) {
				this.removeContact(event.JWR.removePeer.id);
			}
		});
		/* the event is on when other side denied my request */
		this.socketService.socket.on('pending_removed').subscribe((event: any) => {
			console.log('pending_removed::::', event)
			if (event.JWR && event.JWR.hasOwnProperty('id')) {
			    this.removePending(event.JWR.id);
			}
		});
		/* the event is on when user who send me a contact request cancel his request */
		this.socketService.socket.on('whitelistRequest_removed').subscribe((event: any) => {
			console.log('whitelistRequest_removed::::', event)
			if (event.JWR && event.JWR.hasOwnProperty('id')) {
			    this.removeRequest(event.JWR.id);
			}
		});
	}

	pendingConfirmed(peerId: string): void {
		const pendingContact = this.removePending(peerId);
		if (!pendingContact) {
			return console.log('contact is not existing...');
		}
		this._contacts.next([...this.contacts, this.createNewContact(pendingContact.id, pendingContact.email, pendingContact.username)]);
	}
	removePending(id: string): ContactModel.IContact {
		let pendingContact: ContactModel.IContact;

		this._pendings.next(this.pendings.filter(pending => {
			if (pending.id != id) {
				return true;
			}
			pendingContact = pending;
			return false;
		}));
		return pendingContact;
	}
	removeRequest(id: string): void {
		this._requests.next(this.requests.filter(req => req.id != id));
	}
	removeContact(id: string): void {
		this._contacts.next(this.contacts.filter(contact => contact.id != id));
	}
	createNewContact(peerId: string, email: string, username: string): Contact {
		let contact = new Contact(peerId, email, username);
		return contact;
	}
	loadContacts() {
		this.apiService.loadContacts().subscribe((res: SailsResponse) => {
			const contactsData = res.getBody();
			let createdContacts: Contact[] = [];
			for (let mContact of contactsData.contacts) {
				createdContacts.push(this.createNewContact(mContact.id, mContact.email, mContact.username));
			}
			this._contacts.next([...this.contacts, ...createdContacts]);
			this._pendings.next([...this.pendings, ...contactsData.pendingContacts]);
			this._externals.next([...this.externals, ...contactsData.externalContacts]);
			this._requests.next([...this.requests, ...contactsData.contactRequests]);
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
				this._pendings.next([...this.pendings, contact]);
				if (contactReqId) {
					this.removeRequest(contactReqId);
				}
				if (!body.pending) {
					this.pendingConfirmed(contact.id);
				}
			}
		}, (err) => {
			console.log('err', err)
			// this.errorService.logError(err)
		});
	}
	deleteContact(contact: Contact): void {
		const postBody = {
			removePeer: contact
		}
		this.apiService.deleteContact(postBody).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			this.removeContact(contact.id);
		}, (err) => {
			console.log('err', err);
			// this.errorService.logError(err)
		});
	}
	denyRequest(contactRequest: ContactModel.IContactRequest): void {
		const postBody = {
			ownerId: contactRequest.from.id
		}
		this.apiService.denyContactRequest(postBody).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			this.removeRequest(contactRequest.id);
		}, (err) => {
			console.log('err', err);
			// this.errorService.logError(err)
		});
	}
	deletePending(contact: ContactModel.IContact): void {
		const postBody = {
			removePeer: contact
		}
		this.apiService.deletePending(postBody).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			this.removePending(contact.id);
		}, (err) => {
			console.log('err', err);
			// this.errorService.logError(err)
		});
	}
	deleteRequest(contactRequest: ContactModel.IContactRequest): void {
		const postBody = {
			whitelistId: contactRequest.id
		}
		this.apiService.deleteContactRequest(postBody).subscribe((res: SailsResponse) => {
			const body = res.getBody();
			this.removeRequest(contactRequest.id);
		}, (err) => {
			console.log('err', err);
			// this.errorService.logError(err)
		});
	}
}
