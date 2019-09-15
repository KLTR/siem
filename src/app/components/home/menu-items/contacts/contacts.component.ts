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
		});
		contactService.requests$.subscribe(requests => {
			this.requests = requests;
			console.log('in contact component: requestsSubject: ', requests);
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

	add() {
		this.contactService.saveContact({
			email: "eran@copa.io",
			id: "5d24debf149759c878f855a2",
			username: "eranCopa",
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
    deletePending() {
		this.contactService.deletePending(this.pendings[0]);
	}
    deleteRequest() {
		this.contactService.deleteRequest(this.requests[0]);
	}
}
