import { Injectable } from '@angular/core';
import {
	Sails, SailsRequest, SailsResponse,
	SailsSubscription,
} from 'ngx-sails-socketio';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	request: SailsRequest;
	socket: SailsSubscription;
	public user: BehaviorSubject<any>;
	public userObject: any;
	public app: BehaviorSubject<any>;
	public incomingRequests: [];
	serverUrls = {
		getSocketInfo: '/api/socketinfo',
		authMe: '/api/auth/me',
		// Logins
		login: '/api/auth/login',
		register: '/api/auth/register',
		isRegisteredEmail: '/api/auth/isregisterdemail', // email in body
		isRegisteredUsername: '/api/peer/valid_username',
		forgotPassword: '/api/auth/forgot_password', // email in body
		logout: '/api/peer/logout',
		// User settings
		saveUsername: '/api/peer/save_username',
		updateEmailNotifications: '/api/peer/updateEmailNotifications',
		authPassword: '/api/auth/authPass',
		resetPassword: '/api/auth/reset_login_password',
		updateContactMethod: '/api/peer/update_contact_method',
		generateKey: '/api/peer/generate_key',
		updateExternalPassword: '/api/peer/update/external_password',
		updateProtectedLinkPassword: '/api/peer/update/protected_link_password',
		updateOfflineMode: '/api/peer/update/offline_mode',
		updateSelfEncryption: '/api/peer/update/self_encryption',
		setDownloadLinkLimitDefault: '/api/peer/settings/set/download_link_limit',
		// History
		getHistory: '/api/rest/history/get',
		deleteHistory: '/api/rest/history/delete',
		deleteAllHistory: '/api/rest/history/delete/all',
		sendLink: '/api/rest/transfer/send/link',
		// Send Page
		emailExist: '/api/rest/email_exist',
		requestP2P: '/api/rest/request_p2p',
		confirmP2P: '/api/rest/confirm_p2p',

		//Contacts
		contactRequest: '/api/peer/add_to_whitelist',
		loadContacts: '/api/peer/contact/get/all',
		searchPeer: '/api/peer/search_peer',

	};

	constructor(private sails: Sails, private router: Router, private dialog: MatDialog) {
		this.user = new BehaviorSubject({});
		this.app = new BehaviorSubject({});
		this.request = new SailsRequest(this.sails);
		this.decodeToken();
	}

	getToken(): string {
		const token = localStorage.getItem('COPA/JWT');
		return token;
	}
	setToken(token: string): void {
		localStorage.removeItem(`COPA/JWT`);
		localStorage.setItem(`COPA/JWT`, token);
		this.decodeToken();
	}

	forgotPassword(email: { email: string }): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.forgotPassword}`, email);
	}

	setDownloadLinkLimitDefault(downloadLinkLimitName: string): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.setDownloadLinkLimitDefault}`, { downloadLinkLimitName })
	}

	updateExternalPassword(externalPassword: boolean): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.updateExternalPassword}`, { externalPassword });
	}
	updateEmailNotifications(subscribe: boolean): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.updateEmailNotifications}`, { subscribe });
	}

	updateProtectedLinkPassword(protectedLinkPass: boolean): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.updateProtectedLinkPassword}`, { protectedLinkPass });
	}

	updateOfflineMode(offlineMode: 'ask' | 'upload' | 'wait'): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.updateOfflineMode}`, { offlineMode });
	}

	updateContactMethod(methods: any): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.updateContactMethod}`, methods);
	}
	updateSelfEncryption() {
		console.log('need to implement..');
	}
	generatKey(): Observable<SailsResponse> {
		return this.request.get(`${this.serverUrls.generateKey}`);
	}
	logout(): Observable<SailsResponse> {
		this.dialog.closeAll();
		localStorage.removeItem('COPA/JWT');
		// reroute to login screen.
		this.router.navigateByUrl('login');
		this.user.next(null);
		return this.request.post(`${this.serverUrls.logout}`, {});
	}

	editUser(key: any, value: any) {
		this.userObject[key] = value;
		this.user.next(this.userObject);
	}

	decodeToken(): void {
		const helper = new JwtHelperService();
		const decodedToken = helper.decodeToken(this.getToken());
		this.user.next(decodedToken);
		this.userObject = decodedToken;
		console.log(this.userObject);
	}

	setApp(data): void {
		this.app.next(data);
	}



	getUser(): BehaviorSubject<any> {
		return this.user;
	}

	getSocketInfo() {
		this.request.get(`${this.serverUrls.getSocketInfo}`).subscribe((res) => {
		});
	}

	saveUsername(username): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.saveUsername}`, { username });
	}

	login(credentials): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.login}`, credentials);
	}

	register(credentials): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.register}`, credentials);
	}

	setUser(user: any): void {
		this.user = user;
	}

	authMe(): Observable<SailsResponse> {
		return this.request.get(`${this.serverUrls.authMe}`);
	}

	authPassword(password: string): Observable<SailsResponse> {
		return this.request.post(`${this.serverUrls.authPassword}`, { password });
	}
	resetPassword(passwords): Observable<SailsResponse> {
		console.log(passwords);
		return this.request.post(`${this.serverUrls.resetPassword}`, { passwords });
	}

	resetPasswordWithPeerId(passwords): Observable<SailsResponse> {
		console.log(this.userObject);
		console.log({ ...passwords, peerId: this.userObject.id });
		return this.request.post(`${this.serverUrls.resetPassword}`, { ...passwords, peerId: this.userObject.id });
	}

	isRegisteredEmail(email: string): Observable<SailsResponse> {
		return this.request.get(`${this.serverUrls.isRegisteredEmail}`, { email });
	}

	isRegisteredUsername(username: string): Observable<SailsResponse> {
		return this.request.get(`${this.serverUrls.isRegisteredUsername}`, { username });
	}

	// History
	getHistory(type: string): Observable<SailsResponse> {
		// type = incoming / outgoing
		return this.request.get(`${this.serverUrls.getHistory}`, { type });
	}
	deleteHistory(id: string, type: string) {
		return this.request.post(`${this.serverUrls.deleteHistory}`, { id, type });
	}
	deleteAllHistory(type: string) {
		return this.request.post(`${this.serverUrls.deleteAllHistory}`, { type });
	}
	sendLink(approvalId: string) {
		return this.request.post(`${this.serverUrls.sendLink}`, { approvalId });
	}

	// Send Page
	emailExist(recipientData: any): Observable<SailsResponse> {
		console.log(recipientData);
		return this.request.post(`${this.serverUrls.emailExist}`, recipientData);
	}

	requestP2P(recipientsData: any): Observable<SailsResponse> {
		console.log(recipientsData);
		return this.request.post(`${this.serverUrls.requestP2P}`, recipientsData);
	}
	confirmP2P(body: confirmP2P): Observable<SailsResponse> {
		console.log(body);
		return this.request.post(`${this.serverUrls.confirmP2P}`, body);
	}
	contactRequest(obj: ApiModel.IContactRequest): Observable<SailsResponse> {
		return this.request.post(this.serverUrls.contactRequest, obj);
	}
	loadContacts(): Observable<SailsResponse> {
		return this.request.get(this.serverUrls.loadContacts);
	}
	searchPeer(obj: ApiModel.ISearchPeer): Observable<SailsResponse> {
		return this.request.get(this.serverUrls.searchPeer);
	}
}

interface confirmP2P {
	approvalId: string;
	key: string;
	password: string | undefined;
	ip: string;
	localIp: string;
	netmask: string;
	port: string;
	toPortOpen: boolean;
	jwt: string;
	isDirect: boolean;
	toBusiness: boolean;
	toPublicKey: string;
	inWhiteList: boolean;
	autoDownload: boolean;
	version: string;
}
