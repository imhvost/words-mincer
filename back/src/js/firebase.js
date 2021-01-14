import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyDkY94TXAni2wVyg80nMRz7ye4xa6STEYw',
  authDomain: 'words-70e29.firebaseapp.com',
  databaseURL: 'https://words-70e29.firebaseio.com',
  projectId: 'words-70e29',
  storageBucket: 'words-70e29.appspot.com',
  messagingSenderId: '949980257456'
}
let firebaseApp = firebase.initializeApp(config)

export default firebaseApp
