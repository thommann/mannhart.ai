import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import translations from "../src/_data/translations.js";
import { stripHtml, SKILL_LEVELS } from "../src/_data/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "src", "assets", "pdf", "Thomas_Mannhart_CV.pdf");

const ACCENT = [180, 140, 95]; // warm bronze
const BLACK = [30, 28, 35];
const GRAY = [100, 96, 108];
const RULE = [200, 195, 205];

const t = translations.en;
const levels = SKILL_LEVELS.en;

// --- Build CV data from translations ---

function buildJobs() {
  return t.experience.jobs.map((j) => ({
    date: j.date.replace("now", "present"),
    role: j.role,
    company: `${j.company}, ${j.location.replace(/, Switzerland| Schweiz/g, "")}`,
    desc: j.desc,
    tech: j.tech.join(", "),
  }));
}

function buildEducation() {
  return t.education.items
    .slice()
    .reverse()
    .map((e) => {
      const detail = stripHtml(e.detail);
      // Extract thesis info: everything after "Thesis: " or "Bachelorarbeit: " etc.
      const thesisMatch = detail.match(/Thesis:\s*(.+)/);
      let line = thesisMatch ? `Thesis: ${thesisMatch[1]}` : detail;
      if (e.award) line += ` ${e.award.label}.`;
      return {
        year: e.year,
        degree: `${e.degree} (${e.specialization})`,
        school: e.school,
        detail: line,
      };
    });
}

function buildSkills() {
  const groups = t.skills.groups.map((g) => {
    const items = g.items
      .map((s) => {
        const level = levels[s.level];
        return level ? `${s.name} (${level})` : s.name;
      })
      .join(", ");
    return { category: g.name === "Languages" ? "Programming" : g.name, items };
  });
  // Natural languages (not in skills.groups)
  groups.push({
    category: "Languages",
    items: `${t.about.languages}, French (fluent)`,
  });
  return groups;
}

function buildTalks() {
  return [
    { title: stripHtml(t.featured.webinar.title), desc: stripHtml(t.featured.webinar.desc) },
    { title: stripHtml(t.featured.fhnw.title), desc: stripHtml(t.featured.fhnw.desc) },
    { title: stripHtml(t.featured.aiHub.title), desc: stripHtml(t.featured.aiHub.desc) },
  ];
}

// --- PDF layout helpers ---

function drawRule(doc, y) {
  doc
    .moveTo(50, y)
    .lineTo(545, y)
    .strokeColor(RULE)
    .lineWidth(0.5)
    .stroke();
}

function sectionTitle(doc, title) {
  doc
    .fontSize(11)
    .fillColor(ACCENT)
    .font("Helvetica-Bold")
    .text(title.toUpperCase(), { continued: false });
  drawRule(doc, doc.y + 2);
  doc.moveDown(0.4);
}

// --- Generate PDF ---

function main() {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 45, bottom: 45, left: 50, right: 50 },
  });

  doc.pipe(createWriteStream(OUTPUT));

  // --- Header ---
  doc
    .fontSize(26)
    .font("Helvetica-Bold")
    .fillColor(BLACK)
    .text("Thomas Rolf Mannhart", { align: "left" });

  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor(ACCENT)
    .text("Professional AI Engineer", { align: "left" });

  doc.moveDown(0.3);
  doc
    .fontSize(8.5)
    .font("Helvetica")
    .fillColor(GRAY)
    .text(
      "Zürich, Switzerland  ·  thomas@mannhart.ai  ·  github.com/thommann  ·  t.mannhart.ai",
      { align: "left" }
    );

  doc.moveDown(0.8);
  drawRule(doc, doc.y);
  doc.moveDown(0.6);

  // --- Summary ---
  sectionTitle(doc, "Summary");
  doc
    .fontSize(9.5)
    .font("Helvetica")
    .fillColor(BLACK)
    .text(
      stripHtml(t.about.abstract),
      { lineGap: 2.5 }
    );
  doc.moveDown(0.7);

  // --- Experience ---
  sectionTitle(doc, "Experience");

  for (const job of buildJobs()) {
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(GRAY)
      .text(job.date, { continued: false });
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(job.role, { continued: true })
      .font("Helvetica")
      .fillColor(GRAY)
      .text("  —  " + job.company);
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(BLACK)
      .text(job.desc, { lineGap: 1.5 });
    doc
      .fontSize(8)
      .font("Helvetica-Oblique")
      .fillColor(GRAY)
      .text(job.tech);
    doc.moveDown(0.5);
  }

  // --- Education ---
  sectionTitle(doc, "Education");

  for (const edu of buildEducation()) {
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(GRAY)
      .text(edu.year, { continued: false });
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(edu.degree, { continued: true })
      .font("Helvetica")
      .fillColor(GRAY)
      .text("  —  " + edu.school);
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(BLACK)
      .text(edu.detail, { lineGap: 1.5 });
    doc.moveDown(0.4);
  }

  // --- Skills ---
  sectionTitle(doc, "Skills");

  for (const skill of buildSkills()) {
    doc
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(skill.category + ":  ", { continued: true })
      .font("Helvetica")
      .fillColor(GRAY)
      .text(skill.items);
  }
  doc.moveDown(0.7);

  // --- Talks & Projects ---
  sectionTitle(doc, "Talks & Projects");

  for (const talk of buildTalks()) {
    doc
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(talk.title, { continued: true })
      .font("Helvetica")
      .fillColor(GRAY)
      .text("  —  " + talk.desc);
    doc.moveDown(0.2);
  }

  // --- Finalize ---
  doc.end();
  console.log("CV generated:", OUTPUT);
}

main();
