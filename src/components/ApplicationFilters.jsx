function ApplicationFilters({
  applications,
  statusLabels,
  selectedStatus,
  onChange,
  disabled,
}) {
  const counts = applications.reduce((totals, application) => {
    totals[application.status] = (totals[application.status] ?? 0) + 1
    return totals
  }, {})
  const filters = { all: 'Tümü', ...statusLabels }

  return (
    <nav className="application-filters" aria-label="Başvuru durumuna göre filtrele">
      {Object.entries(filters).map(([status, label]) => (
        <button
          key={status}
          type="button"
          className="filter-button"
          data-status={status}
          aria-pressed={selectedStatus === status}
          onClick={() => onChange(status)}
          disabled={disabled}
        >
          {label}
          <span className="filter-count">
            {status === 'all' ? applications.length : (counts[status] ?? 0)}
          </span>
        </button>
      ))}
    </nav>
  )
}

export default ApplicationFilters
