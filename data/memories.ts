export const MEMORY_CATEGORIES = [
  "Special Days",
  "Adventures",
  "Everyday Moments",
  "Celebrations",
  "Firsts",
] as const;

export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number];

export type Memory = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: MemoryCategory;
  location?: string;
  image?: string;
  imageName?: string;
  isFeatured: boolean;
  createdAt: string;
};

export const sampleMemories: Memory[] = [
  {
    id: "memory_001",
    title: "The day we chose the mountains",
    description: "A winding road, one perfect sunset, and a promise to always take the scenic route together.",
    date: "2026-08-17",
    category: "Adventures",
    location: "Lonavala, Maharashtra",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85",
    isFeatured: true,
    createdAt: "2026-08-17T19:20:00Z",
  },
  {
    id: "memory_002",
    title: "Our slow Sunday",
    description: "Coffee went cold while we talked for hours. Somehow, that was the whole plan.",
    date: "2026-07-26",
    category: "Everyday Moments",
    location: "Our favourite café",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",
    isFeatured: false,
    createdAt: "2026-07-26T11:00:00Z",
  },
  {
    id: "memory_003",
    title: "Your birthday, your kind of magic",
    description: "A tiny cake, far too many candles, and the happiest smile in the room.",
    date: "2026-07-08",
    category: "Celebrations",
    location: "Home",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85",
    isFeatured: false,
    createdAt: "2026-07-08T21:45:00Z",
  },
  {
    id: "memory_004",
    title: "Our first train away",
    description: "Window seats, shared playlists, and the beginning of our collection of little escapes.",
    date: "2026-05-23",
    category: "Firsts",
    location: "Mumbai to Pune",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=85",
    isFeatured: false,
    createdAt: "2026-05-23T08:10:00Z",
  },
  {
    id: "memory_005",
    title: "Rainy evening walks",
    description: "We forgot the umbrella and somehow came home with our favourite story.",
    date: "2026-05-09",
    category: "Everyday Moments",
    location: "Marine Drive",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
    isFeatured: false,
    createdAt: "2026-05-10T06:30:00Z",
  },
  {
    id: "memory_006",
    title: "One year of us",
    description: "The small anniversary dinner that turned into a long look back at everything we had become.",
    date: "2026-02-14",
    category: "Special Days",
    location: "The Table",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85",
    isFeatured: false,
    createdAt: "2026-02-14T23:15:00Z",
  },
  {
    id: "memory_007",
    title: "A kitchen full of chaos",
    description: "The pasta was questionable, but the dancing between ingredients was worth it.",
    date: "2025-12-21",
    category: "Everyday Moments",
    location: "Home",
    isFeatured: false,
    createdAt: "2025-12-21T20:00:00Z",
  },
  {
    id: "memory_008",
    title: "Our first trip together",
    description: "Two backpacks, no real itinerary, and a new favourite person beside me.",
    date: "2025-11-02",
    category: "Adventures",
    location: "Udaipur",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85",
    isFeatured: false,
    createdAt: "2025-11-04T09:00:00Z",
  },
  {
    id: "memory_009",
    title: "The first hello",
    description: "An ordinary afternoon that quietly became the beginning of everything.",
    date: "2025-09-12",
    category: "Firsts",
    isFeatured: false,
    createdAt: "2025-09-12T16:30:00Z",
  },
];
