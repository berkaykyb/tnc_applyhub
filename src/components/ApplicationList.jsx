import ApplicationCard from './ApplicationCard.jsx'

function ApplicationList({
  applications,
  editingId,
  storageError,
  statusLabels,
  onEdit,
  onDelete,
}) {
  return (
    <section
      className="panel applications-panel"
      aria-labelledby="applications-heading"
    >
      <div className="section-header">
        <h2 id="applications-heading">Başvurular</h2>
        {!storageError && <span className="count">{applications.length}</span>}
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
            <ApplicationCard
              key={application.id}
              application={application}
              isEditing={editingId === application.id}
              statusLabel={statusLabels[application.status]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default ApplicationList
