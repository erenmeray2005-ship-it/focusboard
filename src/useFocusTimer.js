import { useEffect, useState } from 'react'

const STORAGE_KEY = 'focusboard.focus'

function loadFocus() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))

    if (saved && Array.isArray(saved.sessions)) {
      return {
        timer: saved.timer ?? null,
        sessions: saved.sessions,
      }
    }
  } catch (error) {
    console.error('Odak kayıtları okunamadı:', error)
  }

  return { timer: null, sessions: [] }
}

function finishIfDue(current, now) {
  const timer = current.timer

  if (!timer || timer.status !== 'running' || now < timer.endsAt) {
    return current
  }

  return {
    timer: null,
    sessions: [
      ...current.sessions,
      {
        id: timer.id,
        taskId: timer.taskId,
        taskTitle: timer.taskTitle,
        durationMs: timer.durationMs,
        finishedAt: timer.endsAt,
      },
    ],
  }
}

export default function useFocusTimer() {
  const [focus, setFocus] = useState(loadFocus)
  const [now, setNow] = useState(Date.now)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now()
      setNow(time)
      setFocus((current) => finishIfDue(current, time))
    }, 250)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(focus))

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Report the result of writing to external storage.
    setSaveError('')
  } catch (error) {
    console.error('Odak kayıtları kaydedilemedi:', error)

    
    setSaveError('Odak kayıtları kaydedilemiyor.')
  }
}, [focus])

  function start(task, minutes) {
    const durationMs = Number(minutes) * 60 * 1000

    if (!Number.isFinite(durationMs) || durationMs < 60000) return
    if (durationMs > 1440 * 60 * 1000) return

    const time = Date.now()
    setNow(time)

    setFocus((current) => {
      const updated = finishIfDue(current, time)
      if (updated.timer) return updated

      return {
        ...updated,
        timer: {
          id: crypto.randomUUID(),
          taskId: task.id,
          taskTitle: task.title,
          durationMs,
          remainingMs: durationMs,
          endsAt: time + durationMs,
          status: 'running',
        },
      }
    })
  }

  function pause() {
    const time = Date.now()
    setNow(time)

    setFocus((current) => {
      const updated = finishIfDue(current, time)
      const timer = updated.timer
      if (!timer || timer.status !== 'running') return updated

      return {
        ...updated,
        timer: {
          ...timer,
          remainingMs: Math.max(0, timer.endsAt - time),
          endsAt: null,
          status: 'paused',
        },
      }
    })
  }

  function resume() {
    const time = Date.now()
    setNow(time)

    setFocus((current) => {
      const timer = current.timer
      if (!timer || timer.status !== 'paused') return current

      return {
        ...current,
        timer: {
          ...timer,
          endsAt: time + timer.remainingMs,
          status: 'running',
        },
      }
    })
  }

  function cancel() {
    setFocus((current) => {
      const updated = finishIfDue(current, Date.now())
      return { ...updated, timer: null }
    })
  }

  const timer = focus.timer
  const remainingMs = timer
    ? timer.status === 'running'
      ? Math.max(0, timer.endsAt - now)
      : timer.remainingMs
    : 0

  return {
    timer,
    sessions: focus.sessions,
    remainingMs,
    saveError,
    start,
    pause,
    resume,
    cancel,
  }
}