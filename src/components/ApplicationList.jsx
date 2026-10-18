import ApplicationCard from './ApplicationCard.jsx'

function ApplicationList({
  applications,
  totalCount,
  selectedStatus,
  onResetFilter,
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
        {!storageError && (
          <span
            className="count"
            role="status"
            aria-label={`${applications.length} başvuru gösteriliyor, toplam ${totalCount}`}
          >
            {selectedStatus === 'all'
              ? applications.length
              : `${applications.length} / ${totalCount}`}
          </span>
        )}
      </div>

      {storageError ? (
        <p className="empty-state">Başvuru listesi yüklenemedi.</p>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <p>
            {totalCount === 0
              ? 'Henüz başvuru eklenmedi.'
              : 'Bu durumda başvuru yok.'}
          </p>
          <span>
            {totalCount === 0
              ? 'Formu doldur; ilk başvurun burada görünsün.'
              : 'Diğer başvurularını görmek için filtreyi değiştirebilirsin.'}
          </span>
          {selectedStatus !== 'all' && (
            <button
              className="button button-secondary reset-filter"
              type="button"
              onClick={onResetFilter}
            >
              Tümünü göster
            </button>
          )}
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
