import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import IngredientsResultScreen from '../screens/IngredientsResultScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <Stack.Navigator initialRouteName="MainTabs">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="IngredientsResult" component={IngredientsResultScreen} />
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        </Stack.Navigator>
    );
}