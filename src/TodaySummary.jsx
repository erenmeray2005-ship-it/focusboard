export default function TodaySummary({ sessions }) {
  const today = new Date().toDateString()

  const todaySessions = sessions.filter(
    (session) =>
      new Date(session.finishedAt).toDateString() === today,
  )

  const totalMs = todaySessions.reduce(
    (total, session) => total + session.durationMs,
    0,
  )

  const byTask = new Map()

  for (const session of todaySessions) {
    const existing = byTask.get(session.taskId)

    byTask.set(session.taskId, {
      title: session.taskTitle,
      durationMs: (existing?.durationMs ?? 0) + session.durationMs,
    })
  }

  function minutes(durationMs) {
    return (durationMs / 60000).toLocaleString('tr-TR', {
      maximumFractionDigits: 1,
    })
  }

  return (
    <section aria-labelledby="today-heading">
      <h2 id="today-heading">Bugün</h2>

      <p>
        Toplam odak: <strong>{minutes(totalMs)} dakika</strong>
      </p>
      <p>Tamamlanan oturum: {todaySessions.length}</p>

      {todaySessions.length === 0 ? (
        <p>
          Bugün henüz tamamlanmış odak oturumun yok.
          İlk oturumunu bitirdiğinde özet burada görünecek.
        </p>
      ) : (
        <ul>
          {[...byTask.entries()].map(([taskId, task]) => (
            <li key={taskId}>
              <strong>{task.title}</strong>
              {' — '}
              {minutes(task.durationMs)} dakika
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}