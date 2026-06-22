import { Recipe } from '../types/recipe';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_TEXT_MODEL = 'llama-3.3-70b-versatile';

export async function generateRecipe(ingredients: string[]): Promise<Recipe> {
    const ingredientsList = ingredients.join(', ');

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: GROQ_TEXT_MODEL,
            messages: [
                {
                    role: 'user',
                    content:
                        `Genera una receta de cocina usando estos ingredientes disponibles: ${ingredientsList}. ` +
                        'Puedes asumir que el usuario también tiene condimentos básicos (sal, pimienta, aceite, agua). ' +
                        'Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, con este formato exacto: ' +
                        '{"title": "Nombre de la receta", ' +
                        '"ingredients": ["ingrediente 1 con cantidad", "ingrediente 2 con cantidad"], ' +
                        '"steps": ["paso 1", "paso 2", "paso 3"], ' +
                        '"prepTimeMinutes": 30, ' +
                        '"dietType": "vegetariana"}. ' +
                        'El campo dietType debe ser uno de: "vegetariana", "vegana", "sin gluten", "carnívora", "apta para diabéticos", "sin restricciones". ' +
                        'Todo el contenido debe estar en español.',
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('Respuesta vacía de Groq al generar la receta');
    }

    const parsed: Recipe = JSON.parse(content);
    return parsed;
}