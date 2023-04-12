import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
    appId: "uk.shop.amigao",
    appName: "SHOP",
    webDir: "www",
    bundledWebRuntime: false,
    plugins: {
        SplashScreen: {
            androidScaleType: "CENTER_CROP",
            splashFullScreen: false,
            splashImmersive: false,
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: "#FF5722"
          },
          Keyboard: {
            resize: KeyboardResize.Body
          },
        // PushNotifications: {
        //     presentationOptions: [
        //         "alert"
        //     ]
        // }
    }
};

export default config;