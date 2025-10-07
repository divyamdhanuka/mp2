import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import SortControls, {
  SortDir,
  SortKey,
} from '../../components/SortControls/SortControls';
import MealCard from '../../components/MealCard/MealCard';
import { bootstrapMeals, searchMealsByName } from '../../api/meals';
import { useListStore } from '../../store/useListStore';
import type { MealSummary } from '../../types';
import styles from './ListView.module.css';

export default function ListView() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<MealSummary[]>([]);
  const [error, setError] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const setItemsInStore = useListStore((s) => s.setItems);
  const setSource = useListStore((s) => s.setSource);

  useEffect(() => {
    bootstrapMeals()
      .then((data) => {
        setItems(data);
        setItemsInStore(data);
        setSource({ view: 'list', query: '' });
      })
      .catch(() => setError('Failed to load meals.'));
  }, [setItemsInStore, setSource]);

  useEffect(() => {
    const h = setTimeout(() => {
      const q = query.trim();
      if (q.length === 0) return;
      searchMealsByName(q)
        .then((data) => {
          setItems(data || []);
          setItemsInStore(data || []);
          setSource({ view: 'list', query: q });
        })
        .catch(() => setError('Search failed; showing cached or mock data.'));
    }, 250);
    return () => clearTimeout(h);
  }, [query, setItemsInStore, setSource]);

  const filteredSorted = useMemo(() => {
    const base = items.filter((m) =>
      m.strMeal.toLowerCase().includes(query.toLowerCase())
    );
    const sorted = [...base].sort((a, b) => {
      const A =
        (sortKey === 'name'
          ? a.strMeal
          : sortKey === 'category'
          ? a.strCategory
          : a.strArea) || '';
      const B =
        (sortKey === 'name'
          ? b.strMeal
          : sortKey === 'category'
          ? b.strCategory
          : b.strArea) || '';
      const cmp = A.localeCompare(B);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [items, query, sortDir, sortKey]);

  return (
    <div>
      <h1 className={styles.title}>List View</h1>
      <SearchBar value={query} onChange={setQuery} />
      <SortControls
        sortKey={sortKey}
        sortDir={sortDir}
        onSortKey={setSortKey}
        onSortDir={setSortDir}
      />
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.grid}>
        {filteredSorted.map((m, i) => (
          <MealCard key={m.idMeal} meal={m} index={i} />
        ))}
      </div>
    </div>
  );
}
