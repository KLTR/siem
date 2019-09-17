import { Component, OnInit, OnDestroy } from '@angular/core';

import { ContactsService } from '@app/services/contacts/contacts.service';
import { ApiService } from '@app/services/api/api.service';
import { Contact } from '@app/classes/contact/contact';
import { ExternalContact } from '@app/classes/external-contact/external-contact';

@Component({
	selector: 'app-contacts',
	templateUrl: './contacts.component.html',
	styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
	contacts: Contact[];
	pendings: ContactModel.IContact[];
	externals: ExternalContact[];
	requests: ContactModel.IContactRequest[];

	constructor(private contactService: ContactsService, private apiService: ApiService) {
		contactService.contacts$.subscribe(contacts => {
			console.log('in contact component: contact subject: ', contacts);
            this.contacts = contacts;
		});
		contactService.pendings$.subscribe(pendings => {
			 console.log('in contact component: pendingsSubject: ', pendings);
            this.pendings = pendings;
		});
		contactService.externals$.subscribe(externals => {
			console.log('in contact component: externalsSubject: ', externals);
			this.externals = externals;
		});
		contactService.requests$.subscribe(requests => {
			this.requests = requests;
			console.log('in contact component: requestsSubject: ', requests);
		});
	}
	ngOnInit() {}
	ngOnDestroy() {}
	/*search users in DB that match the property value by email/username\sessionKey.
	*! I just set the base here, need to complete.*/
	searchPeer(property: string) {
		if (property) {
			this.apiService.searchPeer({ property }).subscribe(res => {
				const searchData = res.getBody();
				console.log(searchData)
			}, (err) => {
				console.log('err', err)
				// this.errorService.logError(err)
			});
		}
	}
	add() {
		this.contactService.saveContact({
			email: "user-b@copa.io",
			id: "5d6ceb40845f8028dc9dc9cf",
			username: "user-b",
		});
	}
	addExternal() {
		this.contactService.addExternal({
			email: "copamedialtd@gmail.com",
			need2FA: false,
			s3: true
		});
	}
	confirm() {
		this.contactService.saveContact({
			email: this.requests[0].from.email,
			id: this.requests[0].from.id,
			username: this.requests[0].from.username,
		}, this.requests[0].id);
	}
    deny() {
		this.contactService.denyRequest(this.requests[0]);
	}
    delete() {
		this.contactService.deleteContact(this.contacts[0]);
	}
	deleteExternal() {
		this.contactService.deleteExternal(this.externals[0]);
	}
    deletePending() {
		this.contactService.deletePending(this.pendings[0]);
	}
    deleteRequest() {
		this.contactService.deleteRequest(this.requests[0]);
	}
	resetExternalPassword() {
		this.contactService.resetExternalPassword(this.externals[0]);
	}
	updateExternal() {
		this.contactService.updateExternal(this.externals[0]);
	}
}
