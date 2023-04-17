import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface IAppCategories {
    image?: string,
    url?: string,
    title?: string,
}

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private httpClient: HttpClient,
    ) { }

    getAppCategories(): Observable<IAppCategories> {
        return this.httpClient.get<IAppCategories>(environment.BASE_PATH + '/api/app-infos?populate=*', { headers: this.headers });
    }
}
