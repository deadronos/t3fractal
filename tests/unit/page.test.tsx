import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'
 
test('HomePage renders a main heading', () => {
  render(<HomePage />)
  // Ensure the page renders at least one top-level heading
  const headings = screen.getAllByRole('heading', { level: 1 });
  expect(headings.length).toBeGreaterThan(0);
})