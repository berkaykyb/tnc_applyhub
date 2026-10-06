import { useState } from 'react'

function App() {
  const [applications, setApplications] = useState([])
  const [feedback, setFeedback] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const company = formData.get('company').trim()
    const position = formData.get('position').trim()

    if (!company || !position) {
      setFeedback({
        type: 'error',
        message: 'Şirket adı ve pozisyon yalnızca boşluklardan oluşamaz.',
      })
      return
    }

    const application = {
      id: crypto.randomUUID(),
      company,
      position,
      applicationDate: formData.get('applicationDate'),
      status: formData.get('status'),
      note: formData.get('note').trim(),
    }

    setApplications((previousApplications) => [
      ...previousApplications,
      application,
    ])
    setFeedback({ type: 'success', message: 'Başvuru eklendi.' })
    form.reset()
  }

  return (
    <main>
      <h1>ApplyHub</h1>
      <p>Staj ve iş başvurularını tek yerde takip et.</p>

      <h2>Başvuru ekle</h2>
      <p>Not dışındaki alanlar zorunludur.</p>

      <form onSubmit={handleSubmit} onInput={() => setFeedback(null)}>
        <p>
          <label htmlFor="company">Şirket adı</label>
          <br />
          <input id="company" name="company" type="text" required />
        </p>

        <p>
          <label htmlFor="position">Pozisyon</label>
          <br />
          <input id="position" name="position" type="text" required />
        </p>

        <p>
          <label htmlFor="applicationDate">Başvuru tarihi</label>
          <br />
          <input
            id="applicationDate"
            name="applicationDate"
            type="date"
            required
          />
        </p>

        <p>
          <label htmlFor="status">Durum</label>
          <br />
          <select id="status" name="status" defaultValue="" required>
            <option value="" disabled>Durum seç</option>
            <option value="applied">Başvuruldu</option>
            <option value="interview">Görüşme</option>
            <option value="offer">Teklif Alındı</option>
            <option value="rejected">Reddedildi</option>
          </select>
        </p>

        <p>
          <label htmlFor="note">Not (isteğe bağlı)</label>
          <br />
          <textarea id="note" name="note" rows={4} />
        </p>

        <button type="submit">Başvuru ekle</button>
      </form>

      {feedback && (
        <p role={feedback.type === 'error' ? 'alert' : 'status'}>
          {feedback.message}
          {feedback.type === 'success' && (
            <> Bu oturumda eklenen başvuru sayısı: {applications.length}.</>
          )}
        </p>
      )}
    </main>
  )
}

export default App
