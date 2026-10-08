function ApplicationCard({
  application,
  isEditing,
  statusLabel,
  onEdit,
  onDelete,
}) {
  return (
    <li className={'application-card' + (isEditing ? ' is-editing' : '')}>
      <div className="card-header">
        <h3>{application.company}</h3>
        <span className={'status-badge status-' + application.status}>
          {statusLabel}
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
              {application.applicationDate.split('-').reverse().join('.')}
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
          onClick={() => onEdit(application)}
        >
          Düzenle
        </button>
        <button
          className="button button-danger"
          type="button"
          onClick={() => onDelete(application.id)}
        >
          Sil
        </button>
      </div>
    </li>
  )
}

export default ApplicationCard
