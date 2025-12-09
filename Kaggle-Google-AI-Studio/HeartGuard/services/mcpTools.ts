import { FunctionDeclaration, Type } from "@google/genai";
import { PatientService } from "./patientData";

// Tool Definitions for Gemini
export const PATIENT_TOOLS: FunctionDeclaration[] = [
  {
    name: "register_patient",
    description: "Register a new patient into the system. Use this when the user introduces a new patient.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Full name of the patient" },
        age: { type: Type.NUMBER, description: "Age of the patient" },
        gender: { type: Type.STRING, description: "Gender of the patient (e.g., Male, Female)" },
        condition: { type: Type.STRING, description: "Initial diagnosis or condition (e.g., 'Hypertension', 'At Risk')" }
      },
      required: ["name", "age", "gender", "condition"]
    }
  },
  {
    name: "get_patient_records",
    description: "Search for a patient and retrieve their full history, vitals, and appointments. Use this when the user mentions a patient's name.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of the patient to search for" }
      },
      required: ["name"]
    }
  },
  {
    name: "record_vitals",
    description: "Log new blood pressure or heart rate readings for a specific patient.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        patientId: { type: Type.STRING, description: "The ID of the patient (retrieved from get_patient_records)" },
        systolic: { type: Type.NUMBER, description: "Systolic blood pressure (mmHg)" },
        diastolic: { type: Type.NUMBER, description: "Diastolic blood pressure (mmHg)" },
        heartRate: { type: Type.NUMBER, description: "Heart rate (bpm), optional" },
        notes: { type: Type.STRING, description: "Any observation notes about the reading" }
      },
      required: ["patientId", "systolic", "diastolic"]
    }
  },
  {
    name: "schedule_appointment",
    description: "Schedule a follow-up check-in or appointment.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        patientId: { type: Type.STRING, description: "The ID of the patient" },
        date: { type: Type.STRING, description: "Date string for the appointment (e.g., '2023-10-25' or 'Next Tuesday')" },
        reason: { type: Type.STRING, description: "Reason for the appointment" }
      },
      required: ["patientId", "date", "reason"]
    }
  },
  {
    name: "list_patients",
    description: "List all patients currently registered in the database.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
    }
  }
];

// Execution Logic
export const executeTool = async (name: string, args: any): Promise<any> => {
  console.log(`[MCP] Executing tool: ${name}`, args);
  
  switch (name) {
    case "register_patient":
      const newPatient = PatientService.registerPatient(args.name, args.age, args.gender, args.condition);
      return { 
        result: "success", 
        message: `Patient registered successfully. ID: ${newPatient.id}`, 
        patient: newPatient 
      };

    case "get_patient_records":
      const patient = PatientService.getPatientByName(args.name);
      if (!patient) return { result: "not_found", message: `No patient found with name: ${args.name}` };
      return { result: "success", patient };

    case "record_vitals":
      const recorded = PatientService.recordVitals(args.patientId, args.systolic, args.diastolic, args.heartRate, args.notes);
      return recorded 
        ? { result: "success", message: "Vitals logged." }
        : { result: "error", message: "Patient ID not found." };

    case "schedule_appointment":
      const scheduled = PatientService.scheduleAppointment(args.patientId, args.date, args.reason);
      return scheduled
        ? { result: "success", message: "Appointment scheduled." }
        : { result: "error", message: "Patient ID not found." };

    case "list_patients":
      const list = PatientService.listPatients();
      return { result: "success", count: list.length, patients: list };

    default:
      return { result: "error", message: "Unknown tool" };
  }
};