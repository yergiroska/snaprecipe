import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { generateRecipe } from '../services/recipeGenerationService';

type IngredientsResultRouteProp = RouteProp<RootStackParamList, 'IngredientsResult'>;
type IngredientsResultNavigationProp = NativeStackNavigationProp<RootStackParamList,'IngredientsResult'>;

export default function IngredientsResultScreen() {
    const route = useRoute<IngredientsResultRouteProp>();
    const navigation = useNavigation<IngredientsResultNavigationProp>();
    const [ingredients, setIngredients] = useState<string[]>(route.params.ingredients);
    const [newIngredient, setNewIngredient] = useState('');
    const [generating, setGenerating] = useState(false);

    const removeIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    const addIngredient = () => {
        const trimmed = newIngredient.trim();
        if (trimmed.length === 0) return;
        setIngredients((prev) => [...prev, trimmed]);
        setNewIngredient('');
    };

    const handleGenerateRecipe = async () => {
        setGenerating(true);
        try {
            const recipe = await generateRecipe(ingredients);
            navigation.navigate('RecipeDetail', { recipe });
        } catch (error) {
            Alert.alert(
                'Error al generar la receta',
                'No se pudo generar la receta. Verifica tu conexión e intenta de nuevo.'
            );
        } finally {
            setGenerating(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ingredientes detectados</Text>
            <Text style={styles.subtitle}>
                Revisa la lista, elimina lo que no corresponda o agrega algo que falte
            </Text>

            <FlatList
                data={ingredients}
                keyExtractor={(item, index) => `${item}-${index}`}
                style={styles.list}
                renderItem={({ item, index }) => (
                    <View style={styles.ingredientRow}>
                        <Text style={styles.ingredientText}>{item}</Text>
                        <TouchableOpacity onPress={() => removeIngredient(index)}>
                            <Text style={styles.removeText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No quedan ingredientes en la lista</Text>
                }
            />

            <View style={styles.addRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Agregar ingrediente"
                    placeholderTextColor="#999999"
                    value={newIngredient}
                    onChangeText={setNewIngredient}
                    onSubmitEditing={addIngredient}
                />
                <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    styles.continueButton,
                    (ingredients.length === 0 || generating) && styles.disabledButton,
                ]}
                disabled={ingredients.length === 0 || generating}
                onPress={handleGenerateRecipe}
            >
                {generating ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.continueButtonText}>Generar receta</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#666666',
        marginBottom: 16,
    },
    list: {
        flex: 1,
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    ingredientText: {
        fontSize: 16,
        color: '#000000',
    },
    removeText: {
        fontSize: 18,
        color: '#c62828',
        paddingHorizontal: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999999',
        marginTop: 20,
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#000000',
        marginRight: 8,
    },
    addButton: {
        backgroundColor: '#2e7d32',
        width: 44,
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#2e7d32',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    disabledButton: {
        backgroundColor: '#aaaaaa',
    },
    continueButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});