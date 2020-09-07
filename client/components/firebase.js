// import {config} from '../../public/firestoreConfig.js'
import firebase from 'firebase'

console.log(process.env.firebaseApiKey)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASEAPIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
}

console.log('firebaseConfig', firebaseConfig)

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()

export const fireauth = firebase.auth

const settings = {timestampsInSnapshots: true}
firebase.firestore().settings(settings)

export const db = firebase.firestore()

export const firebasestore = firebase.firestore
