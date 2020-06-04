// import something here
import VueFirestore from 'vue-firestore'
import firebase from 'firebase'
require('firebase/firestore')

var config = {
    apiKey: "AIzaSyCj9cTOCGWcP_jrIFoKxyIwBukBAxuFzfE",
    authDomain: "mapsvue-2015a.firebaseapp.com",
    databaseURL: "https://mapsvue-2015a.firebaseio.com",
    projectId: "mapsvue-2015a",
    storageBucket: "mapsvue-2015a.appspot.com",
    messagingSenderId: "757288549976",
    appId: "1:757288549976:web:707d6d8be439119623542d"
}

export var firebase2 = firebase.initializeApp(config, 'firebase2')
export var AUTH2 = firebase2.auth()
// Initialize Firebase.
firebase.initializeApp(config);
// "async" is optional
export default async ({ Vue }) => {
  // something to do
  Vue.prototype.$firebase = firebase
  Vue.prototype.$firestoreApp = firebase.firestore()
  Vue.prototype.$auth2 = AUTH2
  Vue.use(VueFirestore)
  Vue.use(firebase)
}
