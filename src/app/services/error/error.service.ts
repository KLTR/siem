import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  errorSeparator = environment.errorSeparator;
  constructor(private snackBar: MatSnackBar) { }

  // Errors are returned differently, that's why i'm checking for keys in the JSON.parse(returnedString)
  logError(error) {
    try{
      let errPrint = JSON.parse(error.toString().split(this.errorSeparator)[1]);
      if (errPrint.message) {
        console.log(errPrint.message);
        errPrint = errPrint.message;
      } else {
        console.log(errPrint.err.message);
        errPrint = errPrint.err.message;
      }
      this.snackBar.open(`Ooops ... \n ${errPrint}`, 'ok', {
        duration: 3000
      });
    }
    catch{
      console.log(error)
    }
  }
}
