import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SavedRecipesScreen from '../screens/SavedRecipesScreen';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="SavedRecipes" component={SavedRecipesScreen} />
        </Tab.Navigator>
    );
}