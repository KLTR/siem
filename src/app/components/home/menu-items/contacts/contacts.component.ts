import { Component, OnInit } from '@angular/core';

import { ContactsService} from '@app/services/contacts/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor( contactService: ContactsService) {
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
        requests && console.log('in contact component: requestsSubject: ', requests);
      });
   }

  ngOnInit() {
  }

}
