const STORAGE_KEY = 'applyhub-applications'

function isValidApplication(application) {
  if (!application || typeof application !== 'object') {
    return false
  }

  const fields = ['id', 'company', 'position', 'applicationDate', 'status', 'note']

  return fields.every((field) => typeof application[field] === 'string')
}

export function loadApplications() {
  const savedApplications = localStorage.getItem(STORAGE_KEY)

  if (savedApplications === null) {
    return []
  }

  const applications = JSON.parse(savedApplications)

  if (!Array.isArray(applications) || !applications.every(isValidApplication)) {
    throw new Error('Invalid saved applications')
  }

  return applications
}

export function saveApplications(applications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
}
