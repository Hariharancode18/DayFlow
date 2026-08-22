import { useMemo, useState } from "react";

type LeaveRequest = {
  id: number;
  employee: string;
  employeeId: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

type AIHRAssistantProps = {
  leaveRequests: LeaveRequest[];
  checkedIn: boolean;
  checkInTime: string;
  checkOutTime: string;
};

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

type ActionRequest = {
  id: number;
  action: "approve" | "reject";
};

export default function AIHRAssistant({
  leaveRequests,
  checkedIn,
  checkInTime,
  checkOutTime,
}: AIHRAssistantProps) {
  const [question, setQuestion] = useState("");

  /*
   * Local copy allows the AI demo to perform actions immediately.
   * Your original leaveRequests prop remains untouched.
   */
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text:
        "Hi! I'm DayFlow AI 👋 Ask me about attendance, leave requests, employees, departments, payroll, or today's HR summary.",
    },
  ]);

  const [actionRequest, setActionRequest] =
    useState<ActionRequest | null>(null);

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "Pending"
      ),
    [requests]
  );

  const approvedRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "Approved"
      ),
    [requests]
  );

  const rejectedRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "Rejected"
      ),
    [requests]
  );

  /*
   * Find an employee from a question.
   */
  const findEmployeeRequest = (query: string) => {
    const normalizedQuery = query.toLowerCase();

    return pendingRequests.find((request) => {
      const employeeName = request.employee.toLowerCase();

      const nameParts = employeeName
        .split(" ")
        .filter(Boolean);

      const fullNameMatch =
        normalizedQuery.includes(employeeName);

      const firstNameMatch =
        nameParts.length > 0 &&
        normalizedQuery.includes(nameParts[0]);

      return fullNameMatch || firstNameMatch;
    });
  };

  /*
   * Detect approval/rejection commands.
   */
  const isApprovalCommand = (query: string) => {
    return (
      query.includes("approve") &&
      (query.includes("leave") ||
        query.includes("request"))
    );
  };

  const isRejectCommand = (query: string) => {
    return (
      (query.includes("reject") ||
        query.includes("decline")) &&
      (query.includes("leave") ||
        query.includes("request"))
    );
  };

  /*
   * Generate AI response.
   */
  const generateResponse = (input: string) => {
    const query = input.toLowerCase().trim();

    if (!query) {
      return "Please enter a question.";
    }

    /*
     * APPROVE LEAVE COMMAND
     */
    if (isApprovalCommand(query)) {
      const request = findEmployeeRequest(query);

      if (!request) {
        return (
          "I couldn't find a pending leave request for that employee.\n\n" +
          `Current pending requests: ${
            pendingRequests.length
          }`
        );
      }

      setActionRequest({
        id: request.id,
        action: "approve",
      });

      return (
        `I found ${request.employee}'s pending leave request.\n\n` +
        `Leave type: ${request.type}\n` +
        `From: ${request.from}\n` +
        `To: ${request.to}\n` +
        `Reason: ${request.reason}\n\n` +
        `Would you like to approve this request?`
      );
    }

    /*
     * REJECT LEAVE COMMAND
     */
    if (isRejectCommand(query)) {
      const request = findEmployeeRequest(query);

      if (!request) {
        return (
          "I couldn't find a pending leave request for that employee.\n\n" +
          `Current pending requests: ${
            pendingRequests.length
          }`
        );
      }

      setActionRequest({
        id: request.id,
        action: "reject",
      });

      return (
        `I found ${request.employee}'s pending leave request.\n\n` +
        `Leave type: ${request.type}\n` +
        `From: ${request.from}\n` +
        `To: ${request.to}\n` +
        `Reason: ${request.reason}\n\n` +
        `Would you like to reject this request?`
      );
    }

    /*
     * GREETING
     */
    if (
      query === "hi" ||
      query === "hello" ||
      query.includes("hey dayflow")
    ) {
      return (
        "Hello! 👋 I'm DayFlow AI. I can help you understand " +
        "attendance, leave, employees, payroll, and HR activity."
      );
    }

    /*
     * HELP
     */
    if (
      query.includes("help") ||
      query.includes("what can you do") ||
      query.includes("features")
    ) {
      return (
        "I can help with:\n\n" +
        "• Leave requests\n" +
        "• Approve or reject leave\n" +
        "• Attendance\n" +
        "• Employee information\n" +
        "• Department information\n" +
        "• Payroll\n" +
        "• HR summaries\n\n" +
        'Try asking: "Approve Arjun\'s leave."'
      );
    }

    /*
     * HR SUMMARY
     */
    if (
      query.includes("summary") ||
      query.includes("overview") ||
      query.includes("hr report") ||
      query.includes("today's report") ||
      query.includes("today report")
    ) {
      const attendanceStatus = checkedIn
        ? `You are currently checked in at ${
            checkInTime || "the recorded time"
          }.`
        : checkOutTime
        ? `Your attendance is completed for today.`
        : `Your attendance has not been marked yet.`;

      return (
        `📊 DayFlow HR Summary\n\n` +
        `Employees: 48\n` +
        `Pending leave: ${pendingRequests.length}\n` +
        `Approved leave: ${approvedRequests.length}\n` +
        `Rejected leave: ${rejectedRequests.length}\n\n` +
        `${attendanceStatus}\n\n` +
        `The HR dashboard can be used for detailed employee, attendance, leave, and payroll management.`
      );
    }

    /*
     * PENDING LEAVE
     */
    if (
      query.includes("pending") &&
      query.includes("leave")
    ) {
      if (pendingRequests.length === 0) {
        return "There are currently no pending leave requests. ✅";
      }

      const names = pendingRequests
        .map((request) => request.employee)
        .join(", ");

      return (
        `There ${
          pendingRequests.length === 1 ? "is" : "are"
        } ${pendingRequests.length} pending leave request${
          pendingRequests.length > 1 ? "s" : ""
        }.\n\nEmployees: ${names}`
      );
    }

    /*
     * APPROVED LEAVE
     */
    if (
      query.includes("approved") &&
      query.includes("leave")
    ) {
      if (approvedRequests.length === 0) {
        return "There are no approved leave requests yet.";
      }

      const names = approvedRequests
        .map((request) => request.employee)
        .join(", ");

      return (
        `${approvedRequests.length} leave request${
          approvedRequests.length > 1 ? "s are" : " is"
        } approved.\n\nEmployees: ${names}`
      );
    }

    /*
     * REJECTED LEAVE
     */
    if (
      query.includes("rejected") &&
      query.includes("leave")
    ) {
      if (rejectedRequests.length === 0) {
        return "There are no rejected leave requests.";
      }

      const names = rejectedRequests
        .map((request) => request.employee)
        .join(", ");

      return (
        `${rejectedRequests.length} leave request${
          rejectedRequests.length > 1 ? "s are" : " is"
        } rejected.\n\nEmployees: ${names}`
      );
    }

    /*
     * TOTAL LEAVE
     */
    if (
      query.includes("how many") &&
      query.includes("leave")
    ) {
      return (
        `DayFlow currently has ${requests.length} total leave request${
          requests.length !== 1 ? "s" : ""
        }.\n\n` +
        `Pending: ${pendingRequests.length}\n` +
        `Approved: ${approvedRequests.length}\n` +
        `Rejected: ${rejectedRequests.length}`
      );
    }

    /*
     * LEAVE BALANCE
     */
    if (
      query.includes("leave balance") ||
      query.includes("remaining leave") ||
      query.includes("how many leave days")
    ) {
      return "Your current demo leave balance is 8 days.";
    }

    /*
     * WHO IS ON LEAVE
     */
    if (
      query.includes("who") &&
      (query.includes("on leave") ||
        query.includes("taking leave") ||
        query.includes("absent because of leave"))
    ) {
      if (approvedRequests.length === 0) {
        return "I don't currently have any approved leave records.";
      }

      const names = approvedRequests
        .map((request) => request.employee)
        .join(", ");

      return `Employees with approved leave include: ${names}.`;
    }

    /*
     * ATTENDANCE
     */
    if (
      query.includes("attendance") &&
      (query.includes("my") ||
        query.includes("hariharan") ||
        query.includes("today"))
    ) {
      if (checkedIn) {
        return (
          `Today's attendance is active. 🟢\n\n` +
          `Check-in: ${checkInTime || "Recorded"}\n` +
          `Status: Currently working`
        );
      }

      if (checkOutTime) {
        return (
          `Today's attendance is completed. ✅\n\n` +
          `Check-in: ${checkInTime || "--:--"}\n` +
          `Check-out: ${checkOutTime}`
        );
      }

      return "No attendance has been marked for today yet.";
    }

    /*
     * CHECK-IN
     */
    if (
      query.includes("check in") ||
      query.includes("checked in") ||
      query.includes("working now")
    ) {
      if (checkedIn) {
        return (
          `You are currently checked in. 🟢\n\n` +
          `Check-in time: ${checkInTime || "Recorded"}`
        );
      }

      if (checkOutTime) {
        return (
          `You are not currently checked in.\n\n` +
          `Today's attendance has already been completed.`
        );
      }

      return "You are currently not checked in.";
    }

    /*
     * CHECK-OUT
     */
    if (
      query.includes("check out") ||
      query.includes("checked out")
    ) {
      if (checkOutTime) {
        return `You checked out today at ${checkOutTime}. Your attendance is completed. ✅`;
      }

      if (checkedIn) {
        return "You are currently checked in and have not checked out yet.";
      }

      return "No check-out has been recorded for today.";
    }

    /*
     * EMPLOYEE COUNT
     */
    if (
      query.includes("employee count") ||
      query.includes("number of employees") ||
      (query.includes("how many") &&
        query.includes("employees"))
    ) {
      return "DayFlow currently has 48 employees in the organization.";
    }

    /*
     * PRESENT EMPLOYEES
     */
    if (
      query.includes("present employees") ||
      query.includes("who is present") ||
      query.includes("who are present")
    ) {
      return "The demo organization currently has 41 employees marked present today.";
    }

    /*
     * ABSENT EMPLOYEES
     */
    if (
      query.includes("absent employees") ||
      query.includes("who is absent") ||
      query.includes("who are absent")
    ) {
      return "The demo organization currently has employees who are not marked present today. HR can open Attendance for the complete employee-level breakdown.";
    }

    /*
     * DEPARTMENT
     */
    if (
      query.includes("engineering") ||
      query.includes("engineers")
    ) {
      return (
        "The Engineering department currently includes Arjun Kumar and Rahul Kumar in the demo dataset."
      );
    }

    if (
      query.includes("department") ||
      query.includes("departments")
    ) {
      return (
        "DayFlow supports department-level HR management. The current demo includes Engineering and other organizational teams."
      );
    }

    /*
     * PAYROLL
     */
    if (
      query.includes("payroll") ||
      query.includes("salary") ||
      query.includes("salary details") ||
      query.includes("net salary")
    ) {
      return (
        "Your current demo net salary is ₹31,000 per month.\n\n" +
        "HR can view organization payroll and salary structures from the HR Payroll section."
      );
    }

    /*
     * SALARY SLIP
     */
    if (
      query.includes("salary slip") ||
      query.includes("payslip")
    ) {
      return (
        "Your salary slip is available through the Payroll section. " +
        "The employee payroll view is read-only."
      );
    }

    /*
     * LEAVE TYPE
     */
    if (
      query.includes("leave type") ||
      query.includes("types of leave")
    ) {
      return (
        "DayFlow supports Paid Leave, Sick Leave, and Unpaid Leave."
      );
    }

    /*
     * PENDING REQUEST COUNT
     */
    if (
      query.includes("pending request") ||
      query.includes("pending approval")
    ) {
      return `There are currently ${pendingRequests.length} pending leave request${
        pendingRequests.length !== 1 ? "s" : ""
      } requiring attention.`;
    }

    /*
     * MANAGEMENT INSIGHT
     */
    if (
      query.includes("insight") ||
      query.includes("analytics") ||
      query.includes("analysis")
    ) {
      return (
        `📈 HR Insight\n\n` +
        `• Employees: 48\n` +
        `• Present today: 41\n` +
        `• On leave: 5\n` +
        `• Pending requests: ${pendingRequests.length}\n\n` +
        `HR should review pending leave requests and attendance exceptions first.`
      );
    }

    /*
     * THANK YOU
     */
    if (
      query.includes("thank") ||
      query.includes("thanks")
    ) {
      return "You're welcome! 😊 I'm here whenever you need HR information.";
    }

    /*
     * FALLBACK
     */
    return (
      "I couldn't find a direct answer for that yet.\n\n" +
      "Try asking:\n" +
      "• Who has pending leave?\n" +
      "• Approve Arjun's leave\n" +
      "• Reject Priya's leave\n" +
      "• How many employees are there?\n" +
      "• What is my attendance today?\n" +
      "• Who is on leave?\n" +
      "• What is my salary?\n" +
      "• Give me today's HR summary."
    );
  };

  /*
   * Perform leave action.
   */
  const performLeaveAction = (
    requestId: number,
    action: "approve" | "reject"
  ) => {
    const request = requests.find(
      (item) => item.id === requestId
    );

    if (!request) {
      return;
    }

    const newStatus =
      action === "approve"
        ? "Approved"
        : "Rejected";

    setRequests((current) =>
      current.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    const actionText =
      action === "approve"
        ? "approved"
        : "rejected";

    const message: Message = {
      id: Date.now(),
      sender: "ai",
      text:
        `✅ Leave request ${actionText} successfully.\n\n` +
        `${request.employee}'s ${request.type} request ` +
        `from ${request.from} to ${request.to} ` +
        `is now ${newStatus}.`,
    };

    setMessages((current) => [
      ...current,
      message,
    ]);

    setActionRequest(null);
  };

  /*
   * Ask AI
   */
  const askQuestion = (text?: string) => {
    const finalQuestion = (text ?? question).trim();

    if (!finalQuestion) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: finalQuestion,
    };

    const answer = generateResponse(finalQuestion);

    const aiMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: answer,
    };

    setMessages((current) => [
      ...current,
      userMessage,
      aiMessage,
    ]);

    setQuestion("");
  };

  const suggestions = [
    "Give me today's HR summary",
    "Who has pending leave?",
    "Approve Arjun's leave",
    "Reject Priya's leave",
    "Who is on leave?",
    "What is my attendance today?",
    "How many employees?",
    "What is my salary?",
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* PAGE HEADER */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">
          AI HR COPILOT
        </p>

        <h2 className="mt-1 text-3xl font-bold text-slate-950">
          DayFlow AI Assistant
        </h2>

        <p className="mt-2 text-slate-500">
          Ask questions about your HR workspace using natural language.
        </p>
      </div>

      {/* AI CARD */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* HEADER */}

        <div className="flex items-center gap-4 border-b border-white/10 bg-slate-950 p-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-xl">
            ✨
          </div>

          <div>
            <h3 className="font-bold">
              DayFlow AI
            </h3>

            <p className="text-xs text-slate-400">
              HR Intelligence Assistant
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

            <span className="text-xs text-slate-400">
              Online
            </span>
          </div>
        </div>

        {/* CHAT */}

        <div className="min-h-[430px] max-h-[520px] space-y-4 overflow-y-auto bg-slate-50 p-5">
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
                className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${
                  message.sender === "user"
                    ? "rounded-br-md bg-indigo-600 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.sender === "ai" && (
                  <p className="mb-1 text-xs font-semibold text-indigo-600">
                    DayFlow AI
                  </p>
                )}

                {message.text}
              </div>
            </div>
          ))}

          {/* ACTION CARD */}

          {actionRequest && (
            <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-slate-800">
                HR Action Required
              </p>

              <p className="mb-4 text-xs text-slate-500">
                Confirm the requested leave action.
              </p>

              <div className="flex flex-wrap gap-2">
                {actionRequest.action === "approve" && (
                  <button
                    type="button"
                    onClick={() =>
                      performLeaveAction(
                        actionRequest.id,
                        "approve"
                      )
                    }
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    ✓ Approve Leave
                  </button>
                )}

                {actionRequest.action === "reject" && (
                  <button
                    type="button"
                    onClick={() =>
                      performLeaveAction(
                        actionRequest.id,
                        "reject"
                      )
                    }
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    ✕ Reject Leave
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActionRequest(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}

        <div className="border-t border-slate-100 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quick Questions
          </p>

          <div className="mb-5 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => askQuestion(suggestion)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  askQuestion();
                }
              }}
              placeholder="Ask DayFlow AI anything..."
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={() => askQuestion()}
              className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}