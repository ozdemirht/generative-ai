import { v4 as uuidv4 } from 'uuid';

// Types for our local database
export interface VitalsLog {
  date: string;
  systolic: number;
  diastolic: number;
  heartRate?: number;
  notes?: string;
}

export interface Appointment {
  date: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'missed';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string; // e.g., "Hypertension Stage 1", "Pre-hypertension"
  registeredDate: string;
  vitalsHistory: VitalsLog[];
  appointments: Appointment[];
}

const STORAGE_KEY = 'mhypertension_patient_db';

// Helper to get DB
const getDb = (): Patient[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save DB
const saveDb = (patients: Patient[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

export const PatientService = {
  listPatients: (): { id: string; name: string; condition: string }[] => {
    const patients = getDb();
    return patients.map(p => ({ id: p.id, name: p.name, condition: p.condition }));
  },

  getPatientByName: (name: string): Patient | undefined => {
    const patients = getDb();
    return patients.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
  },

  getPatientById: (id: string): Patient | undefined => {
    const patients = getDb();
    return patients.find(p => p.id === id);
  },

  registerPatient: (name: string, age: number, gender: string, condition: string): Patient => {
    const patients = getDb();
    const newPatient: Patient = {
      id: uuidv4(),
      name,
      age,
      gender,
      condition,
      registeredDate: new Date().toISOString(),
      vitalsHistory: [],
      appointments: []
    };
    patients.push(newPatient);
    saveDb(patients);
    return newPatient;
  },

  recordVitals: (patientId: string, systolic: number, diastolic: number, heartRate?: number, notes?: string): boolean => {
    const patients = getDb();
    const index = patients.findIndex(p => p.id === patientId);
    if (index === -1) return false;

    patients[index].vitalsHistory.push({
      date: new Date().toISOString(),
      systolic,
      diastolic,
      heartRate,
      notes
    });
    saveDb(patients);
    return true;
  },

  scheduleAppointment: (patientId: string, date: string, reason: string): boolean => {
    const patients = getDb();
    const index = patients.findIndex(p => p.id === patientId);
    if (index === -1) return false;

    patients[index].appointments.push({
      date,
      reason,
      status: 'scheduled'
    });
    saveDb(patients);
    return true;
  }
};