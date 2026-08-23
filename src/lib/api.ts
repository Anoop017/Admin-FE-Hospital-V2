import axios from "axios";
import { getToken, clearSession } from "@/lib/auth";
import type { Role, User, AuthUser, LoginPayload, LoginResponse, UserCreatePayload, UserUpdatePayload, NavItem, NavSection, LoginDto, RegisterDto, CreateUserDto, UpdateUserDto, CreatePatientDto, UpdatePatientDto, CreateDoctorDto, UpdateDoctorDto, CreateStaffDto, UpdateStaffDto, CreateDepartmentDto, UpdateDepartmentDto, CreateAppointmentDto, UpdateAppointmentDto, CreateWardDto, UpdateWardDto, CreateBedDto, UpdateBedDto, CreateAdmissionDto, UpdateAdmissionDto, CreateMedicalRecordDto, UpdateMedicalRecordDto, CreatePrescriptionDto, UpdatePrescriptionDto, CreateMedicineDto, UpdateMedicineDto, CreateLabTestDto, UpdateLabTestDto, CreateBillDto, UpdateBillDto, CreatePaymentDto, Patient, Doctor, Staf, Staff, Department, Appointment, Ward, Bed, Admission, MedicalRecord, Prescription, Medicine, Laborator, LabTest, Bill, Payment } from "@/types";

// ── Axios Instance ───────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3042/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor (attach JWT) ─────────────────
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor (handle envelope & 401) ──
api.interceptors.response.use(
  (response) => {
    // If response is formatted with standard envelope { success, data, meta }
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data &&
      ("success" in response.data || "statusCode" in response.data)
    ) {
      const envelope = response.data;
      const innerData = envelope.data;
      if (innerData !== null && typeof innerData === "object" && envelope.meta) {
        try {
          (innerData as any)._meta = envelope.meta;
        } catch {
          // ignore frozen objects
        }
      }
      response.data = innerData;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ── Auth API ─────────────────────────────────────────
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function getProfile(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/profile");
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<any> {
  const { data } = await api.post<any>("/auth/change-password", payload);
  return data;
}

export async function getDashboardSummary(): Promise<any> {
  const { data } = await api.get<any>("/dashboard/summary");
  return data;
}

// ── Users API ────────────────────────────────────────
export async function getUsers(role?: string): Promise<User[]> {
  const url = role ? `/users?role=${role}` : "/users";
  const { data } = await api.get<User[]>(url);
  return data;
}

export async function getUsersSummary(): Promise<import("@/types").UsersSummary> {
  const { data } = await api.get<import("@/types").UsersSummary>("/users/summary");
  return data;
}

export async function createUser(payload: UserCreatePayload): Promise<User> {
  const { data } = await api.post<User>("/users", payload);
  return data;
}

export async function updateUser(
  id: string,
  payload: UserUpdatePayload,
): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

export default api;

// ── Auto-generated API Functions ────────────────────

export async function createPatient(
  payload: CreatePatientDto,
): Promise<Patient> {
  const { data } = await api.post<Patient>("/patients", payload);
  return data;
}

export async function createPatientWithUser(
  payload: { user: UserCreatePayload; patient: CreatePatientDto }
): Promise<Patient> {
  const { data } = await api.post<Patient>("/patients/with-user", payload);
  return data;
}

export async function getPatientsOverview(filter?: string): Promise<any[]> {
  const url = filter && filter !== 'Today' ? `/patients/overview?filter=${filter.toLowerCase()}` : "/patients/overview";
  const { data } = await api.get<any[]>(url);
  return data;
}

export async function getPatients(): Promise<Patient[]> {
  const { data } = await api.get<Patient[]>("/patients");
  return data;
}

export async function getPatient(id: string): Promise<Patient> {
  const { data } = await api.get<Patient>(`/patients/${id}`);
  return data;
}

export async function updatePatient(
  id: string,
  payload: UpdatePatientDto,
): Promise<Patient> {
  const { data } = await api.patch<Patient>(`/patients/${id}`, payload);
  return data;
}

export async function deletePatient(id: string): Promise<void> {
  await api.delete(`/patients/${id}`);
}

export async function deletePatientBulk(ids: string[]): Promise<void> {
  await api.delete("/patients/bulk", { data: { ids } });
}

export async function createDoctor(payload: CreateDoctorDto): Promise<Doctor> {
  const { data } = await api.post<Doctor>("/doctors", payload);
  return data;
}

export async function createDoctorWithUser(
  payload: { user: UserCreatePayload; doctor: CreateDoctorDto }
): Promise<Doctor> {
  const { data } = await api.post<Doctor>("/doctors/with-user", payload);
  return data;
}

export async function getDoctors(): Promise<Doctor[]> {
  const { data } = await api.get<Doctor[]>("/doctors");
  return data;
}

export async function getDoctor(id: string): Promise<Doctor> {
  const { data } = await api.get<Doctor>(`/doctors/${id}`);
  return data;
}

export async function updateDoctor(
  id: string,
  payload: UpdateDoctorDto,
): Promise<Doctor> {
  const { data } = await api.patch<Doctor>(`/doctors/${id}`, payload);
  return data;
}

export async function deleteDoctor(id: string): Promise<void> {
  await api.delete(`/doctors/${id}`);
}

export async function createStaf(payload: CreateStaffDto): Promise<Staf> {
  const { data } = await api.post<Staf>("/staff", payload);
  return data;
}

export async function createStafWithUser(
  payload: { user: UserCreatePayload; staff: CreateStaffDto }
): Promise<Staf> {
  const { data } = await api.post<Staf>("/staff/with-user", payload);
  return data;
}

export async function getStaff(): Promise<Staf[]> {
  const { data } = await api.get<Staf[]>("/staff");
  return data;
}

export async function getStaf(id: string): Promise<Staf> {
  const { data } = await api.get<Staf>(`/staff/${id}`);
  return data;
}

export async function updateStaf(
  id: string,
  payload: UpdateStaffDto,
): Promise<Staf> {
  const { data } = await api.patch<Staf>(`/staff/${id}`, payload);
  return data;
}

export async function deleteStaf(id: string): Promise<void> {
  await api.delete(`/staff/${id}`);
}

export async function createDepartment(
  payload: CreateDepartmentDto,
): Promise<Department> {
  const { data } = await api.post<Department>("/departments", payload);
  return data;
}

export async function getDepartments(): Promise<Department[]> {
  const { data } = await api.get<Department[]>("/departments");
  return data;
}

export async function getDepartment(id: string): Promise<Department> {
  const { data } = await api.get<Department>(`/departments/${id}`);
  return data;
}

export async function updateDepartment(
  id: string,
  payload: UpdateDepartmentDto,
): Promise<Department> {
  const { data } = await api.patch<Department>(`/departments/${id}`, payload);
  return data;
}

export async function deleteDepartment(id: string): Promise<void> {
  await api.delete(`/departments/${id}`);
}

export async function createAppointment(
  payload: CreateAppointmentDto,
): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/appointments", payload);
  return data;
}

export async function getAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/appointments");
  return data;
}

export async function getAppointment(id: string): Promise<Appointment> {
  const { data } = await api.get<Appointment>(`/appointments/${id}`);
  return data;
}

export async function updateAppointment(
  id: string,
  payload: UpdateAppointmentDto,
): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(`/appointments/${id}`, payload);
  return data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/appointments/${id}`);
}

export async function createWard(payload: CreateWardDto): Promise<Ward> {
  const { data } = await api.post<Ward>("/wards", payload);
  return data;
}

export async function getWards(): Promise<Ward[]> {
  const { data } = await api.get<Ward[]>("/wards");
  return data;
}

export async function getWard(id: string): Promise<Ward> {
  const { data } = await api.get<Ward>(`/wards/${id}`);
  return data;
}

export async function updateWard(
  id: string,
  payload: UpdateWardDto,
): Promise<Ward> {
  const { data } = await api.patch<Ward>(`/wards/${id}`, payload);
  return data;
}

export async function deleteWard(id: string): Promise<void> {
  await api.delete(`/wards/${id}`);
}

export async function createBed(payload: CreateBedDto): Promise<Bed> {
  const { data } = await api.post<Bed>("/beds", payload);
  return data;
}

export async function getBeds(): Promise<Bed[]> {
  const { data } = await api.get<Bed[]>("/beds");
  return data;
}

export async function getBed(id: string): Promise<Bed> {
  const { data } = await api.get<Bed>(`/beds/${id}`);
  return data;
}

export async function updateBed(
  id: string,
  payload: UpdateBedDto,
): Promise<Bed> {
  const { data } = await api.patch<Bed>(`/beds/${id}`, payload);
  return data;
}

export async function deleteBed(id: string): Promise<void> {
  await api.delete(`/beds/${id}`);
}

export async function createAdmission(
  payload: CreateAdmissionDto,
): Promise<Admission> {
  const { data } = await api.post<Admission>("/admissions", payload);
  return data;
}

export async function getAdmissions(): Promise<Admission[]> {
  const { data } = await api.get<Admission[]>("/admissions");
  return data;
}

export async function getAdmission(id: string): Promise<Admission> {
  const { data } = await api.get<Admission>(`/admissions/${id}`);
  return data;
}

export async function updateAdmission(
  id: string,
  payload: UpdateAdmissionDto,
): Promise<Admission> {
  const { data } = await api.patch<Admission>(`/admissions/${id}`, payload);
  return data;
}

export async function deleteAdmission(id: string): Promise<void> {
  await api.delete(`/admissions/${id}`);
}

export async function createMedicalRecord(
  payload: CreateMedicalRecordDto,
): Promise<MedicalRecord> {
  const { data } = await api.post<MedicalRecord>("/medical-records", payload);
  return data;
}

export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  const { data } = await api.get<MedicalRecord[]>("/medical-records");
  return data;
}

export async function getMedicalRecordsByPatient(
  patientId: string,
): Promise<MedicalRecord[]> {
  const { data } = await api.get<MedicalRecord[]>(
    `/medical-records/patient/${patientId}`,
  );
  return data;
}

export async function getMedicalRecord(id: string): Promise<MedicalRecord> {
  const { data } = await api.get<MedicalRecord>(`/medical-records/${id}`);
  return data;
}

export async function updateMedicalRecord(
  id: string,
  payload: UpdateMedicalRecordDto,
): Promise<MedicalRecord> {
  const { data } = await api.patch<MedicalRecord>(
    `/medical-records/${id}`,
    payload,
  );
  return data;
}

export async function deleteMedicalRecord(id: string): Promise<void> {
  await api.delete(`/medical-records/${id}`);
}

export async function createPrescription(
  payload: CreatePrescriptionDto,
): Promise<Prescription> {
  const { data } = await api.post<Prescription>("/prescriptions", payload);
  return data;
}

export async function getPrescriptions(): Promise<Prescription[]> {
  const { data } = await api.get<Prescription[]>("/prescriptions");
  return data;
}

export async function getPrescription(id: string): Promise<Prescription> {
  const { data } = await api.get<Prescription>(`/prescriptions/${id}`);
  return data;
}

export async function updatePrescription(
  id: string,
  payload: UpdatePrescriptionDto,
): Promise<Prescription> {
  const { data } = await api.patch<Prescription>(
    `/prescriptions/${id}`,
    payload,
  );
  return data;
}

export async function deletePrescription(id: string): Promise<void> {
  await api.delete(`/prescriptions/${id}`);
}

export async function createMedicine(
  payload: CreateMedicineDto,
): Promise<Medicine> {
  const { data } = await api.post<Medicine>("/medicines", payload);
  return data;
}

export async function getMedicines(params?: Record<string, any>): Promise<Medicine[]> {
  const { data } = await api.get<Medicine[]>("/medicines", { params });
  return data;
}

export async function getMedicine(id: string): Promise<Medicine> {
  const { data } = await api.get<Medicine>(`/medicines/${id}`);
  return data;
}

export async function updateMedicine(
  id: string,
  payload: UpdateMedicineDto,
): Promise<Medicine> {
  const { data } = await api.patch<Medicine>(`/medicines/${id}`, payload);
  return data;
}

export async function deleteMedicine(id: string): Promise<void> {
  await api.delete(`/medicines/${id}`);
}

export async function fulfillPrescriptionPharmacy(
  prescriptionId: string,
): Promise<any> {
  const { data } = await api.post<any>(`/pharmacy/fulfill/${prescriptionId}`);
  return data;
}

export async function createLaborator(
  payload: CreateLabTestDto,
): Promise<Laborator> {
  const { data } = await api.post<Laborator>("/laboratory", payload);
  return data;
}

export async function getLaboratory(): Promise<Laborator[]> {
  const { data } = await api.get<Laborator[]>("/laboratory");
  return data;
}

export async function getLaborator(id: string): Promise<Laborator> {
  const { data } = await api.get<Laborator>(`/laboratory/${id}`);
  return data;
}

export async function updateLaborator(
  id: string,
  payload: UpdateLabTestDto,
): Promise<Laborator> {
  const { data } = await api.patch<Laborator>(`/laboratory/${id}`, payload);
  return data;
}

export async function deleteLaborator(id: string): Promise<void> {
  await api.delete(`/laboratory/${id}`);
}

export async function getDashboardAnalytics(period: "week" | "month" | "day" = "week"): Promise<any> {
  const { data } = await api.get<any>(`/dashboard/analytics?period=${period}`);
  return data;
}

export async function getBillingStats(): Promise<any> {
  const { data } = await api.get<any>("/billing/stats");
  return data;
}

export async function getBedAvailabilityMatrix(): Promise<any[]> {
  const { data } = await api.get<any[]>("/beds/availability-matrix");
  return data;
}

export async function dischargeAdmission(
  id: string,
  dischargeDate?: string,
): Promise<Admission> {
  const { data } = await api.patch<Admission>(`/admissions/${id}`, {
    status: "discharged",
    dischargeDate: dischargeDate || new Date().toISOString(),
  });
  return data;
}

export async function getPatientSummary(id: string): Promise<any> {
  const { data } = await api.get<any>(`/patients/${id}/summary`);
  return data;
}

export async function getMedicinesStats(): Promise<{
  totalMedicines: number;
  lowStockCount: number;
  outOfStockCount: number;
}> {
  const { data } = await api.get<any>("/medicines/stats");
  return data;
}

export async function getLaboratoryStats(): Promise<{
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
}> {
  const { data } = await api.get<any>("/laboratory/stats");
  return data;
}

export async function createBillBilling(payload: CreateBillDto): Promise<any> {
  const { data } = await api.post<any>("/billing/bills", payload);
  return data;
}

export async function findAllBillsBilling(params?: Record<string, any>): Promise<any> {
  const { data } = await api.get<any>("/billing/bills", { params });
  return data;
}

export async function findOneBillBilling(id: string): Promise<any> {
  const { data } = await api.get<any>(`/billing/bills/${id}`);
  return data;
}

export async function updateBillBilling(
  id: string,
  payload: UpdateBillDto,
): Promise<any> {
  const { data } = await api.patch<any>(`/billing/bills/${id}`, payload);
  return data;
}

export async function deleteBillBilling(id: string): Promise<void> {
  await api.delete(`/billing/bills/${id}`);
}

export async function makePaymentBilling(
  payload: CreatePaymentDto,
): Promise<any> {
  const { data } = await api.post<any>("/billing/payments", payload);
  return data;
}

