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
        <div className="company-heading">
          <span className="company-initial" aria-hidden="true">
            {application.company.charAt(0).toLocaleUpperCase('tr')}
          </span>
          <div className="company-title">
            <h3>{application.company}</h3>
            <p>{application.position}</p>
          </div>
        </div>
        <span className={'status-badge status-' + application.status}>
          {statusLabel}
        </span>
      </div>
      <dl className="application-details">
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
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m12.5 4.5 3 3M3 17l4-.8L17 6.2a2.1 2.1 0 0 0-3-3L4 13.3 3 17Z" />
          </svg>
          Düzenle
        </button>
        <button
          className="button button-danger"
          type="button"
          onClick={() => onDelete(application.id)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 5h14M7 5V3h6v2M5 5l1 12h8l1-12M8 8v6m4-6v6" />
          </svg>
          Sil
        </button>
      </div>
    </li>
  )
}

export default ApplicationCard
