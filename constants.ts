import type { Option } from './types';

export const CATEGORIZED_MODELS: Record<string, Option[]> = {
  Women: [
    {
      id: 'woman_1',
      name: 'Elena',
      imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop',
    },
    {
      id: 'woman_2',
      name: 'Sophie',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop',
    },
    {
      id: 'woman_3',
      name: 'Maya',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop',
    },
    {
      id: 'woman_4',
      name: 'Isabella',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    },
    {
      id: 'woman_5',
      name: 'Aria',
      imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=400&fit=crop',
    },
  ],
  Men: [
    {
      id: 'man_1',
      name: 'Alexander',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop',
    },
    {
      id: 'man_2',
      name: 'Marcus',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    },
    {
      id: 'man_3',
      name: 'Daniel',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop',
    },
    {
      id: 'man_4',
      name: 'Leo',
      imageUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&h=400&fit=crop',
    },
    {
      id: 'man_5',
      name: 'Noah',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=400&fit=crop',
    },
  ],
  Girls: [
    {
      id: 'girl_1',
      name: 'Lily',
      imageUrl: 'https://images.unsplash.com/photo-1518632945996-6cb9e69ef14c?w=300&h=400&fit=crop',
    },
    {
      id: 'girl_2',
      name: 'Emma',
      imageUrl: 'https://images.unsplash.com/photo-1544180907-6a7e541f9e16?w=300&h=400&fit=crop',
    },
    {
      id: 'girl_3',
      name: 'Zoe',
      imageUrl: 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=300&h=400&fit=crop',
    },
    {
      id: 'girl_4',
      name: 'Chloe',
      imageUrl: 'https://images.unsplash.com/photo-1595503240812-7286dafaddc1?w=300&h=400&fit=crop',
    },
    {
      id: 'girl_5',
      name: 'Mia',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=400&fit=crop',
    },
  ],
  Boys: [
    {
      id: 'boy_1',
      name: 'Oliver',
      imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&h=400&fit=crop',
    },
    {
      id: 'boy_2',
      name: 'Ethan',
      imageUrl: 'https://images.unsplash.com/photo-1509831879977-74c13e20fce8?w=300&h=400&fit=crop',
    },
    {
      id: 'boy_3',
      name: 'Lucas',
      imageUrl: 'https://images.unsplash.com/photo-1519340333755-56e9c1d17b4e?w=300&h=400&fit=crop',
    },
    {
      id: 'boy_4',
      name: 'Mason',
      imageUrl: 'https://images.unsplash.com/photo-1542156822-6924d1a71ace?w=300&h=400&fit=crop',
    },
    {
      id: 'boy_5',
      name: 'Liam',
      imageUrl: 'https://images.unsplash.com/photo-1520155707862-5b32817388d6?w=300&h=400&fit=crop',
    },
  ],
  Babies: [
    {
      id: 'baby_1',
      name: 'Sweet Angel',
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=400&fit=crop',
    },
    {
      id: 'baby_2',
      name: 'Little Star',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=400&fit=crop',
    },
    {
      id: 'baby_3',
      name: 'Tiny Dream',
      imageUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=300&h=400&fit=crop',
    },
    {
      id: 'baby_4',
      name: 'Little Joy',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=400&fit=crop',
    },
    {
      id: 'baby_5',
      name: 'Sweet Smile',
      imageUrl: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=300&h=400&fit=crop',
    },
  ]
};

export const ALL_MODELS: Option[] = Object.values(CATEGORIZED_MODELS).flat();


export const BACKGROUNDS: Option[] = [
  {
    id: 'bg_1',
    name: 'Minimalist Studio',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop',
    prompt: 'a clean, minimalist studio background with soft, even lighting, and a seamless white cyclorama wall.',
  },
  {
    id: 'bg_2',
    name: 'NYC Street',
    imageUrl: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400&h=300&fit=crop',
    prompt: 'a bustling New York City street with blurred yellow cabs and towering skyscrapers in the background, giving an energetic, urban feel.',
  },
  {
    id: 'bg_3',
    name: 'Serene Beach',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    prompt: 'a serene beach at sunset with golden light, gentle waves, and soft sand.',
  },
  {
    id: 'bg_4',
    name: 'Modern Interior',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    prompt: 'a chic, modern interior with minimalist furniture, large windows, and indoor plants, creating a sophisticated ambiance.',
  },
  {
    id: 'bg_5',
    name: 'Urban Rooftop',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop',
    prompt: 'a stylish urban rooftop with city skyline in the background, modern architecture, and dramatic sunset lighting.',
  },
  {
    id: 'bg_6',
    name: 'Industrial Warehouse',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    prompt: 'an edgy industrial warehouse with exposed brick walls, concrete floors, and dramatic overhead lighting.',
  },
  {
    id: 'bg_7',
    name: 'Luxury Penthouse',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
    prompt: 'a luxurious penthouse interior with floor-to-ceiling windows, contemporary furniture, and elegant city views.',
  },
  {
    id: 'bg_8',
    name: 'Parisian Cafe',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    prompt: 'a charming Parisian street cafe with classic architecture, outdoor seating, and romantic European ambiance.',
  },
  {
    id: 'bg_9',
    name: 'Desert Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
    prompt: 'a stunning desert landscape with golden sand dunes, clear blue sky, and warm natural lighting.',
  },
  {
    id: 'bg_10',
    name: 'Cherry Blossom Park',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop',
    prompt: 'a beautiful park filled with pink cherry blossoms, soft natural light, and dreamy springtime atmosphere.',
  },
  {
    id: 'bg_11',
    name: 'Marble Luxury',
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop',
    prompt: 'an elegant studio with white marble walls, gold accents, and sophisticated high-end fashion atmosphere.',
  },
  {
    id: 'bg_12',
    name: 'Neon Tokyo Street',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=300&fit=crop',
    prompt: 'a vibrant Tokyo street at night with colorful neon lights, modern urban energy, and dynamic atmosphere.',
  },
  {
    id: 'bg_13',
    name: 'Botanical Garden',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
    prompt: 'a lush botanical garden greenhouse with tropical plants, natural light filtering through glass, and organic beauty.',
  },
  {
    id: 'bg_14',
    name: 'Mountain Vista',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    prompt: 'a breathtaking mountain landscape with snow-capped peaks, clear skies, and majestic natural scenery.',
  },
  {
    id: 'bg_15',
    name: 'Art Gallery',
    imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop',
    prompt: 'a contemporary art gallery with white walls, polished floors, modern artwork, and sophisticated lighting.',
  },
  {
    id: 'bg_16',
    name: 'Vintage Library',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop',
    prompt: 'a classic vintage library with wooden bookshelves, leather chairs, warm lighting, and intellectual elegance.',
  },
  {
    id: 'bg_17',
    name: 'Coastal Cliffside',
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
    prompt: 'a dramatic coastal cliffside overlooking the ocean, with rugged rocks, blue water, and natural beauty.',
  },
  {
    id: 'bg_18',
    name: 'Graffiti Alley',
    imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=300&fit=crop',
    prompt: 'an urban graffiti alley with colorful street art, vibrant murals, and edgy contemporary street style.',
  },
  {
    id: 'bg_19',
    name: 'Autumn Forest',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    prompt: 'a picturesque autumn forest with golden and orange foliage, natural sunlight, and warm seasonal atmosphere.',
  },
  {
    id: 'bg_20',
    name: 'Futuristic Studio',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    prompt: 'a sleek futuristic studio with LED lighting, modern geometric designs, and high-tech contemporary aesthetic.',
  },
];