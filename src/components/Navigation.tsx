import React, { useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import { useHistory } from 'react-router-dom'
import { ROUTES } from './Routes'
import styled from 'styled-components'

const BottomNav = styled(BottomNavigation)`
	position: fixed;
	bottom: 0;
	width: 100%;
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
				icon={<RestoreIcon />}
				onClick={() => history.push(ROUTES.addMeal)}
			/>
			<BottomNavigationAction
				label="Meals"
				icon={<FavoriteIcon />}
				onClick={() => history.push(ROUTES.meals)}
			/>
			<BottomNavigationAction
				label="Food"
				icon={<LocationOnIcon />}
				onClick={() => history.push(ROUTES.foods)}
			/>
		</BottomNav>
	)
}
