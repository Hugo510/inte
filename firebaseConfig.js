import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "BJfGFin7k9cuerOZP21vQ65tiCd0t_GQWVKrsAQnBfKm6xQo-_86wpt2ZEn5dm1N-OrZwYbT8zX2hvVTWBeaU18",
  authDomain: "com.victor3041.inte",
  projectId: "rich-ripple-415205",
  storageBucket: "rich-ripple-415205.appspot.com",
  messagingSenderId: "212834219839",
  appId: "1:212834219839:android:020dce2890c2846916058a",
  //measurementId: "YOUR_MEASUREMENT_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase;
