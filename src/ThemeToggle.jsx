import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('focusboard.theme') === 'light'
        ? 'light'
        : 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    try {
      localStorage.setItem('focusboard.theme', theme)
    } catch (error) {
      console.error('Tema tercihi kaydedilemedi:', error)
    }
  }, [theme])

  return (
    <button
      type="button"
      onClick={() =>
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
      }
      aria-label={
        theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'
      }
    >
      {theme === 'dark' ? '☀ Açık tema' : '☾ Koyu tema'}
    </button>
  )
}