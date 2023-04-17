import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
    PushNotifications,
    Token,
    PushNotification,
    PushNotificationActionPerformed,
    PushNotificationToken,
    PushNotificationSchema,
} from '@capacitor/push-notifications';

import { Device } from '@capacitor/device';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { NavigationService } from './navigation/navigation.service';
import { UtilityService } from './utility/utility.service';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    user: { device_token: any; id: string; };
    deviceInfo: any;
    headers_json = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient,
        private utility: UtilityService,

        private navigation: NavigationService,
        private router: Router,
        private store: Store,
        private alertCtrl: AlertController,
    ) {
        // this.user = this.store.selectSnapshot<any>((state) => state.strapiState.user);
    }

    async initPush() {
        console.log('cheers');
        const device = await Device.getInfo();
        if (device.platform !== 'web') {

            let permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive !== 'granted') {
                this.utility.presentAlert('User denied permissions!');
                throw new Error('User denied permissions!');
            }

            await PushNotifications.removeAllListeners();
            this.registerPush();

        } else {
            this.utility.presentAlert('Need to be on mobile');
        }
    }

    private async registerPush() {
        PushNotifications.requestPermissions().then((permission) => {
            if (permission.receive == 'granted') {
                PushNotifications.register();
                this.addFcmPushListerners();
            } else {
                // No permission for push granted
            }
        });
    }

    async addFcmPushListerners() {

        PushNotifications.addListener('registration', async (token: PushNotificationToken) => {
            // const deviceInfo = await Device.getInfo();
            // console.log('My token: ' + JSON.stringify(token));
            this.postFcmTokenToStrapi(token);
        }
        );

        PushNotifications.addListener('registrationError', (error: any) => {
            console.log('Error: ' + JSON.stringify(error));
        });

        PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
            // console.log('Push received: ', notification);
            const alert = await this.alertCtrl.create({
                header: 'You got a message',
                subHeader: 'FCM message',
                message: JSON.stringify(notification),
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'Ok',
                        handler: () => {
                            this.navigation.navigateForwardParams(`/fcm-details`, JSON.stringify(notification));
                        },
                    },
                    {
                        text: 'Open Message',
                        handler: () => {
                            // this.navigation.navigateForwardParams(`/fcm-details`, JSON.stringify(notification));
                        },
                    },
                ]
            });

            alert.present();
        }
        );

        PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
            const data = notification.notification.data;
            // console.log('Action performed: ' + JSON.stringify(notification.notification));
            if (data.detailsId) {
                alert('pushNotificationActionPerformed');
                this.navigation.navigateForwardParams(`/fcm-details`, notification.notification);
            }
        });

    }

    postFcmTokenToStrapi(fcmToken: Token) {
        console.log('fcmToken :>> ', fcmToken);
        if (this.user.device_token == null || this.user.device_token !== fcmToken) {
            console.log('user :>> ', this.user);
            this.http.put(environment.BASE_PATH + '/api/users/' + this.user?.id, {
                device_token: fcmToken.value,
            }).subscribe((user) => {
                console.log('fcm token posted user ', user);
            });
        }
    }
}
