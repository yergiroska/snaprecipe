import { Recipe } from './recipe';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    IngredientsResult: { ingredients: string[] };
    RecipeDetail: { recipe: Recipe };
};

export type MainTabParamList = {
    Home: undefined;
    SavedRecipes: undefined;
};