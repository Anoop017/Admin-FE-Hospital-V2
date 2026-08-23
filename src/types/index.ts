// ── Role ──────────────────────────────────────────────
export interface Role {
  name: string;
}

// ── User ──────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  isActive: boolean;
  isLocked: boolean;
  createdAt: string;
  roles: Role[];
}

export interface UsersSummary {
  total: number;
  active: number;
  locked: number;
  admins: number;
}

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  roles: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ── User CRUD ────────────────────────────────────────
export interface UserCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  roles: string[];
}

export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  isActive?: boolean;
  isLocked?: boolean;
  roles?: string[];
}

// ── Sidebar Navigation ──────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// ── Auto-generated API Types ────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  roles: string[];
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  mobile?: string;
  roles?: string[];
  isActive?: boolean;
  isLocked?: boolean;
}

export interface CreatePatientDto {
  userId: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address?: string;
  medicalNotes?: string;
}

export interface UpdatePatientDto {
  userId?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address?: string;
  medicalNotes?: string;
}

export interface CreateDoctorDto {
  userId: string;
  specialization: string;
  licenseNumber: string;
  experienceYears?: number;
  consultationFee?: number;
}

export interface UpdateDoctorDto {
  userId?: string;
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
  consultationFee?: number;
}

export interface CreateStaffDto {
  userId: string;
  departmentId?: string;
  jobTitle: string;
  hireDate?: string;
}

export interface UpdateStaffDto {
  userId?: string;
  departmentId?: string;
  jobTitle?: string;
  hireDate?: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  patientId?: string;
  doctorId?: string;
  appointmentDate?: string;
  reason?: string;
  notes?: string;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
}

export interface CreateWardDto {
  name: string;
  type: string;
  capacity: number;
  floor: string;
}

export interface UpdateWardDto {
  name?: string;
  type?: string;
  capacity?: number;
  floor?: string;
}

export interface CreateBedDto {
  wardId: string;
  bedNumber: string;
}

export interface UpdateBedDto {
  wardId?: string;
  bedNumber?: string;
  status?: string;
}

export interface CreateAdmissionDto {
  patientId: string;
  admittingDoctorId: string;
  bedId: string;
  admissionDate: string;
  reason: string;
  status?: string;
}

export interface UpdateAdmissionDto {
  patientId?: string;
  admittingDoctorId?: string;
  bedId?: string;
  admissionDate?: string;
  reason?: string;
  status?: string;
  dischargeDate?: string;
}

export interface CreateMedicalRecordDto {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string;
  recordDate?: string;
}

export interface UpdateMedicalRecordDto {
  patientId?: string;
  doctorId?: string;
  diagnosis?: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
  recordDate?: string;
}

export interface CreatePrescriptionDto {
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  issuedDate?: string;
}

export interface UpdatePrescriptionDto {
  patientId?: string;
  doctorId?: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
  issuedDate?: string;
}

export interface CreateMedicineDto {
  name: string;
  manufacturer: string;
  category: string;
  price: number;
  stockQuantity: number;
  expiryDate?: string;
}

export interface UpdateMedicineDto {
  name?: string;
  manufacturer?: string;
  category?: string;
  price?: number;
  stockQuantity?: number;
  expiryDate?: string;
}

export interface CreateLabTestDto {
  patientId: string;
  doctorId: string;
  testName: string;
  testType: string;
  result?: string;
  status?: string;
  testDate?: string;
  reportUrl?: string;
}

export interface UpdateLabTestDto {
  patientId?: string;
  doctorId?: string;
  testName?: string;
  testType?: string;
  result?: string;
  status?: string;
  testDate?: string;
  reportUrl?: string;
}

export interface CreateBillDto {
  patientId: string;
  admissionId?: string;
  appointmentId?: string;
  totalAmount: number;
  dueDate: string;
}

export interface UpdateBillDto {
  patientId?: string;
  admissionId?: string;
  appointmentId?: string;
  totalAmount?: number;
  dueDate?: string;
  status?: string;
}

export interface CreatePaymentDto {
  billId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
}
export interface Patient { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Doctor { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Staf { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Staff { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Department { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Appointment { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Ward { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Bed { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Admission { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface MedicalRecord { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Prescription { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Medicine { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Laborator { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface LabTest { id: string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Bill {
  id: string;
  patientId: string;
  admissionId?: string | null;
  appointmentId?: string | null;
  totalAmount: number | string;
  paidAmount: number | string;
  status: "unpaid" | "partially_paid" | "paid" | string;
  dueDate: string;
  patient?: {
    id: string;
    userId?: string;
    user?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      mobile?: string;
    };
  };
  admission?: any;
  appointment?: any;
  payments?: Payment[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  [key: string]: any;
}

export interface Payment {
  id: string;
  billId: string;
  amount: number | string;
  paymentDate: string;
  paymentMethod: "cash" | "credit_card" | "insurance" | "transfer" | string;
  referenceNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  [key: string]: any;
}
