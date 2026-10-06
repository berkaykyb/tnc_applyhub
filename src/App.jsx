import { useRef, useState } from 'react'
import { loadApplications, saveApplications } from './applicationStorage.js'
import './App.css'

const statusLabels = {
  applied: 'Başvuruldu',
  interview: 'Görüşme',
  offer: 'Teklif Alındı',
  rejected: 'Reddedildi',
}

const emptyFormValues = {
  company: '',
  position: '',
  applicationDate: '',
  status: '',
  note: '',
}

function App() {
  const [applicationState, setApplicationState] = useState(() => {
    try {
      return { applications: loadApplications(), storageError: '' }
    } catch {
      return {
        applications: [],
        storageError:
          'Kaydedilmiş başvurular okunamadı. Mevcut verileri korumak için yeni kayıt eklenemiyor.',
      }
    }
  })
  const [feedback, setFeedback] = useState(null)
  const [formValues, setFormValues] = useState(emptyFormValues)
  const [editingId, setEditingId] = useState(null)
  const companyInputRef = useRef(null)
  const { applications, storageError } = applicationState

  function persistApplications(updatedApplications, successMessage) {
    if (storageError) {
      return false
    }

    try {
      saveApplications(updatedApplications)
    } catch {
      setFeedback({
        type: 'error',
        message:
          'Değişiklik kaydedilemedi. Mevcut kayıtlar ve formdaki bilgilerin korunuyor; tekrar deneyebilirsin.',
      })
      return false
    }

    setApplicationState({ applications: updatedApplications, storageError: '' })
    setFeedback({ type: 'success', message: successMessage })
    return true
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormValues((previousValues) => ({ ...previousValues, [name]: value }))
    setFeedback(null)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (storageError) {
      return
    }

    const formData = new FormData(event.currentTarget)
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
      id: editingId ?? crypto.randomUUID(),
      company,
      position,
      applicationDate: formData.get('applicationDate'),
      status: formData.get('status'),
      note: formData.get('note').trim(),
    }

    const updatedApplications = editingId
      ? applications.map((existingApplication) =>
          existingApplication.id === editingId
            ? application
            : existingApplication,
        )
      : [...applications, application]

    const successMessage = editingId
      ? 'Başvuru güncellendi.'
      : 'Başvuru eklendi.'

    if (!persistApplications(updatedApplications, successMessage)) {
      return
    }

    setFormValues(emptyFormValues)
    setEditingId(null)
  }

  function handleEdit(application) {
    setFormValues({
      company: application.company,
      position: application.position,
      applicationDate: application.applicationDate,
      status: application.status,
      note: application.note,
    })
    setEditingId(application.id)
    setFeedback(null)
    companyInputRef.current?.focus()
  }

  function handleCancelEdit() {
    setFormValues(emptyFormValues)
    setEditingId(null)
    setFeedback(null)
    companyInputRef.current?.focus()
  }

  function handleDelete(applicationId) {
    if (!window.confirm('Bu başvuruyu silmek istiyor musun?')) {
      return
    }

    const updatedApplications = applications.filter(
      (application) => application.id !== applicationId,
    )

    if (!persistApplications(updatedApplications, 'Başvuru silindi.')) {
      return
    }

    if (editingId === applicationId) {
      setEditingId(null)
      setFormValues(emptyFormValues)
      companyInputRef.current?.focus()
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Başvuru takibi</p>
        <h1>ApplyHub</h1>
        <p>Staj ve iş başvurularını tek yerde takip et.</p>
      </header>

      <div className="workspace">
        <section className="panel form-panel" aria-labelledby="form-heading">
          <h2 id="form-heading">
            {editingId ? 'Başvuruyu düzenle' : 'Başvuru ekle'}
          </h2>
          <p className="section-description">
            Not dışındaki alanlar zorunludur.
          </p>

          {storageError && (
            <p className="feedback feedback-error" role="alert">
              {storageError}
            </p>
          )}

          <form className="application-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="company">Şirket adı</label>
              <input
                ref={companyInputRef}
                id="company"
                name="company"
                type="text"
                value={formValues.company}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="position">Pozisyon</label>
              <input
                id="position"
                name="position"
                type="text"
                value={formValues.position}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="applicationDate">Başvuru tarihi</label>
              <input
                id="applicationDate"
                name="applicationDate"
                type="date"
                value={formValues.applicationDate}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="status">Durum</label>
              <select
                id="status"
                name="status"
                value={formValues.status}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>
                  Durum seç
                </option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="note">Not (isteğe bağlı)</label>
              <textarea
                id="note"
                name="note"
                rows={4}
                value={formValues.note}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-actions">
              <button
                className="button button-primary"
                type="submit"
                disabled={Boolean(storageError)}
              >
                {editingId ? 'Değişiklikleri kaydet' : 'Başvuru ekle'}
              </button>
              {editingId && (
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Vazgeç
                </button>
              )}
            </div>
          </form>

          {feedback && (
            <p
              className={'feedback feedback-' + feedback.type}
              role={feedback.type === 'error' ? 'alert' : 'status'}
            >
              {feedback.message}
              {feedback.type === 'success' && (
                <> Toplam başvuru sayısı: {applications.length}.</>
              )}
            </p>
          )}
        </section>

        <section
          className="panel applications-panel"
          aria-labelledby="applications-heading"
        >
          <div className="section-header">
            <h2 id="applications-heading">Başvurular</h2>
            {!storageError && (
              <span className="count">{applications.length}</span>
            )}
          </div>

          {storageError ? (
            <p className="empty-state">Başvuru listesi yüklenemedi.</p>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <p>Henüz başvuru eklenmedi.</p>
              <span>Formu doldur; ilk başvurun burada görünsün.</span>
            </div>
          ) : (
            <ul className="application-list">
              {applications.map((application) => (
                <li
                  className={
                    'application-card' +
                    (editingId === application.id ? ' is-editing' : '')
                  }
                  key={application.id}
                >
                  <div className="card-header">
                    <h3>{application.company}</h3>
                    <span
                      className={'status-badge status-' + application.status}
                    >
                      {statusLabels[application.status]}
                    </span>
                  </div>
                  <dl className="application-details">
                    <div>
                      <dt>Pozisyon</dt>
                      <dd>{application.position}</dd>
                    </div>

                    <div>
                      <dt>Başvuru tarihi</dt>
                      <dd>
                        <time dateTime={application.applicationDate}>
                          {application.applicationDate
                            .split('-')
                            .reverse()
                            .join('.')}
                        </time>
                      </dd>
                    </div>

                    <div className="application-note">
                      <dt>Not</dt>
                      <dd>{application.note || 'Not eklenmedi.'}</dd>
                    </div>
                  </dl>
                  <div className="card-actions">
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => handleEdit(application)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="button button-danger"
                      type="button"
                      onClick={() => handleDelete(application.id)}
                    >
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
