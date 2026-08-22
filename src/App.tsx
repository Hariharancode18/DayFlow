import {
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Home,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Receipt,
  TrendingUp,
  Trash2,
  User,
  Users,
  Wallet,
  X,
  XCircle,

  Sun,
  Moon,} from "lucide-react";

type Role = "employee" | "hr";

type Page =
  | "Dashboard"
  | "Attendance"
  | "Leave"
  | "Payroll"
  | "Profile"
  | "AI Assistant"
  | "Employees"
  | "Leave Approvals"
  | "HR Attendance"
  | "HR Payroll"
  | "HR Insights"
  | "Settings";

type LeaveStatus = "Pending" | "Approved" | "Rejected";

type LeaveRequest = {
  id: number;
  employee: string;
  employeeId: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
};

type PayrollRecord = {
  employeeId: string;
  basic: number;
  allowance: number;
  bonus: number;
  deductions: number;
  status: "Processed" | "Pending";
};

type HREmployee = {
  id: string;
  name: string;
  department: string;
  role: string;
  attendance: "Present" | "Absent" | "On Leave";
  checkIn: string;
  checkOut: string;
};


const DAYFLOW_UI4 = `
:root {
  --df-bg: #f4f7fb;
  --df-surface: rgba(255,255,255,.88);
  --df-primary: #4f46e5;
  --df-primary-2: #7c3aed;
  --df-cyan: #0891b2;
  --df-navy: #0b1026;
  --df-text: #0f172a;
  --df-muted: #64748b;
}

html { scroll-behavior: smooth; }

body {
  background:
    radial-gradient(circle at 0% 0%, rgba(99,102,241,.10), transparent 25%),
    radial-gradient(circle at 100% 10%, rgba(8,145,178,.08), transparent 24%),
    var(--df-bg);
  color: var(--df-text);
}

.dayflow-ui4 {
  min-height: 100vh;
  background:
    radial-gradient(circle at 75% 0%, rgba(124,58,237,.07), transparent 24%),
    radial-gradient(circle at 10% 90%, rgba(8,145,178,.05), transparent 25%),
    var(--df-bg);
}

.dayflow-sidebar {
  background:
    radial-gradient(circle at 10% 5%, rgba(99,102,241,.25), transparent 25%),
    linear-gradient(180deg, #080d20 0%, #101735 55%, #080d20 100%) !important;
  box-shadow: 16px 0 45px rgba(15,23,42,.14);
}

.dayflow-logo {
  background: linear-gradient(135deg,#818cf8,#6366f1 50%,#06b6d4) !important;
  box-shadow: 0 12px 28px rgba(99,102,241,.28);
}

.dayflow-nav-active {
  background: linear-gradient(135deg,#6366f1,#4f46e5 55%,#4338ca) !important;
  box-shadow: 0 8px 24px rgba(79,70,229,.28);
}

.dayflow-topbar {
  background: rgba(255,255,255,.80) !important;
  border-color: rgba(148,163,184,.20) !important;
  box-shadow: 0 8px 30px rgba(15,23,42,.045);
  backdrop-filter: blur(18px);
}

.dayflow-main { background: transparent; }

.dayflow-card {
  background: rgba(255,255,255,.88) !important;
  border-color: rgba(148,163,184,.22) !important;
  box-shadow: 0 12px 35px rgba(15,23,42,.055) !important;
  backdrop-filter: blur(14px);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.dayflow-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99,102,241,.25) !important;
  box-shadow: 0 18px 45px rgba(79,70,229,.10) !important;
}

.dayflow-gradient-text {
  background: linear-gradient(135deg,#4f46e5,#7c3aed 55%,#0891b2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dayflow-primary {
  background: linear-gradient(135deg,#6366f1,#4f46e5 55%,#4338ca) !important;
  box-shadow: 0 8px 22px rgba(79,70,229,.22);
  transition: transform .18s ease, box-shadow .18s ease;
}

.dayflow-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(79,70,229,.30);
}

.dayflow-input {
  background: rgba(255,255,255,.92) !important;
  border-color: rgba(148,163,184,.28) !important;
  transition: border-color .18s ease, box-shadow .18s ease;
}

.dayflow-input:focus {
  border-color: rgba(99,102,241,.65) !important;
  box-shadow: 0 0 0 4px rgba(99,102,241,.10) !important;
}

.dayflow-table thead {
  background: linear-gradient(90deg,#f8faff,#f4f7ff) !important;
}

.dayflow-table tbody tr {
  transition: background .15s ease;
}

.dayflow-table tbody tr:hover {
  background: rgba(99,102,241,.035) !important;
}

.dayflow-avatar {
  background: linear-gradient(135deg,#6366f1,#7c3aed 55%,#0891b2) !important;
  box-shadow: 0 8px 20px rgba(99,102,241,.22);
}

.dayflow-glow {
  position: relative;
  overflow: hidden;
}

.dayflow-glow::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  right: -70px;
  top: -100px;
  border-radius: 999px;
  background: rgba(99,102,241,.10);
  filter: blur(30px);
  pointer-events: none;
}

.dayflow-login {
  background:
    radial-gradient(circle at 15% 20%, rgba(99,102,241,.35), transparent 26%),
    radial-gradient(circle at 85% 78%, rgba(8,145,178,.22), transparent 26%),
    linear-gradient(135deg,#060a1b,#111936 55%,#080d20) !important;
}

.dayflow-login-card {
  background: rgba(255,255,255,.94) !important;
  border: 1px solid rgba(255,255,255,.25) !important;
  box-shadow: 0 30px 90px rgba(2,6,23,.20) !important;
  backdrop-filter: blur(20px);
}

.dayflow-section-title {
  letter-spacing: -.025em;
}

@media (max-width: 1023px) {
  .dayflow-main { padding-top: 5.5rem !important; }
}

html[data-theme="dark"] body {
  background:
    radial-gradient(circle at 0% 0%, rgba(99,102,241,.16), transparent 28%),
    radial-gradient(circle at 100% 10%, rgba(8,145,178,.12), transparent 25%),
    #080d1c;
  color: #e5e7eb;
}

html[data-theme="dark"] .dayflow-ui4 {
  background:
    radial-gradient(circle at 75% 0%, rgba(124,58,237,.12), transparent 26%),
    radial-gradient(circle at 10% 90%, rgba(8,145,178,.08), transparent 25%),
    #080d1c;
}

html[data-theme="dark"] .dayflow-topbar {
  background: rgba(10,16,36,.82) !important;
  border-color: rgba(148,163,184,.14) !important;
}

html[data-theme="dark"] .dayflow-card {
  background: rgba(15,23,42,.88) !important;
  border-color: rgba(148,163,184,.14) !important;
  box-shadow: 0 14px 38px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] .dayflow-card:hover {
  border-color: rgba(129,140,248,.30) !important;
  box-shadow: 0 20px 48px rgba(0,0,0,.30) !important;
}

html[data-theme="dark"] .dayflow-input,
html[data-theme="dark"] input,
html[data-theme="dark"] select,
html[data-theme="dark"] textarea {
  background: #111a31 !important;
  color: #e5e7eb !important;
  border-color: rgba(148,163,184,.18) !important;
}

html[data-theme="dark"] input::placeholder,
html[data-theme="dark"] textarea::placeholder {
  color: #64748b !important;
}

html[data-theme="dark"] .dayflow-table thead {
  background: linear-gradient(90deg,#101a32,#111a31) !important;
}

html[data-theme="dark"] .dayflow-table tbody tr:hover {
  background: rgba(99,102,241,.08) !important;
}

html[data-theme="dark"] .dayflow-glow {
  background: rgba(15,23,42,.78) !important;
  border-color: rgba(99,102,241,.18) !important;
}

html[data-theme="dark"] .text-slate-950 {
  color: #f8fafc !important;
}

html[data-theme="dark"] .text-slate-900 {
  color: #f1f5f9 !important;
}

html[data-theme="dark"] .text-slate-800 {
  color: #e2e8f0 !important;
}

html[data-theme="dark"] .text-slate-700 {
  color: #cbd5e1 !important;
}

html[data-theme="dark"] .text-slate-600 {
  color: #94a3b8 !important;
}

html[data-theme="dark"] .text-slate-500,
html[data-theme="dark"] .text-slate-400 {
  color: #94a3b8 !important;
}

html[data-theme="dark"] .bg-white {
  background-color: #0f172a !important;
}

html[data-theme="dark"] .bg-slate-50 {
  background-color: #0b1225 !important;
}

html[data-theme="dark"] .border-slate-200,
html[data-theme="dark"] .border-slate-100 {
  border-color: rgba(148,163,184,.14) !important;
}

html[data-theme="dark"] .bg-indigo-50 {
  background-color: rgba(99,102,241,.14) !important;
}

html[data-theme="dark"] .bg-slate-100 {
  background-color: #17213a !important;
}

html[data-theme="dark"] .shadow-sm {
  box-shadow: 0 10px 30px rgba(0,0,0,.18) !important;
}

.dayflow-theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px;
  border: 1px solid rgba(148,163,184,.22);
  border-radius: 999px;
  background: rgba(148,163,184,.08);
  backdrop-filter: blur(12px);
}

.dayflow-theme-toggle button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  transition: all .18s ease;
}

.dayflow-theme-toggle button.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 4px 12px rgba(15,23,42,.12);
}


html[data-theme="dark"] .dayflow-topbar .border-slate-200 {
  border-color: rgba(148,163,184,.16) !important;
}

html[data-theme="dark"] .dayflow-topbar .bg-white {
  background: #0f172a !important;
}

html[data-theme="dark"] .dayflow-topbar [class*="bg-white"] {
  color: #e2e8f0;
}

html[data-theme="dark"] .dayflow-topbar .text-slate-900,
html[data-theme="dark"] .dayflow-topbar .text-slate-800 {
  color: #f1f5f9 !important;
}

html[data-theme="dark"] .dayflow-topbar .text-slate-600 {
  color: #94a3b8 !important;
}
html[data-theme="dark"] .dayflow-theme-toggle button.active {
  background: #1e293b;
  color: #a5b4fc;
  box-shadow: 0 4px 14px rgba(0,0,0,.25);
}
`;

type DayFlowNotification = {
  id: string;
  title: string;
  message: string;
  type: "warning" | "leave" | "payroll" | "info";
  createdAt: string;
};

type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

/* =========================================================
   DEMO DATA
========================================================= */

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 1,
    employee: "Arjun Kumar",
    employeeId: "EMP002",
    type: "Casual Leave",
    from: "22 Aug 2026",
    to: "23 Aug 2026",
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: 2,
    employee: "Priya Sharma",
    employeeId: "EMP003",
    type: "Sick Leave",
    from: "24 Aug 2026",
    to: "25 Aug 2026",
    reason: "Medical rest",
    status: "Pending",
  },
  {
    id: 3,
    employee: "Rahul Kumar",
    employeeId: "EMP004",
    type: "Casual Leave",
    from: "18 Aug 2026",
    to: "18 Aug 2026",
    reason: "Family function",
    status: "Approved",
  },
];

const HR_EMPLOYEES: HREmployee[] = [
  {
    id: "EMP001",
    name: "Hariharan V",
    department: "IT",
    role: "Software Developer",
    attendance: "Present",
    checkIn: "09:02 AM",
    checkOut: "--:--",
  },
  {
    id: "EMP002",
    name: "Arjun Kumar",
    department: "Engineering",
    role: "Backend Developer",
    attendance: "Present",
    checkIn: "08:54 AM",
    checkOut: "--:--",
  },
  {
    id: "EMP003",
    name: "Priya Sharma",
    department: "Design",
    role: "UI/UX Designer",
    attendance: "On Leave",
    checkIn: "--:--",
    checkOut: "--:--",
  },
  {
    id: "EMP004",
    name: "Rahul Kumar",
    department: "Engineering",
    role: "Frontend Developer",
    attendance: "Present",
    checkIn: "09:08 AM",
    checkOut: "--:--",
  },
  {
    id: "EMP005",
    name: "Sneha R",
    department: "HR",
    role: "HR Executive",
    attendance: "Absent",
    checkIn: "--:--",
    checkOut: "--:--",
  },
  {
    id: "EMP006",
    name: "Karthik S",
    department: "IT",
    role: "Software Engineer",
    attendance: "Present",
    checkIn: "08:59 AM",
    checkOut: "--:--",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getCurrentTime = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* =========================================================
   COMMON COMPONENTS
========================================================= */

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="dayflow-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  const style =
    status === "Approved"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Rejected"
        ? "bg-red-50 text-red-600"
        : "bg-amber-50 text-amber-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function AttendanceStatus({ status }: { status: string }) {
  const style =
    status === "Present"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Absent"
        ? "bg-red-50 text-red-600"
        : "bg-amber-50 text-amber-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function QuickAction({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-800">{title}</h4>

          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>

        <ArrowRight
          size={18}
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
        />
      </div>
    </button>
  );
}

function LeaveSummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function SimpleRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-4 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>

      <b className="text-slate-800">{value}</b>
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage({
  onLogin,
}: {
  onLogin: (role: Role) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = (selectedRole: Role) => {
    setError("");

    if (selectedRole === "hr") {
      setEmail("admin@dayflow.com");
      setPassword("admin123");
    } else {
      setEmail("employee@dayflow.com");
      setPassword("employee123");
    }
  };

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    window.setTimeout(() => {
      if (
        normalizedEmail === "admin@dayflow.com" &&
        password === "admin123"
      ) {
        if (rememberMe) {
          localStorage.setItem("dayflow_remember", "true");
        }

        onLogin("hr");
        return;
      }

      if (
        normalizedEmail === "employee@dayflow.com" &&
        password === "employee123"
      ) {
        if (rememberMe) {
          localStorage.setItem("dayflow_remember", "true");
        }

        onLogin("employee");
        return;
      }

      setLoading(false);
      setError(
        "Invalid credentials. Please check your email and password.",
      );
    }, 500);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* =================================================
            BRAND PANEL
        ================================================= */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.40),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(79,70,229,0.30),transparent_35%)]" />

          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            

          <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-slate-950 shadow-xl">
                D
              </div>

              <div>
                <p className="text-xl font-bold text-white">
                  DayFlow
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  HR Intelligence
                </p>
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-indigo-300">
                <Sparkles size={14} />
                Intelligent workforce management
              </div>

              <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white xl:text-6xl">
                Your people.
                <br />
                Your flow.
                <br />
                <span className="text-indigo-400">One workspace.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 xl:text-lg">
                DayFlow brings employee management, attendance, leave,
                payroll and HR intelligence together in one focused workspace.
              </p>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                {[
                  [<Users size={18} />, "Workforce", "Employee management"],
                  [<BarChart3 size={18} />, "Insights", "HR analytics"],
                  [<Sparkles size={18} />, "AI", "Smart assistance"],
                ].map(([icon, title, description]) => (
                  <div
                    key={title as string}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                  >
                    <div className="text-indigo-400">{icon}</div>
                    <p className="mt-3 text-sm font-bold text-white">{title}</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600">
              DayFlow • HR Management System • Hackathon Prototype
            </p>
          </div>
        </div>

        {/* =================================================
            LOGIN PANEL
        ================================================= */}
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-8 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                D
              </div>
              <div>
                <p className="text-xl font-bold text-slate-950">DayFlow</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  HR Intelligence
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/30 sm:p-8">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldCheck size={21} />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Sign in to DayFlow
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Access your personalized workplace dashboard.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                  <AlertCircle className="mt-0.5 shrink-0" size={17} />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-7 space-y-5">
                {/* EMAIL */}
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Work email
                  </span>

                  <div className="relative mt-2">
                    <input
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="you@company.com"
                    />
                  </div>
                </label>

                {/* PASSWORD */}
                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">
                      Password
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setError(
                          "Password reset is available in the production version.",
                        )
                      }
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !loading) {
                          handleLogin();
                        }
                      }}
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      placeholder="Enter your password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </label>

                {/* REMEMBER */}
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Remember me on this device
                </label>

                {/* LOGIN */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleLogin}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>

              {/* DEMO ACCOUNTS */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick demo access
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => fillDemo("employee")}
                  className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-white">
                      <User size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Employee
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Demo workspace
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo("hr")}
                  className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-white">
                      <ShieldCheck size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        HR Admin
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Management workspace
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
                Demo credentials are included for the hackathon prototype.
                Production authentication should use a secure backend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  role,
  activePage,
  setActivePage,
  onLogout,
}: {
  role: Role;
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const employeeMenu: [string, Page, ReactNode][] = [
    ["Dashboard", "Dashboard", <Home size={18} />],
    ["Attendance", "Attendance", <Clock3 size={18} />],
    ["Leave", "Leave", <CalendarDays size={18} />],
    ["Payroll", "Payroll", <Wallet size={18} />],
    ["Profile", "Profile", <User size={18} />],
    ["AI Assistant", "AI Assistant", <Sparkles size={18} />],
  ];

  const hrMenu: [string, Page, ReactNode][] = [
    ["Dashboard", "Dashboard", <Home size={18} />],
    ["Employees", "Employees", <Users size={18} />],
    [
      "Leave Approvals",
      "Leave Approvals",
      <CalendarDays size={18} />,
    ],
    ["HR Attendance", "HR Attendance", <Clock3 size={18} />],
    ["HR Payroll", "HR Payroll", <Wallet size={18} />],
    ["HR Insights", "HR Insights", <BarChart3 size={18} />],
    ["AI Assistant", "AI Assistant", <Sparkles size={18} />],
    ["Settings", "Settings", <Settings size={18} />],
  ];

  const menu = role === "hr" ? hrMenu : employeeMenu;

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-slate-950 p-3 text-white lg:hidden"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white transition-transform lg:static lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="dayflow-logo flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold">
            D
          </div>

          <div>
            <b>DayFlow</b>

            <p className="text-xs text-slate-500">
              {role === "hr"
                ? "HR Workspace"
                : "Employee Workspace"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menu.map(([label, page, icon]) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                activePage === page
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 font-bold">
                HV
              </div>

              <div>
                <p className="text-sm font-bold">
                  Hariharan V
                </p>

                <p className="text-xs text-slate-500">
                  {role === "hr"
                    ? "HR Administrator"
                    : "Software Developer"}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-red-500/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({
  role,
  activePage,
  theme,
  setTheme,
  employees,
  leaveRequests,
}: {
  role: Role;
  activePage: Page;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  employees: HREmployee[];
  leaveRequests: LeaveRequest[];
}) {
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [readIds, setReadIds] = useState<string[]>(
    () => {
      try {
        const saved =
          localStorage.getItem(
            "dayflow_read_notifications",
          );

        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        // Use empty read state.
      }

      return [];
    },
  );

  const notifications: DayFlowNotification[] = [
    ...employees
      .filter(
        (employee) =>
          employee.attendance === "Absent",
      )
      .map((employee) => ({
        id: `absent-${employee.id}`,
        title: "Attendance alert",
        message: `${employee.name} is marked absent today.`,
        type: "warning" as const,
        createdAt: "Today",
      })),

    ...leaveRequests
      .filter(
        (request) =>
          request.status === "Pending",
      )
      .map((request) => ({
        id: `leave-${request.id}`,
        title: "Leave approval required",
        message: `${request.employee} requested ${request.type} leave.`,
        type: "leave" as const,
        createdAt: "Pending",
      })),

    {
      id: "payroll-august-ready",
      title: "Payroll reminder",
      message:
        "August payroll records are available for review.",
      type: "payroll",
      createdAt: "This month",
    },
  ];

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !readIds.includes(notification.id),
    );

  const unreadCount =
    unreadNotifications.length;

  const markRead = (
    id: string,
  ) => {
    setReadIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      const next = [...current, id];

      localStorage.setItem(
        "dayflow_read_notifications",
        JSON.stringify(next),
      );

      return next;
    });
  };

  const markAllRead = () => {
    const allIds = notifications.map(
      (notification) =>
        notification.id,
    );

    setReadIds(allIds);

    localStorage.setItem(
      "dayflow_read_notifications",
      JSON.stringify(allIds),
    );
  };

  const clearNotifications = () => {
    setReadIds(
      notifications.map(
        (notification) =>
          notification.id,
      ),
    );

    localStorage.setItem(
      "dayflow_read_notifications",
      JSON.stringify(
        notifications.map(
          (notification) =>
            notification.id,
        ),
      ),
    );
  };

  const notificationIcon = (
    type: DayFlowNotification["type"],
  ) => {
    if (type === "warning") {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertCircle size={17} />
        </div>
      );
    }

    if (type === "leave") {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <CalendarDays size={17} />
        </div>
      );
    }

    if (type === "payroll") {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <DollarSign size={17} />
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        <Bell size={17} />
      </div>
    );
  };

  return (
    <header className="dayflow-topbar sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur lg:px-8">
      <div className="pl-12 lg:pl-0">
        <p className="text-xs font-semibold text-slate-400">
          {role === "hr"
            ? "HR ADMINISTRATION"
            : "EMPLOYEE PORTAL"}
        </p>

        <h2 className="text-lg font-bold text-slate-950">
          {activePage}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="dayflow-theme-toggle"
          aria-label="Theme switcher"
        >
          <button
            type="button"
            title="Light mode"
            className={
              theme === "light"
                ? "active"
                : ""
            }
            onClick={() =>
              setTheme("light")
            }
          >
            <Sun size={16} />
          </button>

          <button
            type="button"
            title="Dark mode"
            className={
              theme === "dark"
                ? "active"
                : ""
            }
            onClick={() =>
              setTheme("dark")
            }
          >
            <Moon size={16} />
          </button>
        </div>

        <button className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:block">
          <Search size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() =>
              setNotificationsOpen(
                (open) => !open,
              )
            }
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Notifications"
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-14 z-[80] w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {unreadCount} unread
                  </p>
                </div>

                <button
                  onClick={markAllRead}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Bell
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      You're all caught up
                    </p>
                  </div>
                ) : (
                  notifications.map(
                    (notification) => {
                      const isRead =
                        readIds.includes(
                          notification.id,
                        );

                      return (
                        <button
                          key={
                            notification.id
                          }
                          onClick={() =>
                            markRead(
                              notification.id,
                            )
                          }
                          className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-indigo-50/50 ${
                            isRead
                              ? "opacity-60"
                              : "bg-indigo-50/20"
                          }`}
                        >
                          {notificationIcon(
                            notification.type,
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-bold text-slate-800">
                                {
                                  notification.title
                                }
                              </p>

                              {!isRead && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {
                                notification.message
                              }
                            </p>

                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              {
                                notification.createdAt
                              }
                            </p>
                          </div>
                        </button>
                      );
                    },
                  )
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                <button
                  onClick={clearNotifications}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500"
                >
                  Clear notifications
                </button>

                <button
                  onClick={() =>
                    setNotificationsOpen(
                      false,
                    )
                  }
                  className="text-xs font-bold text-slate-600 hover:text-indigo-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="dayflow-avatar flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          HV
        </div>
      </div>
    </header>
  );
}


function EmployeeDashboard({
  checkedIn,
  checkInTime,
  leaveRequests,
  setActivePage,
}: {
  checkedIn: boolean;
  checkInTime: string;
  leaveRequests: LeaveRequest[];
  setActivePage: (page: Page) => void;
}) {
  const myRequests = leaveRequests.filter(
    (request) => request.employeeId === "EMP001",
  );

  const pending = myRequests.filter(
    (request) => request.status === "Pending",
  ).length;

  const approved = myRequests.filter(
    (request) => request.status === "Approved",
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
        <p className="text-sm font-medium text-indigo-400">
          EMPLOYEE WORKSPACE
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Welcome back, Hariharan 👋
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Stay on top of attendance, leave and payroll from one
          place.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Clock3 size={20} />}
          label="Today"
          value={checkedIn ? "Working" : "Not Checked In"}
          description={
            checkInTime
              ? `Checked in ${checkInTime}`
              : "Start your workday"
          }
        />

        <MetricCard
          icon={<BarChart3 size={20} />}
          label="Attendance"
          value="92%"
          description="Monthly attendance"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Pending Leave"
          value={String(pending)}
          description="Awaiting approval"
        />

        <MetricCard
          icon={<Wallet size={20} />}
          label="Net Salary"
          value="₹31,000"
          description="August 2026"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-950">
            Quick Actions
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="Attendance"
              description="Check in or out"
              onClick={() =>
                setActivePage("Attendance")
              }
            />

            <QuickAction
              title="Apply Leave"
              description="Submit a leave request"
              onClick={() =>
                setActivePage("Leave")
              }
            />

            <QuickAction
              title="Payroll"
              description="View salary details"
              onClick={() =>
                setActivePage("Payroll")
              }
            />

            <QuickAction
              title="DayFlow AI"
              description="Get HR answers"
              onClick={() =>
                setActivePage("AI Assistant")
              }
            />
          </div>
        </div>

        <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-950">
                Leave Overview
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Your current leave activity.
              </p>
            </div>

            <CalendarDays className="text-indigo-500" />
          </div>

          <div className="mt-5 space-y-3">
            <LeaveSummaryRow
              label="Pending"
              value={pending}
            />

            <LeaveSummaryRow
              label="Approved"
              value={approved}
            />

            <LeaveSummaryRow
              label="Total Requests"
              value={myRequests.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HR DASHBOARD
========================================================= */

function HRDashboard({
  employees,
  leaveRequests,
  setActivePage,
}: {
  employees: HREmployee[];
  leaveRequests: LeaveRequest[];
  setActivePage: (page: Page) => void;
}) {
  const present = employees.filter(
    (employee) => employee.attendance === "Present",
  ).length;

  const attendanceRate =
    employees.length > 0
      ? Math.round((present / employees.length) * 100)
      : 0;

  const pending = leaveRequests.filter(
    (request) => request.status === "Pending",
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
        <p className="text-sm font-medium text-indigo-400">
          HR CONTROL CENTER
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Welcome, Hariharan
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Monitor your workforce and manage HR operations.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Employees"
          value={String(employees.length)}
          description="Active employees"
        />

        <MetricCard
          icon={<Clock3 size={20} />}
          label="Attendance"
          value={`${attendanceRate}%`}
          description="Today's attendance"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Pending Leave"
          value={String(pending)}
          description="Needs approval"
        />

        <MetricCard
          icon={<DollarSign size={20} />}
          label="Payroll"
          value="Ready"
          description="August 2026"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">
                Pending Actions
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Items requiring attention
              </p>
            </div>

            <AlertCircle className="text-amber-500" />
          </div>

          <div className="mt-5 space-y-3">
            <QuickAction
              title="Leave approvals"
              description={`${pending} pending requests`}
              onClick={() =>
                setActivePage("Leave Approvals")
              }
            />

            <QuickAction
              title="Attendance review"
              description="Review today's attendance"
              onClick={() =>
                setActivePage("HR Attendance")
              }
            />
          </div>
        </div>

        <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold">
            HR Quick Access
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="HR Insights"
              description="Analytics & risk insights"
              onClick={() =>
                setActivePage("HR Insights")
              }
            />

            <QuickAction
              title="Employees"
              description="Manage workforce"
              onClick={() =>
                setActivePage("Employees")
              }
            />

            <QuickAction
              title="Payroll"
              description="Manage salary"
              onClick={() =>
                setActivePage("HR Payroll")
              }
            />

            <QuickAction
              title="AI Assistant"
              description="Ask HR questions"
              onClick={() =>
                setActivePage("AI Assistant")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPLOYEE ATTENDANCE
========================================================= */

function EmployeeAttendancePage({
  checkedIn,
  checkInTime,
  checkOutTime,
  onCheckIn,
  onCheckOut,
}: {
  checkedIn: boolean;
  checkInTime: string;
  checkOutTime: string;
  onCheckIn: () => void;
  onCheckOut: () => void;
}) {
  const records = [
    ["01", "Fri", "Present"],
    ["04", "Mon", "Present"],
    ["05", "Tue", "Present"],
    ["06", "Wed", "Present"],
    ["07", "Thu", "Present"],
    ["08", "Fri", "Present"],
    ["11", "Mon", "Present"],
    ["12", "Tue", "Present"],
    ["13", "Wed", "Leave"],
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="MY ATTENDANCE"
        title="Attendance"
        description="Track your daily attendance and working hours."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<BarChart3 size={20} />}
          label="Attendance"
          value="92%"
          description="Monthly rate"
        />

        <MetricCard
          icon={<Check size={20} />}
          label="Present Days"
          value="22"
          description="This month"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Leave Days"
          value="2"
          description="This month"
        />

        <MetricCard
          icon={<X size={20} />}
          label="Absent Days"
          value="1"
          description="This month"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            TODAY
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
              },
            )}
          </h3>

          <div className="mt-7 space-y-4">
            <SimpleRow
              label="Check In"
              value={checkInTime || "--:--"}
            />

            <SimpleRow
              label="Check Out"
              value={checkOutTime || "--:--"}
            />

            <SimpleRow
              label="Status"
              value={
                checkOutTime
                  ? "Completed"
                  : checkedIn
                    ? "Working"
                    : "Not Checked In"
              }
            />
          </div>

          <div className="mt-7">
            {!checkedIn && !checkOutTime && (
              <button
                onClick={onCheckIn}
                className="w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-semibold text-white"
              >
                Check In
              </button>
            )}

            {checkedIn && !checkOutTime && (
              <button
                onClick={onCheckOut}
                className="w-full rounded-xl bg-red-500 px-5 py-3.5 font-semibold text-white"
              >
                Check Out
              </button>
            )}

            {checkOutTime && (
              <div className="rounded-xl bg-emerald-50 px-5 py-3.5 text-center font-semibold text-emerald-600">
                Workday Completed ✓
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            HISTORY
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            August 2026
          </h3>

          <div className="mt-6 space-y-3">
            {records.map(([date, day, status]) => (
              <div
                key={date}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <b>{date}</b>

                  <p className="text-[10px] text-slate-400">
                    {day}
                  </p>
                </div>

                <AttendanceStatus status={status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LEAVE PAGE
========================================================= */

function LeavePage({
  leaveRequests,
  onApply,
}: {
  leaveRequests: LeaveRequest[];
  onApply: (request: LeaveRequest) => void;
}) {
  const [type, setType] =
    useState("Casual Leave");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const submitLeave = () => {
    if (!from || !to || !reason) {
      setMessage("Please fill all leave details.");
      return;
    }

    onApply({
      id: Date.now(),
      employee: "Hariharan V",
      employeeId: "EMP001",
      type,
      from,
      to,
      reason,
      status: "Pending",
    });

    setFrom("");
    setTo("");
    setReason("");

    setMessage(
      "Leave request submitted successfully.",
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="LEAVE MANAGEMENT"
        title="My Leave"
        description="Apply for leave and track your requests."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-7 shadow-sm">
          <h3 className="text-xl font-bold">
            Apply Leave
          </h3>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">
              Leave Type

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
                <option>Work From Home</option>
              </select>
            </label>

            <label className="block text-sm font-semibold">
              From

              <input
                type="date"
                value={from}
                onChange={(event) =>
                  setFrom(event.target.value)
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </label>

            <label className="block text-sm font-semibold">
              To

              <input
                type="date"
                value={to}
                onChange={(event) =>
                  setTo(event.target.value)
                }
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </label>

            <label className="block text-sm font-semibold">
              Reason

              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                rows={4}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </label>

            {message && (
              <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-600">
                {message}
              </div>
            )}

            <button
              onClick={submitLeave}
              className="w-full rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white"
            >
              Submit Leave Request
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-7 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold">
            Leave Requests
          </h3>

          <div className="mt-5 space-y-3">
            {leaveRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-100 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <b>{request.type}</b>

                    <p className="mt-1 text-sm text-slate-400">
                      {request.from} → {request.to}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {request.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYROLL
========================================================= */

function PayrollPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="PAYROLL"
        title="My Payroll"
        description="Review your salary and payment information."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Wallet size={20} />}
          label="Net Salary"
          value="₹31,000"
          description="August 2026"
        />

        <MetricCard
          icon={<DollarSign size={20} />}
          label="Gross Salary"
          value="₹36,000"
          description="Monthly"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Status"
          value="Paid"
          description="August payroll"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Pay Date"
          value="31 Aug"
          description="Scheduled"
        />
      </div>

      <div className="mt-6 rounded-3xl border bg-white p-7 shadow-sm">
        <h3 className="text-xl font-bold">
          Salary Breakdown
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SimpleRow
            label="Basic Salary"
            value="₹20,000"
          />

          <SimpleRow
            label="Allowances"
            value="₹16,000"
          />

          <SimpleRow
            label="Deductions"
            value="₹5,000"
          />

          <SimpleRow
            label="Net Salary"
            value="₹31,000"
          />
        </div>

        <button className="mt-6 flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">
          <ArrowRight size={17} />
          View Payslip
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage() {
  const fields = [
    ["Full Name", "Hariharan V"],
    ["Email", "employee@dayflow.com"],
    ["Employee ID", "EMP001"],
    ["Department", "Information Technology"],
    ["Designation", "Software Developer"],
    ["Employment Type", "Full Time"],
    ["Work Location", "Bangalore"],
    ["Joining Date", "01 July 2026"],
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="MY PROFILE"
        title="Profile"
        description="View your employee information."
      />

      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 text-xl font-bold text-white">
            HV
          </div>

          <div>
            <h3 className="text-2xl font-bold">
              Hariharan V
            </h3>

            <p className="text-sm text-slate-500">
              Software Developer · IT
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AI ASSISTANT
========================================================= */

function AIAssistant({
  employees,
  leaveRequests,
}: {
  employees: HREmployee[];
  leaveRequests: LeaveRequest[];
}) {
  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: 1,
        sender: "ai",
        text: "Hi! I'm DayFlow AI 👋 I can now use your live employee, attendance, leave and payroll data. Try asking: Who is absent today?",
      },
    ]);

  const [input, setInput] = useState("");

  const readPayroll = () => {
    try {
      const saved = localStorage.getItem(
        "dayflow_payroll",
      );

      if (!saved) return [];

      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  };

  const money = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const answer = (question: string) => {
    const text = question
      .trim()
      .toLowerCase();

    const payroll = readPayroll();

    const present = employees.filter(
      (employee) =>
        employee.attendance === "Present",
    );

    const absent = employees.filter(
      (employee) =>
        employee.attendance === "Absent",
    );

    const onLeave = employees.filter(
      (employee) =>
        employee.attendance === "On Leave",
    );

    const pending = leaveRequests.filter(
      (request) =>
        request.status === "Pending",
    );

    const approved = leaveRequests.filter(
      (request) =>
        request.status === "Approved",
    );

    const rejected = leaveRequests.filter(
      (request) =>
        request.status === "Rejected",
    );

    const attendanceRate =
      employees.length === 0
        ? 0
        : Math.round(
            (present.length /
              employees.length) *
              100,
          );

    const findEmployee = () =>
      employees.find((employee) =>
        text.includes(
          employee.name.toLowerCase(),
        ),
      );

    const namedEmployee =
      findEmployee();

    // Employee count
    if (
      text.includes("how many employees") ||
      text.includes("number of employees") ||
      text === "employees" ||
      text.includes("total employees")
    ) {
      return `DayFlow currently has ${employees.length} employees in the organization.`;
    }

    // Present employees
    if (
      text.includes("present employees") ||
      text.includes("who is present") ||
      text.includes("who are present")
    ) {
      if (present.length === 0) {
        return "No employees are currently marked present.";
      }

      return `There are ${present.length} employees present today: ${present
        .map((employee) => employee.name)
        .join(", ")}.`;
    }

    // Absent employees
    if (
      text.includes("absent employees") ||
      text.includes("who is absent") ||
      text.includes("who are absent") ||
      text.includes("absent today")
    ) {
      if (absent.length === 0) {
        return "No employees are currently marked absent today.";
      }

      return `There are ${absent.length} absent employees: ${absent
        .map((employee) => employee.name)
        .join(", ")}.`;
    }

    // Employees on leave
    if (
      text.includes("who is on leave") ||
      text.includes("who are on leave") ||
      text.includes("employees on leave")
    ) {
      if (onLeave.length === 0) {
        return "No employees are currently marked on leave.";
      }

      return `${onLeave.length} employee${onLeave.length === 1 ? " is" : "s are"} currently on leave: ${onLeave
        .map((employee) => employee.name)
        .join(", ")}.`;
    }

    // Attendance percentage / summary
    if (
      text.includes("attendance rate") ||
      text.includes("attendance percentage") ||
      text.includes("attendance summary")
    ) {
      return `Today's attendance rate is ${attendanceRate}%. ${present.length} present, ${absent.length} absent and ${onLeave.length} on leave out of ${employees.length} employees.`;
    }

    // Department questions
    if (
      text.includes("department") ||
      text.includes("how many in it") ||
      text.includes("how many in engineering") ||
      text.includes("how many in hr")
    ) {
      const departments = Array.from(
        new Set(
          employees.map(
            (employee) =>
              employee.department,
          ),
        ),
      );

      const requestedDepartment =
        departments.find((department) =>
          text.includes(
            department.toLowerCase(),
          ),
        );

      if (requestedDepartment) {
        const departmentEmployees =
          employees.filter(
            (employee) =>
              employee.department ===
              requestedDepartment,
          );

        return `${requestedDepartment} has ${departmentEmployees.length} employee${departmentEmployees.length === 1 ? "" : "s"}: ${departmentEmployees
          .map((employee) => employee.name)
          .join(", ")}.`;
      }

      const counts = departments.map(
        (department) => {
          const count = employees.filter(
            (employee) =>
              employee.department ===
              department,
          ).length;

          return `${department}: ${count}`;
        },
      );

      return `Department breakdown — ${counts.join(" • ")}.`;
    }

    // Employee-specific attendance/profile
    if (namedEmployee) {
      if (
        text.includes("attendance") ||
        text.includes("status") ||
        text.includes("present") ||
        text.includes("absent")
      ) {
        return `${namedEmployee.name} (${namedEmployee.id}) is marked ${namedEmployee.attendance.toLowerCase()} today. Check-in: ${namedEmployee.checkIn}. Check-out: ${namedEmployee.checkOut}.`;
      }

      if (
        text.includes("department") ||
        text.includes("role") ||
        text.includes("job")
      ) {
        return `${namedEmployee.name} works as ${namedEmployee.role} in ${namedEmployee.department}.`;
      }

      if (
        text.includes("salary") ||
        text.includes("pay") ||
        text.includes("payroll")
      ) {
        const record = payroll.find(
          (item: {
            employeeId?: string;
          }) =>
            item.employeeId ===
            namedEmployee.id,
        );

        if (!record) {
          return `I don't have a payroll record yet for ${namedEmployee.name}. Open HR Payroll to create one.`;
        }

        const basic = Number(
          record.basic || 0,
        );
        const allowance = Number(
          record.allowance || 0,
        );
        const bonus = Number(
          record.bonus || 0,
        );
        const deductions = Number(
          record.deductions || 0,
        );
        const net = Math.max(
          0,
          basic +
            allowance +
            bonus -
            deductions,
        );

        return `${namedEmployee.name}'s current payroll: basic ${money(basic)}, allowances/bonus ${money(allowance + bonus)}, deductions ${money(deductions)}, and net salary ${money(net)}.`;
      }
    }

    // Pending leave
    if (
      text.includes("pending") &&
      text.includes("leave")
    ) {
      if (pending.length === 0) {
        return "There are no pending leave requests.";
      }

      return `There are ${pending.length} pending leave requests: ${pending
        .map((request) => request.employee)
        .join(", ")}.`;
    }

    if (
      text.includes("approved") &&
      text.includes("leave")
    ) {
      return `There are ${approved.length} approved leave requests.`;
    }

    if (
      text.includes("rejected") &&
      text.includes("leave")
    ) {
      return `There are ${rejected.length} rejected leave requests.`;
    }

    // Payroll summary from the actual HR Payroll localStorage data
    if (
      text.includes("total payroll") ||
      text.includes("payroll total") ||
      text.includes("monthly payroll")
    ) {
      if (payroll.length === 0) {
        return "No payroll records are available yet. Open HR Payroll to initialize the payroll data.";
      }

      const total = employees.reduce(
        (sum, employee) => {
          const record = payroll.find(
            (item: {
              employeeId?: string;
              basic?: number;
              allowance?: number;
              bonus?: number;
              deductions?: number;
            }) =>
              item.employeeId ===
              employee.id,
          );

          if (!record) return sum;

          return (
            sum +
            Math.max(
              0,
              Number(record.basic || 0) +
                Number(
                  record.allowance || 0,
                ) +
                Number(record.bonus || 0) -
                Number(
                  record.deductions || 0,
                ),
            )
          );
        },
        0,
      );

      return `The current monthly net payroll is ${money(total)} across ${employees.length} employees.`;
    }

    // HR summary
    if (
      text.includes("hr summary") ||
      text.includes("today's summary") ||
      text.includes("todays summary") ||
      text.includes("summary")
    ) {
      return `Today's HR summary: ${employees.length} employees, ${present.length} present, ${absent.length} absent, ${onLeave.length} on leave, ${attendanceRate}% attendance, and ${pending.length} pending leave request${pending.length === 1 ? "" : "s"}.`;
    }

    return "I can answer live questions about employees, attendance, departments, leave requests and payroll. Try: 'Who is absent today?', 'What is the attendance rate?', 'Who has pending leave?', or 'What is the total payroll?'";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const question = input.trim();
    const id = Date.now();

    setMessages((current) => [
      ...current,
      {
        id,
        sender: "user",
        text: question,
      },
      {
        id: id + 1,
        sender: "ai",
        text: answer(question),
      },
    ]);

    setInput("");
  };

  const quickQuestions = [
    "How many employees?",
    "Who is absent today?",
    "What is the attendance rate?",
    "Who has pending leave?",
    "What is the total payroll?",
    "Give me today's HR summary",
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="DAYFLOW AI"
        title="AI Assistant"
        description="Ask questions using your live HR workspace data."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {quickQuestions.map((question) => (
          <button
            key={question}
            onClick={() => {
              setInput(question);
            }}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            {question}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles size={19} />
          </div>

          <div>
            <p className="font-bold text-slate-900">
              DayFlow AI
            </p>
            <p className="text-xs text-emerald-600">
              Live HR data connected
            </p>
          </div>
        </div>

        <div className="h-[480px] space-y-4 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[82%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.sender === "user"
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
              placeholder="Ask DayFlow AI about your HR data..."
            />

            <button
              onClick={sendMessage}
              className="rounded-xl bg-indigo-600 px-5 font-semibold text-white transition hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPLOYEES
========================================================= */

function EmployeesPage({
  employees,
  onEmployeesChange,
  leaveRequests,
}: {
  employees: HREmployee[];
  onEmployeesChange: (employees: HREmployee[]) => void;
  leaveRequests: LeaveRequest[];
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [attendance, setAttendance] = useState("All");
  const [selected, setSelected] = useState<HREmployee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<HREmployee | null>(null);

  const departments = [
    "All",
    ...Array.from(new Set(employees.map((employee) => employee.department))),
  ];

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      !searchText ||
      `${employee.name} ${employee.id} ${employee.role} ${employee.department}`
        .toLowerCase()
        .includes(searchText);
    const matchesDepartment =
      department === "All" || employee.department === department;
    const matchesAttendance =
      attendance === "All" || employee.attendance === attendance;
    return matchesSearch && matchesDepartment && matchesAttendance;
  });

  const present = employees.filter((employee) => employee.attendance === "Present").length;
  const onLeave = employees.filter((employee) => employee.attendance === "On Leave").length;
  const absent = employees.filter((employee) => employee.attendance === "Absent").length;

  const handleDelete = (employeeId: string) => {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return;

    if (!window.confirm(`Delete ${employee.name} from DayFlow?`)) return;

    onEmployeesChange(employees.filter((item) => item.id !== employeeId));
    if (selected?.id === employeeId) setSelected(null);
  };

  const handleSave = (employee: HREmployee) => {
    if (editingEmployee) {
      onEmployeesChange(
        employees.map((item) => item.id === employee.id ? employee : item),
      );
    } else {
      onEmployeesChange([...employees, employee]);
    }
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR ADMINISTRATION"
        title="Employees"
        description="Manage your workforce, monitor attendance, and maintain employee records."
      />

      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
            WORKFORCE MANAGEMENT
          </p>
          <h3 className="mt-2 text-xl font-bold">Employee Directory</h3>
          <p className="mt-1 text-sm text-slate-400">
            Add, edit and manage your organization.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Users size={20} />} label="Total Employees" value={String(employees.length)} description="Active workforce" />
        <MetricCard icon={<CheckCircle2 size={20} />} label="Present" value={String(present)} description="Listed today" />
        <MetricCard icon={<CalendarDays size={20} />} label="On Leave" value={String(onLeave)} description="Listed today" />
        <MetricCard icon={<XCircle size={20} />} label="Absent" value={String(absent)} description="Listed today" />
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500"
              placeholder="Search name, ID, role or department..."
            />
          </div>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Departments" : item}
              </option>
            ))}
          </select>
          <select
            value={attendance}
            onChange={(event) => setAttendance(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing <b className="text-slate-700">{filteredEmployees.length}</b> of {employees.length} employees
          </p>
          {(search || department !== "All" || attendance !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setDepartment("All");
                setAttendance("All");
              }}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="dayflow-table w-full min-w-[1000px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Users size={36} className="mx-auto text-slate-300" />
                    <p className="mt-3 font-bold text-slate-700">No employees found</p>
                    <p className="mt-1 text-sm text-slate-400">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-700">
                          {getInitials(employee.name)}
                        </div>
                        <div>
                          <b className="text-slate-800">{employee.name}</b>
                          <p className="text-xs text-slate-400">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">{employee.department}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{employee.role}</td>
                    <td className="px-6 py-5"><AttendanceStatus status={employee.attendance} /></td>
                    <td className="px-6 py-5 text-sm">{employee.checkIn}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(employee)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setEditingEmployee(employee);
                            setShowForm(true);
                          }}
                          aria-label={`Edit ${employee.name}`}
                          className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          aria-label={`Delete ${employee.name}`}
                          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <EmployeeModal
          employee={selected}
          leaveRequests={leaveRequests}
          onClose={() => setSelected(null)}
        />
      )}

      {showForm && (
        <EmployeeFormModal
          employee={editingEmployee}
          employees={employees}
          onClose={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* =========================================================
   EMPLOYEE MODAL
========================================================= */

function EmployeeModal({
  employee,
  leaveRequests,
  onClose,
}: {
  employee: HREmployee;
  leaveRequests: LeaveRequest[];
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "leave" | "payroll"
  >("overview");

  const employeeLeaves = leaveRequests.filter(
    (request) =>
      request.employeeId === employee.id,
  );

  const [payrollRecord, setPayrollRecord] =
    useState<PayrollRecord | null>(null);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "dayflow_payroll",
        );

      if (!saved) {
        setPayrollRecord(null);
        return;
      }

      const records = JSON.parse(saved);

      if (Array.isArray(records)) {
        const record = records.find(
          (item) =>
            item?.employeeId === employee.id,
        );

        setPayrollRecord(
          record ?? null,
        );
      }
    } catch {
      setPayrollRecord(null);
    }
  }, [employee.id]);

  const money = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const gross =
    payrollRecord
      ? payrollRecord.basic +
        payrollRecord.allowance +
        payrollRecord.bonus
      : 0;

  const net =
    payrollRecord
      ? Math.max(
          0,
          gross -
            payrollRecord.deductions,
        )
      : 0;

  const attendanceScore =
    employee.attendance === "Present"
      ? 100
      : employee.attendance === "On Leave"
        ? 80
        : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <div className="dayflow-card w-full max-w-3xl overflow-hidden rounded-[2rem] border bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -bottom-20 left-20 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-300">
                EMPLOYEE PROFILE
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="dayflow-avatar flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white ring-4 ring-white/10">
                  {getInitials(
                    employee.name,
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {employee.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-300">
                    {employee.role}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                      {employee.department}
                    </span>

                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                      {employee.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 p-2 text-slate-300 transition hover:bg-white/20 hover:text-white"
              aria-label="Close employee profile"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 bg-white px-4 sm:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              ["overview", "Overview"],
              ["leave", "Leave History"],
              ["payroll", "Payroll"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() =>
                  setActiveTab(
                    value as
                      | "overview"
                      | "leave"
                      | "payroll",
                  )
                }
                className={`border-b-2 px-4 py-4 text-sm font-bold transition ${
                  activeTab === value
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-6 sm:p-8">
          {activeTab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      Attendance
                    </p>
                    <CheckCircle2
                      size={18}
                      className="text-indigo-500"
                    />
                  </div>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {attendanceScore}%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on today's status
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Net Pay
                    </p>
                    <DollarSign
                      size={18}
                      className="text-emerald-600"
                    />
                  </div>

                  <p className="mt-3 text-2xl font-black text-slate-900">
                    {payrollRecord
                      ? money(net)
                      : "—"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Current payroll record
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                      Leave
                    </p>
                    <CalendarDays
                      size={18}
                      className="text-violet-600"
                    />
                  </div>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {employeeLeaves.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Recorded requests
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Current Status
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <AttendanceStatus
                    status={
                      employee.attendance
                    }
                  />

                  <span className="text-sm text-slate-500">
                    {employee.attendance ===
                    "Present"
                      ? `Checked in at ${employee.checkIn}`
                      : employee.attendance ===
                          "On Leave"
                        ? "Employee is currently on leave"
                        : "No attendance recorded today"}
                  </span>
                </div>
              </div>

              <div className="mt-7">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Employee Information
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <SimpleRow
                    label="Employee ID"
                    value={employee.id}
                  />
                  <SimpleRow
                    label="Department"
                    value={employee.department}
                  />
                  <SimpleRow
                    label="Role"
                    value={employee.role}
                  />
                  <SimpleRow
                    label="Check In"
                    value={employee.checkIn}
                  />
                  <SimpleRow
                    label="Check Out"
                    value={employee.checkOut}
                  />
                  <SimpleRow
                    label="Attendance"
                    value={employee.attendance}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "leave" && (
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                    LEAVE HISTORY
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Leave Requests
                  </h3>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {employeeLeaves.length} request
                  {employeeLeaves.length === 1
                    ? ""
                    : "s"}
                </span>
              </div>

              {employeeLeaves.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                  <CalendarDays
                    size={30}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 font-bold text-slate-600">
                    No leave history
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    This employee has no recorded leave requests.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {employeeLeaves.map(
                    (request) => (
                      <div
                        key={request.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-slate-800">
                              {request.type}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {request.from} →{" "}
                              {request.to}
                            </p>
                          </div>

                          <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                              request.status ===
                              "Approved"
                                ? "bg-emerald-50 text-emerald-600"
                                : request.status ===
                                    "Rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>

                        {request.reason && (
                          <p className="mt-3 rounded-xl bg-white p-3 text-xs leading-5 text-slate-500">
                            {request.reason}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "payroll" && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                PAYROLL PROFILE
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                Compensation Overview
              </h3>

              {!payrollRecord ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                  <DollarSign
                    size={30}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 font-bold text-slate-600">
                    No payroll record found
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-950 p-5 text-white">
                      <p className="text-xs font-semibold text-slate-400">
                        Gross Pay
                      </p>
                      <p className="mt-2 text-2xl font-black">
                        {money(gross)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-600 p-5 text-white">
                      <p className="text-xs font-semibold text-emerald-100">
                        Net Pay
                      </p>
                      <p className="mt-2 text-2xl font-black">
                        {money(net)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-amber-500 p-5 text-white">
                      <p className="text-xs font-semibold text-amber-100">
                        Deductions
                      </p>
                      <p className="mt-2 text-2xl font-black">
                        {money(
                          payrollRecord.deductions,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <SimpleRow
                      label="Basic Salary"
                      value={money(
                        payrollRecord.basic,
                      )}
                    />
                    <SimpleRow
                      label="Allowance"
                      value={money(
                        payrollRecord.allowance,
                      )}
                    />
                    <SimpleRow
                      label="Bonus"
                      value={money(
                        payrollRecord.bonus,
                      )}
                    />
                    <SimpleRow
                      label="Payroll Status"
                      value={payrollRecord.status}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:px-8">
          <button
            onClick={onClose}
            className="dayflow-primary w-full rounded-xl px-5 py-3 font-bold text-white"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}


function EmployeeFormModal({
  employee,
  employees,
  onClose,
  onSave,
}: {
  employee: HREmployee | null;
  employees: HREmployee[];
  onClose: () => void;
  onSave: (employee: HREmployee) => void;
}) {
  const [name, setName] = useState(employee?.name ?? "");
  const [department, setDepartment] = useState(employee?.department ?? "IT");
  const [role, setRole] = useState(employee?.role ?? "");
  const [attendance, setAttendance] = useState<HREmployee["attendance"]>(employee?.attendance ?? "Present");
  const [checkIn, setCheckIn] = useState(employee?.checkIn ?? "--:--");
  const [checkOut, setCheckOut] = useState(employee?.checkOut ?? "--:--");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !department.trim() || !role.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const duplicate = employees.some(
      (item) => item.id !== employee?.id && item.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (duplicate) {
      setError("An employee with this name already exists.");
      return;
    }

    let employeeId = employee?.id;
    if (!employeeId) {
      const usedNumbers = employees
        .map((item) => Number(item.id.replace(/\D/g, "")))
        .filter((value) => Number.isFinite(value));
      const nextNumber = Math.max(0, ...usedNumbers) + 1;
      employeeId = `EMP${String(nextNumber).padStart(3, "0")}`;
    }

    onSave({
      id: employeeId,
      name: name.trim(),
      department: department.trim(),
      role: role.trim(),
      attendance,
      checkIn: attendance === "Present" ? checkIn || "--:--" : "--:--",
      checkOut: attendance === "Present" ? checkOut || "--:--" : "--:--",
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
              {employee ? "UPDATE EMPLOYEE" : "NEW EMPLOYEE"}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {employee ? "Edit Employee" : "Add Employee"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">Maintain accurate employee records.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Full Name *
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500" placeholder="Employee name" />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Department *
              <input value={department} onChange={(event) => setDepartment(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500" placeholder="IT" />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Role *
              <input value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500" placeholder="Software Developer" />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Attendance
              <select value={attendance} onChange={(event) => setAttendance(event.target.value as HREmployee["attendance"])} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500">
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="On Leave">On Leave</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Check In
              <input value={checkIn} onChange={(event) => setCheckIn(event.target.value)} disabled={attendance !== "Present"} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-100 focus:border-indigo-500" placeholder="09:00 AM" />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Check Out
              <input value={checkOut} onChange={(event) => setCheckOut(event.target.value)} disabled={attendance !== "Present"} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-100 focus:border-indigo-500" placeholder="06:00 PM" />
            </label>
          </div>

          {error && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div>}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700">
              <Check size={17} />
              {employee ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LEAVE APPROVALS
========================================================= */

function LeaveApprovalsPage({
  requests,
  onUpdate,
}: {
  requests: LeaveRequest[];
  onUpdate: (
    id: number,
    status: LeaveStatus,
  ) => void;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="HR ADMINISTRATION"
        title="Leave Approvals"
        description="Review and manage employee leave requests."
      />

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="rounded-3xl border bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-500">
                  {request.employeeId}
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {request.employee}
                </h3>

                <p className="text-sm text-slate-500">
                  {request.type} · {request.from} →{" "}
                  {request.to}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {request.reason}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge
                  status={request.status}
                />

                {request.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        onUpdate(
                          request.id,
                          "Approved",
                        )
                      }
                      className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        onUpdate(
                          request.id,
                          "Rejected",
                        )
                      }
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   HR ATTENDANCE
========================================================= */

function HRAttendancePage({
  employees,
  onEmployeesChange,
}: {
  employees: HREmployee[];
  onEmployeesChange: (
    employees: HREmployee[],
  ) => void;
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const present = employees.filter(
    (employee) =>
      employee.attendance === "Present",
  ).length;

  const absent = employees.filter(
    (employee) =>
      employee.attendance === "Absent",
  ).length;

  const onLeave = employees.filter(
    (employee) =>
      employee.attendance === "On Leave",
  ).length;

  const total = employees.length;
  const attendanceRate =
    total === 0
      ? 0
      : Math.round((present / total) * 100);

  const departments = [
    "All",
    ...Array.from(
      new Set(
        employees.map(
          (employee) => employee.department,
        ),
      ),
    ),
  ];

  const filteredEmployees = employees.filter(
    (employee) => {
      const query = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !query ||
        `${employee.name} ${employee.id} ${employee.role} ${employee.department}`
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        department === "All" ||
        employee.department === department;

      const matchesStatus =
        statusFilter === "All" ||
        employee.attendance === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    },
  );

  const updateEmployee = (
    employeeId: string,
    changes: Partial<HREmployee>,
  ) => {
    const updated = employees.map(
      (employee) =>
        employee.id === employeeId
          ? {
              ...employee,
              ...changes,
            }
          : employee,
    );

    onEmployeesChange(updated);
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    );

  const markPresent = (
    employee: HREmployee,
  ) => {
    updateEmployee(employee.id, {
      attendance: "Present",
      checkIn:
        employee.checkIn === "--:--"
          ? getCurrentTime()
          : employee.checkIn,
    });
  };

  const markAbsent = (
    employee: HREmployee,
  ) => {
    updateEmployee(employee.id, {
      attendance: "Absent",
      checkIn: "--:--",
      checkOut: "--:--",
    });
  };

  const markLeave = (
    employee: HREmployee,
  ) => {
    updateEmployee(employee.id, {
      attendance: "On Leave",
      checkIn: "--:--",
      checkOut: "--:--",
    });
  };

  const checkIn = (
    employee: HREmployee,
  ) => {
    updateEmployee(employee.id, {
      attendance: "Present",
      checkIn: getCurrentTime(),
    });
  };

  const checkOut = (
    employee: HREmployee,
  ) => {
    updateEmployee(employee.id, {
      attendance: "Present",
      checkOut: getCurrentTime(),
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR ADMINISTRATION"
        title="HR Attendance"
        description="Monitor and manage today's employee attendance in real time."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Total Employees"
          value={String(total)}
          description="Active workforce"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Present"
          value={String(present)}
          description="Marked present"
        />

        <MetricCard
          icon={<XCircle size={20} />}
          label="Absent"
          value={String(absent)}
          description="Marked absent"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          description={`${onLeave} employee${onLeave === 1 ? "" : "s"} on leave`}
        />
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employee, ID, role or department..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500"
            />
          </div>

          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item === "All"
                  ? "All Departments"
                  : item}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">
              All Status
            </option>
            <option value="Present">
              Present
            </option>
            <option value="Absent">
              Absent
            </option>
            <option value="On Leave">
              On Leave
            </option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-950">
              Today's Attendance
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {filteredEmployees.length} employee
              {filteredEmployees.length === 1 ? "" : "s"} shown
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live employee data
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dayflow-table w-full min-w-[1150px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Attendance Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <Users
                      size={34}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-bold text-slate-700">
                      No employees found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(
                  (employee) => (
                    <tr
                      key={employee.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                            {getInitials(employee.name)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {employee.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {employee.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {employee.department}
                      </td>

                      <td className="px-6 py-5">
                        <AttendanceStatus
                          status={employee.attendance}
                        />
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-600">
                        {employee.checkIn}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-600">
                        {employee.checkOut}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              checkIn(employee)
                            }
                            className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100"
                          >
                            Check In
                          </button>

                          <button
                            onClick={() =>
                              checkOut(employee)
                            }
                            disabled={
                              employee.checkIn === "--:--"
                            }
                            className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Check Out
                          </button>

                          <button
                            onClick={() =>
                              markPresent(employee)
                            }
                            className="rounded-lg border border-emerald-100 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-50"
                          >
                            Present
                          </button>

                          <button
                            onClick={() =>
                              markAbsent(employee)
                            }
                            className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                          >
                            Absent
                          </button>

                          <button
                            onClick={() =>
                              markLeave(employee)
                            }
                            className="rounded-lg border border-amber-100 px-3 py-2 text-xs font-bold text-amber-600 transition hover:bg-amber-50"
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HR PAYROLL
========================================================= */

function HRPayrollPage({
  employees,
}: {
  employees: HREmployee[];
}) {
  const defaultRecord = (
    employee: HREmployee,
  ): PayrollRecord => ({
    employeeId: employee.id,
    basic: 45000,
    allowance: 6000,
    bonus: 0,
    deductions: 2500,
    status: "Processed",
  });

  const [records, setRecords] =
    useState<PayrollRecord[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            "dayflow_payroll",
          );

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        // Fall back to generated records.
      }

      return employees.map(defaultRecord);
    });

  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("All");

  const [selectedEmployee, setSelectedEmployee] =
    useState<HREmployee | null>(null);

  const [editing, setEditing] =
    useState<PayrollRecord | null>(null);

  const [showEditor, setShowEditor] =
    useState(false);

  // Keep payroll records synchronized with
  // the central employee data.
  useEffect(() => {
    setRecords((current) => {
      const validIds = new Set(
        employees.map(
          (employee) => employee.id,
        ),
      );

      const existing = current.filter(
        (record) =>
          validIds.has(record.employeeId),
      );

      const existingIds = new Set(
        existing.map(
          (record) => record.employeeId,
        ),
      );

      const missing = employees
        .filter(
          (employee) =>
            !existingIds.has(employee.id),
        )
        .map(defaultRecord);

      const next = [
        ...existing,
        ...missing,
      ];

      localStorage.setItem(
        "dayflow_payroll",
        JSON.stringify(next),
      );

      return next;
    });
  }, [employees]);

  const saveRecords = (
    next: PayrollRecord[],
  ) => {
    setRecords(next);

    localStorage.setItem(
      "dayflow_payroll",
      JSON.stringify(next),
    );
  };

  const departments = [
    "All",
    ...Array.from(
      new Set(
        employees.map(
          (employee) => employee.department,
        ),
      ),
    ),
  ];

  const getRecord = (
    employeeId: string,
  ) =>
    records.find(
      (record) =>
        record.employeeId === employeeId,
    ) ?? {
      employeeId,
      basic: 45000,
      allowance: 6000,
      bonus: 0,
      deductions: 2500,
      status: "Pending" as const,
    };

  const getGross = (
    record: PayrollRecord,
  ) =>
    record.basic +
    record.allowance +
    record.bonus;

  const getNet = (
    record: PayrollRecord,
  ) =>
    Math.max(
      0,
      getGross(record) -
        record.deductions,
    );

  const totalPayroll =
    employees.reduce(
      (sum, employee) =>
        sum +
        getNet(
          getRecord(employee.id),
        ),
      0,
    );

  const totalGross =
    employees.reduce(
      (sum, employee) =>
        sum +
        getGross(
          getRecord(employee.id),
        ),
      0,
    );

  const totalDeductions =
    employees.reduce(
      (sum, employee) =>
        sum +
        getRecord(employee.id)
          .deductions,
      0,
    );

  const processedCount =
    employees.filter(
      (employee) =>
        getRecord(employee.id)
          .status === "Processed",
    ).length;

  const filteredEmployees =
    employees.filter((employee) => {
      const query =
        search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        `${employee.name} ${employee.id} ${employee.role} ${employee.department}`
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        department === "All" ||
        employee.department === department;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });

  const formatCurrency = (
    value: number,
  ) =>
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      },
    ).format(value);

  const openEditor = (
    employee: HREmployee,
  ) => {
    setEditing(
      getRecord(employee.id),
    );

    setSelectedEmployee(employee);
    setShowEditor(true);
  };

  const markProcessed = (
    employeeId: string,
  ) => {
    const next = records.map(
      (record) =>
        record.employeeId === employeeId
          ? {
              ...record,
              status: "Processed" as const,
            }
          : record,
    );

    saveRecords(next);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR ADMINISTRATION"
        title="HR Payroll"
        description="Manage employee compensation, deductions and monthly payroll using the central workforce data."
      />

      {/* PAYROLL SUMMARY */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Banknote size={20} />}
          label="Net Payroll"
          value={formatCurrency(totalPayroll)}
          description="Current monthly payroll"
        />

        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Gross Payroll"
          value={formatCurrency(totalGross)}
          description="Before deductions"
        />

        <MetricCard
          icon={<Receipt size={20} />}
          label="Deductions"
          value={formatCurrency(totalDeductions)}
          description="Total deductions"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Processed"
          value={`${processedCount}/${employees.length}`}
          description="Payroll records processed"
        />
      </div>

      {/* MONTH + FILTERS */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search employee, ID, role or department..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item === "All"
                  ? "All Departments"
                  : item}
              </option>
            ))}
          </select>

          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            August 2026 Payroll
          </div>
        </div>
      </div>

      {/* PAYROLL TABLE */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-950">
                Employee Payroll
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {filteredEmployees.length} employee
                {filteredEmployees.length === 1
                  ? ""
                  : "s"} shown
              </p>
            </div>

            <button
              onClick={() => {
                const csvRows = [
                  [
                    "Employee ID",
                    "Employee",
                    "Department",
                    "Basic",
                    "Allowance",
                    "Bonus",
                    "Deductions",
                    "Net Salary",
                    "Status",
                  ],
                  ...filteredEmployees.map(
                    (employee) => {
                      const record =
                        getRecord(
                          employee.id,
                        );

                      return [
                        employee.id,
                        employee.name,
                        employee.department,
                        record.basic,
                        record.allowance,
                        record.bonus,
                        record.deductions,
                        getNet(record),
                        record.status,
                      ];
                    },
                  ),
                ];

                const csv = csvRows
                  .map((row) =>
                    row
                      .map((cell) =>
                        `"${String(cell).replaceAll(
                          '"',
                          '""',
                        )}"`,
                      )
                      .join(","),
                  )
                  .join("\n");

                const blob = new Blob(
                  [csv],
                  {
                    type: "text/csv;charset=utf-8;",
                  },
                );

                const url =
                  URL.createObjectURL(
                    blob,
                  );

                const anchor =
                  document.createElement(
                    "a",
                  );

                anchor.href = url;
                anchor.download =
                  "dayflow-payroll-august-2026.csv";

                anchor.click();

                URL.revokeObjectURL(url);
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dayflow-table w-full min-w-[1150px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Basic
                </th>

                <th className="px-6 py-4">
                  Allowances
                </th>

                <th className="px-6 py-4">
                  Deductions
                </th>

                <th className="px-6 py-4">
                  Net Salary
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center"
                  >
                    <Wallet
                      size={34}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-bold text-slate-700">
                      No payroll records found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(
                  (employee) => {
                    const record =
                      getRecord(
                        employee.id,
                      );

                    return (
                      <tr
                        key={employee.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                              {getInitials(
                                employee.name,
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {employee.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                {employee.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {employee.department}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-slate-600">
                          {formatCurrency(
                            record.basic,
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-emerald-600">
                          {formatCurrency(
                            record.allowance +
                              record.bonus,
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-red-600">
                          -
                          {formatCurrency(
                            record.deductions,
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-slate-950">
                          {formatCurrency(
                            getNet(record),
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              record.status ===
                              "Processed"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                openEditor(
                                  employee,
                                )
                              }
                              className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100"
                            >
                              Edit
                            </button>

                            {record.status !==
                              "Processed" && (
                              <button
                                onClick={() =>
                                  markProcessed(
                                    employee.id,
                                  )
                                }
                                className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-100"
                              >
                                Process
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYROLL EDITOR */}
      {showEditor &&
        selectedEmployee &&
        editing && (
          <PayrollEditorModal
            employee={selectedEmployee}
            record={editing}
            onClose={() => {
              setShowEditor(false);
              setSelectedEmployee(null);
              setEditing(null);
            }}
            onSave={(next) => {
              saveRecords(
                records.map(
                  (record) =>
                    record.employeeId ===
                    next.employeeId
                      ? next
                      : record,
                ),
              );

              setShowEditor(false);
              setSelectedEmployee(null);
              setEditing(null);
            }}
          />
        )}
    </div>
  );
}

function PayrollEditorModal({
  employee,
  record,
  onClose,
  onSave,
}: {
  employee: HREmployee;
  record: PayrollRecord;
  onClose: () => void;
  onSave: (record: PayrollRecord) => void;
}) {
  const [basic, setBasic] =
    useState<string>(String(record.basic));

  const [allowance, setAllowance] =
    useState<string>(
      String(record.allowance),
    );

  const [bonus, setBonus] =
    useState<string>(String(record.bonus));

  const [deductions, setDeductions] =
    useState<string>(
      String(record.deductions),
    );

  const [status, setStatus] =
    useState<
      "Processed" | "Pending"
    >(record.status);

  const numberValue = (
    value: string,
  ) => {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? Math.max(0, parsed)
      : 0;
  };

  const gross =
    numberValue(basic) +
    numberValue(allowance) +
    numberValue(bonus);

  const net = Math.max(
    0,
    gross -
      numberValue(deductions),
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
              PAYROLL EDITOR
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {employee.name}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {employee.id} · {employee.department}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Basic Salary

              <input
                type="number"
                min="0"
                value={basic}
                onChange={(event) =>
                  setBasic(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Allowance

              <input
                type="number"
                min="0"
                value={allowance}
                onChange={(event) =>
                  setAllowance(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Bonus

              <input
                type="number"
                min="0"
                value={bonus}
                onChange={(event) =>
                  setBonus(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Deductions

              <input
                type="number"
                min="0"
                value={deductions}
                onChange={(event) =>
                  setDeductions(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Payroll Status

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as
                      | "Processed"
                      | "Pending",
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Processed">
                  Processed
                </option>
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Gross
              </p>

              <p className="mt-1 font-bold text-slate-950">
                {new Intl.NumberFormat(
                  "en-IN",
                  {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  },
                ).format(gross)}
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-xs text-red-500">
                Deductions
              </p>

              <p className="mt-1 font-bold text-red-700">
                {new Intl.NumberFormat(
                  "en-IN",
                  {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  },
                ).format(
                  numberValue(
                    deductions,
                  ),
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs text-emerald-500">
                Net Salary
              </p>

              <p className="mt-1 font-bold text-emerald-700">
                {new Intl.NumberFormat(
                  "en-IN",
                  {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  },
                ).format(net)}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSave({
                  employeeId:
                    record.employeeId,
                  basic:
                    numberValue(basic),
                  allowance:
                    numberValue(
                      allowance,
                    ),
                  bonus:
                    numberValue(bonus),
                  deductions:
                    numberValue(
                      deductions,
                    ),
                  status,
                })
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Check size={17} />
              Save Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HR INSIGHTS
========================================================= */

function HRInsightsPage({
  employees,
  leaveRequests,
}: {
  employees: HREmployee[];
  leaveRequests: LeaveRequest[];
}) {
  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const departments = [
    "All",
    ...Array.from(
      new Set(
        employees.map(
          (employee) => employee.department
        )
      )
    ),
  ];

  const filteredEmployees =
    departmentFilter === "All"
      ? employees
      : employees.filter(
          (employee) =>
            employee.department ===
            departmentFilter
        );

  const total = filteredEmployees.length;

  const present = filteredEmployees.filter(
    (employee) =>
      employee.attendance === "Present"
  ).length;

  const absent = filteredEmployees.filter(
    (employee) =>
      employee.attendance === "Absent"
  ).length;

  const onLeave = filteredEmployees.filter(
    (employee) =>
      employee.attendance === "On Leave"
  ).length;

  const pendingLeaves =
    leaveRequests.filter(
      (request) =>
        request.status === "Pending"
    ).length;

  const approvedLeaves =
    leaveRequests.filter(
      (request) =>
        request.status === "Approved"
    ).length;

  const attendanceRate =
    total > 0
      ? Math.round((present / total) * 100)
      : 0;

  /*
   * Workforce health score
   *
   * Attendance contributes 60%.
   * Leave stability contributes 20%.
   * Absence rate contributes 20%.
   */
  const attendanceScore = attendanceRate * 0.6;

  const leaveScore =
    Math.max(
      0,
      100 - pendingLeaves * 10
    ) * 0.2;

  const absenceScore =
    total > 0
      ? Math.max(
          0,
          100 -
            (absent / total) * 100
        ) * 0.2
      : 0;

  const healthScore = Math.round(
    attendanceScore +
      leaveScore +
      absenceScore
  );

  const healthLabel =
    healthScore >= 85
      ? "Excellent"
      : healthScore >= 70
        ? "Healthy"
        : healthScore >= 50
          ? "Needs Attention"
          : "Critical";

  const healthStyle =
    healthScore >= 85
      ? "border-emerald-200 bg-emerald-50"
      : healthScore >= 70
        ? "border-indigo-200 bg-indigo-50"
        : healthScore >= 50
          ? "border-amber-200 bg-amber-50"
          : "border-red-200 bg-red-50";

  const healthText =
    healthScore >= 85
      ? "text-emerald-700"
      : healthScore >= 70
        ? "text-indigo-700"
        : healthScore >= 50
          ? "text-amber-700"
          : "text-red-700";

  const riskyEmployees =
    filteredEmployees.filter(
      (employee) =>
        employee.attendance !== "Present"
    );

  const insightMessage =
    attendanceRate >= 85 &&
    pendingLeaves <= 1
      ? "Workforce health is strong. Maintain the current attendance and leave management practices."
      : attendanceRate >= 70
        ? "Workforce health is stable, but HR should monitor attendance and pending leave requests."
        : "Workforce health needs attention. HR should review attendance patterns and unresolved leave requests.";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="AI HR INTELLIGENCE"
        title="HR Insights"
        description="Understand workforce health, attendance, leave activity and employee risk from one dashboard."
      />

      {/* =================================================
          CONTROL BAR
      ================================================= */}

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Analytics Scope
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {departmentFilter === "All"
              ? "Entire organization"
              : `${departmentFilter} department`}
          </p>
        </div>

        <select
          value={departmentFilter}
          onChange={(event) =>
            setDepartmentFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
        >
          {departments.map(
            (department) => (
              <option
                key={department}
                value={department}
              >
                {department === "All"
                  ? "All Departments"
                  : department}
              </option>
            )
          )}
        </select>
      </div>

      {/* =================================================
          WORKFORCE HEALTH
      ================================================= */}

      <div
        className={`rounded-3xl border p-6 shadow-sm ${healthStyle}`}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className={healthText}
              />

              <p
                className={`text-xs font-bold uppercase tracking-wider ${healthText}`}
              >
                Workforce Health
              </p>
            </div>

            <h3
              className={`mt-2 text-3xl font-bold ${healthText}`}
            >
              {healthLabel}
            </h3>

            <p
              className={`mt-2 max-w-2xl text-sm ${healthText}`}
            >
              {insightMessage}
            </p>
          </div>

          <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full bg-white shadow-sm">
            <span
              className={`text-4xl font-bold ${healthText}`}
            >
              {healthScore}
            </span>

            <span className="text-xs font-semibold text-slate-400">
              / 100
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Employees"
          value={String(total)}
          description="Employees in scope"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Attendance"
          value={`${attendanceRate}%`}
          description={`${present} present today`}
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Pending Leave"
          value={String(pendingLeaves)}
          description="Requests awaiting action"
        />

        <MetricCard
          icon={<AlertCircle size={20} />}
          label="Risk Employees"
          value={String(riskyEmployees.length)}
          description="Require attention"
        />
      </div>

      {/* =================================================
          ATTENDANCE + LEAVE
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                ATTENDANCE
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-950">
                Workforce Attendance
              </h3>
            </div>

            <Clock3 className="text-indigo-500" />
          </div>

          <div className="mt-7 space-y-6">
            <InsightBar
              label="Present"
              value={present}
              total={total}
            />

            <InsightBar
              label="On Leave"
              value={onLeave}
              total={total}
            />

            <InsightBar
              label="Absent"
              value={absent}
              total={total}
            />
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {present}
              </p>

              <p className="mt-1 text-xs text-emerald-600">
                Present
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {onLeave}
              </p>

              <p className="mt-1 text-xs text-amber-600">
                Leave
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {absent}
              </p>

              <p className="mt-1 text-xs text-red-600">
                Absent
              </p>
            </div>
          </div>
        </div>

        <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                LEAVE ANALYTICS
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-950">
                Leave Activity
              </h3>
            </div>

            <CalendarDays className="text-indigo-500" />
          </div>

          <div className="mt-7 space-y-3">
            <LeaveSummaryRow
              label="Pending Requests"
              value={pendingLeaves}
            />

            <LeaveSummaryRow
              label="Approved Requests"
              value={approvedLeaves}
            />

            <LeaveSummaryRow
              label="Total Requests"
              value={leaveRequests.length}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-indigo-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              HR Recommendation
            </p>

            <p className="mt-2 text-sm leading-6 text-indigo-900">
              {pendingLeaves > 0
                ? `There ${pendingLeaves === 1 ? "is" : "are"} ${pendingLeaves} leave request${pendingLeaves === 1 ? "" : "s"} waiting for HR review.`
                : "No pending leave requests require immediate action."}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          DEPARTMENT ANALYTICS
      ================================================= */}

      <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              ORGANIZATION
            </p>

            <h3 className="mt-1 text-xl font-bold">
              Department Performance
            </h3>
          </div>

          <BarChart3 className="text-indigo-500" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {departments
            .filter(
              (department) =>
                department !== "All"
            )
            .map((department) => {
              const departmentEmployees =
                employees.filter(
                  (employee) =>
                    employee.department ===
                    department
                );

              const departmentPresent =
                departmentEmployees.filter(
                  (employee) =>
                    employee.attendance ===
                    "Present"
                ).length;

              const departmentRate =
                departmentEmployees.length
                  ? Math.round(
                      (departmentPresent /
                        departmentEmployees.length) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={department}
                  className="rounded-2xl border border-slate-100 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                      {department
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <span className="text-lg font-bold text-indigo-600">
                      {departmentRate}%
                    </span>
                  </div>

                  <h4 className="mt-4 font-bold">
                    {department}
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    {departmentEmployees.length} listed employees
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${departmentRate}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* =================================================
          RISK EMPLOYEES
      ================================================= */}

      <div className="dayflow-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-500">
              ATTENTION REQUIRED
            </p>

            <h3 className="mt-1 text-xl font-bold">
              Employee Risk Monitor
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Employees whose current attendance status requires HR attention.
            </p>
          </div>

          <AlertCircle className="text-red-500" />
        </div>

        <div className="mt-6">
          {riskyEmployees.length === 0 ? (
            <div className="rounded-2xl bg-emerald-50 p-5 text-sm font-medium text-emerald-700">
              Excellent! No employees currently require attention.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {riskyEmployees.map(
                (employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold">
                        {getInitials(
                          employee.name
                        )}
                      </div>

                      <div>
                        <p className="font-bold">
                          {employee.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {employee.department} ·{" "}
                          {employee.role}
                        </p>
                      </div>
                    </div>

                    <AttendanceStatus
                      status={
                        employee.attendance
                      }
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          AI RECOMMENDATIONS
      ================================================= */}

      <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              DAYFLOW AI
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              HR Recommendation
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              {insightMessage}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                Attendance: {attendanceRate}%
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                Pending Leave: {pendingLeaves}
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                Risk Employees:{" "}
                {riskyEmployees.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total
    ? (value / total) * 100
    : 0;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>

        <b>{value}</b>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  const [notifications, setNotifications] =
    useState(true);

  const [emailAlerts, setEmailAlerts] =
    useState(true);

  const [autoApproval, setAutoApproval] =
    useState(false);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="SYSTEM"
        title="Settings"
        description="Configure DayFlow preferences."
      />

      <div className="space-y-4">
        <Setting
          title="Notifications"
          description="Receive notifications for important HR activity."
          enabled={notifications}
          setEnabled={setNotifications}
        />

        <Setting
          title="Email Alerts"
          description="Receive important updates through email."
          enabled={emailAlerts}
          setEnabled={setEmailAlerts}
        />

        <Setting
          title="Automatic Leave Approval"
          description="Automatically approve eligible requests."
          enabled={autoApproval}
          setEnabled={setAutoApproval}
        />
      </div>
    </div>
  );
}

function Setting({
  title,
  description,
  enabled,
  setEnabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border bg-white p-6 shadow-sm">
      <div>
        <h3 className="font-bold">{title}</h3>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>
      </div>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative h-7 w-12 rounded-full ${
          enabled
            ? "bg-indigo-600"
            : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("dayflow_theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("dayflow_theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [role, setRole] =
    useState<Role>("employee");

  const [activePage, setActivePage] =
    useState<Page>("Dashboard");

  const [employees, setEmployees] = useState<HREmployee[]>(() => {
    try {
      const saved = localStorage.getItem("dayflow_employees");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Use default employee data.
    }
    return HR_EMPLOYEES;
  });

  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(
      INITIAL_LEAVE_REQUESTS,
    );

  const [checkedIn, setCheckedIn] =
    useState(false);

  const [checkInTime, setCheckInTime] =
    useState("");

  const [checkOutTime, setCheckOutTime] =
    useState("");

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setLoggedIn(true);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setActivePage("Dashboard");
  };

  const handleEmployeesChange = (updatedEmployees: HREmployee[]) => {
    setEmployees(updatedEmployees);
    localStorage.setItem("dayflow_employees", JSON.stringify(updatedEmployees));
  };

  const handleCheckIn = () => {
    const time = getCurrentTime();

    setCheckedIn(true);
    setCheckInTime(time);
    setCheckOutTime("");

    localStorage.setItem(
      "dayflow_checked_in",
      "true",
    );

    localStorage.setItem(
      "dayflow_check_in",
      time,
    );
  };

  const handleCheckOut = () => {
    const time = getCurrentTime();

    setCheckedIn(false);
    setCheckOutTime(time);

    localStorage.setItem(
      "dayflow_checked_in",
      "false",
    );

    localStorage.setItem(
      "dayflow_check_out",
      time,
    );
  };

  const handleLeaveStatus = (
    id: number,
    status: LeaveStatus,
  ) => {
    setLeaveRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request,
      ),
    );
  };

  const handleApplyLeave = (
    request: LeaveRequest,
  ) => {
    setLeaveRequests((current) => [
      ...current,
      request,
    ]);
  };

  if (!loggedIn) {
    return (
      <LoginPage onLogin={handleLogin} />
    );
  }

  let pageContent: ReactNode = null;

  if (activePage === "Dashboard") {
    pageContent =
      role === "hr" ? (
        <HRDashboard
          employees={employees}
          leaveRequests={leaveRequests}
          setActivePage={setActivePage}
        />
      ) : (
        <EmployeeDashboard
          checkedIn={checkedIn}
          checkInTime={checkInTime}
          leaveRequests={leaveRequests}
          setActivePage={setActivePage}
        />
      );
  } else if (activePage === "Attendance") {
    pageContent = (
      <EmployeeAttendancePage
        checkedIn={checkedIn}
        checkInTime={checkInTime}
        checkOutTime={checkOutTime}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />
    );
  } else if (activePage === "Leave") {
    pageContent = (
      <LeavePage
        leaveRequests={leaveRequests}
        onApply={handleApplyLeave}
      />
    );
  } else if (activePage === "Payroll") {
    pageContent = <PayrollPage />;
  } else if (activePage === "Profile") {
    pageContent = <ProfilePage />;
  } else if (activePage === "AI Assistant") {
    pageContent = (
      <AIAssistant
        employees={employees}
        leaveRequests={leaveRequests}
      />
    );
  } else if (activePage === "Employees") {
    pageContent = (
      <EmployeesPage
        employees={employees}
        onEmployeesChange={handleEmployeesChange}
          leaveRequests={leaveRequests}
      />
    );
  } else if (activePage === "Leave Approvals") {
    pageContent = (
      <LeaveApprovalsPage
        requests={leaveRequests}
        onUpdate={handleLeaveStatus}
      />
    );
  } else if (activePage === "HR Attendance") {
    pageContent = (
      <HRAttendancePage
        employees={employees}
        onEmployeesChange={
          handleEmployeesChange
        }
      />
    );
  } else if (activePage === "HR Payroll") {
    pageContent = (
      <HRPayrollPage
        employees={employees}
      />
    );
  } else if (activePage === "HR Insights") {
    pageContent = (
      <HRInsightsPage
        employees={employees}
        leaveRequests={leaveRequests}
      />
    );
  } else if (activePage === "Settings") {
    pageContent = <SettingsPage />;
  }

  return (
    <>
      <style>{DAYFLOW_UI4}</style>
      <div className="dayflow-ui4 flex min-h-screen bg-slate-50">
      <Sidebar
        role={role}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          role={role}
          activePage={activePage}
          theme={theme}
          setTheme={setTheme}
          employees={employees}
          leaveRequests={leaveRequests}
        />

        <main className="dayflow-main flex-1 overflow-y-auto p-5 lg:p-8">
          {pageContent}
        </main>
      </div>
      </div>
    </>
  );
}