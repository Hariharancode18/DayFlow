import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DollarSign,
  Download,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

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

type LeaveStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

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

type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  text: string;
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

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   SMALL COMPONENTS
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
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: LeaveStatus;
}) {
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

function AttendanceStatus({
  status,
}: {
  status: string;
}) {
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

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-800">
        {value}
      </p>
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
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (
      email === "admin@dayflow.com" &&
      password === "admin123"
    ) {
      onLogin("hr");
      return;
    }

    if (
      email === "employee@dayflow.com" &&
      password === "employee123"
    ) {
      onLogin("employee");
      return;
    }

    setError(
      "Invalid credentials. Use one of the demo accounts below."
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-slate-950 shadow-lg">
            D
          </div>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-white">
            DayFlow
          </h1>

          <p className="mt-3 text-lg text-slate-400">
            Human Resource Management System
          </p>
        </div>

        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Welcome Back
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Sign in to DayFlow
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Access your workplace dashboard.
          </p>

          <div className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-600"
            >
              Sign in
            </button>
          </div>

          <div className="my-7 border-t border-slate-100" />

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Demo Accounts
          </p>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => {
                setEmail("employee@dayflow.com");
                setPassword("employee123");
              }}
              className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <p className="font-bold text-slate-900">
                Employee
              </p>

              <p className="mt-1 text-xs text-slate-400">
                employee@dayflow.com
              </p>
            </button>

            <button
              onClick={() => {
                setEmail("admin@dayflow.com");
                setPassword("admin123");
              }}
              className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <p className="font-bold text-slate-900">
                HR Administrator
              </p>

              <p className="mt-1 text-xs text-slate-400">
                admin@dayflow.com
              </p>
            </button>
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
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const employeeMenu: {
    label: string;
    icon: React.ReactNode;
    page: Page;
  }[] = [
    {
      label: "Dashboard",
      icon: <Home size={18} />,
      page: "Dashboard",
    },
    {
      label: "Attendance",
      icon: <Clock3 size={18} />,
      page: "Attendance",
    },
    {
      label: "Leave",
      icon: <CalendarDays size={18} />,
      page: "Leave",
    },
    {
      label: "Payroll",
      icon: <Wallet size={18} />,
      page: "Payroll",
    },
    {
      label: "Profile",
      icon: <User size={18} />,
      page: "Profile",
    },
    {
      label: "AI Assistant",
      icon: <Sparkles size={18} />,
      page: "AI Assistant",
    },
  ];

  const hrMenu: {
    label: string;
    icon: React.ReactNode;
    page: Page;
  }[] = [
    {
      label: "Dashboard",
      icon: <Home size={18} />,
      page: "Dashboard",
    },
    {
      label: "Employees",
      icon: <Users size={18} />,
      page: "Employees",
    },
    {
      label: "Leave Approvals",
      icon: <CalendarDays size={18} />,
      page: "Leave Approvals",
    },
    {
      label: "HR Attendance",
      icon: <Clock3 size={18} />,
      page: "HR Attendance",
    },
    {
      label: "HR Payroll",
      icon: <Wallet size={18} />,
      page: "HR Payroll",
    },
    {
      label: "HR Insights",
      icon: <BarChart3 size={18} />,
      page: "HR Insights",
    },
    {
      label: "AI Assistant",
      icon: <Sparkles size={18} />,
      page: "AI Assistant",
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      page: "Settings",
    },
  ];

  const menu =
    role === "hr" ? hrMenu : employeeMenu;

  return (
    <>
      <button
        onClick={() =>
          setMobileOpen(!mobileOpen)
        }
        className="fixed left-4 top-4 z-50 rounded-xl bg-slate-950 p-3 text-white lg:hidden"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform lg:static lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold">
            D
          </div>

          <div>
            <h1 className="font-bold">
              DayFlow
            </h1>

            <p className="text-xs text-slate-500">
              {role === "hr"
                ? "HR Workspace"
                : "Employee Workspace"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menu.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setActivePage(item.page);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                activePage === item.page
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 font-bold">
                HV
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  Hariharan V
                </p>

                <p className="truncate text-xs text-slate-500">
                  {role === "hr"
                    ? "HR Administrator"
                    : "Software Developer"}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-red-500/20 hover:text-red-300"
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
}: {
  role: Role;
  activePage: Page;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur lg:px-8">
      <div className="pl-12 lg:pl-0">
        <p className="text-xs font-semibold text-slate-400">
          {role === "hr"
            ? "HR ADMINISTRATION"
            : "EMPLOYEE PORTAL"}
        </p>

        <h2 className="mt-0.5 text-lg font-bold text-slate-950">
          {activePage}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 sm:block">
          <Search size={18} />
        </button>

        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          HV
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   EMPLOYEE DASHBOARD
========================================================= */

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
  const pending = leaveRequests.filter(
    (request) =>
      request.status === "Pending"
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
        <p className="text-sm font-medium text-indigo-400">
          GOOD MORNING 👋
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Welcome back, Hariharan
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Here's what's happening with your workday.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Clock3 size={20} />}
          label="Attendance"
          value="92%"
          description="This month"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Leave Balance"
          value="14 days"
          description="Available leave"
        />

        <MetricCard
          icon={<Wallet size={20} />}
          label="Net Salary"
          value="₹31,000"
          description="August 2026"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Today"
          value={
            checkedIn
              ? "Checked In"
              : "Not Checked"
          }
          description={
            checkedIn
              ? `Since ${checkInTime}`
              : "Remember to check in"
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-950">
                Quick Actions
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Common workplace actions
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="Mark Attendance"
              description="Check in or check out"
              onClick={() =>
                setActivePage(
                  "Attendance"
                )
              }
            />

            <QuickAction
              title="Apply Leave"
              description="Request time off"
              onClick={() =>
                setActivePage("Leave")
              }
            />

            <QuickAction
              title="View Payroll"
              description="Check your payslip"
              onClick={() =>
                setActivePage("Payroll")
              }
            />

            <QuickAction
              title="Ask DayFlow AI"
              description="Get HR answers"
              onClick={() =>
                setActivePage(
                  "AI Assistant"
                )
              }
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-950">
            Leave Overview
          </h3>

          <div className="mt-5 space-y-3">
            <LeaveSummaryRow
              label="Pending"
              value={pending}
            />

            <LeaveSummaryRow
              label="Approved"
              value={
                leaveRequests.filter(
                  (r) =>
                    r.status === "Approved"
                ).length
              }
            />

            <LeaveSummaryRow
              label="Available"
              value={14}
            />
          </div>

          <button
            onClick={() =>
              setActivePage("Leave")
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            View Leave
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
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
          <h4 className="font-bold text-slate-800">
            {title}
          </h4>

          <p className="mt-1 text-sm text-slate-400">
            {description}
          </p>
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
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   HR DASHBOARD
========================================================= */

function HRDashboard({
  leaveRequests,
  setActivePage,
}: {
  leaveRequests: LeaveRequest[];
  setActivePage: (page: Page) => void;
}) {
  const pending = leaveRequests.filter(
    (r) => r.status === "Pending"
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
          value="48"
          description="Active employees"
        />

        <MetricCard
          icon={<Clock3 size={20} />}
          label="Attendance"
          value="85%"
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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-950">
                Pending Actions
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Items requiring HR attention
              </p>
            </div>

            <AlertCircle
              size={20}
              className="text-amber-500"
            />
          </div>

          <div className="mt-5 space-y-3">
            <button
              onClick={() =>
                setActivePage(
                  "Leave Approvals"
                )
              }
              className="flex w-full items-center justify-between rounded-2xl bg-amber-50 p-4 text-left hover:bg-amber-100"
            >
              <div>
                <p className="font-semibold text-amber-800">
                  Leave approvals
                </p>

                <p className="mt-1 text-xs text-amber-600">
                  {pending} pending requests
                </p>
              </div>

              <ArrowRight
                size={17}
                className="text-amber-600"
              />
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "HR Attendance"
                )
              }
              className="flex w-full items-center justify-between rounded-2xl bg-indigo-50 p-4 text-left hover:bg-indigo-100"
            >
              <div>
                <p className="font-semibold text-indigo-800">
                  Attendance review
                </p>

                <p className="mt-1 text-xs text-indigo-600">
                  Review today's attendance
                </p>
              </div>

              <ArrowRight
                size={17}
                className="text-indigo-600"
              />
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-950">
            HR Quick Access
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="HR Insights"
              description="Analytics & AI insights"
              onClick={() =>
                setActivePage(
                  "HR Insights"
                )
              }
            />

            <QuickAction
              title="Employees"
              description="Manage workforce"
              onClick={() =>
                setActivePage(
                  "Employees"
                )
              }
            />

            <QuickAction
              title="Payroll"
              description="Manage salary"
              onClick={() =>
                setActivePage(
                  "HR Payroll"
                )
              }
            />

            <QuickAction
              title="AI Assistant"
              description="Ask HR questions"
              onClick={() =>
                setActivePage(
                  "AI Assistant"
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ATTENDANCE
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
    ["14", "Thu", "Present"],
    ["15", "Fri", "Present"],
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

          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
              }
            )}
          </h3>

          <div className="mt-7 space-y-4">
            <AttendanceRow
              label="Check In"
              value={
                checkInTime || "--:--"
              }
            />

            <AttendanceRow
              label="Check Out"
              value={
                checkOutTime || "--:--"
              }
            />

            <AttendanceRow
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
                className="w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-semibold text-white hover:bg-emerald-600"
              >
                Check In
              </button>
            )}

            {checkedIn && !checkOutTime && (
              <button
                onClick={onCheckOut}
                className="w-full rounded-xl bg-red-500 px-5 py-3.5 font-semibold text-white hover:bg-red-600"
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

          <h3 className="mt-2 text-2xl font-bold text-slate-950">
            August 2026
          </h3>

          <div className="mt-6 space-y-3">
            {records.map(
              ([date, day, status]) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center">
                      <p className="font-bold text-slate-800">
                        {date}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {day}
                      </p>
                    </div>

                    <span className="text-sm text-slate-500">
                      {status ===
                      "Present"
                        ? "Workday"
                        : "Leave"}
                    </span>
                  </div>

                  <AttendanceStatus
                    status={status}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="font-semibold text-slate-800">
        {value}
      </span>
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
  onApply: (
    request: LeaveRequest
  ) => void;
}) {
  const [type, setType] =
    useState("Casual Leave");

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [message, setMessage] =
    useState("");

  const submitLeave = () => {
    if (!from || !to || !reason) {
      setMessage(
        "Please fill all leave details."
      );
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
      "Leave request submitted successfully."
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
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-950">
            Apply Leave
          </h3>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Leave Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option>
                  Casual Leave
                </option>
                <option>
                  Sick Leave
                </option>
                <option>
                  Earned Leave
                </option>
                <option>
                  Work From Home
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                From
              </label>

              <input
                type="date"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                To
              </label>

              <input
                type="date"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Reason
              </label>

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                rows={4}
                placeholder="Enter reason..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-600">
                {message}
              </div>
            )}

            <button
              onClick={submitLeave}
              className="w-full rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white hover:bg-indigo-600"
            >
              Submit Leave Request
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-950">
            My Requests
          </h3>

          <div className="mt-6 space-y-3">
            {leaveRequests.map(
              (request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-100 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="font-bold text-slate-800">
                        {request.type}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {request.from} →{" "}
                        {request.to}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {request.reason}
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        request.status
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYROLL PAGE
========================================================= */

function PayrollPage() {
  const rows = [
    ["Basic Salary", "₹25,000"],
    ["HRA", "₹10,000"],
    ["Special Allowance", "₹7,000"],
    ["PF", "-₹3,000"],
    ["Professional Tax", "-₹2,000"],
    ["Other Deductions", "-₹6,000"],
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="PAYROLL"
        title="My Payroll"
        description="View your salary and payroll information."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<DollarSign size={20} />}
          label="Gross Salary"
          value="₹42,000"
          description="Monthly"
        />

        <MetricCard
          icon={<Wallet size={20} />}
          label="Deductions"
          value="₹11,000"
          description="Monthly"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Net Salary"
          value="₹31,000"
          description="Take home"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="Pay Period"
          value="August"
          description="2026"
        />
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              CURRENT PAYSLIP
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-950">
              August 2026
            </h3>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600">
            <Download size={16} />
            Download
          </button>
        </div>

        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-100">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-slate-100 px-5 py-4"
            >
              <span className="text-sm text-slate-500">
                {label}
              </span>

              <span className="text-sm font-semibold text-slate-800">
                {value}
              </span>
            </div>
          ))}

          <div className="flex justify-between bg-slate-50 px-5 py-4">
            <span className="font-bold text-slate-900">
              Net Salary
            </span>

            <span className="font-bold text-indigo-600">
              ₹31,000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="EMPLOYEE PROFILE"
        title="My Profile"
        description="View your personal and workplace information."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-950 p-7 text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500 text-2xl font-bold">
            HV
          </div>

          <h3 className="mt-5 text-2xl font-bold">
            Hariharan V
          </h3>

          <p className="mt-1 text-slate-400">
            Software Developer
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <p className="text-slate-400">
              Employee ID
              <span className="ml-2 font-semibold text-white">
                EMP001
              </span>
            </p>

            <p className="text-slate-400">
              Department
              <span className="ml-2 font-semibold text-white">
                IT
              </span>
            </p>

            <p className="text-slate-400">
              Status
              <span className="ml-2 font-semibold text-emerald-400">
                Active
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-950">
            Personal Information
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ProfileField
              label="Full Name"
              value="Hariharan V"
            />

            <ProfileField
              label="Email"
              value="employee@dayflow.com"
            />

            <ProfileField
              label="Department"
              value="Information Technology"
            />

            <ProfileField
              label="Designation"
              value="Software Developer"
            />

            <ProfileField
              label="Employment Type"
              value="Full Time"
            />

            <ProfileField
              label="Work Location"
              value="Bangalore"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPLOYEES
========================================================= */

function EmployeesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Employees"
        description="Manage and monitor your organization's employees."
      />

      <div className="mb-5 flex justify-between">
        <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
          <span className="font-bold text-slate-900">
            48
          </span>{" "}
          total employees
        </div>

        <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600">
          + Add Employee
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  ID
                </th>

                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {HR_EMPLOYEES.map(
                (employee) => (
                  <tr
                    key={employee.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {employee.name
                            .split(" ")
                            .map(
                              (part) =>
                                part[0]
                            )
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {employee.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {employee.department}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {employee.role}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {employee.id}
                    </td>

                    <td className="px-6 py-5">
                      <AttendanceStatus
                        status={
                          employee.attendance
                        }
                      />
                    </td>
                  </tr>
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
   LEAVE APPROVALS
========================================================= */

function LeaveApprovalsPage({
  requests,
  onUpdate,
}: {
  requests: LeaveRequest[];
  onUpdate: (
    id: number,
    status: LeaveStatus
  ) => void;
}) {
  const [filter, setFilter] =
    useState<"All" | LeaveStatus>("All");

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter(
          (request) =>
            request.status === filter
        );

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="LEAVE MANAGEMENT"
        title="Leave Approvals"
        description="Review and manage employee leave requests."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          "All",
          "Pending",
          "Approved",
          "Rejected",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setFilter(
                item as
                  | "All"
                  | LeaveStatus
              )
            }
            className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
              filter === item
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  Leave Type
                </th>

                <th className="px-6 py-4">
                  Duration
                </th>

                <th className="px-6 py-4">
                  Reason
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
              {filteredRequests.map(
                (request) => (
                  <tr
                    key={request.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">
                        {request.employee}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {request.employeeId}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {request.type}
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-700">
                        {request.from}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        to {request.to}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {request.reason}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={
                          request.status
                        }
                      />
                    </td>

                    <td className="px-6 py-5">
                      {request.status ===
                      "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              onUpdate(
                                request.id,
                                "Approved"
                              )
                            }
                            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              onUpdate(
                                request.id,
                                "Rejected"
                              )
                            }
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
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
   HR ATTENDANCE
========================================================= */

function HRAttendancePage({
  employees,
}: {
  employees: HREmployee[];
}) {
  const present = employees.filter(
    (e) => e.attendance === "Present"
  ).length;

  const absent = employees.filter(
    (e) => e.attendance === "Absent"
  ).length;

  const leave = employees.filter(
    (e) => e.attendance === "On Leave"
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR OPERATIONS"
        title="Attendance"
        description="Monitor employee attendance."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Employees"
          value="48"
          description="Total workforce"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Present"
          value={String(present)}
          description="Today's attendance"
        />

        <MetricCard
          icon={<XCircle size={20} />}
          label="Absent"
          value={String(absent)}
          description="Needs attention"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="On Leave"
          value={String(leave)}
          description="Currently away"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Check In
                </th>

                <th className="px-6 py-4">
                  Check Out
                </th>

                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map(
                (employee) => (
                  <tr
                    key={employee.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">
                        {employee.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {employee.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {employee.department}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {employee.checkIn}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {employee.checkOut}
                    </td>

                    <td className="px-6 py-5">
                      <AttendanceStatus
                        status={
                          employee.attendance
                        }
                      />
                    </td>
                  </tr>
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

function HRPayrollPage() {
  const employees = [
    ["Hariharan V", "IT", "₹42,000", "₹31,000"],
    ["Arjun Kumar", "Engineering", "₹55,000", "₹42,500"],
    ["Priya Sharma", "Design", "₹48,000", "₹38,000"],
    ["Rahul Kumar", "Engineering", "₹52,000", "₹40,500"],
    ["Sneha R", "HR", "₹45,000", "₹35,500"],
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR OPERATIONS"
        title="Payroll Management"
        description="Monitor salary processing across the organization."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Employees"
          value="48"
          description="Payroll workforce"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Processed"
          value="43"
          description="Completed"
        />

        <MetricCard
          icon={<Clock3 size={20} />}
          label="Pending"
          value="5"
          description="Needs processing"
        />

        <MetricCard
          icon={<Wallet size={20} />}
          label="Period"
          value="August"
          description="2026"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex justify-between border-b border-slate-100 p-6">
          <div>
            <h3 className="font-bold text-slate-950">
              August 2026 Payroll
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Salary processing overview
            </p>
          </div>

          <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-600">
            Process Payroll
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Gross
                </th>

                <th className="px-6 py-4">
                  Net
                </th>

                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map(
                ([name, department, gross, net]) => (
                  <tr
                    key={name}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {name}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {department}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {gross}
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-900">
                      {net}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Processed
                      </span>
                    </td>
                  </tr>
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
   AI ASSISTANT
========================================================= */

function AIAssistant({
  leaveRequests,
}: {
  leaveRequests: LeaveRequest[];
}) {
  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: 1,
        sender: "ai",
        text: "Hello! I'm DayFlow AI. Ask me about attendance, leave, payroll or employees.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const pendingLeaves =
    leaveRequests.filter(
      (r) => r.status === "Pending"
    );

  const answer = (question: string) => {
    const text = question.toLowerCase();

    if (
      text.includes("pending") &&
      text.includes("leave")
    ) {
      if (pendingLeaves.length === 0) {
        return "There are no pending leave requests.";
      }

      return `There are ${pendingLeaves.length} pending leave requests: ${pendingLeaves
        .map((r) => r.employee)
        .join(", ")}.`;
    }

    if (
      text.includes("how many") &&
      text.includes("leave")
    ) {
      return `There are ${leaveRequests.length} total leave requests: ${
        leaveRequests.filter(
          (r) => r.status === "Pending"
        ).length
      } pending, ${
        leaveRequests.filter(
          (r) => r.status === "Approved"
        ).length
      } approved, and ${
        leaveRequests.filter(
          (r) => r.status === "Rejected"
        ).length
      } rejected.`;
    }

    if (
      text.includes("attendance") ||
      text.includes("present")
    ) {
      return "Your current demo attendance is 92%. You are expected to check in each working day.";
    }

    if (
      text.includes("who") &&
      text.includes("leave")
    ) {
      return `Employees currently associated with leave requests include: ${leaveRequests
        .map((r) => r.employee)
        .join(", ")}.`;
    }

    if (
      text.includes("payroll") ||
      text.includes("salary")
    ) {
      return "Your demo net salary is ₹31,000 for August 2026.";
    }

    if (
      text.includes("employee") ||
      text.includes("employees")
    ) {
      return "DayFlow currently has 48 employees in the demo organization.";
    }

    return "I can answer questions about attendance, leave requests, payroll, salary and employees. Try asking: 'Who has pending leave?'";
  };

  const ask = (question: string) => {
    const value = question.trim();

    if (!value) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: value,
    };

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: "ai",
      text: answer(value),
    };

    setMessages((current) => [
      ...current,
      userMessage,
      aiMessage,
    ]);

    setInput("");
  };

  const questions = [
    "Who has pending leave?",
    "How many leave requests?",
    "What is my attendance?",
    "Who is on leave?",
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="DAYFLOW AI"
        title="AI Assistant"
        description="Ask questions about your workplace data."
      />

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-[620px] flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-6">
            {messages.map(
              (message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-5 py-4 ${
                      message.sender ===
                      "user"
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {message.sender ===
                      "ai" && (
                      <p className="mb-1 text-xs font-bold text-indigo-600">
                        DayFlow AI
                      </p>
                    )}

                    <p className="text-sm leading-6">
                      {message.text}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Questions
            </p>

            <div className="mb-4 flex gap-2 overflow-x-auto">
              {questions.map(
                (question) => (
                  <button
                    key={question}
                    onClick={() =>
                      ask(question)
                    }
                    className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {question}
                  </button>
                )
              )}
            </div>

            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    ask(input);
                  }
                }}
                placeholder="Ask DayFlow AI anything..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <button
                onClick={() => ask(input)}
                className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
              >
                Ask AI
              </button>
            </div>
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
  leaveRequests,
}: {
  leaveRequests: LeaveRequest[];
}) {
  const pending =
    leaveRequests.filter(
      (r) => r.status === "Pending"
    ).length;

  const approved =
    leaveRequests.filter(
      (r) => r.status === "Approved"
    ).length;

  const rejected =
    leaveRequests.filter(
      (r) => r.status === "Rejected"
    ).length;

  const totalEmployees = 48;
  const present = 41;
  const onLeave = 5;
  const absent = 2;

  const attendanceRate = Math.round(
    (present / totalEmployees) * 100
  );

  const risk =
    pending >= 3
      ? "High"
      : pending > 0 ||
          attendanceRate < 90
        ? "Medium"
        : "Low";

  const riskStyle =
    risk === "High"
      ? "border-red-200 bg-red-50 text-red-700"
      : risk === "Medium"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR INTELLIGENCE"
        title="HR Insights"
        description="Analytics and actionable insights for HR administrators."
      />

      <div
        className={`rounded-3xl border p-6 ${riskStyle}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
            {risk === "Low"
              ? "✓"
              : "!"}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              HR Risk Level
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              {risk}
            </h3>

            <p className="mt-2 text-sm">
              {risk === "Low"
                ? "HR operations are currently healthy."
                : risk === "Medium"
                  ? "Some HR items require attention."
                  : "Immediate HR attention is recommended."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Total Employees"
          value="48"
          description="Active workforce"
        />

        <MetricCard
          icon={<BarChart3 size={20} />}
          label="Attendance"
          value={`${attendanceRate}%`}
          description={`${present} present today`}
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="On Leave"
          value={String(onLeave)}
          description="Currently away"
        />

        <MetricCard
          icon={<Wallet size={20} />}
          label="Payroll"
          value="Ready"
          description="Current cycle"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-950">
            Attendance Health
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Current organization attendance
          </p>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-4xl font-bold text-slate-950">
                {attendanceRate}%
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Attendance rate
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              Healthy
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{
                width: `${attendanceRate}%`,
              }}
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MiniMetric
              label="Present"
              value={String(present)}
            />

            <MiniMetric
              label="Absent"
              value={String(absent)}
            />

            <MiniMetric
              label="Leave"
              value={String(onLeave)}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-950">
            Leave Analytics
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Current request status
          </p>

          <div className="mt-6 space-y-5">
            <ProgressRow
              label="Pending"
              value={pending}
              total={Math.max(
                leaveRequests.length,
                1
              )}
              className="bg-amber-400"
            />

            <ProgressRow
              label="Approved"
              value={approved}
              total={Math.max(
                leaveRequests.length,
                1
              )}
              className="bg-emerald-500"
            />

            <ProgressRow
              label="Rejected"
              value={rejected}
              total={Math.max(
                leaveRequests.length,
                1
              )}
              className="bg-red-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500">
            <Sparkles size={24} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              DayFlow AI Recommendation
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {pending > 0
                ? "Review pending leave requests"
                : "HR operations look healthy"}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {pending > 0
                ? `There are ${pending} pending leave request${
                    pending > 1
                      ? "s"
                      : ""
                  }. Reviewing these before payroll finalization can reduce attendance and payroll discrepancies.`
                : "No pending leave requests were detected. Continue monitoring attendance and payroll."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SignalCard
          icon="🏖"
          title="Leave Requests"
          description={`${pending} pending request${
            pending === 1 ? "" : "s"
          } need review.`}
        />

        <SignalCard
          icon="📊"
          title="Attendance"
          description={`${attendanceRate}% attendance rate across the demo workforce.`}
        />

        <SignalCard
          icon="💰"
          title="Payroll"
          description="Payroll data is ready for the current cycle."
        />
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  className,
}: {
  label: string;
  value: number;
  total: number;
  className: string;
}) {
  const percentage = Math.min(
    100,
    Math.round((value / total) * 100)
  );

  return (
    <div>
      <div className="flex justify-between">
        <span className="text-sm text-slate-600">
          {label}
        </span>

        <span className="text-sm font-bold text-slate-800">
          {value}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function SignalCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-slate-500">
        {description}
      </p>
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
  setEnabled: (
    value: boolean
  ) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>
      </div>

      <button
        onClick={() =>
          setEnabled(!enabled)
        }
        className={`relative h-7 w-12 rounded-full transition ${
          enabled
            ? "bg-indigo-600"
            : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [loggedIn, setLoggedIn] =
    useState(false);

  const [role, setRole] =
    useState<Role>("employee");

  const [activePage, setActivePage] =
    useState<Page>("Dashboard");

  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(
      INITIAL_LEAVE_REQUESTS
    );

  const [checkInTime, setCheckInTime] =
    useState("");

  const [checkOutTime, setCheckOutTime] =
    useState("");

  const [checkedIn, setCheckedIn] =
    useState(false);

  /* =======================================================
     RESTORE ATTENDANCE
  ======================================================= */

  useEffect(() => {
    const savedDate =
      localStorage.getItem(
        "dayflow_attendance_date"
      );

    const today = getTodayKey();

    if (savedDate !== today) {
      localStorage.removeItem(
        "dayflow_checked_in"
      );

      localStorage.removeItem(
        "dayflow_check_in"
      );

      localStorage.removeItem(
        "dayflow_check_out"
      );

      localStorage.setItem(
        "dayflow_attendance_date",
        today
      );

      return;
    }

    setCheckedIn(
      localStorage.getItem(
        "dayflow_checked_in"
      ) === "true"
    );

    setCheckInTime(
      localStorage.getItem(
        "dayflow_check_in"
      ) || ""
    );

    setCheckOutTime(
      localStorage.getItem(
        "dayflow_check_out"
      ) || ""
    );
  }, []);

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = (
    selectedRole: Role
  ) => {
    setRole(selectedRole);
    setLoggedIn(true);

    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setActivePage("Dashboard");
  };

  /* =======================================================
     ATTENDANCE
  ======================================================= */

  const handleCheckIn = () => {
    const time = getCurrentTime();

    setCheckedIn(true);
    setCheckInTime(time);

    localStorage.setItem(
      "dayflow_checked_in",
      "true"
    );

    localStorage.setItem(
      "dayflow_check_in",
      time
    );

    localStorage.setItem(
      "dayflow_attendance_date",
      getTodayKey()
    );
  };

  const handleCheckOut = () => {
    const time = getCurrentTime();

    setCheckedIn(false);
    setCheckOutTime(time);

    localStorage.setItem(
      "dayflow_checked_in",
      "false"
    );

    localStorage.setItem(
      "dayflow_check_out",
      time
    );
  };

  /* =======================================================
     LEAVE
  ======================================================= */

  const handleLeaveStatus = (
    id: number,
    status: LeaveStatus
  ) => {
    setLeaveRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request
      )
    );
  };

  const handleApplyLeave = (
    request: LeaveRequest
  ) => {
    setLeaveRequests((current) => [
      ...current,
      request,
    ]);
  };

  /* =======================================================
     PAGE CONTENT
  ======================================================= */

  const pageContent = useMemo(() => {
    if (activePage === "Dashboard") {
      return role === "hr" ? (
        <HRDashboard
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
    }

    if (activePage === "Attendance") {
      return (
        <EmployeeAttendancePage
          checkedIn={checkedIn}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      );
    }

    if (activePage === "Leave") {
      return (
        <LeavePage
          leaveRequests={leaveRequests}
          onApply={handleApplyLeave}
        />
      );
    }

    if (activePage === "Payroll") {
      return <PayrollPage />;
    }

    if (activePage === "Profile") {
      return <ProfilePage />;
    }

    if (activePage === "AI Assistant") {
      return (
        <AIAssistant
          leaveRequests={leaveRequests}
        />
      );
    }

    if (activePage === "Employees") {
      return <EmployeesPage />;
    }

    if (activePage === "Leave Approvals") {
      return (
        <LeaveApprovalsPage
          requests={leaveRequests}
          onUpdate={handleLeaveStatus}
        />
      );
    }

    if (activePage === "HR Attendance") {
      return (
        <HRAttendancePage
          employees={HR_EMPLOYEES}
        />
      );
    }

    if (activePage === "HR Payroll") {
      return <HRPayrollPage />;
    }

    if (activePage === "HR Insights") {
      return (
        <HRInsightsPage
          leaveRequests={leaveRequests}
        />
      );
    }

    if (activePage === "Settings") {
      return <SettingsPage />;
    }

    return null;
  }, [
    activePage,
    role,
    leaveRequests,
    checkedIn,
    checkInTime,
    checkOutTime,
  ]);

  /* =======================================================
     LOGIN SCREEN
  ======================================================= */

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  /* =======================================================
     APPLICATION
  ======================================================= */

  return (
    <div className="flex min-h-screen bg-slate-50">
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
        />

        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {pageContent}
        </main>
      </div>
    </div>
  );
}

export default App;