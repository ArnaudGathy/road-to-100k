import 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: "road-to-100k-9642a.firebaseapp.com",
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: "road-to-100k-9642a",
	storageBucket: "road-to-100k-9642a.appspot.com",
	messagingSenderId: "853981989763",
	appId: process.env.REACT_APP_APP_ID,
}