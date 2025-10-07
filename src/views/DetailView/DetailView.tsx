import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchMealById } from '../../api/meals';
import type { MealDetail } from '../../types';
import { useListStore } from '../../store/useListStore';
import styles from './DetailView.module.css';

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const idxFromUrl = Number(params.get('idx') ?? '0');

  const navigate = useNavigate();
  const items = useListStore((s) => s.items);

  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [error, setError] = useState('');

  // fetch details for the current id
  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!id) return;
      try {
        const data = await fetchMealById(id);
        if (mounted) setMeal(data);
      } catch {
        if (mounted) setError('Failed to load meal details.');
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  // resolve the current index: prefer the index by id inside items otherwise fall back to idx param
  const currentIndex = useMemo(() => {
    if (!id || items.length === 0) {
      return Number.isFinite(idxFromUrl)
        ? Math.max(0, Math.min(idxFromUrl, Math.max(0, items.length - 1)))
        : 0;
    }
    const byId = items.findIndex((m) => m.idMeal === id);
    if (byId >= 0) return byId;
    return Math.max(0, Math.min(idxFromUrl, Math.max(0, items.length - 1)));
  }, [id, items, idxFromUrl]);

  const hasPrev = currentIndex > 0 && items.length > 0;
  const hasNext = currentIndex < items.length - 1 && items.length > 0;
  const prevId = hasPrev ? items[currentIndex - 1].idMeal : undefined;
  const nextId = hasNext ? items[currentIndex + 1].idMeal : undefined;

  const goPrev = () => {
    if (prevId) navigate(`/meal/${prevId}?idx=${currentIndex - 1}`);
  };
  const goNext = () => {
    if (nextId) navigate(`/meal/${nextId}?idx=${currentIndex + 1}`);
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && hasPrev) goPrev();
      if (e.key === 'ArrowRight' && hasNext) goNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasPrev, hasNext, prevId, nextId]);

  // extract ingredients
  const ingredients = useMemo(() => {
    if (!meal) return [] as { name: string; measure: string }[];
    const out: { name: string; measure: string }[] = [];
    for (let i = 1; i <= 20; i++) {
      const name = (meal as any)[`strIngredient${i}`];
      const measure = (meal as any)[`strMeasure${i}`];
      if (name && String(name).trim()) {
        out.push({ name: String(name), measure: String(measure ?? '') });
      }
    }
    return out;
  }, [meal]);

  return (
    <div>
      {error && <div className={styles.error}>{error}</div>}
      {meal && (
        <article className={styles.wrap}>
          <div className={styles.media}>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
          </div>
          <div className={styles.content}>
            <h1>{meal.strMeal}</h1>
            <p className={styles.sub}>
              {(meal as any).strCategory ?? '—'} ·{' '}
              {(meal as any).strArea ?? '—'}
            </p>

            <div className={styles.controls}>
              <button onClick={goPrev} disabled={!hasPrev}>
                &larr; Prev
              </button>
              <button onClick={goNext} disabled={!hasNext}>
                Next &rarr;
              </button>
            </div>

            {meal.strInstructions && (
              <section>
                <h2>Instructions</h2>
                <p className={styles.instructions}>{meal.strInstructions}</p>
              </section>
            )}

            {ingredients.length > 0 && (
              <section>
                <h2>Ingredients</h2>
                <ul className={styles.list}>
                  {ingredients.map((ing, i) => (
                    <li key={i}>
                      {ing.name} — {ing.measure}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {meal.strYoutube && (
              <section>
                <h2>Video</h2>
                <a href={meal.strYoutube} target="_blank" rel="noreferrer">
                  Watch on YouTube
                </a>
              </section>
            )}
          </div>
        </article>
      )}
      {!meal && !error && <div>Loading…</div>}
    </div>
  );
}
