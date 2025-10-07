import { useEffect, useMemo, useState } from 'react';
import { filterByCategory, listCategories } from '../../api/meals';
import type { Category, MealSummary } from '../../types';
import MealCard from '../../components/MealCard/MealCard';
import { useListStore } from '../../store/useListStore';
import styles from './GalleryView.module.css';

export default function GalleryView() {
  const [cats, setCats] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [items, setItems] = useState<MealSummary[]>([]);
  const [error, setError] = useState('');
  const setItemsInStore = useListStore((s) => s.setItems);
  const setSource = useListStore((s) => s.setSource);

  useEffect(() => {
    listCategories()
      .then(setCats)
      .catch(() => setError('Failed to load categories.'));
  }, []);

  useEffect(() => {
    async function load() {
      if (selected.length === 0) {
        setItems([]);
        setItemsInStore([]);
        setSource({ view: 'gallery', filters: [] });
        return;
      }
      try {
        const chunks = await Promise.all(
          selected.map((c) => filterByCategory(c))
        );
        const merged = new Map<string, MealSummary>();
        chunks.flat().forEach((m) => merged.set(m.idMeal, m));
        const list = Array.from(merged.values());
        setItems(list);
        setItemsInStore(list);
        setSource({ view: 'gallery', filters: selected });
      } catch {
        setError('Failed to fetch gallery meals; showing cached or mock data.');
      }
    }
    load();
  }, [selected, setItemsInStore, setSource]);

  const onToggle = (c: string) =>
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.strMeal.localeCompare(b.strMeal)),
    [items]
  );

  return (
    <div>
      <h1 className={styles.title}>Gallery View</h1>
      <div className={styles.filters}>
        {cats.map((c) => (
          <label key={c.idCategory} className={styles.tag}>
            <input
              type="checkbox"
              checked={selected.includes(c.strCategory)}
              onChange={() => onToggle(c.strCategory)}
            />
            <span>{c.strCategory}</span>
          </label>
        ))}
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.grid}>
        {sorted.map((m, i) => (
          <MealCard key={m.idMeal} meal={m} index={i} />
        ))}
      </div>
    </div>
  );
}
