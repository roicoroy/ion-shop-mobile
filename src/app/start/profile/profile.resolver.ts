import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileResolver implements Resolve<Observable<any>> {

    constructor(

    ) { }

    resolve(): Observable<any> {
        console.log('profile resolver')
        return null;
    }
}