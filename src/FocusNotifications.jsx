import { useEffect, useRef, useState } from 'react'

export default function FocusNotifications({ sessions }) {
  const supported = 'Notification' in window

  const [permission, setPermission] = useState(() =>
    supported ? Notification.permission : 'unsupported',
  )
  const [message, setMessage] = useState('')

  const seenIds = useRef(
    new Set(sessions.map((session) => session.id)),
  )

  useEffect(() => {
    for (const session of sessions) {
      if (seenIds.current.has(session.id)) continue

      seenIds.current.add(session.id)

      const body = `${session.taskTitle} için odak oturumun tamamlandı.`
      setMessage(body)

      if (
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification('FocusBoard — Süre doldu!', {
            body,
            tag: session.id,
          })
        } catch (error) {
          console.error('Bildirim gösterilemedi:', error)
          setMessage(`${body} Sistem bildirimi gösterilemedi.`)
        }
      }
    }
  }, [sessions])

  async function enableNotifications() {
    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        setMessage('Bildirimler açık. Bir odak oturumu bitirerek dene.')
      } else {
        setMessage('Bildirim izni verilmedi. Zamanlayıcı çalışmaya devam eder.')
      }
    } catch (error) {
      console.error('Bildirim izni alınamadı:', error)
      setMessage('Bildirim izni alınamadı.')
    }
  }

  return (
    <section aria-labelledby="notifications-heading">
      <h2 id="notifications-heading">Bildirimler</h2>

      {permission === 'unsupported' ? (
        <p>Bu tarayıcı sistem bildirimlerini desteklemiyor.</p>
      ) : permission === 'granted' ? (
        <p>Bildirimler açık.</p>
      ) : permission === 'denied' ? (
        <p>
          Bildirimler engellenmiş. Açmak için tarayıcının
          site izinlerinden bildirimlere izin verebilirsin.
        </p>
      ) : (
        <button type="button" onClick={enableNotifications}>
          Bildirimlere izin ver
        </button>
      )}

      <p role="status">{message}</p>
    </section>
  )
}