import { useEffect, useState } from 'react'

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
    </main>
  )
}

export default App