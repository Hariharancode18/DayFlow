export type HREmployee = {
  id: string;
  name: string;
  department: string;
  role: string;
  attendance: "Present" | "Absent" | "On Leave";
  checkIn: string;
  checkOut: string;
};

export type HRRiskLevel =
  | "Low"
  | "Moderate"
  | "High"
  | "Critical";

export type HRRiskResult = HREmployee & {
  attendanceScore: number;
  riskScore: number;
  riskLevel: HRRiskLevel;
  reasons: string[];
};

/*
 * Convert the current attendance status
 * into a simple HR attendance score.
 */
export function getAttendanceScore(
  attendance: HREmployee["attendance"]
): number {
  switch (attendance) {
    case "Present":
      return 100;

    case "On Leave":
      return 80;

    case "Absent":
      return 40;

    default:
      return 0;
  }
}

/*
 * Calculate a workforce risk score
 * using only the data currently available.
 */
export function calculateRiskScore(
  employee: HREmployee
): HRRiskResult {
  const reasons: string[] = [];

  let riskScore = 0;

  const attendanceScore = getAttendanceScore(
    employee.attendance
  );

  /*
   * Attendance risk
   */
  if (employee.attendance === "Absent") {
    riskScore += 60;
    reasons.push("Absent today");
  }

  if (employee.attendance === "On Leave") {
    riskScore += 10;
    reasons.push("Currently on leave");
  }

  /*
   * Late check-in detection
   *
   * Normal expected check-in is around 9:00 AM.
   */
  if (
    employee.attendance === "Present" &&
    employee.checkIn !== "--:--"
  ) {
    const timeMatch = employee.checkIn.match(
      /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i
    );

    if (timeMatch) {
      let hour = Number(timeMatch[1]);
      const minute = Number(timeMatch[2]);
      const period = timeMatch[3].toUpperCase();

      if (period === "PM" && hour !== 12) {
        hour += 12;
      }

      if (period === "AM" && hour === 12) {
        hour = 0;
      }

      const totalMinutes =
        hour * 60 + minute;

      const expectedMinutes =
        9 * 60;

      if (
        totalMinutes >
        expectedMinutes + 10
      ) {
        riskScore += 20;

        reasons.push(
          `Late check-in at ${employee.checkIn}`
        );
      }
    }
  }

  /*
   * Role/department awareness
   */
  if (employee.department === "HR") {
    riskScore = Math.max(
      0,
      riskScore - 5
    );
  }

  /*
   * Keep score between 0 and 100.
   */
  riskScore = Math.min(
    100,
    Math.max(0, riskScore)
  );

  let riskLevel: HRRiskLevel;

  if (riskScore >= 81) {
    riskLevel = "Critical";
  } else if (riskScore >= 61) {
    riskLevel = "High";
  } else if (riskScore >= 31) {
    riskLevel = "Moderate";
  } else {
    riskLevel = "Low";
  }

  /*
   * If no issue exists, give a positive explanation.
   */
  if (reasons.length === 0) {
    reasons.push("No immediate attendance risk");
  }

  return {
    ...employee,
    attendanceScore,
    riskScore,
    riskLevel,
    reasons,
  };
}

/*
 * Analyze every employee.
 */
export function analyzeEmployees(
  employees: HREmployee[]
): HRRiskResult[] {
  return employees
    .map(calculateRiskScore)
    .sort(
      (a, b) =>
        b.riskScore - a.riskScore
    );
}

/*
 * Calculate workforce statistics.
 */
export function getHRStats(
  employees: HREmployee[]
) {
  const totalEmployees =
    employees.length;

  const present =
    employees.filter(
      (employee) =>
        employee.attendance === "Present"
    ).length;

  const absent =
    employees.filter(
      (employee) =>
        employee.attendance === "Absent"
    ).length;

  const onLeave =
    employees.filter(
      (employee) =>
        employee.attendance === "On Leave"
    ).length;

  const attendanceRate =
    totalEmployees === 0
      ? 0
      : Math.round(
          (present / totalEmployees) *
            100
        );

  const lateCheckIns =
    employees.filter((employee) => {
      if (
        employee.attendance !==
          "Present" ||
        employee.checkIn === "--:--"
      ) {
        return false;
      }

      const match =
        employee.checkIn.match(
          /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i
        );

      if (!match) {
        return false;
      }

      let hour = Number(match[1]);
      const minute = Number(match[2]);
      const period =
        match[3].toUpperCase();

      if (
        period === "PM" &&
        hour !== 12
      ) {
        hour += 12;
      }

      if (
        period === "AM" &&
        hour === 12
      ) {
        hour = 0;
      }

      const checkInMinutes =
        hour * 60 + minute;

      return (
        checkInMinutes >
        9 * 60 + 10
      );
    }).length;

  const highRiskEmployees =
    employees.filter(
      (employee) =>
        calculateRiskScore(employee)
          .riskScore >= 61
    ).length;

  return {
    totalEmployees,
    present,
    absent,
    onLeave,
    attendanceRate,
    lateCheckIns,
    highRiskEmployees,
  };
}

/*
 * Generate an HR recommendation.
 */
export function generateHRRecommendation(
  employees: HREmployee[]
): string {
  const stats =
    getHRStats(employees);

  if (stats.highRiskEmployees > 0) {
    return (
      `${stats.highRiskEmployees} employee${
        stats.highRiskEmployees > 1
          ? "s"
          : ""
      } require HR attention based on today's attendance data.`
    );
  }

  if (stats.lateCheckIns > 0) {
    return (
      `${stats.lateCheckIns} employee${
        stats.lateCheckIns > 1
          ? "s"
          : ""
      } checked in late today.`
    );
  }

  if (stats.absent > 0) {
    return (
      `${stats.absent} employee${
        stats.absent > 1
          ? "s"
          : ""
      } are absent today.`
    );
  }

  return (
    "Workforce attendance looks healthy today. No immediate attendance action is required."
  );
}