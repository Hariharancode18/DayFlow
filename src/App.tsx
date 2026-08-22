import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  DollarSign,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

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

type HREmployee = {
  id: string;
  name: string;
  department: string;
  role: string;
  attendance: "Present" | "Absent" | "On Leave";
  checkIn: string;
  checkOut: string;
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
      "Invalid credentials. Use one of the demo accounts below.",
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-slate-950">
            D
          </div>

          <h1 className="mt-5 text-5xl font-bold text-white">
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
            <label className="block text-sm font-semibold text-slate-700">
              Email

              <input
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="you@company.com"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleLogin();
                  }
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Enter password"
              />
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white hover:bg-indigo-600"
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
              className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-300 hover:bg-indigo-50"
            >
              <b>Employee</b>

              <p className="mt-1 text-xs text-slate-400">
                employee@dayflow.com / employee123
              </p>
            </button>

            <button
              onClick={() => {
                setEmail("admin@dayflow.com");
                setPassword("admin123");
              }}
              className="w-full rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-300 hover:bg-indigo-50"
            >
              <b>HR Administrator</b>

              <p className="mt-1 text-xs text-slate-400">
                admin@dayflow.com / admin123
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold">
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

        <h2 className="text-lg font-bold text-slate-950">
          {activePage}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 sm:block">
          <Search size={18} />
        </button>

        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
  leaveRequests,
  setActivePage,
}: {
  leaveRequests: LeaveRequest[];
  setActivePage: (page: Page) => void;
}) {
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
  leaveRequests,
}: {
  leaveRequests: LeaveRequest[];
}) {
  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: 1,
        sender: "ai",
        text: "Hi! I'm DayFlow AI 👋 Ask me about attendance, leave, employees, payroll, or today's HR summary.",
      },
    ]);

  const [input, setInput] = useState("");

  const answer = (question: string) => {
    const text = question.toLowerCase();

    const pending = leaveRequests.filter(
      (request) => request.status === "Pending",
    );

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
      text.includes("attendance") ||
      text.includes("present")
    ) {
      const present = HR_EMPLOYEES.filter(
        (employee) =>
          employee.attendance === "Present",
      ).length;

      return `The demo organization has ${present} of ${HR_EMPLOYEES.length} listed employees present today.`;
    }

    if (text.includes("employee")) {
      return "DayFlow currently has 48 employees in the organization.";
    }

    if (
      text.includes("payroll") ||
      text.includes("salary")
    ) {
      return "Your demo net salary is ₹31,000 for August 2026.";
    }

    if (text.includes("leave")) {
      return `There are ${leaveRequests.length} leave requests in the demo data.`;
    }

    return "I can answer questions about attendance, leave, payroll, salary and employees.";
  };

  const sendMessage = () => {
    if (!input.trim()) {
      return;
    }

    const question = input.trim();

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: "user",
        text: question,
      },
      {
        id: Date.now() + 1,
        sender: "ai",
        text: answer(question),
      },
    ]);

    setInput("");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="DAYFLOW AI"
        title="AI Assistant"
        description="Ask questions about your HR workspace."
      />

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
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
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
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

        <div className="border-t p-4">
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
              className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="Ask: Who has pending leave?"
            />

            <button
              onClick={sendMessage}
              className="rounded-xl bg-indigo-600 px-5 font-semibold text-white"
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

function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All");
  const [attendance, setAttendance] =
    useState("All");
  const [selected, setSelected] =
    useState<HREmployee | null>(null);

  const departments = [
    "All",
    ...Array.from(
      new Set(
        HR_EMPLOYEES.map(
          (employee) => employee.department,
        ),
      ),
    ),
  ];

  const employees = HR_EMPLOYEES.filter(
    (employee) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        `${employee.name} ${employee.id} ${employee.role} ${employee.department}`
          .toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        department === "All" ||
        employee.department === department;

      const matchesAttendance =
        attendance === "All" ||
        employee.attendance === attendance;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesAttendance
      );
    },
  );

  const present = HR_EMPLOYEES.filter(
    (employee) =>
      employee.attendance === "Present",
  ).length;

  const onLeave = HR_EMPLOYEES.filter(
    (employee) =>
      employee.attendance === "On Leave",
  ).length;

  const absent = HR_EMPLOYEES.filter(
    (employee) =>
      employee.attendance === "Absent",
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR ADMINISTRATION"
        title="Employees"
        description="Manage your workforce, monitor attendance, and view employee information."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Total Employees"
          value="48"
          description="Active workforce"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Present"
          value={String(present)}
          description="Listed today"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="On Leave"
          value={String(onLeave)}
          description="Listed today"
        />

        <MetricCard
          icon={<XCircle size={20} />}
          label="Absent"
          value={String(absent)}
          description="Listed today"
        />
      </div>

      <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border py-3 pl-10 pr-4"
              placeholder="Search name, ID, role or department..."
            />
          </div>

          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            className="rounded-xl border px-4 py-3"
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
            value={attendance}
            onChange={(event) =>
              setAttendance(event.target.value)
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Showing{" "}
          <b>{employees.length}</b> of{" "}
          {HR_EMPLOYEES.length} listed employees
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
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
                  Attendance
                </th>

                <th className="px-6 py-4">
                  Check In
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-700">
                        {getInitials(employee.name)}
                      </div>

                      <div>
                        <b>{employee.name}</b>

                        <p className="text-xs text-slate-400">
                          {employee.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm">
                    {employee.department}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-500">
                    {employee.role}
                  </td>

                  <td className="px-6 py-5">
                    <AttendanceStatus
                      status={employee.attendance}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm">
                    {employee.checkIn}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() =>
                        setSelected(employee)
                      }
                      className="rounded-xl border px-3 py-2 text-xs font-bold hover:bg-indigo-50"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <EmployeeModal
          employee={selected}
          onClose={() => setSelected(null)}
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
  onClose,
}: {
  employee: HREmployee;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <p className="text-xs font-bold uppercase text-indigo-500">
              Employee Profile
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {employee.name}
            </h2>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 text-xl font-bold text-white">
              {getInitials(employee.name)}
            </div>

            <div>
              <h3 className="text-2xl font-bold">
                {employee.name}
              </h3>

              <p className="text-sm text-slate-500">
                {employee.role}
              </p>

              <div className="mt-2">
                <AttendanceStatus
                  status={employee.attendance}
                />
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
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

          <button
            onClick={onClose}
            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            Close
          </button>
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
}: {
  employees: HREmployee[];
}) {
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

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR ADMINISTRATION"
        title="HR Attendance"
        description="Monitor today's employee attendance."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Present"
          value={String(present)}
          description="Listed employees"
        />

        <MetricCard
          icon={<XCircle size={20} />}
          label="Absent"
          value={String(absent)}
          description="Listed employees"
        />

        <MetricCard
          icon={<CalendarDays size={20} />}
          label="On Leave"
          value={String(onLeave)}
          description="Listed employees"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase text-slate-400">
                <th className="px-6 py-4">
                  Employee
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Check In
                </th>

                <th className="px-6 py-4">
                  Check Out
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-t"
                >
                  <td className="px-6 py-4 font-semibold">
                    {employee.name}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {employee.department}
                  </td>

                  <td className="px-6 py-4">
                    <AttendanceStatus
                      status={employee.attendance}
                    />
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {employee.checkIn}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {employee.checkOut}
                  </td>
                </tr>
              ))}
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
    [
      "Hariharan V",
      "IT",
      "₹36,000",
      "₹31,000",
    ],
    [
      "Arjun Kumar",
      "Engineering",
      "₹42,000",
      "₹36,500",
    ],
    [
      "Priya Sharma",
      "Design",
      "₹38,000",
      "₹33,200",
    ],
    [
      "Rahul Kumar",
      "Engineering",
      "₹40,000",
      "₹34,800",
    ],
    [
      "Sneha R",
      "HR",
      "₹32,000",
      "₹28,400",
    ],
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR ADMINISTRATION"
        title="HR Payroll"
        description="Review organization payroll processing."
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

      <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h3 className="font-bold">
              August 2026 Payroll
            </h3>

            <p className="text-sm text-slate-400">
              Salary processing overview
            </p>
          </div>

          <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Process Payroll
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase text-slate-400">
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
              {employees.map((employee) => (
                <tr
                  key={employee[0]}
                  className="border-t"
                >
                  <td className="px-6 py-5 font-semibold">
                    {employee[0]}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-500">
                    {employee[1]}
                  </td>

                  <td className="px-6 py-5 text-sm">
                    {employee[2]}
                  </td>

                  <td className="px-6 py-5 font-bold">
                    {employee[3]}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Processed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const total = employees.length;

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

  const pending = leaveRequests.filter(
    (request) =>
      request.status === "Pending",
  ).length;

  const attendanceRate = total
    ? Math.round((present / total) * 100)
    : 0;

  const risk =
    absent >= 2 || pending >= 3
      ? "High"
      : absent || pending
        ? "Medium"
        : "Low";

  const departments = Array.from(
    new Set(
      employees.map(
        (employee) => employee.department,
      ),
    ),
  );

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="HR INTELLIGENCE"
        title="HR Insights"
        description="Live workforce analytics and actionable insights for HR administrators."
      />

      <div
        className={`rounded-3xl border p-6 ${
          risk === "Low"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : risk === "Medium"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-red-200 bg-red-50 text-red-800"
        }`}
      >
        <div className="flex items-start gap-4">
          <AlertCircle />

          <div>
            <p className="text-xs font-bold uppercase">
              HR Risk Level
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              {risk}
            </h3>

            <p className="mt-1 text-sm">
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
          value={String(total)}
          description="Listed workforce"
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
          description={`${absent} absent today`}
        />

        <MetricCard
          icon={<Wallet size={20} />}
          label="Pending Leave"
          value={String(pending)}
          description="Awaiting review"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h3 className="font-bold">
            Attendance Overview
          </h3>

          <div className="mt-6 space-y-5">
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
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h3 className="font-bold">
            Department Snapshot
          </h3>

          <div className="mt-5 space-y-3">
            {departments.map((department) => {
              const list = employees.filter(
                (employee) =>
                  employee.department ===
                  department,
              );

              const departmentPresent =
                list.filter(
                  (employee) =>
                    employee.attendance ===
                    "Present",
                ).length;

              const rate = list.length
                ? Math.round(
                    (departmentPresent /
                      list.length) *
                      100,
                  )
                : 0;

              return (
                <div
                  key={department}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                >
                  <div>
                    <b>{department}</b>

                    <p className="text-xs text-slate-400">
                      {list.length} listed employees
                    </p>
                  </div>

                  <span className="font-bold text-indigo-600">
                    {rate}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
        <h3 className="font-bold">
          Attention Required
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {employees
            .filter(
              (employee) =>
                employee.attendance !==
                "Present",
            )
            .map((employee) => (
              <div
                key={employee.id}
                className="rounded-2xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <b>{employee.name}</b>

                  <AttendanceStatus
                    status={employee.attendance}
                  />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {employee.department} ·{" "}
                  {employee.role}
                </p>
              </div>
            ))}
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
  const [loggedIn, setLoggedIn] =
    useState(false);

  const [role, setRole] =
    useState<Role>("employee");

  const [activePage, setActivePage] =
    useState<Page>("Dashboard");

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
        leaveRequests={leaveRequests}
      />
    );
  } else if (activePage === "Employees") {
    pageContent = <EmployeesPage />;
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
        employees={HR_EMPLOYEES}
      />
    );
  } else if (activePage === "HR Payroll") {
    pageContent = <HRPayrollPage />;
  } else if (activePage === "HR Insights") {
    pageContent = (
      <HRInsightsPage
        employees={HR_EMPLOYEES}
        leaveRequests={leaveRequests}
      />
    );
  } else if (activePage === "Settings") {
    pageContent = <SettingsPage />;
  }

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