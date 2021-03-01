export interface Food {
	name: string,
	calories: string
}

export interface Ingredient {
	food: string,
	weight: string,
}

export interface Meal {
	ingredients: string[],
	name: string,
}