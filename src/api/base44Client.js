import { v4 as uuid } from 'uuid';

const clone = (value) => JSON.parse(JSON.stringify(value));

const delay = (result) => new Promise((resolve) => setTimeout(() => resolve(clone(result)), 200));

const sortData = (items, sort) => {
  if (!sort) return items;
  const descending = sort.startsWith('-');
  const key = descending ? sort.slice(1) : sort;
  return [...items].sort((a, b) => {
    if (a[key] === b[key]) return 0;
    if (a[key] === undefined) return 1;
    if (b[key] === undefined) return -1;
    return descending ? (a[key] < b[key] ? 1 : -1) : a[key] < b[key] ? -1 : 1;
  });
};

const createStore = (seedData) => {
  let data = [...seedData];

  return {
    list: async (sort, limit) => {
      const sorted = sort ? sortData(data, sort) : [...data];
      return delay(limit ? sorted.slice(0, limit) : sorted);
    },
    filter: async (criteria = {}, sort, limit) => {
      const filtered = data.filter((item) =>
        Object.entries(criteria).every(([key, value]) => item[key] === value),
      );
      const sorted = sort ? sortData(filtered, sort) : filtered;
      return delay(limit ? sorted.slice(0, limit) : sorted);
    },
    create: async (payload) => {
      const now = new Date().toISOString();
      const record = { id: uuid(), created_date: now, ...payload };
      data = [record, ...data];
      return delay(record);
    },
    update: async (id, updates) => {
      data = data.map((item) => (item.id === id ? { ...item, ...updates } : item));
      return delay(data.find((item) => item.id === id));
    },
    delete: async (id) => {
      data = data.filter((item) => item.id !== id);
      return delay({ id });
    },
  };
};

const moviesStore = createStore([
  {
    id: 'm1',
    title: 'Neon Afterglow',
    synopsis:
      'In a city powered by dreams, a data scientist uncovers a signal that blurs reality and cinema.',
    banner_url:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1600&q=80&auto=format&fit=crop',
    poster_url:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600&q=80&auto=format&fit=crop',
    rating: 8.6,
    rating_count: 1283,
    release_date: '2024-11-05',
    runtime: 124,
    genres: ['Sci-Fi', 'Thriller'],
    languages: ['English'],
    cast: ['Lena Ray', 'Kai Monroe'],
    director: 'Mina Hart',
    editorial_tags: ['Trending', 'Critically Acclaimed'],
    is_featured: true,
    status: 'active',
    created_date: '2024-10-02',
  },
  {
    id: 'm2',
    title: 'Midnight Vinyl',
    synopsis: 'A washed-up DJ finds a track that predicts the future.',
    banner_url:
      'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=1600&q=80&auto=format&fit=crop',
    poster_url:
      'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=600&q=80&auto=format&fit=crop',
    rating: 7.9,
    rating_count: 864,
    release_date: '2023-08-17',
    runtime: 110,
    genres: ['Drama', 'Music'],
    languages: ['English'],
    cast: ['Noah Clark', 'Priya Singh'],
    director: 'Caleb Wyatt',
    editorial_tags: ['Trending'],
    is_featured: true,
    status: 'active',
    created_date: '2023-06-12',
  },
  {
    id: 'm3',
    title: 'Orbital Echoes',
    synopsis: 'An astronaut records messages that appear on Earth decades earlier.',
    poster_url:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80&auto=format&fit=crop',
    rating: 8.1,
    rating_count: 642,
    release_date: '2022-02-19',
    runtime: 134,
    genres: ['Sci-Fi', 'Drama'],
    languages: ['English'],
    cast: ['Sara Diaz', 'Kenji Ito'],
    director: 'Ava Park',
    editorial_tags: ['Critically Acclaimed'],
    is_featured: false,
    status: 'active',
    created_date: '2022-01-05',
  },
  {
    id: 'm4',
    title: 'Sunset Syndicate',
    synopsis: 'Two rival crews unite when a heist reveals a larger conspiracy.',
    poster_url:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=500&q=80&auto=format&fit=crop',
    rating: 7.4,
    rating_count: 410,
    release_date: '2021-05-11',
    runtime: 118,
    genres: ['Action', 'Thriller'],
    languages: ['English'],
    cast: ['Mara Bloom', 'Felix Winters'],
    director: 'Tariq Khan',
    editorial_tags: [],
    is_featured: false,
    status: 'draft',
    created_date: '2021-04-15',
  },
]);

const usersStore = createStore([
  {
    id: 'u1',
    full_name: 'Ava Summers',
    email: 'ava@cineverse.app',
    status: 'active',
    role: 'admin',
    last_login: '2024-11-18T10:15:00Z',
    is_flagged: false,
    created_date: '2023-03-12',
  },
  {
    id: 'u2',
    full_name: 'Marcus Lee',
    email: 'marcus@cineverse.app',
    status: 'banned',
    role: 'user',
    last_login: '2024-10-21T09:00:00Z',
    is_flagged: true,
    created_date: '2023-08-02',
  },
  {
    id: 'u3',
    full_name: 'Priya Patel',
    email: 'priya@cineverse.app',
    status: 'active',
    role: 'moderator',
    last_login: '2024-11-20T21:00:00Z',
    is_flagged: false,
    created_date: '2023-12-15',
  },
]);

const reviewsStore = createStore([
  {
    id: 'r1',
    movie_id: 'm1',
    movie_title: 'Neon Afterglow',
    user_name: 'Cinephile_88',
    content: 'Rich visuals and a synth-heavy score. The plot twists keep coming.',
    rating: 4.5,
    status: 'pending',
    created_date: '2024-11-15',
    sentiment: 'positive',
    helpful_votes: 42,
  },
  {
    id: 'r2',
    movie_id: 'm2',
    movie_title: 'Midnight Vinyl',
    user_name: 'AnalogSoul',
    content: 'Starts slow but crescendos into a great final act.',
    rating: 4.0,
    status: 'approved',
    created_date: '2024-10-10',
    sentiment: 'positive',
    helpful_votes: 30,
  },
]);

const graphsStore = createStore([
  {
    id: 'g1',
    name: 'Engagement Pulse',
    status: 'pending',
    audience_score: 78,
    engagement_score: 85,
    created_date: '2024-11-10',
  },
  {
    id: 'g2',
    name: 'Churn Watch',
    status: 'approved',
    audience_score: 66,
    engagement_score: 71,
    created_date: '2024-09-22',
  },
]);

const collectionsStore = createStore([
  {
    id: 'c1',
    name: 'Critics Choice',
    status: 'pending',
    items_count: 12,
    created_by: 'Editorial',
    created_date: '2024-11-11',
  },
  {
    id: 'c2',
    name: 'New & Noteworthy',
    status: 'approved',
    items_count: 18,
    created_by: 'Editorial',
    created_date: '2024-10-15',
  },
]);

const reportsStore = createStore([
  {
    id: 'rep1',
    reported_item: 'Review r2',
    reported_by: 'u3',
    reason: 'Potential spoilers',
    status: 'pending',
    created_date: '2024-11-09',
    type: 'review',
  },
]);

const notificationsStore = createStore([
  {
    id: 'n1',
    title: 'Weekend Premiere',
    message: 'Catch Neon Afterglow streaming this weekend.',
    segment: 'cinephiles',
    status: 'scheduled',
    severity: 'info',
    type: 'general',
    created_date: '2024-11-18',
  },
]);

const ingestionLogStore = createStore([
  {
    id: 'ing1',
    source: 'TMDB',
    status: 'success',
    records_ingested: 320,
    duration_ms: 1850,
    created_date: '2024-11-20',
  },
  {
    id: 'ing2',
    source: 'User Upload',
    status: 'warning',
    records_ingested: 48,
    duration_ms: 920,
    created_date: '2024-11-18',
  },
]);

const metricsStore = createStore([
  {
    id: 'ml1',
    metric_type: 'recommendation',
    model_name: 'CineRanker v2',
    accuracy: 0.87,
    drift_score: 0.12,
    samples_processed: 25000,
    retrain_suggested: false,
    created_date: '2024-11-19',
  },
  {
    id: 'ml2',
    metric_type: 'moderation',
    model_name: 'Guardian v1',
    accuracy: 0.81,
    drift_score: 0.22,
    samples_processed: 14000,
    retrain_suggested: true,
    created_date: '2024-11-17',
  },
]);

export const base44 = {
  auth: {
    isAuthenticated: async () => true,
    me: async () =>
      delay({
        id: 'u-demo',
        full_name: 'Demo Admin',
        email: 'demo@cineverse.app',
        role: 'admin',
      }),
    logout: async () => delay(true),
  },
  entities: {
    Movie: {
      ...moviesStore,
    },
    User: {
      ...usersStore,
    },
    Review: {
      ...reviewsStore,
    },
    Graph: {
      ...graphsStore,
    },
    Collection: {
      ...collectionsStore,
    },
    Report: {
      ...reportsStore,
    },
    Notification: {
      ...notificationsStore,
    },
    IngestionLog: {
      ...ingestionLogStore,
    },
    MLMetric: {
      ...metricsStore,
    },
  },
};

export default base44;
