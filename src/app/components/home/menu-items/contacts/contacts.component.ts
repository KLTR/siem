import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import { ContactsService } from '@app/services/contacts/contacts.service';
import { SearchService } from '@app/services/search/search.service';
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
	searchResults: Object[];
	searchContactResults: Contact[];
	searchPeer$ = new Subject<string>();
	searchContact$ = new Subject<string>();

	constructor(private contactService: ContactsService, private searchService: SearchService) {

	}
	ngOnInit() {
		this.contactService.contacts$.subscribe(contacts => {
			this.contacts = contacts;
		});
		this.contactService.pendings$.subscribe(pendings => {
			this.pendings = pendings;
		});
		this.contactService.externals$.subscribe(externals => {
			this.externals = externals;
		});
		this.contactService.requests$.subscribe(requests => {
			this.requests = requests;
		});
		/*search method expect subject and the type of search you want
		* search users in DB that match the property value by email/username\sessionKey.*/
		this.searchService.search(this.searchPeer$, 'peer').subscribe(results => {
			this.searchResults = results;
		});
		/*search local in local contacts */
		this.contactService.searchContact(this.searchContact$).subscribe(results => {
			this.searchContactResults = results;
		});
	}
	ngOnDestroy() { }

	add() {
		//sandbox user for testing
		this.contactService.saveContact({
			email: "eran@copa.io",
			id: "5d24debf149759c878f855a2",
			username: "eranCopa",
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
	changeExternalTransferMethod() {
		this.externals[0].s3 = !this.externals[0].s3;
		this.contactService.updateExternal(this.externals[0]);
	}
	editExternal() {
		this.externals[0].need2FA = !this.externals[0].need2FA;
		if (this.externals[0].need2FA) {
			this.externals[0].phone = '524637956';
			this.externals[0].countryCode = {
				id: 'Isreal',
				code: '+972'
			};
		} else {
			this.externals[0].phone = '';
			this.externals[0].countryCode = null;
		}
		this.contactService.updateExternal(this.externals[0]);
	}
}
