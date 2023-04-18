/* eslint-disable @typescript-eslint/naming-convention */
export const environment = {
  firebase: {
    apiKey: "AIzaSyAKPqlzZDnZszbdySKHlM3-Fgw76MMvF-o",
    authDomain: "ion-amigao.firebaseapp.com",
    projectId: "ion-amigao",
    storageBucket: "ion-amigao.appspot.com",
    messagingSenderId: "247045122799",
    appId: "1:247045122799:web:f67aac53155fa79047891a",
    measurementId: "G-ND73JJYLDJ"
  },
  production: false,
  API_BASE_PATH: 'http://localhost:1337/api',
  // API_BASE_PATH: 'https://strapi-passwordless.onrender.com/api',
  BASE_PATH: 'http://localhost:1337',
  // BASE_PATH: 'https://strapi-passwordless.onrender.com',
  STRIPE_KEY: 'pk_test_2qqvb6DTqKondL46mnEjZ68e',
  populate: '?populate=*'
};
