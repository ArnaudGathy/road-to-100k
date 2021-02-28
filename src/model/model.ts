export interface Food {
	name: string,
	calories: number
}

export interface Ingredient {
	food: string,
	weight: number,
}

export interface Meal {
	ingredients: string[],
	name: string,
}