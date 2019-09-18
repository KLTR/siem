import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Contact } from '@app/classes/contact/contact';
import { ExternalContact } from '@app/classes/external-contact/external-contact';
import { ApiService } from '@app/services/api/api.service';
import { SocketService } from '@app/services/socket/socket.service';
import { ErrorService } from '@app/services/error/error.service';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

interface IContactsService {
	loadContacts(): any;
	saveContact(contact: ContactModel.IContact): any;
	deleteContact(contact: Contact): void;
	removeContact(peerId: string): void;
	removePending(peerId: string): ContactModel.IContact;
	pendingConfirmed(peerId: string): void;
	deletePending(contact: ContactModel.IContact): void;
	removeRequest(reqId: string): void;
	denyRequest(contactRequest: ContactModel.IContactRequest): void;
	deleteRequest(contactRequest: ContactModel.IContactRequest): void
	addExternal(externalContact: ContactModel.IExternalContact): void;
	removeExternal(nonPeerId: string): void;
	deleteExternal(externalContact: ExternalContact): void;
	resetExternalPassword(externalContact: ExternalContact): void;
	updateExternal(externalContact: ExternalContact): void;
	searchContact(property: Observable<string>): Observable<Contact[]>;
}

@Injectable({
	providedIn: 'root'
})
export class ContactsService implements IContactsService {
	private readonly _contacts = new BehaviorSubject<Contact[]>([]);
	readonly contacts$ = this._contacts.asObservable();

	private readonly _pendings = new BehaviorSubject<ContactModel.IContact[]>([]);
	readonly pendings$ = this._pendings.asObservable();

	private readonly _externals = new BehaviorSubject<ExternalContact[]>([]);
	readonly externals$ = this._externals.asObservable();

	private readonly _requests = new BehaviorSubject<ContactModel.IContactRequest[]>([]);
	readonly requests$ = this._requests.asObservable();

	constructor(private apiService: ApiService, private socketService: SocketService, private errorService: ErrorService) {
		this.initialize();
		this.startListen();
	}

	get contacts(): Contact[] {
		return this._contacts.getValue();
	}
	get pendings(): ContactModel.IContact[] {
		return this._pendings.getValue();
	}
	get externals(): ExternalContact[] {
		return this._externals.getValue();
	}
	get requests(): ContactModel.IContactRequest[] {
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
				this._requests.next([...this.requests, res.eventData.whitelistRequest]);
			}
		});
		/* the event is on when other side confirmed my request */
		this.socketService.socket.on('whitelist_added').subscribe((event: any) => {
			if (event.JWR && event.JWR.hasOwnProperty('id')) {
				this.pendingConfirmed(event.JWR.id);
			}
		});
		/* the event is on when an exists contact deleting me */
		this.socketService.socket.on('whitelist_removed').subscribe((event: any) => {
			if (event.JWR && event.JWR.hasOwnProperty('removePeer')) {
				this.removeContact(event.JWR.removePeer.id);
			}
		});
		/* the event is on when other side denied my request */
		this.socketService.socket.on('pending_removed').subscribe((event: any) => {
			if (event.JWR && event.JWR.hasOwnProperty('id')) {
				this.removePending(event.JWR.id);
			}
		});
		/* the event is on when user who send me a contact request cancel his request */
		this.socketService.socket.on('whitelistRequest_removed').subscribe((event: any) => {
			if (event.JWR && event.JWR.hasOwnProperty('id')) {
				this.removeRequest(event.JWR.id);
			}
		});
	}
	loadContacts() {
		this.apiService.loadContacts().subscribe(res => {
			const contactsData = res.getBody();
			this._contacts.next([...this.contacts, ...contactsData.contacts.map((contact: ContactModel.IContact) => new Contact(contact.id, contact.email, contact.username))]);
			this._pendings.next([...this.pendings, ...contactsData.pendingContacts]);
			this._externals.next([...this.externals, ...contactsData.externalContacts]);
			this._requests.next([...this.requests, ...contactsData.contactRequests]);
		}, err => {
			this.errorService.logError(err)
		});
	}
	pendingConfirmed(peerId: string): void {
		const pendingContact = this.removePending(peerId);
		if (pendingContact) {
			this._contacts.next([...this.contacts, new Contact(pendingContact.id, pendingContact.email, pendingContact.username)]);
		}
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
	removeExternal(id: string): void {
		this._externals.next(this.externals.filter(external => external.id != id));
	}
	/*saveContact will either send or confirm a contact request.
	* expects: either the selected peer from searchPeer function results or the IContactRequest.from after confirm request.
	* when done, this function will either add to pending or to contact*/
	saveContact(contact: ContactModel.IContact, contactReqId?: string) {
		this.apiService.contactRequest({
			peerId: contact.id
		}).subscribe((res) => {
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
			this.errorService.logError(err)
		});
	}
	deleteContact(contact: Contact): void {
		this.apiService.deleteContact({
			removePeer: contact
		}).subscribe(() => {
			this.removeContact(contact.id);
		}, (err) => {
			this.errorService.logError(err)
		});
	}
	denyRequest(contactRequest: ContactModel.IContactRequest): void {
		this.apiService.denyContactRequest({
			ownerId: contactRequest.from.id
		}).subscribe(() => {
			this.removeRequest(contactRequest.id);
		}, (err) => {
			this.errorService.logError(err)
		});
	}
	deletePending(contact: ContactModel.IContact): void {
		this.apiService.deletePending({
			removePeer: contact
		}).subscribe(() => {
			this.removePending(contact.id);
		}, (err) => {
			this.errorService.logError(err)
		});
	}
	deleteRequest(contactRequest: ContactModel.IContactRequest): void {
		this.apiService.deleteContactRequest({
			whitelistId: contactRequest.id
		}).subscribe(() => {
			this.removeRequest(contactRequest.id);
		}, (err) => {
			this.errorService.logError(err)
		});
	}
	addExternal(externalContact: ContactModel.IExternalContact) {
		this.apiService.addExternal({
			nonPeer: externalContact
		}).subscribe((res) => {
			const body = res.getBody();
			this._externals.next([...this.externals, new ExternalContact(body.id, body.email, body.need2FA, body.s3)]);
		}, (err) => {
			this.errorService.logError(err)
		});
	}
	deleteExternal(externalContact: ExternalContact) {
		this.apiService.deleteExternal({
			removePeer: externalContact
		}).subscribe(() => {
			this.removeExternal(externalContact.id);
		}, (err) => {
			this.errorService.logError(err)
		});
	}
	resetExternalPassword(externalContact: ExternalContact) {
		this.apiService.resetExternalPassword(externalContact).subscribe({
			error: (err) => {
				this.errorService.logError(err)
			}
		});
	}
	updateExternal(externalContact: ExternalContact) {
		this.apiService.updateExternal({
			peer: externalContact
		}).subscribe({
			error: (err) => {
				this.errorService.logError(err)
			}
		});
	}
	searchContact(property: Observable<string>): Observable<Contact[]> {
		return property.pipe(
			distinctUntilChanged(),
			switchMap(property => {
				if (property) {
					const regEx = new RegExp(property.toLowerCase());
					const results = this.contacts.filter(contact => regEx.test(contact.email) || regEx.test(contact.username.toLowerCase()));
					return of(results);
				} else {
					return of([]);
				}
			})
		);
	}
}
