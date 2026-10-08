function ApplicationForm({
  formValues,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  companyInputRef,
  statusLabels,
  storageError,
  feedback,
  applicationCount,
}) {
  return (
    <section className="panel form-panel" aria-labelledby="form-heading">
      <h2 id="form-heading">
        {isEditing ? 'Başvuruyu düzenle' : 'Başvuru ekle'}
      </h2>
      <p className="section-description">Not dışındaki alanlar zorunludur.</p>

      {storageError && (
        <p className="feedback feedback-error" role="alert">
          {storageError}
        </p>
      )}

      <form className="application-form" onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="company">Şirket adı</label>
          <input
            ref={companyInputRef}
            id="company"
            name="company"
            type="text"
            value={formValues.company}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="status">Durum</label>
          <select
            id="status"
            name="status"
            value={formValues.status}
            onChange={onChange}
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
            onChange={onChange}
          />
        </div>

        <div className="form-actions">
          <button
            className="button button-primary"
            type="submit"
            disabled={Boolean(storageError)}
          >
            {isEditing ? 'Değişiklikleri kaydet' : 'Başvuru ekle'}
          </button>
          {isEditing && (
            <button
              className="button button-secondary"
              type="button"
              onClick={onCancel}
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
            <> Toplam başvuru sayısı: {applicationCount}.</>
          )}
        </p>
      )}
    </section>
  )
}

export default ApplicationForm
