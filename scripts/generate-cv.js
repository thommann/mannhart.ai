import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "src", "assets", "pdf", "Thomas_Mannhart_CV.pdf");

const ACCENT = [180, 140, 95]; // warm bronze
const BLACK = [30, 28, 35];
const GRAY = [100, 96, 108];
const RULE = [200, 195, 205];

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
      "Professional AI Engineer at bbv Software Services in Zürich, building the bbv AI Hub — a Swiss-made, model-agnostic enterprise AI platform. I architect and implement customized AI solutions (especially RAG systems) for enterprise customers, lead AI projects as Dev Lead, and consult on IT and AI strategy. MSc and BSc in Informatics from the University of Zürich with AI specialization. Shipping software professionally since 2019 — from biomedical Java apps to full-stack web platforms to LLM-powered agentic systems.",
      { lineGap: 2.5 }
    );
  doc.moveDown(0.7);

  // --- Experience ---
  sectionTitle(doc, "Experience");

  const jobs = [
    {
      date: "2025 — present",
      role: "Professional AI Engineer",
      company: "bbv Software Services AG, Zürich",
      desc: "Development of a comprehensive enterprise AI platform (bbv AI Hub), including architecture design with the software architect. Architecture and implementation of customized AI solutions — especially RAG systems — for customer projects in industry and market research. Technical leadership (Dev Lead) of customer AI projects. Operation and maintenance of the AI platform at customer sites. Consulting customers on IT and AI strategy.",
      tech: "Python, LLMs/RAG, Agentic AI, MCP, Azure, TypeScript, Platform Engineering",
    },
    {
      date: "2023 — 2024",
      role: "Professional Software Engineer",
      company: "Ergon Informatik AG, Zürich",
      desc: "Developed a time-tracking and workforce planning system for the retail sector. End-to-end software delivery from requirements engineering and prototyping to second/third-level support. Mentored new team members and organized IT workshops for students.",
      tech: "Java, Kotlin, Angular, TypeScript, SQL, Selenium, Jenkins",
    },
    {
      date: "2020 — 2023",
      role: "Senior Software Developer",
      company: "PolygonSoftware, Opfikon",
      desc: "Led full-stack development of web applications and computer vision / machine learning projects at a UZH-founded startup. Designed software architectures, supervised dev teams, and interfaced directly with product owners and clients.",
      tech: "Full Stack, Computer Vision, Machine Learning, Web Apps, DevOps",
    },
    {
      date: "2019 — 2020",
      role: "Junior Software Developer",
      company: "swissbiomechanics ag (ETH spin-off), Zürich",
      desc: "Led an independent software project building a Java application to track biomedical analyses and automatically generate clinical reports. Handled stakeholder communication, requirements analysis, and developer coordination.",
      tech: "Java, Report Generation, Biomedical",
    },
  ];

  for (const job of jobs) {
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

  const education = [
    {
      year: "2020 — 2023",
      degree: "MSc in Informatics (AI specialization)",
      school: "University of Zürich",
      detail:
        'Thesis: "KroneDB — Compressing and Querying Time Series Data using the Kronecker Decomposition." Supervised by Johannes Marti and Dan Olteanu, Data Systems and Theory group.',
    },
    {
      year: "2017 — 2020",
      degree: "BSc in Informatics (Software Systems)",
      school: "University of Zürich",
      detail:
        'Thesis: "A General-purpose Range Join Algorithm for PostgreSQL." Supervised by Michael Böhlen and Anton Dignös, Database Technology group. UZH Semester Award 2020.',
    },
  ];

  for (const edu of education) {
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

  const skills = [
    { category: "Programming", items: "Python (expert), TypeScript/JS (advanced), Java/Kotlin (advanced), SQL (advanced)" },
    { category: "AI", items: "Agent Orchestration (expert), RAG (expert), MCP (advanced), LLM Integration" },
    { category: "Tools", items: "Claude Code (expert), Git/GitHub (expert), Docker (advanced), Azure" },
    { category: "Languages", items: "German (native), English (fluent), French (fluent)" },
  ];

  for (const skill of skills) {
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

  doc
    .fontSize(9.5)
    .font("Helvetica-Bold")
    .fillColor(BLACK)
    .text("KI als Entwicklungspartner", { continued: true })
    .font("Helvetica")
    .fillColor(GRAY)
    .text(
      "  —  bbv webinar on practical methods, tools, and strategies for integrating AI into the software development lifecycle."
    );
  doc.moveDown(0.2);
  doc
    .fontSize(9.5)
    .font("Helvetica-Bold")
    .fillColor(BLACK)
    .text("AI-Augmented Software Engineering", { continued: true })
    .font("Helvetica")
    .fillColor(GRAY)
    .text(
      "  —  Talk at the FHNW Data Science & Data Engineering Alumni Event 2025."
    );
  doc.moveDown(0.2);
  doc
    .fontSize(9.5)
    .font("Helvetica-Bold")
    .fillColor(BLACK)
    .text("bbv AI Hub", { continued: true })
    .font("Helvetica")
    .fillColor(GRAY)
    .text(
      "  —  Swiss-made, model-agnostic enterprise AI platform. Listed on Siemens Xcelerator, certified Swiss Made Software."
    );

  // --- Finalize ---
  doc.end();
  console.log("CV generated:", OUTPUT);
}

main();
