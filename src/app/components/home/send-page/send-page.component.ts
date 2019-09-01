import {
  TransferMethodDialogComponent
} from './transfer-method-dialog/transfer-method-dialog.component';
import {
  SailsResponse
} from 'ngx-sails-socketio';
import {
  environment
} from '@env/environment';
import {
  MultiFactorAuthenticationDialogComponent
} from './multi-factor-authentication-dialog/multi-factor-authentication-dialog.component';
import {
  ErrorService,
  FileService
} from '@services';
import {
  ApiService
} from '@app/services';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material/dialog';
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
import {
  ContactsDialogComponent
} from './contacts-dialog/contacts-dialog/contacts-dialog.component';
import * as _ from 'lodash';
import {
  ConfirmDialogComponent
} from '@app/dialogs/confirm.dialog/confirm.dialog.component';
import {
  MatIcon
} from '@angular/material';
import {
  NonCopaUsersDialogComponent
} from './non-copa-users-dialog/non-copa-users-dialog.component';
import * as uuid from 'uuid';

@Component({
  selector: 'app-send-page',
  templateUrl: './send-page.component.html',
  styleUrls: ['./send-page.component.scss']
})
export class SendPageComponent implements OnInit {
  @Output() cancel = new EventEmitter();
  @Input() selectedFiles: any[];
  @ViewChild('contactIcon', {
    static: false
  }) contactIcon: ElementRef;
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
  user: any;
  contactBy: string;
  dbFiles = [];
  blockedFiles = [];
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private apiService: ApiService,
    private errorService: ErrorService,
    public fileService: FileService) {
    this.apiService.user.subscribe(user => {
      this.user = user;
      this.contactBy = this.user.contactByEmail ? 'email' : (this.user.contactByKey ? 'key' : 'username');
    });
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
    if (!this.mobile) {
      settingsConfig.minHeight = '500px';
      settingsConfig.minWidth = '650px';
    } else {
      settingsConfig.width = '90vw';
      settingsConfig.height = '70vh';
    }


    this.dialog.open(ContactsDialogComponent, settingsConfig).afterClosed().subscribe(selectedContacts => {
      this.selectedContacts = _.union(this.selectedContacts, selectedContacts);
      // this.selectedContacts = _.unionBy(this.selectedContacts, selectedContacts, 'id');
    });
  }
  addRecipient(recipientData) {
    this.selectedContacts.unshift({
      property: recipientData
    })
  }
  removeContact(contact: any) {
    this.selectedContacts.splice(this.selectedContacts.findIndex(c => c.id === contact.id), 1);
  }
  transfer() {
    const contacts = [];
    this.selectedContacts.forEach(contact => {
      delete contact.isSelected;
      contact = {
        id: contact.inWhitelist ? contact.id : undefined,
        isMirage: false,
        email: contact.inWhitelist ? contact.email : undefined,
        username: contact.inWhitelist ? contact.username : undefined,
        duration: {
          days: 0,
          hours: 0,
          minutes: 0
        },
        inWhitelist: contact.inWhitelist ? true : false,
        property: contact.inWhitelist ? undefined : contact.property
      }
      contacts.unshift(contact);
      let files = [];
      this.selectedFiles.forEach(file => {
        file = { fileId: uuid.v4(), name: file.name, size: file.size, type: file.type,  checksum: 'checksum', archived: false }
        files.unshift(file);
      })
      this.selectedFiles = files;
      console.log(this.selectedFiles);
    });
    this.apiService.emailExist(contacts).subscribe(
      (res: SailsResponse) => {
        const body = res.getBody();
        // If non exists
        if (body.nonExistEmails.length > 0) {
          const settingsConfig = new MatDialogConfig();
          settingsConfig.autoFocus = false;
          if (!this.mobile) {
            settingsConfig.minHeight = '700px';
            settingsConfig.minWidth = '900px';
          } else {
            settingsConfig.width = '90vw';
            settingsConfig.height = '70vh';
          }
          settingsConfig.data = body.nonExistEmails;


          this.dialog.open(NonCopaUsersDialogComponent, settingsConfig).afterClosed().subscribe(res => {
            console.log(res);
            if (res) {
              this.dialog.open(MultiFactorAuthenticationDialogComponent, settingsConfig).afterClosed().subscribe(res => {
                console.log(res);
              })
            }
          })
        }
        // If all are contacts
        else {
          const existEmails = res.getBody().existEmails;
          if (this.user.offlineMode === 'ask') {
            const settingsConfig = new MatDialogConfig();
            settingsConfig.autoFocus = false;
            if(!this.mobile){
              settingsConfig.width = '400px';
              settingsConfig.height = '200px';
            } else {
              settingsConfig.width = '90vw';
              settingsConfig.height = '70vh';
            }
            this.dialog.open(TransferMethodDialogComponent, settingsConfig).afterClosed().subscribe(res => {
              console.log(res);
              const arrToSend = [];
              const arr = _.values(existEmails);
              arr.forEach(contact => {
                contact = {
                  ...contact,
                  duration: contact.mirageTime,
                  isDirect: true,
                  fromBusiness: this.user.business,
                  fromPublicKey: 'FAKE',
                  from: this.user.email,
                  isPAYG: this.user.payg,
                  version: '1.14.4',
                  files: this.selectedFiles
                }
                delete contact.property;
                delete contact.email;
                delete contact.mirageTime;
                delete contact.username;
                arrToSend.unshift(contact);
              });
              this.sendP2P(arrToSend, body);
            })
          } else {
            // this.sendP2P([...contacts, this.selectedFiles]);
            // this.apiService.requestP2P(contacts);
          }
        }
      },
      (err) => {
        this.errorService.logError(err)
      }
    )

  }
  sendP2P(p2pArr, body) {
    console.log(p2pArr);
    this.apiService.requestP2P(p2pArr).subscribe( res => {
      console.log(res);
      const approvals = _.values(res.getBody().approvals);
      const notApproved = _.values(res.getBody().notApproved);
      const reqId = res.getBody().reqID;
      const balance = res.getBody().balance;
      this.dbFiles = res.getBody().dbFiles;
      this.blockedFiles = res.getBody().blockedFiles;
      const req = res.getBody();
      let totalSize = 0;
      p2pArr[0].files.forEach(file => {
        totalSize += file.size;
      });
      const newReq = {
        id: req.id,
        to: req.to,
        status: 'pending',
        isMirage: req.isMirage,
        duration: req.duration,
        isDirect: p2pArr[0].isDirect,
        files: p2pArr[0].files,
        filesNumber: p2pArr[0].files.length,
        filesListOpen: false,
        totalSize: totalSize,
        progress: -1,
        inProcess: false,
        username: req.to.username,
        email: req.to.email,
        needKey: req.needKey,
        isPAYG: req.isPAYG,
        webTransfer: false,
        downloadLink: req.downloadLink,
        trackId: req.id,
        created: new Date()
      }
      console.log(newReq);
      if(notApproved.length > 0) {
        // Pop Failed Modal
      }
    })
  }
  clearRecipients() {
    if (this.selectedTransferMethod === 'link' && this.selectedContacts.length > 0) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          ...this.dialogData
        }
      }).afterClosed().subscribe(dialogRes => {
        if (dialogRes) {
          this.selectedContacts = [];
        } else {
          this.selectedTransferMethod = 'classic';
        }
      });
    }
  }

}
