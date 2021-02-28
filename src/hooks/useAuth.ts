import firebase from 'firebase/app'

export const useAuth = () => {
	const provider = new firebase.auth.GoogleAuthProvider()
	const login = () => firebase.auth().signInWithPopup(provider)
	const authObserver = (cb: (user: firebase.User | null) => void) => firebase.auth().onAuthStateChanged(cb)
	const logOut = () => firebase.auth().signOut()

	return { authObserver, login, logOut }
}