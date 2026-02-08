import { useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:5086'

type HttpMethod = 'GET' | 'POST' | 'PUT'

interface ApiResult {
  ok: boolean
  status: number
  data: unknown
}

function App() {
  const [loading, setLoading] = useState(false)
  const [lastRequest, setLastRequest] = useState('')
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [doctorId, setDoctorId] = useState('1')
  const [appointmentId, setAppointmentId] = useState('1')
  const [episodeId, setEpisodeId] = useState('1')
  const [doctorFirstName, setDoctorFirstName] = useState('')
  const [doctorLastName, setDoctorLastName] = useState('')
  const [doctorLicenseNumber, setDoctorLicenseNumber] = useState('')
  const [doctorAddress, setDoctorAddress] = useState('')
  const [doctorPhone, setDoctorPhone] = useState('')
  const [doctorEmail, setDoctorEmail] = useState('')
  const [doctorTreatmentUnitId, setDoctorTreatmentUnitId] = useState('')
  const [officeName, setOfficeName] = useState('')
  const [officeLocation, setOfficeLocation] = useState('')
  const [episodeNotes, setEpisodeNotes] = useState('')

  async function callApi(method: HttpMethod, path: string, body?: unknown) {
    setLoading(true)
    setError(null)
    setResult(null)
    setLastRequest(`${method} ${path}`)
    try {
      const url = `${API_BASE}${path}`
      const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })

      const contentType = response.headers.get('content-type')
      let data: unknown
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      setResult({
        ok: response.ok,
        status: response.status,
        data,
      })
      if (!response.ok) {
        setError('La respuesta no fue exitosa. Revisa el detalle abajo.')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Medical Appointments UI</h1>
        <p>Panel para probar las APIs del backend</p>
        <p className="app-base-url">Base URL API: {API_BASE}</p>
      </header>

      <main className="app-main">
        <section className="api-section">
          <h2>Health</h2>
          <button
            className="api-button"
            onClick={() => callApi('GET', '/api/health')}
            disabled={loading}
          >
            GET /api/health
          </button>
        </section>

        <section className="api-section">
          <h2>Appointments</h2>
          <div className="field-row">
            <label>
              Appointment Id
              <input
                type="number"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Doctor Id
              <input
                type="number"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
            </label>
          </div>
          <button
            className="api-button"
            onClick={() =>
              callApi('POST', `/api/appointments/${appointmentId}/attend`, {
                doctorId: Number(doctorId),
              })
            }
            disabled={loading}
          >
            POST /api/appointments/:id/attend
          </button>
          <button
            className="api-button"
            onClick={() => callApi('GET', '/api/appointments/today')}
            disabled={loading}
          >
            GET /api/appointments/today
          </button>
          <button
            className="api-button"
            onClick={() => callApi('GET', '/api/appointments/ping')}
            disabled={loading}
          >
            GET /api/appointments/ping
          </button>
        </section>

        <section className="api-section">
          <h2>Doctors</h2>
          <div className="field-row">
            <label>
              Doctor Id
              <input
                type="number"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
            </label>
          </div>
          <button
            className="api-button"
            onClick={() => callApi('GET', `/api/doctors/${doctorId}/schedule`)}
            disabled={loading}
          >
            GET /api/doctors/:id/schedule
          </button>
          <button
            className="api-button"
            onClick={() => callApi('GET', `/api/doctors/${doctorId}/availability`)}
            disabled={loading}
          >
            GET /api/doctors/:id/availability
          </button>
          <button
            className="api-button"
            onClick={() => callApi('GET', '/api/doctors')}
            disabled={loading}
          >
            GET /api/doctors
          </button>

          <h3>Crear doctor</h3>
          <div className="field-row">
            <label>
              First name
              <input
                type="text"
                value={doctorFirstName}
                onChange={(e) => setDoctorFirstName(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Last name
              <input
                type="text"
                value={doctorLastName}
                onChange={(e) => setDoctorLastName(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              License number
              <input
                type="text"
                value={doctorLicenseNumber}
                onChange={(e) => setDoctorLicenseNumber(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Address (opcional)
              <input
                type="text"
                value={doctorAddress}
                onChange={(e) => setDoctorAddress(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Phone (opcional)
              <input
                type="text"
                value={doctorPhone}
                onChange={(e) => setDoctorPhone(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Email (opcional)
              <input
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Treatment Unit Id
              <input
                type="number"
                value={doctorTreatmentUnitId}
                onChange={(e) => setDoctorTreatmentUnitId(e.target.value)}
              />
            </label>
          </div>
          <button
            className="api-button"
            onClick={() =>
              callApi('POST', '/api/doctors/create', {
                firstName: doctorFirstName,
                lastName: doctorLastName,
                licenseNumber: doctorLicenseNumber,
                address: doctorAddress || null,
                phone: doctorPhone || null,
                email: doctorEmail || null,
                treatmentUnitId: doctorTreatmentUnitId
                  ? Number(doctorTreatmentUnitId)
                  : 0,
              })
            }
            disabled={loading}
          >
            POST /api/doctors/create
          </button>
        </section>

        <section className="api-section">
          <h2>Offices</h2>
          <button
            className="api-button"
            onClick={() => callApi('GET', '/api/offices')}
            disabled={loading}
          >
            GET /api/offices
          </button>

          <h3>Crear office</h3>
          <div className="field-row">
            <label>
              Nombre
              <input
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Ubicación
              <input
                type="text"
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
              />
            </label>
          </div>
          <button
            className="api-button"
            onClick={() =>
              callApi('POST', '/api/offices', {
                name: officeName,
                location: officeLocation,
              })
            }
            disabled={loading}
          >
            POST /api/offices
          </button>
        </section>

        <section className="api-section">
          <h2>Medical Episodes</h2>
          <div className="field-row">
            <label>
              Episode Id
              <input
                type="number"
                value={episodeId}
                onChange={(e) => setEpisodeId(e.target.value)}
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              Notas
              <textarea
                value={episodeNotes}
                onChange={(e) => setEpisodeNotes(e.target.value)}
              />
            </label>
          </div>
          <button
            className="api-button"
            onClick={() =>
              callApi('PUT', `/api/medical-episodes/${episodeId}/notes`, {
                notes: episodeNotes,
              })
            }
            disabled={loading}
          >
            PUT /api/medical-episodes/:id/notes
          </button>
        </section>

        <section className="api-section api-result-section">
          <h2>Resultado</h2>
          {loading && <p>Cargando...</p>}
          {!loading && lastRequest && (
            <p className="last-request">Última llamada: {lastRequest}</p>
          )}
          {error && <p className="error-text">Error: {error}</p>}
          {result && (
            <pre className="result-pre">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
