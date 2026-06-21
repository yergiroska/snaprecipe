import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import IngredientsResultScreen from '../screens/IngredientsResultScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            {user ? (
                <>
                    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="IngredientsResult" component={IngredientsResultScreen} />
                    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                </>
            )}
        </Stack.Navigator>
    );
}