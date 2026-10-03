import { useEffect, useRef, useState } from 'react'

export default function FocusNotifications({ sessions }) {
  const desktop = Boolean(window.focusboardDesktop)
  const supported = 'Notification' in window

  const [permission, setPermission] = useState(() =>
    supported ? Notification.permission : 'unsupported',
  )
  const [message, setMessage] = useState('')

  const seenIds = useRef(
    new Set(sessions.map((session) => session.id)),
  )

  useEffect(() => {
    async function notify(session) {
      const body = `${session.taskTitle} için odak oturumun tamamlandı.`
      setMessage(body)

      try {
        if (window.focusboardDesktop) {
          const result = await window.focusboardDesktop.notify(
            session.taskTitle,
          )

          if (!result.ok) {
            setMessage(`${body} ${result.reason}`)
          }
        } else if (
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          new Notification('FocusBoard — Süre doldu!', {
            body,
            tag: session.id,
          })
        }
      } catch (error) {
        console.error('Bildirim gösterilemedi:', error)
        setMessage(`${body} Sistem bildirimi gösterilemedi.`)
      }
    }

    for (const session of sessions) {
      if (seenIds.current.has(session.id)) continue

      seenIds.current.add(session.id)
      void notify(session)
    }
  }, [sessions])

  async function enableNotifications() {
    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      setMessage(
        result === 'granted'
          ? 'Bildirimler açık. Bir odak oturumu bitirerek dene.'
          : 'Bildirim izni verilmedi. Zamanlayıcı çalışmaya devam eder.',
      )
    } catch (error) {
      console.error('Bildirim izni alınamadı:', error)
      setMessage('Bildirim izni alınamadı.')
    }
  }

  return (
    <section aria-labelledby="notifications-heading">
      <h2 id="notifications-heading">Bildirimler</h2>

      {desktop ? (
        <p>
          Windows sistem bildirimleri kullanılıyor.
          Bildirim görünürlüğü Windows ayarlarına bağlıdır.
        </p>
      ) : permission === 'unsupported' ? (
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