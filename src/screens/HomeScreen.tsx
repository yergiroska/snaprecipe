import { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { detectIngredients } from '../services/groqVisionService';
import { RootStackParamList } from '../types/navigation';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeNavigationProp>();
    const { signOut } = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    const takePicture = async () => {
        if (!cameraRef.current) return;
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        if (photo) {
            setPhotoUri(photo.uri);
        }
    };

    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const retake = () => setPhotoUri(null);

    const useThisPhoto = async () => {
        if (!photoUri) return;
        setAnalyzing(true);
        try {
            const ingredients = await detectIngredients(photoUri);
            if (ingredients.length === 0) {
                Alert.alert(
                    'Sin ingredientes detectados',
                    'No se detectaron ingredientes en la foto. Intenta con otra imagen.'
                );
                return;
            }
            navigation.navigate('IngredientsResult', { ingredients });
            setPhotoUri(null);
        } catch (error) {
            Alert.alert(
                'Error al analizar la foto',
                'No se pudo procesar la imagen. Verifica tu conexión e intenta de nuevo.'
            );
        } finally {
            setAnalyzing(false);
        }
    };

    if (!permission) {
        return (
            <View style={styles.center}>
                <Text>Cargando permisos...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.message}>
                    Necesitamos acceso a tu cámara para fotografiar los ingredientes
                </Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Conceder permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (photoUri) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photoUri }} style={styles.preview} />
                {analyzing ? (
                    <View style={styles.row}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.analyzingText}>Analizando ingredientes...</Text>
                    </View>
                ) : (
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.secondaryButton} onPress={retake}>
                            <Text style={styles.buttonText}>Repetir foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={useThisPhoto}>
                            <Text style={styles.buttonText}>Usar esta foto</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>

            <CameraView ref={cameraRef} style={styles.camera} facing="back" />

            <View style={styles.row}>
                <TouchableOpacity style={styles.secondaryButton} onPress={pickFromGallery}>
                    <Text style={styles.buttonText}>Galería</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    message: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 16,
    },
    camera: {
        flex: 1,
    },
    preview: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#000000',
    },
    button: {
        backgroundColor: '#2e7d32',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    secondaryButton: {
        backgroundColor: '#555555',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#ffffff',
        borderWidth: 4,
        borderColor: '#cccccc',
    },
    logoutButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 12,
    },
    analyzingText: {
        color: '#ffffff',
        marginLeft: 12,
        fontSize: 16,
    },
});