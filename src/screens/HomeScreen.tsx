import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <TouchableOpacity style={styles.button} onPress={signOut}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#c62828',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});