import { ApiService } from './../../../../../services/api/api.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contacts-dialog',
  templateUrl: './contacts-dialog.component.html',
  styleUrls: ['./contacts-dialog.component.scss']
})
export class ContactsDialogComponent implements OnInit {
  @Output() addContacts = new EventEmitter();
  user: any;
  contacts = [];
  filteredContacts = [];
  selectedContacts = [];
  constructor(private apiService: ApiService) {
    this.apiService.user.subscribe(user => {
      this.contacts = user.whitelists[0].peers;
      this.filteredContacts = this.contacts;
      console.log(this.contacts);
    });
   }

  ngOnInit() {
  }

search(value) {
 this.filteredContacts =  this.contacts.filter( contact =>
  contact.email.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
  contact.username.toLowerCase().indexOf(value.toLowerCase()) > -1
  );
 if(!value){
   this.filteredContacts = this.contacts;
 }
}
toggleSelectContact(contact: any){
  if(contact.isSelected) {
    this.selectedContacts.splice(this.selectedContacts.findIndex(c => c.id === contact.id), 1);
    contact.isSelected = false;
  }else {
    this.selectedContacts.push(contact);
    contact.isSelected = true;
  }
}



}
