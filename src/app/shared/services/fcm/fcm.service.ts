import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { UtilityService } from '../utility/utility.service';
import { NavigationService } from '../navigation/navigation.service';
import { Store } from '@ngxs/store';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    headers_json = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient,
        private utility: UtilityService,
        private navigation: NavigationService,
        private store: Store
    ) { }

    // async initListerners(): Promise<void> {
    //     console.error('initListerners: ');
    //     PushNotifications.addListener('registrationError', (error: any) => {
    //         console.log('Error: ' + JSON.stringify(error));
    //     });

    //     PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
    //         console.log('Push received: ', notification);
    //         this.utility.presentAlert(JSON.stringify(notification));
    //     }
    //     );

    //     PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
    //         const data = notification.notification.data;
    //         // console.log('Action performed: ' + JSON.stringify(notification.notification));
    //         if (data.detailsId) {
    //             alert('pushNotificationActionPerformed');
    //             this.navigation.navigateForwardParams(`/fcm-details`, notification.notification);
    //         }
    //     });

    // }

    async initPush() {
        // let permStatus = await PushNotifications.checkPermissions();
        // if (permStatus.receive !== 'granted') {
        //     this.utility.presentAlert('User denied permissions!');
        //     throw new Error('User denied permissions!');
        // }
        // await PushNotifications.requestPermissions()
        //     .then(async (permission) => {
        //         if (permission.receive == 'granted') {
        //             await PushNotifications.register();
        //             PushNotifications.addListener('registration', async (token: PushNotificationToken) => {
        //                 console.log('My token: ' + JSON.stringify(token));
        //                 if (token != null) {
        //                     this.postFcmTokenToStrapi(token);
        //                 }
        //             }
        //             );
        //         }
        //     });
    }
    postFcmTokenToStrapi(fcmToken) {
        const user = this.store.selectSnapshot<any>((state) => state.auth.user);
        console.log('fcmToken :>> ', fcmToken);
        this.http.put(environment.BASE_PATH + '/api/users/' + user?.id, {
            device_token: fcmToken.value,
        }).subscribe((user) => {
            console.log('fcm token posted user ', user);
        });
    }
}
