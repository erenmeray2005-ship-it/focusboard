import { useEffect, useState } from 'react'
import useFocusTimer from './useFocusTimer'
import TodaySummary from './TodaySummary'
import FocusNotifications from './FocusNotifications'

function App() {
  const [tasks, setTasks] = useState(() => {
  try {
    const saved = localStorage.getItem('focusboard.tasks')
    if (!saved) return []

    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []

    return parsed
  } catch (error) {
    console.error('Görevler okunamadı:', error)
    return []
  }
})
  const [title, setTitle] = useState('')
  const [project, setProject] = useState('')
  const [estimate, setEstimate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [focusMinutes, setFocusMinutes] = useState(25)
const focus = useFocusTimer()

const remainingSeconds = Math.ceil(focus.remainingMs / 1000)
const timerText = `${Math.floor(remainingSeconds / 60)
  .toString()
  .padStart(2, '0')}:${(remainingSeconds % 60)
  .toString()
  .padStart(2, '0')}`
  const [storageError, setStorageError] = useState('')

useEffect(() => {
  try {
    localStorage.setItem('focusboard.tasks', JSON.stringify(tasks))
    setStorageError('')
  } catch (error) {
    console.error('Görevler kaydedilemedi:', error)
    setStorageError(
      'Görevler kaydedilemiyor. Sayfayı kapatırsan son değişiklikler kaybolabilir.',
    )
  }
}, [tasks])

  function resetForm() {
    setTitle('')
    setProject('')
    setEstimate('')
    setEditingId(null)
  }

  function saveTask(event) {
    event.preventDefault()

    if (!title.trim()) return

    const taskData = {
      title: title.trim(),
      project: project.trim(),
      estimate: estimate === '' ? null : Number(estimate),
    }

    if (editingId !== null) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId ? { ...task, ...taskData } : task,
        ),
      )
    } else {
      setTasks((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          ...taskData,
          completed: false,
        },
      ])
    }

    resetForm()
  }

  function editTask(task) {
    setEditingId(task.id)
    setTitle(task.title)
    setProject(task.project)
    setEstimate(task.estimate ?? '')
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id))

    if (editingId === id) resetForm()
  }

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main>
      
      {storageError && <p role="alert">{storageError}</p>}
      <header>
        <p>GÜNÜNÜ PLANLA · ODAĞINI KORU</p>
        <h1>FocusBoard</h1>
        <p>Bir görev seç. Küçük bir adımla başla.</p>
      </header>

      <section aria-labelledby="form-heading">
        <h2 id="form-heading">
          {editingId !== null ? 'Görevi düzenle' : 'Yeni görev'}
        </h2>

        <form onSubmit={saveTask}>
          <label htmlFor="task-title">Görev başlığı</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Örneğin: Ana sayfa tasarımını bitir"
            required
            maxLength={120}
          />

          <label htmlFor="task-project">Proje etiketi — isteğe bağlı</label>
          <input
            id="task-project"
            value={project}
            onChange={(event) => setProject(event.target.value)}
            placeholder="Örneğin: Müşteri sitesi"
            maxLength={50}
          />

          <label htmlFor="task-estimate">
            Tahmini dakika — isteğe bağlı
          </label>
          <input
            id="task-estimate"
            type="number"
            min="1"
            max="1440"
            step="1"
            value={estimate}
            onChange={(event) => setEstimate(event.target.value)}
            placeholder="25"
          />

          <button type="submit" disabled={!title.trim()}>
            {editingId !== null ? 'Değişiklikleri kaydet' : 'Görev ekle'}
          </button>

          {editingId !== null && (
            <button type="button" onClick={resetForm}>
              Düzenlemekten vazgeç
            </button>
          )}
        </form>
      </section>

      <section aria-labelledby="focus-heading">
  <h2 id="focus-heading">Odak zamanlayıcısı</h2>

  {focus.saveError && <p role="alert">{focus.saveError}</p>}

  <label htmlFor="focus-minutes">Odak süresi — dakika</label>
  <input
    id="focus-minutes"
    type="number"
    min="1"
    max="1440"
    step="1"
    value={focusMinutes}
    disabled={Boolean(focus.timer)}
    onChange={(event) => setFocusMinutes(event.target.value)}
  />

  {focus.timer ? (
    <div>
      <h3>{focus.timer.taskTitle}</h3>
      <p style={{ fontSize: '3rem', fontWeight: 700 }}>
        {timerText}
      </p>
      <p>
        {focus.timer.status === 'paused'
          ? 'Duraklatıldı'
          : 'Odak oturumu devam ediyor'}
      </p>

      {focus.timer.status === 'running' ? (
        <button type="button" onClick={focus.pause}>
          Duraklat
        </button>
      ) : (
        <button type="button" onClick={focus.resume}>
          Devam et
        </button>
      )}

      <button type="button" onClick={focus.cancel}>
        Oturumu iptal et
      </button>
    </div>
  ) : (
    <p>Başlamak için bir görevin “Odaklan” düğmesine bas.</p>
  )}

  <p>Tamamlanan odak oturumu: {focus.sessions.length}</p>
</section>
      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">Görevlerin</h2>
        <p>
          {tasks.length} görev · {completedCount} tamamlandı
        </p>

        {tasks.length === 0 ? (
          <p>Henüz görev yok. Yukarıdan ilk görevini ekle.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span
                    style={{
                      textDecoration: task.completed
                        ? 'line-through'
                        : 'none',
                    }}
                  >
                    {task.title}
                  </span>
                </label>

                {task.project && <p>Proje: {task.project}</p>}
                {task.estimate !== null && (
                  <p>Tahmin: {task.estimate} dakika</p>
                )}

                <button
  type="button"
  disabled={
    task.completed ||
    Boolean(focus.timer) ||
    !Number.isInteger(Number(focusMinutes)) ||
    Number(focusMinutes) < 1 ||
    Number(focusMinutes) > 1440
  }
  onClick={() => focus.start(task, focusMinutes)}
>
  Odaklan
</button>

<button type="button" onClick={() => editTask(task)}>
  Düzenle
</button>
                <button type="button" onClick={() => deleteTask(task.id)}>
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
            </section>
      <FocusNotifications sessions={focus.sessions} />
      <TodaySummary sessions={focus.sessions} />
    </main>
  )
}

export default App