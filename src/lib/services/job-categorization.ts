import { HfInference } from '@huggingface/inference';
import { ZeroShotClassificationOutput } from '@/types';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export async function categorizeJob(description: string): Promise<string> {
  try {
    const response = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: description,
      parameters: {
        candidate_labels: [
          'plumbing',
          'electrical',
          'carpentry',
          'cleaning',
          'tutoring',
          'gardening',
          'pet care',
          'moving',
          'painting',
          'other'
        ]
      }
    });

    // Cast the response to our expected type
    const result = (response as unknown as ZeroShotClassificationOutput)[0];
    const maxIndex = result.scores.indexOf(Math.max(...result.scores));
    return result.labels[maxIndex];
  } catch (error) {
    console.error('Error categorizing job:', error);
    // Return the existing category if available, otherwise 'other'
    return 'other';
  }
} 