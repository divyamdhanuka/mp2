import client from './axiosClient';
import type { Category, MealDetail, MealSummary } from '../types';

export async function searchMealsByName(q: string): Promise<MealSummary[]> {
  try {
    const res = await client.get(`/search.php?s=${encodeURIComponent(q)}`);
    return (res.data.meals || []) as MealSummary[];
  } catch (e) {
    const mock = await import('../mock/mockSearch.json');
    return mock.default.meals as MealSummary[];
  }
}

export async function fetchMealById(id: string): Promise<MealDetail | null> {
  try {
    const res = await client.get(`/lookup.php?i=${id}`);
    return res.data.meals ? (res.data.meals[0] as MealDetail) : null;
  } catch (e) {
    const mock = await import('../mock/mockById.json');
    const m =
      (mock.default.meals as MealDetail[]).find((x) => x.idMeal === id) || null;
    return m;
  }
}

export async function listCategories(): Promise<Category[]> {
  try {
    const res = await client.get('/categories.php');
    return res.data.categories as Category[];
  } catch (e) {
    const mock = await import('../mock/mockCategories.json');
    return mock.default.categories as Category[];
  }
}

export async function filterByCategory(
  category: string
): Promise<MealSummary[]> {
  try {
    const res = await client.get(
      `/filter.php?c=${encodeURIComponent(category)}`
    );
    return (res.data.meals || []) as MealSummary[];
  } catch (e) {
    const mock = await import('../mock/mockFilter_Beef.json');
    return mock.default.meals as MealSummary[];
  }
}

// fetch a larger starter set by merging multiple first letter searches
export async function bootstrapMeals(): Promise<MealSummary[]> {
  try {
    const letters = ['a', 'b', 'c', 'd'];
    const responses = await Promise.all(
      letters.map((l) => client.get(`/search.php?f=${l}`))
    );
    const merged = new Map<string, MealSummary>();
    responses.forEach((r) => {
      (r.data.meals || []).forEach((m: MealSummary) => merged.set(m.idMeal, m));
    });
    return Array.from(merged.values());
  } catch {
    const mock = await import('../mock/mockSearch.json');
    return mock.default.meals as MealSummary[];
  }
}
