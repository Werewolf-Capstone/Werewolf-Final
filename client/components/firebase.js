// import {config} from '../../public/firestoreConfig.js'
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: process.env.firebaseApiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()

export const fireauth = firebase.auth

const settings = {timestampsInSnapshots: true}
firebase.firestore().settings(settings)

export const db = firebase.firestore()

export const firebasestore = firebase.firestore
