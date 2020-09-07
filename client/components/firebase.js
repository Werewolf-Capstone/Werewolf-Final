// import {config} from '../../public/firestoreConfig.js'
import firebase from 'firebase'

console.log(atob(process.env.firebaseApiKey))

const firebaseConfig = {
  apiKey: atob(process.env.firebaseApiKey),
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
}

console.log('firebaseConfig', firebaseConfig)

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()

export const fireauth = firebase.auth

const settings = {timestampsInSnapshots: true}
firebase.firestore().settings(settings)

export const db = firebase.firestore()

export const firebasestore = firebase.firestore
