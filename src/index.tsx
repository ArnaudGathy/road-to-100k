import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { firebaseConfig } from './config/firebase'
import firebase from 'firebase/app'
import './default.css'

firebase.initializeApp(firebaseConfig)

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
)
