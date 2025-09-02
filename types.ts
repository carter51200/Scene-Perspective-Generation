
export interface ShotProfile {
  name: string;
  lens: string;
  description: string;
  prompt: string;
}

export interface GeneratedImage extends ShotProfile {
  imageUrl: string | null;
  isLoading?: boolean;
}
