import fs from "fs";
import path from "path";

const casesPath = path.join(process.cwd(), "data", "cases.json");

// Load cases from file
function loadCases() {
  if (!fs.existsSync(casesPath)) {
    fs.writeFileSync(casesPath, "[]");
  }
  const file = fs.readFileSync(casesPath, "utf8");
  return JSON.parse(file);
}

// Save cases back into file
function saveCases(data) {
  fs.writeFileSync(casesPath, JSON.stringify(data, null, 2));
}

export function createCase({ userId, modId, type, reason, hidden = false }) {
  const cases = loadCases();
  const newCase = {
    caseId: cases.length + 1,
    userId,
    modId,
    type,
    reason,
    hidden,
    timestamp: Date.now(),
  };

  cases.push(newCase);
  saveCases(cases);

  return newCase;
}

export function getCase(id) {
  const cases = loadCases();
  return cases.find(x => x.caseId === id);
}

export function getCasesForUser(userId) {
  const cases = loadCases();
  return cases.filter(x => x.userId === userId);
}

export function deleteCase(id) {
  const cases = loadCases();
  const filtered = cases.filter(c => c.caseId !== id);
  saveCases(filtered);
}

export function updateCase(id, newData) {
  const cases = loadCases();
  const index = cases.findIndex(c => c.caseId === id);
  if (index === -1) return null;

  cases[index] = { ...cases[index], ...newData };
  saveCases(cases);

  return cases[index];
}

export function hideCase(id) {
  return updateCase(id, { hidden: true });
}

export function unhideCase(id) {
  return updateCase(id, { hidden: false });
}

export function getAllCases() {
  return loadCases();
}