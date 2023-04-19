import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { NgxsModule } from "@ngxs/store";
import { AuthPageRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthPageRoutingModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AuthModule { }
