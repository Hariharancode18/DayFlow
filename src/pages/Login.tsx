import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock3,
} from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = onLogin(email, password);

    if (!success) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const fillEmployee = () => {
    setEmail("employee@dayflow.com");
    setPassword("employee123");
    setError("");
  };

  const fillHR = () => {
    setEmail("admin@dayflow.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-[52%] bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center">
                <span className="text-xl font-black text-slate-950">
                  D
                </span>
              </div>

              <span className="text-2xl font-bold tracking-tight">
                DayFlow
              </span>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 mb-7">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Every workday, perfectly aligned.
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
              Your workplace,
              <br />
              <span className="text-slate-400">
                beautifully organized.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400 max-w-lg">
              Manage people, attendance, leave and payroll from one
              simple HR workspace.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <Feature
                icon={<Users size={18} />}
                title="People"
                text="Employee management"
              />

              <Feature
                icon={<Clock3 size={18} />}
                title="Attendance"
                text="Track every workday"
              />

              <Feature
                icon={<ShieldCheck size={18} />}
                title="Secure"
                text="Role-based access"
              />
            </div>
          </div>

          <p className="text-sm text-slate-500">
            DayFlow HRMS • Hackathon Edition
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black">
              D
            </div>
            <span className="text-2xl font-bold text-slate-950">
              DayFlow
            </span>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600 mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold text-slate-950">
              Sign in to DayFlow
            </h2>

            <p className="mt-2 text-slate-500">
              Access your workplace dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.99]"
            >
              Sign in
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-900">
                Quick Demo Access
              </p>

              <span className="text-xs rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">
                Hackathon
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillEmployee}
                className="rounded-xl border border-slate-200 px-3 py-3 text-left hover:border-indigo-300 hover:bg-indigo-50 transition"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Employee
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  employee@dayflow.com
                </p>
              </button>

              <button
                type="button"
                onClick={fillHR}
                className="rounded-xl border border-slate-200 px-3 py-3 text-left hover:border-indigo-300 hover:bg-indigo-50 transition"
              >
                <p className="text-sm font-semibold text-slate-900">
                  HR Admin
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  admin@dayflow.com
                </p>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            © 2026 DayFlow. Human Resource Management System.
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-slate-300 mb-3">{icon}</div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}