import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KeypadFacade } from './keypad.facade';
import { AppService } from 'src/app/shared/services/native/app/app.service';

@Directive({
    selector: '[eqmHideWhenKeypadVisible]'
})
export class KeyPadDirective implements OnDestroy {
    private native = inject(AppService);
    private targetElement = inject(ElementRef);
    private keypadFacade = inject(KeypadFacade);

    private readonly ngUnsubscribe = new Subject();

    async ngOnInit() {
        const device = await this.native.getDeviceInfo();
        if (device.platform === 'android' || device.platform === 'ios') {
            const originalStyle = this.targetElement.nativeElement.style.display;
            this.keypadFacade.keyboardIsOpen$
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((keyboardStatus: boolean) => {
                    setTimeout(() => {
                        this.targetElement.nativeElement.style.display = keyboardStatus ? 'none' : originalStyle;
                    }, 25);
                });
        }
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
