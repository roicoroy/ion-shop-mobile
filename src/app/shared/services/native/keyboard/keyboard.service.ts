import { Injectable, EventEmitter, Output } from '@angular/core';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';
import { Store } from '@ngxs/store';
import { ErrorLoggingActions } from 'src/app/store/error-logging/error-logging.actions';
import { UpdateKeyboardStatus } from 'src/app/store/keyboard/keyboard.actions';
import { IKeyboardService } from './IKeyboard';
import { blurActiveElement } from './ui-utils';


/** EquateMobile Keyboard service used to connect with native plugin. */
@Injectable({
    providedIn: 'root'
})
export class KeyboardService implements IKeyboardService {
    @Output() keyboardWillShow = new EventEmitter<KeyboardInfo>();

    @Output() keyboardDidShow = new EventEmitter<KeyboardInfo>();

    @Output() keyboardWillHide = new EventEmitter<void>();

    @Output() keyboardDidHide = new EventEmitter<void>();

    /** Creates a new Keyboard Service instance. */
    constructor(
        private readonly store: Store,

    ) {
        // Keyboard Plugin Events
        Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
            this.keyboardWillShow.emit(info);
            this.store.dispatch(new UpdateKeyboardStatus(true));
        });

        Keyboard.addListener('keyboardDidShow', (info: KeyboardInfo) => {
            this.keyboardDidShow.emit(info);
        });

        Keyboard.addListener('keyboardWillHide', () => {
            this.keyboardWillHide.emit();
            this.store.dispatch(new UpdateKeyboardStatus(false));
        });

        Keyboard.addListener('keyboardDidHide', () => {
            blurActiveElement();
            this.keyboardDidHide.emit();
        });
    }

    /** Set whether the accessory bar should be visible on the keyboard. */
    async setAccessoryBarVisible(isBarVisible: boolean): Promise<void> {
        try {
            return await Keyboard.setAccessoryBarVisible({ isVisible: isBarVisible });
        } catch (error) {
            this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
            throw error;
        }
    }

    /** Hide the keyboard. */
    async hideKeyboard(): Promise<void> {
        try {
            return await Keyboard.hide();
        } catch (error) {
            this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));            throw error;
        }
    }

    /** Display the keyboard. */
    async showKeyboard(): Promise<void> {
        try {
            return await Keyboard.show();
        } catch (error) {
            this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));            throw error;
        }
    }

    /**
     * Enable or disable the webview scroll.
     * @param options is disabled scroll.
     */
    async setScroll(options: { isDisabled: boolean }): Promise<void> {
        try {
            return await Keyboard.setScroll(options);
        } catch (error) {
            this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));            throw error;
        }
    }
}
