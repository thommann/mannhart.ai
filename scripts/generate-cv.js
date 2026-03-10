import { writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import translations from "../src/_data/translations.js";
import { stripHtml, SKILL_LEVELS } from "../src/_data/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "src", "assets", "pdf");
const PHOTO = join(__dirname, "..", "src", "assets", "img", "photo-cv.jpg");

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

/* ── data builders ─────────────────────────────────── */

function truncate(text, maxSentences = 2) {
  // Temporarily protect abbreviations from sentence splitting
  const protected_ = text
    .replace(/u\.\s*a\./g, "u\x00a\x00")
    .replace(/z\.\s*B\./g, "z\x00B\x00")
    .replace(/d\.\s*h\./g, "d\x00h\x00");
  const sentences = protected_.match(/[^.!]+[.!]+/g) || [protected_];
  return sentences
    .slice(0, maxSentences)
    .join("")
    .replace(/\x00/g, ".")
    .trim();
}

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

function buildJobs(t) {
  return t.experience.jobs.map((j) => ({
    date: escTex(j.date),
    role: escTex(j.role),
    company: escTex(
      `${j.company}, ${j.location.replace(/, (Switzerland|Schweiz)/g, "")}`
    ),
    desc: escTex(j.desc),
    tech: j.tech.map((t) => escTex(t)).join(", "),
  }));
}

function buildEducation(t) {
  return t.education.items
    .slice()
    .reverse()
    .map((e) => {
      const detail = stripHtml(e.detail);
      return {
        year: escTex(e.year),
        degree: escTex(`${e.degree} (${e.specialization})`),
        school: escTex(e.school),
        detail: escTex(detail),
        award: e.award
          ? { label: escTex(e.award.label), href: e.award.href }
          : null,
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
        return level ? `${escTex(s.name)} (${escTex(level)})` : escTex(s.name);
      })
      .join(", ");
    const rawCategory = progNames.includes(g.name)
      ? labels.programming
      : escTex(g.name);
    return { category: rawCategory, items };
  });
  groups.push({
    category: labels.languages,
    items: escTex(t.about.languages),
  });
  return groups;
}

function buildTalks(t) {
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
      desc: `${escTex(stripHtml(t.featured.aiHub.desc))} {\\color{accent}\\href{https://bbvch-ai.github.io/aihub-core/}{bbvch-ai.github.io/aihub-core}}`,
    },
  ];
}

/* ── LaTeX generation ──────────────────────────────── */

function generateCV(lang) {
  const t = translations[lang];
  const labels = LABELS[lang];
  const jobName = `Thomas_Mannhart_CV_${lang.toUpperCase()}`;
  const outputPdf = join(OUTPUT_DIR, `${jobName}.pdf`);
  const outputTex = join(OUTPUT_DIR, `cv_${lang}.tex`);

  const jobs = buildJobs(t);
  const education = buildEducation(t);
  const skills = buildSkills(t, lang);
  const talks = buildTalks(t);
  const profile = t.about.abstract
    .split(/<\/?p>/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => escTex(stripHtml(s)))
    .join("\n\n\\vspace{4pt}\n");

  const jobEntries = jobs
    .map(
      (j) => `\\cventry{${j.date}}{${j.role}}{${j.company}}{${j.desc}}{${j.tech}}`
    )
    .join("\n");

  const eduEntries = education
    .map((e) => {
      const award = e.award
        ? `\\newline{\\bfseries\\color{accent}\\href{${e.award.href}}{${e.award.label}}}`
        : "";
      return `\\cvedu{${e.year}}{${e.degree}}{${e.school}}{${e.detail}${award}}`;
    })
    .join("\n");

  const skillEntries = skills
    .map((s) => `\\cvskill{${s.category}}{${s.items}}`)
    .join("\n");

  const talkEntries = talks
    .map((t) => `\\cvtalk{${t.title}}{${t.desc}}`)
    .join("\n");

  const tex = `% Auto-generated --- do not edit by hand
\\documentclass[a4paper,10pt]{article}

\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{tgheros}
\\renewcommand{\\familydefault}{\\sfdefault}
\\usepackage[top=36pt,bottom=34pt,left=50pt,right=50pt]{geometry}
\\usepackage[dvipsnames]{xcolor}
\\usepackage{graphicx}
\\usepackage{tikz}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage{parskip}
\\usepackage{tabularx}
\\usepackage{calc}
\\usepackage{microtype}

% ── Colors ──
\\definecolor{cvblack}{RGB}{35,35,40}
\\definecolor{cvdark}{RGB}{50,50,58}
\\definecolor{cvgray}{RGB}{110,110,118}
\\definecolor{cvlight}{RGB}{165,165,172}
\\definecolor{accent}{RGB}{160,125,80}
\\definecolor{ruledark}{RGB}{60,60,68}
\\definecolor{rulelight}{RGB}{200,200,206}

\\color{cvblack}

% ── Layout ──
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\newlength{\\datecol}
\\setlength{\\datecol}{88pt}
\\newlength{\\colgap}
\\setlength{\\colgap}{10pt}

% ── Icons ──
\\newcommand{\\iconlabel}[2]{%
  {\\fontsize{7.5}{9}\\selectfont\\color{cvgray}{\\fontsize{8}{9}\\selectfont#1}\\enspace#2}%
}

% ── Section heading ──
\\newcommand{\\cvsection}[1]{%
  \\vspace{6pt}%
  {\\fontsize{9}{11}\\selectfont\\bfseries\\color{cvdark}\\MakeUppercase{#1}}%
  \\\\[-3pt]%
  {\\color{ruledark}\\rule{\\textwidth}{0.6pt}}%
  \\vspace{4pt}%
}

% ── Experience entry ──
\\newcommand{\\cventry}[5]{%
  \\noindent
  \\begin{tabularx}{\\textwidth}{@{}p{\\datecol}@{\\hspace{\\colgap}}X@{}}
    {\\fontsize{8}{10}\\selectfont\\color{cvgray}#1} &
    {\\fontsize{9.5}{12}\\selectfont\\bfseries\\color{cvblack}#2}\\newline
    {\\fontsize{8.5}{11}\\selectfont\\color{cvgray}#3}\\newline
    {\\fontsize{8.5}{11}\\selectfont\\color{cvblack}#4}\\newline
    {\\fontsize{8}{10}\\selectfont\\color{accent}#5}
  \\end{tabularx}\\vspace{3pt}%
}

% ── Education entry ──
\\newcommand{\\cvedu}[4]{%
  \\noindent
  \\begin{tabularx}{\\textwidth}{@{}p{\\datecol}@{\\hspace{\\colgap}}X@{}}
    {\\fontsize{8}{10}\\selectfont\\color{cvgray}#1} &
    {\\fontsize{9.5}{12}\\selectfont\\bfseries\\color{cvblack}#2}\\newline
    {\\fontsize{8.5}{11}\\selectfont\\color{cvgray}#3}\\newline
    {\\fontsize{8.5}{11}\\selectfont\\color{cvblack}#4}
  \\end{tabularx}\\vspace{3pt}%
}

% ── Skill entry ──
\\newcommand{\\cvskill}[2]{%
  {\\fontsize{9}{12}\\selectfont{\\bfseries\\color{cvblack}#1:\\enspace}{\\color{cvgray}#2}}\\\\[3pt]%
}

% ── Talk entry ──
\\newcommand{\\cvtalk}[2]{%
  {\\fontsize{9}{12}\\selectfont{\\bfseries\\color{cvblack}#1\\enspace}{\\color{cvgray}#2}}\\\\[3pt]%
}

\\begin{document}

% ── Header ──
\\noindent
\\begin{minipage}[t]{\\textwidth-82pt}
  {\\fontsize{22}{26}\\selectfont\\bfseries\\color{cvblack}Thomas Rolf Mannhart}\\\\[3pt]
  {\\fontsize{11}{14}\\selectfont\\color{accent}Professional AI Engineer}\\\\[5pt]
  \\begin{tabular}{@{}l@{\\hspace{18pt}}l@{}}
    \\iconlabel{\\faIcon{map-marker-alt}}{${labels.location}} &
    \\iconlabel{\\faEnvelope}{\\href{mailto:thomas@mannhart.ai}{thomas@mannhart.ai}} \\\\[3pt]
    \\iconlabel{\\faGithub}{\\href{https://github.com/thommann}{github.com/thommann}} &
    \\iconlabel{\\faGlobe}{\\href{https://t.mannhart.ai}{t.mannhart.ai}}
  \\end{tabular}
\\end{minipage}%
\\hfill
\\begin{minipage}[t]{72pt}
  \\vspace{0pt}
  \\begin{tikzpicture}
    \\clip (0,0) circle (36pt);
    \\node at (0,0) {\\includegraphics[width=72pt]{${PHOTO}}};
  \\end{tikzpicture}
\\end{minipage}

\\vspace{4pt}
{\\color{ruledark}\\rule{\\textwidth}{0.8pt}}
\\vspace{2pt}

% ── Profile ──
\\cvsection{${labels.profile}}
{\\fontsize{9}{12}\\selectfont\\color{cvblack}${profile}}

% ── Experience ──
\\cvsection{${labels.experience}}
${jobEntries}

\\newpage

% ── Education ──
\\cvsection{${labels.education}}
${eduEntries}

% ── Skills ──
\\cvsection{${labels.skills}}
${skillEntries}

% ── Talks ──
\\cvsection{${labels.talks}}
${talkEntries}

\\end{document}
`;

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

/* ── run ───────────────────────────────────────────── */

generateCV("en");
generateCV("de");
