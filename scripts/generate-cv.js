import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import translations from "../src/_data/translations.js";
import { stripHtml, SKILL_LEVELS } from "../src/_data/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "src", "assets", "pdf");
const PHOTO = join(__dirname, "..", "src", "assets", "img", "photo-cv.jpg");

// Palette
const BLACK = [35, 35, 40];
const DARK = [50, 50, 58];
const GRAY = [110, 110, 118];
const LIGHT = [165, 165, 172];
const ACCENT = [160, 125, 80];
const RULE_DARK = [60, 60, 68];
const RULE_LIGHT = [200, 200, 206];

// Layout
const L = 50;
const R = 545;
const W = R - L;
const DATE_W = 92;
const COL_GAP = 10;
const CX = L + DATE_W + COL_GAP;
const CW = R - CX;

// Photo
const PHOTO_SIZE = 72;
const PHOTO_X = R - PHOTO_SIZE;
const PHOTO_Y = 42;
const HEADER_W = PHOTO_X - L - 15;

// Section labels per language
const LABELS = {
  en: {
    profile: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    talks: "Talks & Projects",
    programming: "Programming",
    languages: "Languages",
    location: "Zürich, Switzerland",
  },
  de: {
    profile: "Profil",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Skills",
    talks: "Vorträge & Projekte",
    programming: "Programmierung",
    languages: "Sprachen",
    location: "Zürich, Schweiz",
  },
};

/* ── data builders ─────────────────────────────────── */

function truncate(text, maxSentences = 2) {
  const sentences = text.match(/[^.!]+[.!]+/g) || [text];
  return sentences.slice(0, maxSentences).join("").trim();
}

function buildJobs(t) {
  return t.experience.jobs.map((j) => ({
    date: j.date.replace("now", "present"),
    role: j.role,
    company: `${j.company}, ${j.location.replace(/, (Switzerland|Schweiz)/g, "")}`,
    desc: truncate(j.desc, 2),
  }));
}

function buildEducation(t) {
  return t.education.items
    .slice()
    .reverse()
    .map((e) => {
      const detail = stripHtml(e.detail);
      const thesisMatch = detail.match(
        /(Thesis|Bachelorarbeit|Masterarbeit):\s*(.+)/
      );
      let line = thesisMatch
        ? truncate(`${thesisMatch[1]}: ${thesisMatch[2]}`, 2)
        : truncate(detail, 2);
      return {
        year: e.year,
        degree: `${e.degree} (${e.specialization})`,
        school: e.school,
        detail: line,
        award: e.award || null,
      };
    });
}

function buildSkills(t, lang) {
  const levels = SKILL_LEVELS[lang];
  const labels = LABELS[lang];
  const progNames = ["Languages", "Sprachen"];

  const groups = t.skills.groups.map((g) => {
    const items = g.items
      .map((s) => {
        const level = levels[s.level];
        return level ? `${s.name} (${level})` : s.name;
      })
      .join(", ");
    return {
      category: progNames.includes(g.name) ? labels.programming : g.name,
      items,
    };
  });
  groups.push({
    category: labels.languages,
    items: t.about.languages,
  });
  return groups;
}

function buildTalks(t) {
  return [
    {
      title: stripHtml(t.featured.webinar.title),
      desc: stripHtml(t.featured.webinar.desc),
    },
    {
      title: stripHtml(t.featured.fhnw.title),
      desc: stripHtml(t.featured.fhnw.desc),
    },
    {
      title: stripHtml(t.featured.aiHub.title),
      desc: stripHtml(t.featured.aiHub.desc),
    },
  ];
}

/* ── icon helpers ──────────────────────────────────── */

function drawIcon(doc, type, x, y, size, color) {
  const s = size;
  const cx = x + s / 2;
  const cy = y + s / 2;
  const lw = Math.max(0.55, s * 0.075);

  doc.save();

  switch (type) {
    case "location": {
      doc.fillColor(color);
      const pr = s * 0.28;
      const pcy = y + s * 0.34;
      doc.circle(cx, pcy, pr).fill();
      doc
        .path(
          `M${cx - pr * 0.7} ${pcy + pr * 0.5} L${cx} ${y + s * 0.92} L${cx + pr * 0.7} ${pcy + pr * 0.5}`
        )
        .fill();
      doc.fillColor([255, 255, 255]);
      doc.circle(cx, pcy, pr * 0.35).fill();
      break;
    }
    case "email": {
      doc
        .strokeColor(color)
        .lineWidth(lw)
        .lineCap("round")
        .lineJoin("round");
      const pad = s * 0.08;
      const top = y + s * 0.22;
      const bot = y + s * 0.78;
      doc.rect(x + pad, top, s - 2 * pad, bot - top).stroke();
      doc
        .path(
          `M${x + pad} ${top} L${cx} ${y + s * 0.53} L${x + s - pad} ${top}`
        )
        .stroke();
      break;
    }
    case "code": {
      doc
        .strokeColor(color)
        .lineWidth(lw * 1.1)
        .lineCap("round")
        .lineJoin("round");
      doc
        .path(
          `M${x + s * 0.38} ${y + s * 0.18} L${x + s * 0.12} ${cy} L${x + s * 0.38} ${y + s * 0.82}`
        )
        .stroke();
      doc
        .path(
          `M${x + s * 0.62} ${y + s * 0.18} L${x + s * 0.88} ${cy} L${x + s * 0.62} ${y + s * 0.82}`
        )
        .stroke();
      break;
    }
    case "globe": {
      doc.strokeColor(color).lineWidth(lw);
      const r = s * 0.4;
      doc.circle(cx, cy, r).stroke();
      doc
        .moveTo(x + s * 0.1, cy)
        .lineTo(x + s * 0.9, cy)
        .stroke();
      doc.ellipse(cx, cy, r * 0.45, r).stroke();
      break;
    }
  }

  doc.restore();
}

/* ── layout helpers ────────────────────────────────── */

function rule(doc, y, color = RULE_LIGHT, width = 0.4) {
  doc.moveTo(L, y).lineTo(R, y).strokeColor(color).lineWidth(width).stroke();
}

function heading(doc, label) {
  doc.moveDown(0.5);
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(DARK)
    .text(label.toUpperCase(), L, doc.y, { characterSpacing: 1.5 });
  rule(doc, doc.y + 3, RULE_DARK, 0.6);
  doc.y += 10;
}

/* ── generate one CV ───────────────────────────────── */

function generateCV(lang) {
  const t = translations[lang];
  const labels = LABELS[lang];
  const output = join(
    OUTPUT_DIR,
    `Thomas_Mannhart_CV_${lang.toUpperCase()}.pdf`
  );

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 42, bottom: 38, left: L, right: 50 },
  });
  doc.pipe(createWriteStream(output));

  /* ── photo ── */
  doc.save();
  doc
    .circle(PHOTO_X + PHOTO_SIZE / 2, PHOTO_Y + PHOTO_SIZE / 2, PHOTO_SIZE / 2)
    .clip();
  doc.image(PHOTO, PHOTO_X, PHOTO_Y, { width: PHOTO_SIZE });
  doc.restore();
  doc
    .circle(PHOTO_X + PHOTO_SIZE / 2, PHOTO_Y + PHOTO_SIZE / 2, PHOTO_SIZE / 2)
    .strokeColor(RULE_LIGHT)
    .lineWidth(0.5)
    .stroke();

  /* ── header ── */
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor(BLACK)
    .text("Thomas Rolf Mannhart", L, 42, { width: HEADER_W });

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(ACCENT)
    .text("Professional AI Engineer", { width: HEADER_W });

  doc.moveDown(0.3);

  /* ── contact info with icons ── */
  const iconS = 9;
  const iconGap = 3;
  const col2X = L + 155;
  const contactY1 = doc.y;
  const contactY2 = contactY1 + 14;

  drawIcon(doc, "location", L, contactY1, iconS, GRAY);
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(GRAY)
    .text(labels.location, L + iconS + iconGap, contactY1 + 1, {
      lineBreak: false,
    });

  drawIcon(doc, "email", col2X, contactY1, iconS, GRAY);
  const emailX = col2X + iconS + iconGap;
  const emailY = contactY1 + 1;
  doc.text("thomas@mannhart.ai", emailX, emailY, { lineBreak: false });
  doc.link(emailX, emailY - 1, doc.widthOfString("thomas@mannhart.ai"), 10, "mailto:thomas@mannhart.ai");

  drawIcon(doc, "code", L, contactY2, iconS, GRAY);
  const ghX = L + iconS + iconGap;
  const ghY = contactY2 + 1;
  doc.text("github.com/thommann", ghX, ghY, { lineBreak: false });
  doc.link(ghX, ghY - 1, doc.widthOfString("github.com/thommann"), 10, "https://github.com/thommann");

  drawIcon(doc, "globe", col2X, contactY2, iconS, GRAY);
  const webX = col2X + iconS + iconGap;
  const webY = contactY2 + 1;
  doc.text("t.mannhart.ai", webX, webY, { lineBreak: false });
  doc.link(webX, webY - 1, doc.widthOfString("t.mannhart.ai"), 10, "https://t.mannhart.ai");

  doc.y = contactY2 + 18;
  rule(doc, doc.y, RULE_DARK, 0.8);
  doc.y += 6;

  /* ── profile ── */
  heading(doc, labels.profile);
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(BLACK)
    .text(stripHtml(t.about.abstract), L, doc.y, { width: W, lineGap: 1.8 });

  /* ── experience ── */
  heading(doc, labels.experience);

  for (const job of buildJobs(t)) {
    const y0 = doc.y;

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor(GRAY)
      .text(job.date, L, y0, { width: DATE_W });
    const yDate = doc.y;

    doc
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(job.role, CX, y0, { width: CW });

    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor(GRAY)
      .text(job.company, CX, doc.y, { width: CW });

    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor(BLACK)
      .text(job.desc, CX, doc.y + 2, { width: CW, lineGap: 1.5 });

    doc.y = Math.max(doc.y, yDate) + 8;
  }

  /* ── education ── */
  heading(doc, labels.education);

  for (const edu of buildEducation(t)) {
    const y0 = doc.y;

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor(GRAY)
      .text(edu.year, L, y0, { width: DATE_W });
    const yDate = doc.y;

    doc
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(edu.degree, CX, y0, { width: CW });

    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor(GRAY)
      .text(edu.school, CX, doc.y, { width: CW });

    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor(BLACK)
      .text(edu.detail, CX, doc.y + 2, { width: CW, lineGap: 1.5 });

    if (edu.award) {
      const awardY = doc.y + 1;
      doc
        .fontSize(8.5)
        .font("Helvetica-Bold")
        .fillColor(ACCENT)
        .text(edu.award.label, CX, awardY, { width: CW });
      doc.link(CX, awardY - 1, doc.widthOfString(edu.award.label), 10, edu.award.href);
    }

    doc.y = Math.max(doc.y, yDate) + 6;
  }

  /* ── skills ── */
  heading(doc, labels.skills);

  for (const skill of buildSkills(t, lang)) {
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(`${skill.category}:  `, L, doc.y, { width: W, continued: true })
      .font("Helvetica")
      .fillColor(GRAY)
      .text(skill.items);
    doc.moveDown(0.2);
  }

  /* ── talks & projects ── */
  heading(doc, labels.talks);

  for (const talk of buildTalks(t)) {
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(talk.title, L, doc.y, { width: W, continued: true })
      .font("Helvetica")
      .fillColor(GRAY)
      .fontSize(8.5)
      .text(`  ${truncate(talk.desc, 1)}`);
    doc.moveDown(0.15);
  }

  doc.end();
  console.log(`CV (${lang.toUpperCase()}) generated → ${output}`);
}

/* ── run ───────────────────────────────────────────── */

generateCV("en");
generateCV("de");
