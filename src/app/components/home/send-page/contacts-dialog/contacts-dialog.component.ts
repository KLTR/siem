import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Contact } from '@app/classes/contact/contact';
import { ContactsService } from '@app/services/contacts/contacts.service';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-contacts-dialog',
	templateUrl: './contacts-dialog.component.html',
	styleUrls: ['./contacts-dialog.component.scss']
})
export class ContactsDialogComponent implements OnInit, OnDestroy {
	@Output() addContacts = new EventEmitter();
	contacts = [];
	constructor(
		public dialogRef: MatDialogRef<ContactsDialogComponent>,
		private contactsService: ContactsService
	) { }
	ngOnInit() {
		this.contactsService.contacts$.pipe(take(1)).subscribe(contacts => {
			contacts.forEach(contact => {
				this.contacts.push(Object.assign({ selected: false }, contact));
			});
		});
	}
	done() {
		const selectedContacts = this.contacts.filter(contact => !!contact.selected).map(obj => {
			return new Contact(obj.id, obj.email, obj.username);
		});
		this.dialogRef.close(selectedContacts);
	}
	toggleSelectContact(contact: any) {
		contact.selected = !contact.selected;
	}
	ngOnDestroy() { }
}
