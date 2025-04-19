import { env } from "@/env.mjs";

interface Category {
  label: string;
  score: number;
}

interface ZeroShotClassificationResult {
  labels: string[];
  scores: number[];
}

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

export async function categorizeJob(title: string, description: string): Promise<Category[]> {
  try {
    console.log('Categorizing job:', { title, description });
    
    const response = await fetch('/api/categorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API error:', data.error);
      throw new Error(data.error || 'Failed to categorize job');
    }

    if (!data.labels || !data.scores) {
      console.error('Invalid API response:', data);
      throw new Error('Invalid response from categorization service');
    }
    
    return data.labels.map((label: string, index: number) => ({
      label,
      score: data.scores[index],
    }));
  } catch (error) {
    console.error('Error categorizing job:', error);
    // Return a default category if the API call fails
    return [{
      label: 'Other',
      score: 1.0
    }];
  }
} 