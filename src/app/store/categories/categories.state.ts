import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriesActions } from './categories.actions';
import { CategoriesService, IAppCategories } from './categories.service';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';

export class CategoriesStateModel {
    categories: any;
}
@State<CategoriesStateModel>({
    name: 'categories',
    defaults: {
        categories: null,
    }
})
@Injectable()
export class CategoriesState {

    constructor(
        private categoriesService: CategoriesService,
        private store: Store,
    ) { }

    @Selector()
    static getgetCategoreisTheme(state: CategoriesStateModel) {
        return state.categories;
    }

    @Action(CategoriesActions.GetCategories)
    getCategoreis(ctx: StateContext<CategoriesStateModel>) {
        const state = ctx.getState();
        // console.log("payload", payload);
        this.categoriesService.getAppCategories()
            .pipe(
                catchError((err: HttpErrorResponse) => throwError(() => {
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return new Error(err.message)
                })),
            )
            .subscribe({
                next: (v: any) => {
                    // console.log(v);

                    return ctx.patchState({
                        ...state,
                        categories: this.buildCategoriesData(v.data),
                    });
                },
                error: (e: any) => {
                    console.error(e);
                },
                // complete: () => console.info('complete')
            });
    }
    buildCategoriesData(categories: any) {
        const newCategoriesArray: IAppCategories[] = [];
        categories.forEach((category: any, i: any) => {
            const newCat: IAppCategories = {
                image: category.attributes.image.data.attributes.url,
                url: category.attributes.url,
                title: category.attributes.title,
            };
            newCategoriesArray.push(newCat);
        });

        return newCategoriesArray;
    }
}