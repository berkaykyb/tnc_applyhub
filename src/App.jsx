import { useRef, useState } from 'react'
import { loadApplications, saveApplications } from './applicationStorage.js'
import ApplicationForm from './components/ApplicationForm.jsx'
import ApplicationList from './components/ApplicationList.jsx'
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
        <ApplicationForm
          formValues={formValues}
          isEditing={editingId !== null}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          companyInputRef={companyInputRef}
          statusLabels={statusLabels}
          storageError={storageError}
          feedback={feedback}
          applicationCount={applications.length}
        />

        <ApplicationList
          applications={applications}
          editingId={editingId}
          storageError={storageError}
          statusLabels={statusLabels}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  )
}

export default App
