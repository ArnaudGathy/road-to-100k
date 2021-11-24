import React from 'react'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import styled from 'styled-components'
import { IEntityWithID, REFS, useDatabase } from '../hooks/useDatabase'
import { Food, Ingredient, Meal } from '../model/model'
import { sortBy, prop } from 'ramda'

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
	position: relative;

	input {
		margin-top: 6px;
		margin-right: 30px;
	}
`

const AddContainer = styled.div`
	margin: 16px 0;
	display: flex;
	justify-content: space-between;
`

const PlusButton = styled.button`
	height: 30px;
	width: 30px;
	font-size: 20px;
	background-color: greenyellow;
	border: 1px solid black;
	align-items: center;
	display: flex;
	justify-content: center;
`

const RemoveButton = styled(PlusButton)`
	position: absolute;
	right: 5px;
	top: 5px;
	border-radius: 20px;
	background-color: tomato;
`

const SuggestionList = styled.div`
	position: absolute;
	top: 42px;

	ul {
		list-style-type: none;
		border: 1px solid black;
	}

	li {
		padding: 4px 2px;
		background-color: #fafafa;
	}

	li:nth-of-type(2n) {
		background-color: #f1f1f1;
	}
`

interface IIngredient {
	name: string
	weight: string
	calories: string
	uid?: string
}
interface IFormData {
	name: string
	ingredients: Array<IIngredient>
}

const computeCaloriesPer100g = (ingredients: IFormData['ingredients']) =>
	Math.round(
		computeCalories(ingredients) /
			(ingredients.reduce((acc, { weight }) => acc + parseInt(weight, 10), 0) / 100)
	)

const computeCalories = (ingredients: IFormData['ingredients']) =>
	Math.round(
		ingredients.reduce(
			(acc: number, { calories, weight }) =>
				acc + parseInt(calories, 10) * (parseInt(weight, 10) / 100),
			0
		)
	)

const trimString = (val: string) =>
	val
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
		.toLowerCase()

export const AddMeal = () => {
	const { add: addIngredient } = useDatabase<Ingredient>(REFS.ingredient)
	const { add: addFood, entitiesArray: foodList } = useDatabase<Food>(REFS.food)
	const { add: addMeal } = useDatabase<Meal>(REFS.meals)

	const onSubmit = async (data: IFormData) => {
		const { ingredients } = data

		const ingredientsIds = await Promise.all(
			ingredients.map(async ({ name, calories, weight, uid }) => {
				let foodUid = uid ?? null
				if (!uid) {
					foodUid = (await addFood({ name, calories })).key
				}

				const ingredientResponse = await addIngredient({ food: foodUid ?? '', weight })
				return ingredientResponse.key ?? ''
			})
		)

		await addMeal({ name: data.name, ingredients: ingredientsIds })
	}

	const getSuggestions = (value: string) => {
		if (!value) {
			return []
		}

		const inputValue = trimString(value)
		const inputLength = inputValue.length

		return inputLength === 0
			? []
			: sortBy(
					prop('name'),
					foodList.filter((food) => trimString(food.name).includes(inputValue))
			  )
	}

	const renderSuggestions = (
		fieldValue: string,
		index: number,
		updateFunc: (index: number, newValue: IIngredient) => void
	) => {
		const updateFormValue = (newValue: IEntityWithID<Food>) => {
			updateFunc(index, {
				name: newValue.name,
				calories: newValue.calories,
				uid: newValue.uid,
				weight: '',
			})
		}

		const suggestions = getSuggestions(fieldValue)
		const hasPerfectMatch =
			suggestions.length === 1 && trimString(fieldValue) === trimString(suggestions[0].name)

		if (!suggestions.length || hasPerfectMatch) {
			return null
		} else {
			return (
				<ul>
					{suggestions.map((suggest) => (
						<li key={suggest.uid} onClick={() => updateFormValue(suggest)}>
							{suggest.name}
						</li>
					))}
				</ul>
			)
		}
	}

	return (
		<>
			<Title>Add a meal</Title>
			<Form
				onSubmit={onSubmit}
				mutators={{
					...arrayMutators,
				}}
				initialValues={{ ingredients: [{}] }}
				render={({ handleSubmit, values, form }) => (
					<form
						onSubmit={async (event) => {
							await handleSubmit(event)
							form.reset()
						}}
						autoComplete="off"
					>
						<FieldArray name="ingredients">
							{({ fields }) => (
								<>
									<Field component="input" name="name" placeholder="Meal name" />
									{fields.map((name, index) => (
										<FieldArrayContainer key={name}>
											<Field component="input" name={`${name}.name`} placeholder="name" />
											<SuggestionList>
												{renderSuggestions(values?.ingredients[index].name, index, fields.update)}
											</SuggestionList>
											<Field
												component="input"
												name={`${name}.weight`}
												placeholder="weight"
												type="number"
											/>
											<Field
												component="input"
												name={`${name}.calories`}
												placeholder="calories"
												type="number"
											/>
											<RemoveButton
												onClick={() => {
													fields.remove(index)
												}}
											>
												-
											</RemoveButton>
										</FieldArrayContainer>
									))}
									{!!values?.ingredients?.length && (
										<>
											<div>Total calories : {computeCalories(values.ingredients) || '...'}</div>
											<div>
												Calories / 100g : {computeCaloriesPer100g(values.ingredients) || '...'}
											</div>
										</>
									)}
									<AddContainer>
										<PlusButton
											type="button"
											onClick={() => fields.push({ name: '', weight: '', calories: '' })}
										>
											+
										</PlusButton>
										<button type="submit">Add meal</button>
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
