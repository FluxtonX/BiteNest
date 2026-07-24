import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (productId) => {
        set((state) => {
          const exists = state.favoriteIds.includes(productId);
          if (exists) {
            return { favoriteIds: state.favoriteIds.filter((id) => id !== productId) };
          } else {
            return { favoriteIds: [...state.favoriteIds, productId] };
          }
        });
      },

      isFavorite: (productId) => {
        return get().favoriteIds.includes(productId);
      },
    }),
    {
      name: 'sizzle_favorites_store',
    }
  )
);
