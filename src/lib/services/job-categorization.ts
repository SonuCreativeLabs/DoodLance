import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface ClassificationResult {
  label: string;
  score: number;
}

export async function categorizeJob(description: string): Promise<string> {
  try {
    const response = await hf.textClassification({
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

    // Find the label with the highest score
    const results = response as ClassificationResult[];
    const bestMatch = results.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    return bestMatch.label;
  } catch (error) {
    console.error('Error categorizing job:', error);
    return 'other';
  }
} 