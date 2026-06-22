import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen() {
    const route = useRoute<RecipeDetailRouteProp>();
    const { recipe } = route.params;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{recipe.title}</Text>

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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
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