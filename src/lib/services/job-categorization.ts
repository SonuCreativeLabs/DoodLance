import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export interface JobCategory {
  label: string;
  score: number;
}

export async function categorizeJob(title: string, description: string): Promise<JobCategory[]> {
  try {
    const text = `${title}\n${description}`;
    
    // Using a zero-shot classification model
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: text,
      parameters: {
        candidate_labels: [
          'Cleaning',
          'Gardening',
          'Home Maintenance',
          'Moving',
          'Pet Care',
          'Technology',
          'Teaching',
          'Personal Assistant',
          'Beauty & Wellness',
          'Events & Entertainment'
        ]
      }
    });

    return result.labels.map((label, index) => ({
      label,
      score: result.scores[index]
    }));
  } catch (error) {
    console.error('Error categorizing job:', error);
    return [];
  }
} 