import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

interface Category {
  label: string;
  score: number;
}

interface ZeroShotClassificationResult {
  label: string;
  score: number;
}

export async function categorizeJob(title: string, description: string): Promise<Category[]> {
  try {
    // Combine title and description for better context
    const text = `${title}. ${description}`;
    
    // Use a zero-shot classification model to categorize the job
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: text,
      parameters: {
        candidate_labels: [
          'Home Improvement',
          'Cleaning',
          'Moving & Packing',
          'Gardening',
          'Pet Care',
          'Tutoring',
          'Event Planning',
          'Personal Training',
          'Beauty & Wellness',
          'Tech Support',
          'Writing & Translation',
          'Graphic Design',
          'Photography',
          'Music Lessons',
          'Cooking & Baking'
        ]
      }
    });

    // Map the results to our Category interface
    return result.map((item: ZeroShotClassificationResult) => ({
      label: item.label,
      score: item.score
    }));
  } catch (error) {
    console.error('Error categorizing job:', error);
    return [];
  }
} 