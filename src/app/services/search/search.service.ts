import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ApiService } from '@app/services/api/api.service';
import { ErrorService } from '@app/services/error/error.service';

@Injectable({
	providedIn: 'root'
})
export class SearchService {
    private searchFunctions: object = {
        'peer': this.searchPeer
    };
	constructor(private apiService: ApiService, private errorService: ErrorService) {

	}

    /*
    * debounceTime: https://rxjs-dev.firebaseapp.com/api/operators/debounceTime
    * distinctUntilChanged: https://rxjs-dev.firebaseapp.com/api/operators/distinctUntilChanged
    * switchMap: https://rxjs-dev.firebaseapp.com/api/operators/switchMap
    * map: https://rxjs-dev.firebaseapp.com/api/operators/map
    */
	search(property: Observable<any>, searchType: string): Observable<any> {
		return property.pipe(
			debounceTime(400),
			distinctUntilChanged(),
			switchMap(property => this.searchFunctions[searchType](property))
		);
	}

	private searchPeer(property: string): any {
        return this.apiService.searchPeer({ property }).pipe(
            map(res => {
                return res.getBody().peers;
            }),
            //adding catchError inside prevents the main observable from stoping
            catchError((err) => {
                this.errorService.logError(err);
                return of([]);
            })
        );
	}

}
