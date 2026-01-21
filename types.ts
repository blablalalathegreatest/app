
export type IdolCategory = 'Riize' | 'NCT127' | 'XngHan';

export interface Photocard {
  id: string;
  url: string;
  title: string;
  category: IdolCategory;
  dateAdded: string;
  tags?: string[];
  memo?: string;
}

export interface PlaylistLink {
  name: string;
  url: string;
  platform: 'Spotify' | 'YouTube' | 'Apple Music' | 'Other';
  category: IdolCategory;
}
