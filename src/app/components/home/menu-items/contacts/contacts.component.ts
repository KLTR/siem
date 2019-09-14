import { Component, OnInit, OnDestroy } from '@angular/core';

import { ContactsService } from '@app/services/contacts/contacts.service';
import { ApiService } from '@services';
import { SailsResponse } from 'ngx-sails-socketio';
import { Contact } from '@app/classes/contact';

@Component({
	selector: 'app-contacts',
	templateUrl: './contacts.component.html',
	styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
	contacts: Contact[];
	pendings: ContactModel.IContact[];
	externals: ContactModel.IContact[];
	requests: ContactModel.IContactRequest[];

	constructor(private contactService: ContactsService, private apiService: ApiService) {
		contactService.contactsSubject$.subscribe(contacts => {
			contacts && console.log('in contact component: contact subject: ', contacts);
		});
		contactService.pendingsSubject$.subscribe(pendings => {
			pendings && console.log('in contact component: pendingsSubject: ', pendings);
		});
		contactService.externalsSubject$.subscribe(externals => {
			externals && console.log('in contact component: externalsSubject: ', externals);
		});
		contactService.requestsSubject$.subscribe(requests => {
			this.requests = requests;
			requests && console.log('in contact component: requestsSubject: ', requests);
		});
	}

	ngOnInit() {
	}
	ngOnDestroy() {
		// unsibscribes...
	}
	/*search users in DB that match the property value by email/username\sessionKey.
	*! I just set the base here, need to complete.*/
	searchPeer(property: string) {
		if (property) {
			this.apiService.searchPeer({ property }).subscribe((res: SailsResponse) => {
				const searchData = res.getBody();
				console.log(searchData)
			}, (err) => {
				console.log('err', err)
				// this.errorService.logError(err)
			});
		}
	}

	add(contact: ContactModel.IContact) {
		this.contactService.saveContact({
			email: "danni@gmail.com",
			id: "5c8165b9e84c1d2218492fd6",
			username: "danniG",
		});
	}
	confirm(contactRequest: ContactModel.IContactRequest) {
		this.contactService.saveContact({
			email: "danni@gmail.com",
			id: "5c8165b9e84c1d2218492fd6",
			username: "danniG",
		}, this.requests[0].id);
	}

}
