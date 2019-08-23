import { environment } from '@env/environment';
import { MultiFactorAuthenticationDialogComponent } from './multi-factor-authentication-dialog/multi-factor-authentication-dialog.component';
import { ErrorService, FileService } from '@services';
import { ApiService } from '@app/services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ContactsDialogComponent } from './contacts-dialog/contacts-dialog/contacts-dialog.component';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '@app/dialogs/confirm.dialog/confirm.dialog.component';
import { MatIcon } from '@angular/material';
import { NonCopaUsersDialogComponent } from './non-copa-users-dialog/non-copa-users-dialog.component';

@Component({
  selector: 'app-send-page',
  templateUrl: './send-page.component.html',
  styleUrls: ['./send-page.component.scss']
})
export class SendPageComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Input() selectedFiles: any[];
  @ViewChild('contactIcon', {static: false}) contactIcon: ElementRef;
  mobile = false;
  selectedTransferMethod = 'classic'
  formGroup: FormGroup;
  linkFormGroup: FormGroup;
  isPasswordProtected = true;
  downloadLinkLimitString = '5 downloads';
  dialogConfig: MatDialogConfig;
  selectedContacts = [];
  dialogData = {
    title: 'Confirm',
    questionText: 'Protected links could not be sent together with classic and advanced transfers. This will remove all recipients and prepare the link for transfer.',
    name: 'Are you sure you would like to continue ?',
    btn: 'Yes',
    btnColor: 'primary'
  }
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private apiService: ApiService,
    private errorService: ErrorService,
    public fileService: FileService) {
  }

  ngOnInit() {
    this.createForm()
    if (window.screen.width <= 480) { // 768px portrait
      this.mobile = true;
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      username: [null, [Validators.required]],
    });

    this.linkFormGroup = this.formBuilder.group({
      password: [null, [this.checkPassword]],
      isPasswordProtected: [true],
    });
  }
  delete(name: string) {
    this.selectedFiles = this.selectedFiles.filter((f: File) => f.name !== name);
    if (this.selectedFiles.length === 0) {
      this.fileService.resetSubject();
    }
  }
  uploadFile(file) {
    this.selectedFiles.push(...file);
  }

  uploadFolder(files) {
    this.selectedFiles.push(...files);
  }

  setDownloadLinkLimit(limit: string) {
    this.downloadLinkLimitString = limit;
  }
  getUsernameError() {
    return this.formGroup.get('username').hasError('required') ?
      'Field is required' :
      '';
  }
  checkPassword(control) {
    const enteredPassword = control.value;
    return !environment.passwordCheck.test(enteredPassword) && enteredPassword ? {
      requirements: true
    } : null;
  }
  getErrorPassword() {
    return this.linkFormGroup.get('password').hasError('required') ?
      'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.linkFormGroup.get('password').hasError('requirements') ?
      'Password needs to be at least eight characters, one uppercase letter and one number' :
      '';
  }
  openContacts(event: Event) {
    event.stopPropagation();
    const settingsConfig = new MatDialogConfig();
    settingsConfig.autoFocus = false;
    if(!this.mobile){
      settingsConfig.minHeight = '500px';
      settingsConfig.minWidth = '650px';
    } else {
      settingsConfig.width = '90vw';
      settingsConfig.height = '70vh';
    }


    this.dialog.open(ContactsDialogComponent, settingsConfig).afterClosed().subscribe( selectedContacts => {
      this.selectedContacts = _.union(this.selectedContacts, selectedContacts);
    });
  }
  addRecipient(recipientData){
    console.log(recipientData);
    this.selectedContacts.unshift({property: recipientData})
  }
  removeContact(contact: any) {
    this.selectedContacts.splice(this.selectedContacts.findIndex(c => c.id === contact.id), 1);
  }
  transfer(){
    // const contacts = [];
    // this.selectedContacts.forEach(contact => {
    //   delete contact.isSelected;
    //   console.log(contact);
    //   contact = {...contact, isMirage: false, duration: {days: 0, hours: 0, minutes: 0}, inWhitelist: true, property: undefined }
    //   contacts.unshift(contact);
    // });
    // this.apiService.emailExist(contacts).subscribe(
    // (res) => {
    //   console.log(res);
    // },
    // (err) => {
    //   this.errorService.logError(err)
    // }
    // )

    // this sould be after api response - if the array of non-registered recipients is not empty ->
    const serverResponse = [
      {
      email: 'asanska@hotmail.com',
      id: '5d2b5069a13614e1237ff5a8',
      inWhitelist: false,
      isMirage: false,
      property: 'email',
      username: 'asanskaHotmail',
      duration: {
        days: 0, hours: 0, minutes: 0
      }
     },
    ]
    if(serverResponse.length > 0) {
      const settingsConfig = new MatDialogConfig();
      settingsConfig.autoFocus = false;
      if(!this.mobile){
        settingsConfig.minHeight = '700px';
        settingsConfig.minWidth = '900px';
      } else {
        settingsConfig.width = '90vw';
        settingsConfig.height = '70vh';
      }
      settingsConfig.data = serverResponse;


      this.dialog.open(NonCopaUsersDialogComponent, settingsConfig).afterClosed().subscribe( res => {
        console.log(res);
        if(res){
          this.dialog.open(MultiFactorAuthenticationDialogComponent, settingsConfig).afterClosed().subscribe( res => {
            console.log(res);
          })
        }
      })
    }
  }
  clearRecipients(){
    if(this.selectedTransferMethod === 'link' && this.selectedContacts.length > 0) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {...this.dialogData}
        }).afterClosed().subscribe( dialogRes => {
          if(dialogRes){
            this.selectedContacts = [];
          } else {
            this.selectedTransferMethod = 'classic';
          }
      });
    }
  }

}
