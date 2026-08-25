// ── Role ──────────────────────────────────────────────
export interface Role {
  name: string;
}

// ── User ──────────────────────────────────────────────
export interface User {
  id: number | string;
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
  userId: number | string;
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
  userId?: number | string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address?: string;
  medicalNotes?: string;
}

export interface UpdatePatientDto {
  userId?: number | string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address?: string;
  medicalNotes?: string;
}

export interface CreateDoctorDto {
  userId?: number | string;
  specialization: string;
  licenseNumber: string;
  experienceYears?: number;
  consultationFee?: number;
}

export interface UpdateDoctorDto {
  userId?: number | string;
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
  consultationFee?: number;
}

export interface CreateStaffDto {
  userId?: number | string;
  departmentId?: number | string;
  jobTitle: string;
  hireDate?: string;
}

export interface UpdateStaffDto {
  userId?: number | string;
  departmentId?: number | string;
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
  patientId: number | string;
  doctorId: number | string;
  appointmentDate: string;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  patientId?: number | string;
  doctorId?: number | string;
  appointmentDate?: string;
  reason?: string;
  notes?: string;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
}

export interface CreateWardDto {
  name: string;
  type: string;
  capacity: number;
  floor?: number | string;
}

export interface UpdateWardDto {
  name?: string;
  type?: string;
  capacity?: number;
  floor?: number | string;
}

export interface CreateBedDto {
  wardId: number | string;
  bedNumber: string;
}

export interface UpdateBedDto {
  wardId?: number | string;
  bedNumber?: string;
  status?: string;
}

export interface CreateAdmissionDto {
  patientId: number | string;
  admittingDoctorId?: number | string;
  bedId?: number | string;
  admissionDate: string;
  reason: string;
  status?: string;
}

export interface UpdateAdmissionDto {
  patientId?: number | string;
  admittingDoctorId?: number | string;
  bedId?: number | string;
  admissionDate?: string;
  reason?: string;
  status?: string;
  dischargeDate?: string;
}

export interface CreateMedicalRecordDto {
  patientId: number | string;
  doctorId: number | string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string;
  recordDate?: string;
}

export interface UpdateMedicalRecordDto {
  patientId?: number | string;
  doctorId?: number | string;
  diagnosis?: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
  recordDate?: string;
}

export interface CreatePrescriptionDto {
  patientId: number | string;
  doctorId: number | string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  issuedDate?: string;
}

export interface UpdatePrescriptionDto {
  patientId?: number | string;
  doctorId?: number | string;
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
  patientId: number | string;
  doctorId: number | string;
  testName: string;
  testType: string;
  result?: string;
  status?: string;
  testDate?: string;
  reportUrl?: string;
}

export interface UpdateLabTestDto {
  patientId?: number | string;
  doctorId?: number | string;
  testName?: string;
  testType?: string;
  result?: string;
  status?: string;
  testDate?: string;
  reportUrl?: string;
}

export interface CreateBillDto {
  patientId: number | string;
  admissionId?: number | string;
  appointmentId?: number | string;
  totalAmount: number;
  dueDate: string;
}

export interface UpdateBillDto {
  patientId?: number | string;
  admissionId?: number | string;
  appointmentId?: number | string;
  totalAmount?: number;
  dueDate?: string;
  status?: string;
}

export interface CreatePaymentDto {
  billId: number | string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
}
export interface Patient { id: number | string; userId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Doctor { id: number | string; userId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Staf { id: number | string; userId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Staff { id: number | string; userId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Department { id: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Appointment { id: number | string; patientId?: number | string; doctorId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Ward { id: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Bed { id: number | string; wardId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Admission { id: number | string; patientId?: number | string; admittingDoctorId?: number | string; bedId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface MedicalRecord { id: number | string; patientId?: number | string; doctorId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Prescription { id: number | string; patientId?: number | string; doctorId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Medicine { id: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Laborator { id: number | string; patientId?: number | string; doctorId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface LabTest { id: number | string; patientId?: number | string; doctorId?: number | string; createdAt?: string; updatedAt?: string; [key: string]: any; }
export interface Bill {
  id: number | string;
  patientId: number | string;
  admissionId?: number | string | null;
  appointmentId?: number | string | null;
  totalAmount: number | string;
  paidAmount: number | string;
  status: "unpaid" | "partially_paid" | "paid" | string;
  dueDate: string;
  patient?: {
    id: number | string;
    userId?: number | string;
    user?: {
      id?: number | string;
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
  id: number | string;
  billId: number | string;
  amount: number | string;
  paymentDate: string;
  paymentMethod: "cash" | "credit_card" | "insurance" | "transfer" | string;
  referenceNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  [key: string]: any;
}

// ── Notifications ───────────────────────────────────
export type NotificationType =
  | "appointment"
  | "admission"
  | "billing"
  | "lab"
  | "prescription"
  | "system"
  | string;

export type NotificationPriority = "info" | "warning" | "urgent" | string;

export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  link?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface NotificationsResponse {
  data: AppNotification[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface QueryNotificationsDto {
  page?: number;
  take?: number;
  isRead?: boolean;
  type?: string;
  search?: string;
}

