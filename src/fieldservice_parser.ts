export type DispatchStatus = "ready" | "needs-follow-up";

export type TechnicianRecord = {
  name: string;
  skills: string[];
  dispatchStatus: DispatchStatus;
  followUp: string;
};

export function parseTechnicianRecord(text: string): TechnicianRecord {
  const line = (label: string) => text.match(new RegExp(`^${label}\\s*:\\s*(.+)$`, "im"))?.[1]?.trim() ?? "";
  const name = line("Name") || "Unknown technician";
  const skills = (line("Skills") || "").split(",").map((item) => item.trim()).filter(Boolean);
  const rawStatus = line("Dispatch status").toLowerCase();
  const dispatchStatus: DispatchStatus = rawStatus === "ready" ? "ready" : "needs-follow-up";
  const followUp = line("Follow-up") || (dispatchStatus === "ready" ? "Confirm arrival window" : "Call technician to confirm availability");
  return { name, skills, dispatchStatus, followUp };
}
