import { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { saveRecipe } from '../services/recipesService';

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen() {
    const route = useRoute<RecipeDetailRouteProp>();
    const navigation = useNavigation();
    const { recipe } = route.params;
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await saveRecipe(user.uid, recipe);
            setSaved(true);
        } catch (error) {
            console.log('Error al guardar:', error);
            Alert.alert('Error al guardar', String(error));
        } finally {
            setSaving(false);
        }
    };

    const goToSavedRecipes = () => {
        (navigation as any).navigate('MainTabs', { screen: 'SavedRecipes' });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{recipe.title}</Text>
                <View style={styles.buttonsColumn}>
                    <TouchableOpacity
                        style={[styles.saveButton, saved && styles.savedButton]}
                        onPress={handleSave}
                        disabled={saving || saved}
                    >
                        {saving ? (
                            <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                            <Text style={styles.saveButtonText}>{saved ? '★ Guardada' : '☆ Guardar'}</Text>
                        )}
                    </TouchableOpacity>

                    {saved && (
                        <TouchableOpacity style={styles.viewSavedButton} onPress={goToSavedRecipes}>
                            <Text style={styles.viewSavedButtonText}>Ver guardadas →</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>⏱ {recipe.prepTimeMinutes} min</Text>
                </View>
                <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>{recipe.dietType}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {recipe.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.listItem}>
                    • {ingredient}
                </Text>
            ))}

            <Text style={styles.sectionTitle}>Preparación</Text>
            {recipe.steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 12,
    },
    buttonsColumn: {
        alignItems: 'flex-end',
    },
    saveButton: {
        backgroundColor: '#2e7d32',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        minWidth: 90,
        alignItems: 'center',
    },
    savedButton: {
        backgroundColor: '#aaaaaa',
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    viewSavedButton: {
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    viewSavedButtonText: {
        color: '#2e7d32',
        fontWeight: '600',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    metaBadge: {
        backgroundColor: '#e8f5e9',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    metaText: {
        color: '#2e7d32',
        fontWeight: '600',
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    listItem: {
        fontSize: 15,
        color: '#333333',
        marginBottom: 6,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    stepNumber: {
        backgroundColor: '#2e7d32',
        color: '#ffffff',
        fontWeight: 'bold',
        width: 24,
        height: 24,
        borderRadius: 12,
        textAlign: 'center',
        lineHeight: 24,
        marginRight: 10,
        fontSize: 13,
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        color: '#333333',
        lineHeight: 21,
    },
});