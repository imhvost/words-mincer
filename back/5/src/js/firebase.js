import firebase from 'firebase/app'

var config = {
  apiKey: 'AIzaSyAvJ5At1MHaXmbfh5yTxHtGKSCZuLCbpAw',
  authDomain: 'words-mincer.firebaseapp.com',
  databaseURL: 'https://words-mincer.firebaseio.com',
  projectId: 'words-mincer',
  storageBucket: 'words-mincer.appspot.com',
  messagingSenderId: '145271931064',
  appId: '1:145271931064:web:683841e6325c4cd3'
}
let firebaseApp = firebase.initializeApp(config)

export default firebaseApp
