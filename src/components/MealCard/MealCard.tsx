import { Link } from 'react-router-dom';
import styles from './MealCard.module.css';
import type { MealSummary } from '../../types';

interface Props {
  meal: MealSummary;
  index?: number;
}

export default function MealCard({ meal, index }: Props) {
  return (
    <Link to={`/meal/${meal.idMeal}?idx=${index ?? 0}`} className={styles.card}>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <div className={styles.meta}>
        <h3>{meal.strMeal}</h3>
        <p>
          {meal.strCategory || '—'} · {meal.strArea || '—'}
        </p>
      </div>
    </Link>
  );
}
