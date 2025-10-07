import styles from './SortControls.module.css';

export type SortKey = 'name' | 'category' | 'area';
export type SortDir = 'asc' | 'desc';

interface Props {
  sortKey: SortKey;
  sortDir: SortDir;
  onSortKey: (k: SortKey) => void;
  onSortDir: (d: SortDir) => void;
}

export default function SortControls({
  sortKey,
  sortDir,
  onSortKey,
  onSortDir,
}: Props) {
  return (
    <div className={styles.row}>
      <label>
        Sort by:
        <select
          value={sortKey}
          onChange={(e) => onSortKey(e.target.value as SortKey)}
        >
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="area">Area</option>
        </select>
      </label>
      <label>
        Direction:
        <select
          value={sortDir}
          onChange={(e) => onSortDir(e.target.value as SortDir)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}
