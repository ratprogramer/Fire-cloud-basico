import llave from '../key/llave.json' assert { type: 'json' }
import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert(llave),
    storageBucket: 'url-images-generator.appspot.com'
})

export const bucket = admin.storage().bucket()