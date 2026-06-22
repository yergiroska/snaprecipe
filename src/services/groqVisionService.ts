import * as FileSystem from 'expo-file-system/legacy';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

export async function detectIngredients(imageUri: string): Promise<string[]> {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const dataUrl = `data:image/jpeg;base64,${base64}`;

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text:
                                'Identify all food ingredients visible in this image. ' +
                                'Respond ONLY with a valid JSON object in this exact format: ' +
                                '{"ingredients": ["ingredient1", "ingredient2"]}. ' +
                                'Use simple, common ingredient names in Spanish. ' +
                                'If no food ingredients are visible, respond with {"ingredients": []}.',
                        },
                        {
                            type: 'image_url',
                            image_url: { url: dataUrl },
                        },
                    ],
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('Respuesta vacía de Groq Vision');
    }

    const parsed = JSON.parse(content);
    return parsed.ingredients ?? [];
}