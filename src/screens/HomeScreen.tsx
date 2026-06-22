import { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
    const { signOut } = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
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

    // Caso 1: aún no sabemos si hay permiso (cargando)
    if (!permission) {
        return (
            <View style={styles.center}>
                <Text>Cargando permisos...</Text>
            </View>
        );
    }

    // Caso 2: permiso denegado o no concedido todavía
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

    // Caso 3: ya hay una foto tomada, mostrar preview
    if (photoUri) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photoUri }} style={styles.preview} />
                <View style={styles.row}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={retake}>
                        <Text style={styles.buttonText}>Repetir foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => {}}>
                        <Text style={styles.buttonText}>Usar esta foto</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Caso 4: cámara en vivo, lista para capturar
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
});