import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD0fObnlam0I62oIq5-DLUTpMvPi8g-YMA",
  authDomain: "tenedores-2c5dd.firebaseapp.com",
  databaseURL: "https://tenedores-2c5dd.firebaseio.com",
  projectId: "tenedores-2c5dd",
  storageBucket: "tenedores-2c5dd.appspot.com",
  messagingSenderId: "631917019486",
  appId: "1:631917019486:web:8aef04f96ef819fced4fcf"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);