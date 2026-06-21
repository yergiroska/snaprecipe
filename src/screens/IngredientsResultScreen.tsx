import { View, Text, StyleSheet } from 'react-native';

export default function IngredientsResultScreen() {
    return (
        <View style={styles.container}>
            <Text>Ingredients Result Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});