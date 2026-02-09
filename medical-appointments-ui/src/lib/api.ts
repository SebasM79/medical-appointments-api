const API_BASE = 'http://localhost:5086';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

export async function callApi<T = unknown>(
  method: HttpMethod,
  path: string,
  body?: unknown
): Promise<ApiResult<T>> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  let data: T;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = (await response.text()) as T;
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  }

  return { ok: response.ok, status: response.status, data };
}

// Health
export const checkHealth = () => callApi('GET', '/api/health');

// Appointments
export const getAppointmentsToday = () => callApi('GET', '/api/appointments/today');
export const pingAppointments = () => callApi('GET', '/api/appointments/ping');
export const attendAppointment = (appointmentId: number, doctorId: number) =>
  callApi('POST', `/api/appointments/${appointmentId}/attend`, { doctorId });

// Doctors
export const getDoctors = () => callApi('GET', '/api/doctors');
export const getDoctorSchedule = (doctorId: number) => callApi('GET', `/api/doctors/${doctorId}/schedule`);
export const getDoctorAvailability = (doctorId: number) => callApi('GET', `/api/doctors/${doctorId}/availability`);
export const createDoctor = (doctor: {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  treatmentUnitId: number;
}) => callApi('POST', '/api/doctors/create', doctor);

// Offices
export const getOffices = () => callApi('GET', '/api/offices');
export const createOffice = (office: { name: string; location: string }) =>
  callApi('POST', '/api/offices', office);

// Medical Episodes
export const updateEpisodeNotes = (episodeId: number, notes: string) =>
  callApi('PUT', `/api/medical-episodes/${episodeId}/notes`, { notes });