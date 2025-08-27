-- Creates an Apple Note titled "Human-centered AI Transformation"
-- and returns a confirmation string with the new note's id and name.

set noteTitle to "Human-centered AI Transformation"
set noteBody to ""
set noteBody to noteBody & "<h1>Human-centered AI Transformation</h1>" & linefeed
set noteBody to noteBody & "<p>Ein praxisnaher Ansatz, um KI verantwortungsvoll, nutzerzentriert und messbar in die Organisation zu integrieren.</p>" & linefeed

set noteBody to noteBody & "<h2>Warum</h2>" & linefeed
set noteBody to noteBody & "<ul>" & linefeed
set noteBody to noteBody & "<li>Wert schaffen: Probleme von Nutzer:innen zuerst, Technologie zweitens.</li>" & linefeed
set noteBody to noteBody & "<li>Risiken steuern: Sicherheit, Fairness, Transparenz, Datenschutz.</li>" & linefeed
set noteBody to noteBody & "<li>Effizienz heben: Arbeitsabläufe vereinfachen, Qualität steigern, Zeit sparen.</li>" & linefeed
set noteBody to noteBody & "</ul>" & linefeed

set noteBody to noteBody & "<h2>Prinzipien</h2>" & linefeed
set noteBody to noteBody & "<ol>" & linefeed
set noteBody to noteBody & "<li>Human-in-the-loop statt Autopilot.</li>" & linefeed
set noteBody to noteBody & "<li>Messbar vom ersten Experiment an.</li>" & linefeed
set noteBody to noteBody & "<li>Sicherheit und Compliance by design.</li>" & linefeed
set noteBody to noteBody & "<li>Kleine, inkrementelle Schritte (KISS).</li>" & linefeed
set noteBody to noteBody & "</ol>" & linefeed

set noteBody to noteBody & "<h2>Phasenplan</h2>" & linefeed
set noteBody to noteBody & "<h3>Phase 0 — Ausrichtung</h3>" & linefeed
set noteBody to noteBody & "<ul><li>Use-Case-Backlog, Ziele, Risiken, Leitplanken definieren.</li><li>Datenschutz/Legal/Security früh einbinden.</li></ul>" & linefeed
set noteBody to noteBody & "<h3>Phase 1 — Experimente</h3>" & linefeed
set noteBody to noteBody & "<ul><li>3–5 Quick Wins als Prototypen.</li><li>Metriken: Task-Zeit, Qualität, Zufriedenheit.</li></ul>" & linefeed
set noteBody to noteBody & "<h3>Phase 2 — Pilot</h3>" & linefeed
set noteBody to noteBody & "<ul><li>1–2 Piloten mit echten Nutzer:innen.</li><li>Governance: Prompt-Richtlinien, Logging, Freigaben.</li></ul>" & linefeed
set noteBody to noteBody & "<h3>Phase 3 — Skalierung</h3>" & linefeed
set noteBody to noteBody & "<ul><li>Integration in Prozesse/Tools, Schulung, Change-Management.</li><li>Kontinuierliche Verbesserung und Monitoring.</li></ul>" & linefeed

set noteBody to noteBody & "<h2>Rollen</h2>" & linefeed
set noteBody to noteBody & "<ul><li>Product Owner: Priorisierung, Erfolgsmessung.</li><li>UX/Research: Nutzerbedürfnisse, Tests.</li><li>Tech/ML: Architektur, Qualität, Sicherheit.</li><li>Legal/Security: Risiken, Compliance.</li></ul>" & linefeed

set noteBody to noteBody & "<h2>Metriken</h2>" & linefeed
set noteBody to noteBody & "<ul><li>Nutzwert: NPS/CSAT, Akzeptanz, Adoption.</li><li>Qualität: Genauigkeit, Halluzinationen, Fehlerquote.</li><li>Effizienz: Bearbeitungszeit, Automatisierungsgrad.</li><li>Risiken: Incidents, Policy-Verstöße.</li></ul>" & linefeed

set noteBody to noteBody & "<h2>Risiken & Gegenmaßnahmen</h2>" & linefeed
set noteBody to noteBody & "<ul><li>Datenschutz: Datenminimierung, Pseudonymisierung, DLP.</li><li>Bias: Evaluationssets, diverse Tests.</li><li>Halluzinationen: Retrieval, Validierung, Feedback-Loops.</li><li>Abhängigkeit: Vendor-Neutralität, Exit-Strategie.</li></ul>" & linefeed

set noteBody to noteBody & "<h2>Nächste Schritte (90 Tage)</h2>" & linefeed
set noteBody to noteBody & "<ul><li>Week 1–2: Governance-Leitfaden, Use-Case-Backlog.</li><li>Week 3–6: Prototypen + Messung.</li><li>Week 7–12: Pilot live, Schulung, Review.</li></ul>" & linefeed

tell application "Notes"
  set theAccount to first account
  set theFolder to first folder of theAccount
  set newNote to make new note at theFolder with properties {name:noteTitle, body:noteBody}
  return "CREATED:" & id of newNote & "|" & name of newNote
end tell

