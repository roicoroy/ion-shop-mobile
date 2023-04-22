import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { NgxsModule } from "@ngxs/store";
import { LanguageComponent } from "src/app/start/profile/language-component/language.component";


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
  ],
  exports: [
    LanguageComponent
  ],
  declarations: [
    LanguageComponent
  ],
})
export class LanguageModule { }
