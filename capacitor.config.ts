import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: "uk.shop.mobile",
    appName: "ion-shop-mobile",
    webDir: "www",
    bundledWebRuntime: false,
    plugins: {
        SplashScreen: {
            backgroundColor: "#FF5722",
        },
        PushNotifications: {
            presentationOptions: [
                "alert"
            ]
        }
    }
};

export default config;