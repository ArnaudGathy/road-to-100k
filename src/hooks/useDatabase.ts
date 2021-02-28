import { useEffect, useState } from 'react'
import firebase from 'firebase/app'

interface IEntities<T> {
	[key: string]: T
}

type IEntityWithID<T> = T & { uid: string }

export enum REFS {
	food = '/foods',
	ingredient = '/ingredients',
	meals = '/meals',
}

const objectToArray = function <T>(entities: IEntities<T>) {
	return Object.entries(entities).reduce(
		(acc: Array<IEntityWithID<T>>, [key, value]): Array<IEntityWithID<T>> => [
			...acc,
			{ uid: key, ...value },
		],
		[]
	)
}

export const useDatabase = function <T>(ref: REFS) {
	const add = (entity: T) => firebase.database().ref(ref).push(entity)

	const remove = (uid: string) => firebase.database().ref(`${ref}/${uid}`).remove()

	const update = ({ uid, value }: { uid: string; value: T }) =>
		firebase.database().ref(`${ref}/${uid}`).set(value)

	const [entities, setEntities] = useState<IEntities<T>>({})
	useEffect(() => {
		firebase
			.database()
			.ref(ref)
			.on('value', (snapshot) => setEntities(snapshot.val() || {}))
	}, [ref])

	return {
		entities,
		entitiesArray: objectToArray<T>(entities),
		add,
		remove,
		update,
	}
}
