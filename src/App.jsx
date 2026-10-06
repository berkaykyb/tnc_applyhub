import { useState } from 'react'

const statusLabels = {
  applied: 'Başvuruldu',
  interview: 'Görüşme',
  offer: 'Teklif Alındı',
  rejected: 'Reddedildi',
}

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
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
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

      <section aria-labelledby="applications-heading">
        <h2 id="applications-heading">Başvurular</h2>

        {applications.length === 0 ? (
          <p>Henüz başvuru eklenmedi.</p>
        ) : (
          <ul>
            {applications.map((application) => (
              <li key={application.id}>
                <h3>{application.company}</h3>
                <dl>
                  <dt>Pozisyon</dt>
                  <dd>{application.position}</dd>

                  <dt>Başvuru tarihi</dt>
                  <dd>
                    <time dateTime={application.applicationDate}>
                      {application.applicationDate.split('-').reverse().join('.')}
                    </time>
                  </dd>

                  <dt>Durum</dt>
                  <dd>{statusLabels[application.status]}</dd>

                  <dt>Not</dt>
                  <dd>{application.note || 'Not eklenmedi.'}</dd>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
