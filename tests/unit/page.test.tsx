import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

test('HomePage renders Start Menu', () => {
  render(<HomePage />)
  expect(screen.getByRole('button', { name: 'Start Game' })).toBeDefined()
})
