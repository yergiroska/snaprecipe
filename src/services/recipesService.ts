import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Recipe } from '../types/recipe';

export interface SavedRecipe extends Recipe {
    id: string;
    savedAt: Timestamp;
}

function recipesCollection(userId: string) {
    return collection(db, 'users', userId, 'savedRecipes');
}

export async function saveRecipe(userId: string, recipe: Recipe): Promise<string> {
    const ref = doc(recipesCollection(userId));
    await setDoc(ref, {
        ...recipe,
        savedAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getSavedRecipes(userId: string): Promise<SavedRecipe[]> {
    const snapshot = await getDocs(recipesCollection(userId));
    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<SavedRecipe, 'id'>),
    }));
}

export async function deleteSavedRecipe(userId: string, recipeId: string): Promise<void> {
    const ref = doc(db, 'users', userId, 'savedRecipes', recipeId);
    await deleteDoc(ref);
}