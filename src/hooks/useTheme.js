import { useCallback, useEffect, useState } from 'react'

// Resolves light/dark following the OS preference until the user overrides it,
// mirroring the prototype's `themeMode: 'system'` behaviour.
export function useTheme() {
  const [mode, setMode] = useState('system')
  const [resolved, setResolved] = useState('light')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setResolved(mq.matches ? 'dark' : 'light')
    const onChange = (e) => {
      setMode((m) => {
        if (m === 'system') setResolved(e.matches ? 'dark' : 'light')
        return m
      })
    }
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', onChange) }
  }, [])

  const toggle = useCallback(() => {
    setResolved((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      setMode(next)
      return next
    })
  }, [])

  return { resolved, toggle }
}
