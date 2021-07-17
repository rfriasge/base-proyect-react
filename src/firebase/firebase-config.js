import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';



var firebaseConfig = {
    apiKey: "AIzaSyCbzLtG7NEiItn0YmQDDhPyvc5iKT2MAp4",
    authDomain: "loginapp-89c08.firebaseapp.com",
    databaseURL: "https://loginapp-89c08.firebaseio.com",
    projectId: "loginapp-89c08",
    storageBucket: "loginapp-89c08.appspot.com",
    messagingSenderId: "787698335828",
    appId: "1:787698335828:web:ed2f7b39fa5686f23c6dc1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  export{
	  db,
	  googleAuthProvider,
	  firebase
  }