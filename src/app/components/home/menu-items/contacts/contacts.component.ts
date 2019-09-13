import { Component, OnInit } from '@angular/core';

import { ContactsService} from '@app/services/contacts/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor( contactService: ContactsService) {

   }

  ngOnInit() {
  }

}
