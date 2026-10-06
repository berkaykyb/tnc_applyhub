import { useState } from 'react'
import { loadApplications, saveApplications } from './applicationStorage.js'

const statusLabels = {
  applied: 'Başvuruldu',
  interview: 'Görüşme',
  offer: 'Teklif Alındı',
  rejected: 'Reddedildi',
}

function App() {
  const [applicationState, setApplicationState] = useState(() => {
    try {
      return { applications: loadApplications(), storageError: '' }
    } catch {
      return {
        applications: [],
        storageError: 'Kaydedilmiş başvurular okunamadı. Mevcut verileri korumak için yeni kayıt eklenemiyor.',
      }
    }
  })
  const [feedback, setFeedback] = useState(null)
  const { applications, storageError } = applicationState

  function handleSubmit(event) {
    event.preventDefault()

    if (storageError) {
      return
    }

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

    const updatedApplications = [...applications, application]

    try {
      saveApplications(updatedApplications)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Başvuru kaydedilemedi. Formdaki bilgilerin korunuyor; tekrar deneyebilirsin.',
      })
      return
    }

    setApplicationState({ applications: updatedApplications, storageError: '' })
    setFeedback({ type: 'success', message: 'Başvuru eklendi.' })
    form.reset()
  }

  return (
    <main>
      <h1>ApplyHub</h1>
      <p>Staj ve iş başvurularını tek yerde takip et.</p>

      <h2>Başvuru ekle</h2>
      <p>Not dışındaki alanlar zorunludur.</p>

      {storageError && <p role="alert">{storageError}</p>}

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

        <button type="submit" disabled={Boolean(storageError)}>Başvuru ekle</button>
      </form>

      {feedback && (
        <p role={feedback.type === 'error' ? 'alert' : 'status'}>
          {feedback.message}
          {feedback.type === 'success' && (
            <> Toplam başvuru sayısı: {applications.length}.</>
          )}
        </p>
      )}

      <section aria-labelledby="applications-heading">
        <h2 id="applications-heading">Başvurular</h2>

        {storageError ? (
          <p>Başvuru listesi yüklenemedi.</p>
        ) : applications.length === 0 ? (
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
