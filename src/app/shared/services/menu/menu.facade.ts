import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { combineLatest, map, Observable } from 'rxjs';
import { IMenuStateModel, MenuState } from 'src/app/store/menu/menu.state';

@Injectable({
    providedIn: 'root'
})
export class MenuFacade {

    @Select(MenuState.isOpen) menuIsOpen$: Observable<boolean>;

    readonly menuState$: Observable<any>;

    constructor() {
        this.menuState$ = combineLatest(
            [
                this.menuIsOpen$
            ]
        ).pipe(
            map((menuIsOpen) => ({
                isOpen: menuIsOpen
            }))
        );
    }
}