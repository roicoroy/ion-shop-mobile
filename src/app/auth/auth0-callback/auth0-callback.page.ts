import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Message, DataService } from 'src/app/services/data.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AppService } from 'src/app/shared/services/native/app/app.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { NgxsModule, Store } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { tap } from 'rxjs';
import { Auth0Actions } from 'src/app/store/auth/auth0/auth0.actions';

@Component({
  selector: 'app-auth0-callback',
  templateUrl: './auth0-callback.page.html',
  styleUrls: ['./auth0-callback.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule
  ]
})
export class Auth0CallbackPage implements OnInit {
  public message!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  // private strapi = inject(AuthService);
  private native = inject(AppService);
  private navigation = inject(NavigationService);
  private store = inject(Store);

  user: string = '';

  mockUrl = 'https://ion-shop-online.web.app/auth0-callback?id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTFOa1U1T0RWRU9UQXpNRVpFUTBKRE1FSXdRVVkzTlRJMVFrRkZRa1E1Umpnd09VVXpSUSJ9.eyJuaWNrbmFtZSI6InJvaWNvcm95IiwibmFtZSI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83ZmJhNTliMzBiZmZiYmE3MmVkYjA2M2Y4ODYyNGU1Nj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnJvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA0LTEzVDE4OjA5OjMxLjQyNVoiLCJlbWFpbCI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3JvaWNvcm95LmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJkTFNaNTRvbFpwbHdseUt1TUJWcWFUSHZPejVFOHY1bCIsImlhdCI6MTY4MTQwOTM3MiwiZXhwIjoxNjgxNDQ1MzcyLCJzdWIiOiJhdXRoMHw2NDJkYjUwNWIzZGEzYWI1MTQ5MzRiNWYiLCJzaWQiOiJGVmY3Q3hQUm9YbjV0TnBlOFp2a1BjTnU1dXV3SnF2VyJ9.n2lYxZxz2SDShiqj2ZjMuUW0HSi2jvt_NP-eVjwntWuPXx1oETA7lIPK_fcuM-esXQnFYcvFsuM03lI03yEUAtic_oY2jYLQXbZDKSRKNw77s2jjDq8hR8LUuRDCF-em2BlWd9CIiSghAoZYxv3t1aGUXFPL8m7xy_d1fA410Qs5Rr3uADBFjD-_z82ggxE-nFLKS4zz4oSb9xz3ig3aLDKItNRLHYkOmUIz9LKihS2_H9ZPcUL0_TzfQpRcG5az_nC4FrpaDQ37nXcxppc3e8Lb4AFYDWKDxHJQFcaU2VbtW9Fo0L5o6JQ8uBa-21CshD_sAeHKgCW0TUDhscxJbw&access_token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9yb2ljb3JveS5ldS5hdXRoMC5jb20vIn0..fZdQVTQm0ddjWiBa.7FM0pWaFNvC1syQ8mXYKjnYKPYn_m6pEdBhDB3ssAq9YjNvWrmOSxhX6IRr6QQ3klu8J0N55sd4HpRM1ODYgUuuJrG3jIo88-rWeGSeLkVTajbLhZYPg5ZxAETA359IIfDmHyvRdQ41ssYrZGPTT5U08Eq44KR2fg3iFdV68eYe9oaIaK7KX3fzFezJVUfTJUMcKCEab9XFBZbhSdJd2MRhJD7UsD6GQXD-h__slNtSrp6VGEOzNK4n4s0L_upQLXtI4TfmGNLwSMcd94LLVSTTf2eWh7n5JlSJx5mzd3jMiCz3xRgLlD1oU.RP4jKHkTgsnmYaYp45ebeQ&raw%5Baccess_token%5D=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9yb2ljb3JveS5ldS5hdXRoMC5jb20vIn0..fZdQVTQm0ddjWiBa.7FM0pWaFNvC1syQ8mXYKjnYKPYn_m6pEdBhDB3ssAq9YjNvWrmOSxhX6IRr6QQ3klu8J0N55sd4HpRM1ODYgUuuJrG3jIo88-rWeGSeLkVTajbLhZYPg5ZxAETA359IIfDmHyvRdQ41ssYrZGPTT5U08Eq44KR2fg3iFdV68eYe9oaIaK7KX3fzFezJVUfTJUMcKCEab9XFBZbhSdJd2MRhJD7UsD6GQXD-h__slNtSrp6VGEOzNK4n4s0L_upQLXtI4TfmGNLwSMcd94LLVSTTf2eWh7n5JlSJx5mzd3jMiCz3xRgLlD1oU.RP4jKHkTgsnmYaYp45ebeQ&raw%5Bid_token%5D=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTFOa1U1T0RWRU9UQXpNRVpFUTBKRE1FSXdRVVkzTlRJMVFrRkZRa1E1Umpnd09VVXpSUSJ9.eyJuaWNrbmFtZSI6InJvaWNvcm95IiwibmFtZSI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83ZmJhNTliMzBiZmZiYmE3MmVkYjA2M2Y4ODYyNGU1Nj9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnJvLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA0LTEzVDE4OjA5OjMxLjQyNVoiLCJlbWFpbCI6InJvaWNvcm95QHlhaG9vLmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3JvaWNvcm95LmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJkTFNaNTRvbFpwbHdseUt1TUJWcWFUSHZPejVFOHY1bCIsImlhdCI6MTY4MTQwOTM3MiwiZXhwIjoxNjgxNDQ1MzcyLCJzdWIiOiJhdXRoMHw2NDJkYjUwNWIzZGEzYWI1MTQ5MzRiNWYiLCJzaWQiOiJGVmY3Q3hQUm9YbjV0TnBlOFp2a1BjTnU1dXV3SnF2VyJ9.n2lYxZxz2SDShiqj2ZjMuUW0HSi2jvt_NP-eVjwntWuPXx1oETA7lIPK_fcuM-esXQnFYcvFsuM03lI03yEUAtic_oY2jYLQXbZDKSRKNw77s2jjDq8hR8LUuRDCF-em2BlWd9CIiSghAoZYxv3t1aGUXFPL8m7xy_d1fA410Qs5Rr3uADBFjD-_z82ggxE-nFLKS4zz4oSb9xz3ig3aLDKItNRLHYkOmUIz9LKihS2_H9ZPcUL0_TzfQpRcG5az_nC4FrpaDQ37nXcxppc3e8Lb4AFYDWKDxHJQFcaU2VbtW9Fo0L5o6JQ8uBa-21CshD_sAeHKgCW0TUDhscxJbw&raw%5Bscope%5D=openid%20profile%20email&raw%5Bexpires_in%5D=86400&raw%5Btoken_type%5D=Bearer';

  async ngOnInit() {
    const device = await this.native.getDeviceInfo();
    const location = window.location.search;
    console.log(location);
    if (device.platform == 'web' && location) {
      console.log('::::');
      this.store.dispatch(new Auth0Actions.Auth0ProviderCallback(location, 'auth0'))
        .subscribe((vs) => console.log(vs));
      // console.log(location);
    }
    if (device.platform === 'android' || device.platform === 'ios') {
      await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        const urlArray = event.url.split("id_token=");
        console.log(urlArray);
        // this.store.dispatch(new AuthActions.AuthProviderCallback(urlArray[1], 'auth0'));
      });
    }
  }
  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return isIos ? 'Inbox' : '';
  }
}