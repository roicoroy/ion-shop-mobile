
import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { StorageService } from '../../storage/ionstorage.service';
import { LanguageService, SAVED_LANGUAGE } from '../language.service';


@Component({
  selector: 'ng-ion-workspace-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent {
  profile: any;
  availableLanguages: any = [];
  translations: any;
  translateSub: Subscription;
  selectedLanguage: any;
  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
    private storageService: StorageService,
    public popoverController: PopoverController,
  ) {
    this.availableLanguages = this.languageService.getLanguages();
  }

  ionViewWillEnter() {
    this.storageService.storageGet(SAVED_LANGUAGE).then((language) => {
      this.selectedLanguage = language;
    });
  }

  selectLanguage(item: any) {

    this.selectedLanguage = item?.code;
    this.translate.use(this.selectedLanguage);
    this.storageService.storageSet(SAVED_LANGUAGE, this.selectedLanguage);
    this.popoverController.dismiss();
    this.getTranslations();
  }

  getTranslations() {
    this.translate.getTranslation(this.translate.currentLang)
      .subscribe((translations) => {
        this.translations = translations;
      });
  }
}
