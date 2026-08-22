export type UserRole = "EMPLOYEE" | "HR";

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "LEAVE";

export type LeaveType = "PAID" | "SICK" | "UNPAID";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  designation: string;
  phone: string;
  address: string;
  profileImage?: string;
  joiningDate: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  hrComment?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}