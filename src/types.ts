export type ZeroShotClassificationOutput = Array<{
  sequence: string;
  labels: string[];
  scores: number[];
}>; 