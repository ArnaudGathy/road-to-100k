import React from 'react'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { TextField } from 'mui-rff'
import styled from 'styled-components'
import { Button, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { REFS, useDatabase } from '../hooks/useDatabase'
import { Food, Ingredient, Meal } from '../model/model'

const Title = styled.h1`
	padding: 16px 0;
`

const FieldArrayContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 8px 0;
	background-color: rgba(0, 0, 0, 0.05);
	padding: 16px;
	border-radius: 16px;
`

const Input = styled(TextField)`
	.MuiInput-root {
		margin: 16px 0;
	}
`

const MediumInput = styled(Input)`
	.MuiInput-root {
		width: 35ch;
	}
`

const SmallInput = styled(Input)`
	.MuiInput-root {
		width: 18ch;
		margin-right: 8px;
	}
`

const AddContainer = styled.div`
	margin: 16px 0;
	display: flex;
	justify-content: space-between;
`

const FirstLine = styled.div`
	display: flex;
	align-items: center;
`

const ButtonContainer = styled.div`
	margin-left: 16px;
`

interface IFormData {
	name: string
	ingredients: Array<{ name: string; weight: number; calories: number }>
}

const computeCaloriesPer100g = (data: IFormData) =>
	Math.round(
		computeCalories(data) / (data.ingredients.reduce((acc, { weight }) => acc + weight, 0) / 100)
	)

const computeCalories = (data: IFormData) =>
	data.ingredients.reduce((acc: number, { calories }) => acc + calories, 0)

export const AddMeal = () => {
	const { add: addIngredient } = useDatabase<Ingredient>(REFS.ingredient)
	const { add: addFood } = useDatabase<Food>(REFS.food)
	const { add: addMeal } = useDatabase<Meal>(REFS.meals)

	const onSubmit = async (data: IFormData) => {
		const { ingredients } = data

		const ingredientsIds = await Promise.all(
			ingredients.map(async ({ name, calories, weight }) => {
				const foodResponse = await addFood({ name, calories })
				const ingredientResponse = await addIngredient({ food: foodResponse.key ?? '', weight })
				return ingredientResponse.key ?? ''
			})
		)

		await addMeal({ name: data.name, ingredients: ingredientsIds })
	}

	return (
		<>
			<Title>Add a meal</Title>
			<Form
				onSubmit={onSubmit}
				mutators={{
					...arrayMutators,
				}}
				initialValues={{ ingredients: [{ name: '', weight: '', calories: '' }] }}
				render={({ handleSubmit, values }) => (
					<form onSubmit={handleSubmit}>
						<FieldArray name="ingredients">
							{({ fields }) => (
								<>
									<Input label="Meal name" name="name" required={true} />
									{fields.map((name, index) => (
										<FieldArrayContainer key={name}>
											<FirstLine>
												<MediumInput
													label="Name"
													name={`${name}.name`}
													required={true}
													fullWidth={false}
												/>
												<ButtonContainer>
													<IconButton
														aria-label="delete"
														color="secondary"
														size="small"
														onClick={() => {
															fields.remove(index)
														}}
													>
														<DeleteIcon />
													</IconButton>
												</ButtonContainer>
											</FirstLine>
											<div>
												<SmallInput
													label="Weight"
													name={`${name}.weight`}
													required={true}
													fullWidth={false}
												/>
												<SmallInput
													label="Calories"
													name={`${name}.calories`}
													required={true}
													fullWidth={false}
												/>
											</div>
										</FieldArrayContainer>
									))}
									<div>Total calories : {computeCalories(values)}</div>
									<div>Calories / 100g : {computeCaloriesPer100g(values)}</div>
									<AddContainer>
										<Button
											variant="outlined"
											color="primary"
											size="small"
											startIcon={<AddIcon />}
											onClick={() => fields.push({ name: '', weight: '', calories: '' })}
										>
											Add Ingredient
										</Button>
										<Button variant="contained" type="submit" color="primary">
											Add meal
										</Button>
									</AddContainer>
								</>
							)}
						</FieldArray>
					</form>
				)}
			/>
		</>
	)
}
