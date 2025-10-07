import React from 'react';
import styles from './SearchBar.module.css';

type Props = {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  autoFocus = true,
  placeholder = 'Search meals… (filters as you type)',
}: Props) {
  return (
    <input
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
      placeholder={placeholder}
      aria-label="Search"
    />
  );
}
