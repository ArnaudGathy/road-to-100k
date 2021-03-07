import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AddMeal } from '../screens/AddMeal'
import { Foods } from '../screens/Foods'
import { Meals } from '../screens/Meals'

export enum ROUTES {
	root = '/',
	addMeal = '/addmeal',
	meals = '/meals',
	foods = '/foods',
}

export const Routes = () => (
	<Switch>
		<Route path={ROUTES.addMeal} component={AddMeal} />
		<Route path={ROUTES.meals} component={Meals} />
		<Route path={ROUTES.foods} component={Foods} />
		<Redirect from={ROUTES.root} to={ROUTES.addMeal} />
	</Switch>
)
