// import {config} from '../../public/firestoreConfig.js'
import firebase from 'firebase'

console.log(process.env.firebaseApiKey)

const firebaseConfig = {
  apiKey: 'AIzaSyDRRUvacIROPbqJN-lYP9m2ZrSgM_AkHzM',
  authDomain: 'werewolf-capstone.firebaseapp.com',
  databaseURL: 'https://werewolf-capstone.firebaseio.com',
  projectId: 'werewolf-capstone',
  storageBucket: 'werewolf-capstone.appspot.com',
  messagingSenderId: '74673561059',
  appId: '1:74673561059:web:b44d84cc74d54e784594d6',
  measurementId: 'G-M6N194G87D',
}

console.log('firebaseConfig', firebaseConfig)

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()

export const fireauth = firebase.auth

const settings = {timestampsInSnapshots: true}
firebase.firestore().settings(settings)

export const db = firebase.firestore()

export const firebasestore = firebase.firestore
