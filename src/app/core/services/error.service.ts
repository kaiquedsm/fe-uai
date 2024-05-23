import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  errorSub: BehaviorSubject<boolean>  = new BehaviorSubject(false);

  setError(error: boolean) {
    this.errorSub.next(error);
  }

  constructor() { }
}
