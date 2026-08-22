import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Users,
  UserX,
  CalendarDays,
  ShieldAlert,
} from "lucide-react";

import {
  analyzeEmployees,
  generateHRRecommendation,
  getHRStats,
  type HREmployee,
} from "../utils/hrAnalytics";

type HRInsightsProps = {
  employees: HREmployee[];
};

export default function HRInsights({
  employees,
}: HRInsightsProps) {
  const stats = getHRStats(employees);

  const analyzedEmployees =
    analyzeEmployees(employees);

  const recommendation =
    generateHRRecommendation(employees);

  const attentionEmployees =
    analyzedEmployees.filter(
      (employee) => employee.riskScore >= 31
    );

  const getRiskClasses = (
    level: string
  ) => {
    switch (level) {
      case "Critical":
        return {
          badge:
            "bg-red-100 text-red-700 border-red-200",
          bar: "bg-red-500",
          icon: "text-red-600",
        };

      case "High":
        return {
          badge:
            "bg-orange-100 text-orange-700 border-orange-200",
          bar: "bg-orange-500",
          icon: "text-orange-600",
        };

      case "Moderate":
        return {
          badge:
            "bg-amber-100 text-amber-700 border-amber-200",
          bar: "bg-amber-500",
          icon: "text-amber-600",
        };

      default:
        return {
          badge:
            "bg-emerald-100 text-emerald-700 border-emerald-200",
          bar: "bg-emerald-500",
          icon: "text-emerald-600",
        };
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <ShieldAlert
                size={18}
                className="text-indigo-600"
              />
            </div>

            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              AI HR Intelligence
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Workforce Insights
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Monitor workforce attendance, identify potential
            HR risks, and get AI-powered recommendations.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-slate-400">
            Workforce status
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="text-sm font-semibold text-slate-800">
              Live HR Data
            </span>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle="Active workforce"
          icon={<Users size={20} />}
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Present Today"
          value={stats.present}
          subtitle={`${stats.attendanceRate}% attendance rate`}
          icon={<CheckCircle2 size={20} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="On Leave"
          value={stats.onLeave}
          subtitle="Employees on leave"
          icon={<CalendarDays size={20} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Needs Attention"
          value={stats.highRiskEmployees}
          subtitle={`${stats.lateCheckIns} late check-in${
            stats.lateCheckIns === 1 ? "" : "s"
          }`}
          icon={<AlertTriangle size={20} />}
          iconClass="bg-orange-50 text-orange-600"
        />
      </div>

      {/* ATTENDANCE OVERVIEW */}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-950">
                Attendance Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Today's workforce attendance distribution
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Clock3
                size={19}
                className="text-slate-600"
              />
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Attendance rate
              </span>

              <span className="text-lg font-bold text-slate-950">
                {stats.attendanceRate}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{
                  width: `${stats.attendanceRate}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <MiniStat
              label="Present"
              value={stats.present}
              className="text-emerald-600"
            />

            <MiniStat
              label="On Leave"
              value={stats.onLeave}
              className="text-blue-600"
            />

            <MiniStat
              label="Absent"
              value={stats.absent}
              className="text-red-600"
            />
          </div>
        </div>

        {/* AI RECOMMENDATION */}

        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500">
              ✨
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                DayFlow AI
              </p>

              <h2 className="font-bold">
                HR Recommendation
              </h2>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-sm leading-7 text-slate-300">
              {recommendation}
            </p>
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight
                size={16}
                className="text-indigo-300"
              />

              <span className="text-xs font-semibold text-indigo-200">
                Suggested action
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Review employees requiring attention and
              investigate attendance exceptions.
            </p>
          </div>
        </div>
      </div>

      {/* EMPLOYEE RISK */}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-950">
              Employee Risk Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-generated workforce risk based on today's
              attendance signals.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ShieldAlert size={15} />
            Risk engine active
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {analyzedEmployees.map((employee) => {
            const styles = getRiskClasses(
              employee.riskLevel
            );

            return (
              <div
                key={employee.id}
                className="p-5 transition hover:bg-slate-50"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  {/* EMPLOYEE */}

                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-700">
                      {employee.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">
                        {employee.name}
                      </h3>

                      <p className="truncate text-xs text-slate-500">
                        {employee.role} ·{" "}
                        {employee.department}
                      </p>
                    </div>
                  </div>

                  {/* ATTENDANCE */}

                  <div className="w-full lg:w-52">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Attendance
                      </span>

                      <span className="text-xs font-bold text-slate-800">
                        {employee.attendanceScore}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${employee.attendanceScore}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* RISK */}

                  <div className="w-full lg:w-52">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Risk score
                      </span>

                      <span className="text-xs font-bold text-slate-800">
                        {employee.riskScore}/100
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${styles.bar}`}
                        style={{
                          width: `${employee.riskScore}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* BADGE */}

                  <div
                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${styles.badge}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${styles.bar}`}
                    />

                    {employee.riskLevel}
                  </div>
                </div>

                {/* REASONS */}

                <div className="mt-4 ml-0 flex flex-wrap gap-2 lg:ml-15">
                  {employee.reasons.map(
                    (reason) => (
                      <span
                        key={reason}
                        className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
                      >
                        {reason}
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ATTENTION PANEL */}

      {attentionEmployees.length > 0 && (
        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100">
              <UserX
                size={20}
                className="text-orange-600"
              />
            </div>

            <div>
              <h2 className="font-bold text-orange-950">
                HR Attention Required
              </h2>

              <p className="mt-1 text-sm leading-6 text-orange-800">
                {attentionEmployees.length} employee
                {attentionEmployees.length === 1
                  ? ""
                  : "s"} currently have attendance
                signals that may require HR review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- */
/* REUSABLE COMPONENTS              */
/* -------------------------------- */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-bold ${className}`}
      >
        {value}
      </p>
    </div>
  );
}