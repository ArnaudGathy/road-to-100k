import React, { useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import FastfoodIcon from '@material-ui/icons/Fastfood'
import AddIcon from '@material-ui/icons/Add'
import KitchenIcon from '@material-ui/icons/Kitchen'
import { useHistory } from 'react-router-dom'
import { ROUTES } from './Routes'
import styled from 'styled-components'

const BottomNav = styled(BottomNavigation)`
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 60px;
	z-index: 10;
`

export const Navigation = () => {
	const history = useHistory()
	const [value, setValue] = useState(0)

	return (
		<BottomNav
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue)
			}}
			showLabels
		>
			<BottomNavigationAction
				label="Add"
				icon={<AddIcon />}
				onClick={() => history.push(ROUTES.addMeal)}
			/>
			<BottomNavigationAction
				label="Meals"
				icon={<FastfoodIcon />}
				onClick={() => history.push(ROUTES.meals)}
			/>
			<BottomNavigationAction
				label="Food"
				icon={<KitchenIcon />}
				onClick={() => history.push(ROUTES.foods)}
			/>
		</BottomNav>
	)
}
