import { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { getSavedRecipes, deleteSavedRecipe, SavedRecipe } from '../services/recipesService';
import { RootStackParamList } from '../types/navigation';

type SavedRecipesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function SavedRecipesScreen() {
    const navigation = useNavigation<SavedRecipesNavigationProp>();
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadRecipes = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const result = await getSavedRecipes(user.uid);
            setRecipes(result);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las recetas guardadas.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Recarga la lista cada vez que esta pantalla recibe foco
    // (por ejemplo, después de guardar una receta nueva y volver aquí)
    useFocusEffect(
        useCallback(() => {
            loadRecipes();
        }, [loadRecipes])
    );

    const handleDelete = (recipeId: string) => {
        if (!user) return;
        Alert.alert('Eliminar receta', '¿Seguro que quieres eliminar esta receta guardada?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    setDeletingId(recipeId);
                    try {
                        await deleteSavedRecipe(user.uid, recipeId);
                        setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
                    } catch (error) {
                        console.log('Error al eliminar:', error);
                        Alert.alert('Error', 'No se pudo eliminar la receta.');
                    } finally {
                        setDeletingId(null);
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis recetas guardadas</Text>

            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Todavía no has guardado ninguna receta</Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardMeta}>
                                ⏱ {item.prepTimeMinutes} min · {item.dietType}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            style={styles.deleteButton}
                        >
                            {deletingId === item.id ? (
                                <ActivityIndicator size="small" color="#c62828" />
                            ) : (
                                <Text style={styles.deleteText}>✕</Text>
                            )}
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999999',
        marginTop: 40,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardMeta: {
        fontSize: 13,
        color: '#666666',
    },
    deleteButton: {
        width: 28,
        alignItems: 'center',
    },
    deleteText: {
        fontSize: 18,
        color: '#c62828',
        paddingHorizontal: 8,
    },
});