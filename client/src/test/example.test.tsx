import { render, screen } from '@testing-library/react'

it('vitest setup works', () => {
  render(<div>Hello</div>)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
