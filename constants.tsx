
import React from 'react';
import { IdolCategory, Photocard, PlaylistLink } from './types';

export const INITIAL_PHOTOCARDS: Photocard[] = [
  {
    id: '1',
    url: 'https://i.pinimg.com/736x/f9/58/7f/f9587f77d1dd2c21143fd0f198f4953c.jpg',
    title: 'Riize Official',
    category: 'Riize',
    dateAdded: '2024-01-15',
    tags: ['Anton', 'RIIZING'],
    memo: 'The aesthetic of this shot is perfect.'
  },
  {
    id: '2',
    url: 'https://i.pinimg.com/736x/58/30/1c/58301cd93a584516f63137b0b8974f45.jpg',
    title: 'NCT 127 WALK',
    category: 'NCT127',
    dateAdded: '2024-02-10',
    tags: ['Doyoung', 'MemberCard'],
    memo: 'WALK concept is everything.'
  },
  {
    id: '3',
    url: 'https://i.pinimg.com/736x/5b/09/7d/5b097d9f485664220306edbc0ba1aa08.jpg',
    title: 'XngHan Kit',
    category: 'XngHan',
    dateAdded: '2023-12-01',
    tags: ['XngHan', 'Solo'],
  }
];

export const INITIAL_PLAYLISTS: PlaylistLink[] = [
  { 
    name: 'Riize - RIIZING', 
    url: 'https://music.youtube.com/playlist?list=OLAK5uy_nYY8Bh88vPBAb2w_3Y6JC0ZcsykUo43zA&si=i7vOwZflwZKU3hNy', 
    platform: 'YouTube',
    category: 'Riize'
  },
  { 
    name: 'NCT 127 - WALK', 
    url: 'https://music.youtube.com/playlist?list=OLAK5uy_lCsEbbiKuWJAzPBH5zjaAZXV4CobCUWjg', 
    platform: 'YouTube',
    category: 'NCT127'
  }
];

export const MEDIA_LINKS = {
  Riize: {
    instagram: 'https://www.instagram.com/riize_official/',
    youtube: 'https://www.youtube.com/@RIIZE_official'
  },
  NCT127: {
    instagram: 'https://www.instagram.com/nct127/',
    youtube: 'https://www.youtube.com/@nct127'
  },
  XngHan: {
    instagram: 'https://www.instagram.com/xnghan/',
    youtube: 'https://www.youtube.com/@XngHan'
  }
};

export const Doodles = {
  Flower: () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-60">
      <path d="M50 50 Q60 20 50 10 Q40 20 50 50 Q80 40 90 50 Q80 60 50 50 Q60 80 50 90 Q40 80 50 50 Q20 60 10 50 Q20 40 50 50" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-60">
      <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Wavy: () => (
    <svg viewBox="0 0 100 20" className="w-full h-4 opacity-40">
      <path d="M0 10 Q10 0 20 10 T40 10 T60 10 T80 10 T100 10" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
};
