import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import translations from "../src/_data/translations.js";
import { stripHtml } from "../src/_data/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "src", "assets", "pdf");
const PHOTO = join(__dirname, "..", "src", "assets", "img", "photo-cv.jpg");
const TEMPLATE = readFileSync(join(__dirname, "cv-template.tex"), "utf8");

// Section labels per language (already TeX-safe where needed)
const LABELS = {
  en: {
    profile: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    talks: "Talks \\& Projects",
    programming: "Programming",
    languages: "Languages",
    location: "Zürich, Switzerland",
  },
  de: {
    profile: "Profil",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Skills",
    talks: "Vorträge \\& Projekte",
    programming: "Programmierung",
    languages: "Sprachen",
    location: "Zürich, Schweiz",
  },
};

/* ── TeX helpers ──────────────────────────────────────── */

function escTex(str) {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\u00a0/g, "~")
    .replace(/—/g, "---")
    .replace(/–/g, "--")
    .replace(/\u2018/g, "`")
    .replace(/\u2019/g, "'")
    .replace(/\u201c/g, "``")
    .replace(/\u201d/g, "''");
}

/* ── data builders ───────────────────────────────────── */

function buildProfile(t) {
  return t.about.abstract
    .split(/<\/?p>/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => escTex(stripHtml(s)))
    .join("\n\n\\vspace{4pt}\n");
}

function buildJobs(t) {
  return t.experience.jobs
    .map((j) => {
      const date = escTex(j.date);
      const role = escTex(j.role);
      const company = escTex(
        `${j.company}, ${j.location.replace(/, (Switzerland|Schweiz)/g, "")}`
      );
      const desc = escTex(j.desc);
      const assessment = j.assessment
        ? `\\newline\\cvlink{file-alt}{https://t.mannhart.ai${j.assessment.href}}{${escTex(j.assessment.label)}}`
        : "";
      return `\\cventry{${date}}{${role}}{${company}}{${assessment}}{${desc}}`;
    })
    .join("\n");
}

function buildEducation(t) {
  return t.education.items
    .slice()
    .reverse()
    .map((e) => {
      const detail = escTex(stripHtml(e.detail));
      const award = e.award
        ? `\\newline\\cvlink{award}{${e.award.href}}{${escTex(e.award.label)}}`
        : "";
      const year = escTex(e.year);
      const degree = escTex(`${e.degree} (${e.specialization})`);
      const school = escTex(e.school);
      return `\\cvedu{${year}}{${degree}}{${school}}{${detail}${award}}`;
    })
    .join("\n");
}

function buildSkills(t, lang) {
  const labels = LABELS[lang];
  const progNames = ["Languages", "Sprachen"];

  const groups = t.skills.groups.map((g) => {
    const items = g.items.map((s) => escTex(s.name)).join(", ");
    const category = progNames.includes(g.name)
      ? labels.programming
      : escTex(g.name);
    return `\\cvskill{${category}}{${items}}`;
  });
  groups.push(
    `\\cvskill{${labels.languages}}{${escTex(t.about.languages)}}`
  );
  return groups.join("\n");
}

function buildTalks(t, lang) {
  const docsUrl = lang === "de"
    ? "https://bbvch-ai.github.io/aihub-core/de/"
    : "https://bbvch-ai.github.io/aihub-core/";
  const docsLabel = lang === "de" ? "Dokumentation" : "Documentation";
  return [
    {
      title: escTex(stripHtml(t.featured.webinar.title)),
      desc: escTex(stripHtml(t.featured.webinar.desc)),
    },
    {
      title: escTex(stripHtml(t.featured.fhnw.title)),
      desc: escTex(stripHtml(t.featured.fhnw.desc)),
    },
    {
      title: escTex(stripHtml(t.featured.aiHub.title)),
      desc: `${escTex(stripHtml(t.featured.aiHub.desc))} \\cvlink{globe}{${docsUrl}}{${docsLabel}}`,
    },
    {
      title: escTex(t.featured.mannhart.title),
      desc: `${escTex(t.featured.mannhart.desc)} \\cvlink{globe}{https://t.mannhart.ai}{t.mannhart.ai}`,
    },
    {
      title: escTex(t.featured.airspace.title),
      desc: `${escTex(t.featured.airspace.desc)} \\cvlink{github}{https://github.com/johannschwabe/AirspaceAuctionSimulator}{GitHub}`,
    },
  ]
    .map((t) => `\\cvtalk{${t.title}}{${t.desc}}`)
    .join("\n");
}

/* ── generate ────────────────────────────────────────── */

function generateCV(lang) {
  const t = translations[lang];
  const labels = LABELS[lang];
  const jobName = `Thomas_Mannhart_CV_${lang.toUpperCase()}`;
  const outputPdf = join(OUTPUT_DIR, `${jobName}.pdf`);
  const outputTex = join(OUTPUT_DIR, `cv_${lang}.tex`);

  const tex = TEMPLATE
    .replace("{{LOCATION}}", labels.location)
    .replace("{{PHOTO}}", PHOTO)
    .replace("{{LABEL_PROFILE}}", labels.profile)
    .replace("{{PROFILE}}", buildProfile(t))
    .replace("{{LABEL_EXPERIENCE}}", labels.experience)
    .replace("{{JOB_ENTRIES}}", buildJobs(t))
    .replace("{{LABEL_EDUCATION}}", labels.education)
    .replace("{{EDU_ENTRIES}}", buildEducation(t))
    .replace("{{LABEL_SKILLS}}", labels.skills)
    .replace("{{SKILL_ENTRIES}}", buildSkills(t, lang))
    .replace("{{LABEL_TALKS}}", labels.talks)
    .replace("{{TALK_ENTRIES}}", buildTalks(t, lang));

  writeFileSync(outputTex, tex);
  console.log(`LaTeX source written → ${outputTex}`);

  try {
    execSync(
      `pdflatex -interaction=nonstopmode -halt-on-error -output-directory="${OUTPUT_DIR}" -jobname="${jobName}" "${outputTex}"`,
      { cwd: OUTPUT_DIR, stdio: "pipe" }
    );
    console.log(`CV (${lang.toUpperCase()}) compiled → ${outputPdf}`);
  } catch (err) {
    console.error(
      `LaTeX compilation failed for ${lang}:\n${err.stdout?.toString()}`
    );
    process.exit(1);
  }

  // Clean up auxiliary files
  for (const ext of [".aux", ".log", ".out"]) {
    try {
      execSync(`rm -f "${join(OUTPUT_DIR, jobName + ext)}"`, { stdio: "pipe" });
    } catch {}
  }
}

/* ── run ─────────────────────────────────────────────── */

generateCV("en");
generateCV("de");
