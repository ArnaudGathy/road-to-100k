import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './components/Routes'
import { useAuth } from './hooks/useAuth'
import { Container } from '@material-ui/core'
import { Navigation } from './components/Navigation'
import styled from 'styled-components'

const NewContainer = styled.div`
	height: 85vh;
	overflow: auto;
`

export const App = () => {
	const [isAuth, setIsAuth] = useState<boolean>(false)
	const { login, authObserver } = useAuth()

	useEffect(() => {
		authObserver((user) => {
			if (user?.email === 'arno.firefox@gmail.com') {
				setIsAuth(true)
			} else {
				setIsAuth(false)
			}
		})
	}, [])

	if (!isAuth) {
		return (
			<Container>
				Login required <button onClick={login}>Login</button>
			</Container>
		)
	}

	return (
		<BrowserRouter>
			<Navigation />
			<NewContainer>
				<Container>
					<Routes />
				</Container>
			</NewContainer>
		</BrowserRouter>
	)
}
