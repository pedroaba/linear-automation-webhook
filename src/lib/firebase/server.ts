import { env } from '@auto-pedroaba/env'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const privateKeyInUtf8 = Buffer.from(
  env.FIREBASE_PRIVATE_KEY_BASE64,
  'base64',
).toString('utf-8')

export const firebaseCert = cert({
  projectId: env.FIREBASE_PROJECT_ID,
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
  privateKey: privateKeyInUtf8,
})

const apps = getApps()
const isAppInitialized = apps.length > 0
if (!isAppInitialized) {
  initializeApp({
    credential: firebaseCert,
  })
}

export const firestore = getFirestore()
