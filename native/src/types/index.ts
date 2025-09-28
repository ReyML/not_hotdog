export type SelectedImage = {
  uri: string;
  dataUri: string;
  mimeType: string;
  name: string;
  size?: number;
};

export type AnalysisResult = {
  description: string;
  isHamburger: boolean;
};
