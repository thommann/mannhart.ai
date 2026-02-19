export default {
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      contact: "Contact",
      langSwitch: "DE",
      langSwitchHref: "/de/",
    },
    hero: {
      label: "Professional AI Engineer · Zürich, CH",
      name: 'Thomas<br>Rolf<br><em>Mannhart</em>',
      desc: "Building enterprise AI in Zürich. I make complex technology usable — and I write about how AI is changing the way we build software.",
      getInTouch: "Get in touch",
      github: "GitHub",
    },
    about: {
      number: "01",
      title: "About",
      prose: `<p>I grew up in Zürich and have been tinkering with computers for as long as I can remember. What started as building mods for games I loved turned into studying Informatics at the <strong>University of Zürich</strong>, where I spent seven years — first a <a href="#education">Bachelor's in Software Systems</a>, then a <a href="#education">Master's specializing in Artificial Intelligence</a>. For my bachelor thesis I built a general-purpose range join algorithm for PostgreSQL, which won the <a href="https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html" target="_blank" rel="noopener">UZH Semester Award</a>. For my master's I dove into time series databases and the Kronecker decomposition — an unusual intersection of linear algebra and data compression that I found genuinely fascinating.</p>

<p>Throughout my studies I was always working alongside. My <a href="#experience">first real software job</a> was at swissbiomechanics, an ETH spin-off, where I single-handedly built a Java application for tracking biomedical analyses and generating clinical reports. That threw me into the deep end of stakeholder communication and independent project ownership at twenty-two. From there I moved to PolygonSoftware, a startup founded by fellow UZH graduates, where I spent three years leading full-stack development and diving into computer vision and machine learning. I designed architectures, supervised dev teams, and talked directly with clients — the kind of small-company work where you end up doing a bit of everything and learning fast.</p>

<p>After finishing my Master's, I joined <strong>Ergon Informatik</strong>, one of Zürich's most respected software houses, and worked on a time-tracking and workforce planning system for the retail sector. There I sharpened my craft in enterprise Java and Kotlin, handled the full delivery cycle from requirements to support, and found that I really enjoyed mentoring — whether that was onboarding new team members or organizing IT workshops for local students.</p>

<p>These days I'm a <strong>Professional AI Engineer</strong> at <a href="https://en.bbv.ch/" target="_blank" rel="noopener">bbv Software Services</a> in Zürich, where I work on the <a href="https://ai-hub.bbv.ch/" target="_blank" rel="noopener">bbv AI Hub</a> — a Swiss-made, model-agnostic enterprise AI platform that's going open source. My day-to-day is building <a href="#skills">RAG pipelines, agentic workflows, and LLM integrations</a> across enterprise systems. It sits at the exact intersection of my interests: real engineering problems, cutting-edge AI, and the challenge of making complex technology usable and trustworthy for organisations that can't afford to get it wrong.</p>

<p>I also <a href="#featured">speak and write</a> about AI-augmented software engineering — how AI is changing the way we build software, not just the software itself. I've given talks at the FHNW Alumni Event and bbv webinars on practical methods for integrating AI into the development lifecycle, from requirements analysis through to testing.</p>

<p>My <a href="#skills">technical toolkit</a> centres on Python, TypeScript, and Java/Kotlin, with deep experience in agent orchestration, RAG, and the Model Context Protocol. I'm fluent in German, English, and French. And when I'm not coding — hot tea, cold beer, good food, thick books, old music, and long boardgame nights.</p>`,
    },
    experience: {
      number: "02",
      title: "Experience",
      jobs: [
        {
          date: "2025 — now",
          role: "Professional AI Engineer",
          company: "bbv Software Services AG",
          location: "Zürich, Switzerland",
          desc: "Working on the bbv AI Hub, a Swiss-made enterprise AI platform. Building RAG pipelines, agentic workflows, and integrations across various LLMs and enterprise systems. The platform is model-agnostic, runs on Swiss cloud infrastructure, and is going open source.",
          tech: ["Python", "LLMs / RAG", "Agentic AI", "Vector DB", "Azure", "TypeScript", "Platform Engineering"],
        },
        {
          date: "2023 — 2024",
          role: "Professional Software Engineer",
          company: "Ergon Informatik AG",
          location: "Zürich, Switzerland",
          desc: "Developed a time-tracking and workforce planning system for the retail sector. Handled end-to-end software delivery from requirements engineering and prototyping through to second/third-level support. Mentored new team members and contributed to youth outreach by organizing IT workshops for students.",
          tech: ["Java", "Kotlin", "Angular", "TypeScript", "SQL", "Selenium", "Jenkins", "Git"],
        },
        {
          date: "2020 — 2023",
          role: "Senior Software Developer",
          company: "PolygonSoftware",
          location: "Opfikon, Switzerland",
          desc: "Led full-stack development of web applications and computer vision / machine learning projects at a UZH-founded startup. Designed software architectures, supervised dev teams, and interfaced directly with product owners and clients. Recognized for outstanding quality, reliability, and initiative.",
          tech: ["Full Stack", "Computer Vision", "Machine Learning", "Web Apps", "DevOps"],
        },
        {
          date: "2019 — 2020",
          role: "Junior Software Developer",
          company: "swissbiomechanics ag",
          location: "Zürich, Switzerland",
          desc: "Led an independent software project for this ETH spin-off, building a Java application to track biomedical analyses and automatically generate clinical reports. Handled stakeholder communication, requirements analysis, and coordinated with other developers.",
          tech: ["Java", "Report Generation", "Biomedical"],
        },
      ],
    },
    education: {
      number: "03",
      title: "Education",
      items: [
        {
          degree: "MSc in Informatics",
          school: "University of Zürich",
          year: "2020 — 2023",
          detail: 'Specialization in Artificial Intelligence. Thesis: <em>KroneDB — Compressing and Querying Time Series Data using the Kronecker Decomposition.</em> Supervised by Johannes Marti and Dan Olteanu at the Data Systems and Theory group.',
          award: null,
        },
        {
          degree: "BSc in Informatics",
          school: "University of Zürich",
          year: "2017 — 2020",
          detail: 'Specialization in Software Systems. Thesis: <em><a href="http://tpg.inf.unibz.it/project-rmj" target="_blank" rel="noopener" style="color:var(--accent);text-decoration-color:var(--accent-dim);">A General-purpose Range Join Algorithm for PostgreSQL</a></em>. Supervised by Michael Böhlen and Anton Dignös at the Database Technology group.',
          award: {
            label: "UZH Semester Award 2020",
            href: "https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html",
          },
        },
      ],
    },
    skills: {
      number: "04",
      title: "Skills",
      groups: [
        {
          name: "Languages",
          items: [
            { name: "Python", level: 5 },
            { name: "TypeScript / JS", level: 4 },
            { name: "Java / Kotlin", level: 4 },
            { name: "SQL", level: 4 },
          ],
        },
        {
          name: "AI",
          items: [
            { name: "Agent Orchestration", level: 5 },
            { name: "RAG", level: 5 },
            { name: "MCP", level: 4 },
          ],
        },
        {
          name: "Tools",
          items: [
            { name: "Claude Code", level: 5 },
            { name: "Git / GitHub", level: 5 },
            { name: "Docker", level: 4 },
          ],
        },
      ],
    },
    featured: {
      number: "05",
      title: "Talks",
      webinar: {
        title: "KI als Entwicklungspartner",
        desc: "bbv webinar on practical methods, tools, and proven strategies for integrating AI into the software development lifecycle — from requirements analysis through code development to testing.",
        watchOnYoutube: "Watch on YouTube",
      },
      fhnw: {
        label: "Alumni Event · FHNW · 2025",
        title: "AI-Augmented<br>Software Engineering",
        desc: 'Talk at the FHNW Data Science &amp; Data Engineering Alumni Event on integrating AI into the software development lifecycle — from enterprise AI strategy and the bbv AI Hub, to working with coding agents and the "Development Funnel" for context-driven AI workflows.',
        bbvPost: "bbv Post",
        fhnwPost: "FHNW Post",
        slides: "Slides",
      },
      aiHub: {
        title: "About the bbv AI Hub",
        desc: "Swiss-made, model-agnostic enterprise AI platform — soon to be open-sourced. Listed on Siemens Xcelerator, certified Swiss Made Software.",
        bbvAiHub: "bbv AI Hub",
        swissMadeSoftware: "Swiss Made Software",
        siemensXcelerator: "Siemens Xcelerator",
        bbvSoftwareServices: "bbv Software Services",
      },
    },
    contact: {
      title: 'Get in <em>touch</em>',
      desc: "Feel free to reach out — I'm happy to chat.",
    },
    footer: {
      text: "&copy; 2026 Thomas Mannhart · Zürich, Switzerland",
    },
  },

  de: {
    nav: {
      about: "Über mich",
      experience: "Erfahrung",
      education: "Ausbildung",
      skills: "Skills",
      contact: "Kontakt",
      langSwitch: "EN",
      langSwitchHref: "/en/",
    },
    hero: {
      label: "Professional AI Engineer · Zürich, CH",
      name: 'Thomas<br>Rolf<br><em>Mannhart</em>',
      desc: "Ich entwickle Enterprise-KI in Zürich. Ich mache komplexe Technologie nutzbar — und schreibe darüber, wie KI die Softwareentwicklung verändert.",
      getInTouch: "Kontakt aufnehmen",
      github: "GitHub",
    },
    about: {
      number: "01",
      title: "Über mich",
      prose: `<p>Ich bin in Zürich aufgewachsen und bastle an Computern, seit ich denken kann. Was als Modding für Lieblingsspiele begann, wurde zum Informatik-Studium an der <strong>Universität Zürich</strong>, wo ich sieben Jahre verbrachte — zuerst einen <a href="#education">Bachelor in Software Systems</a>, dann einen <a href="#education">Master mit Spezialisierung in Artificial Intelligence</a>. In meiner Bachelorarbeit entwickelte ich einen universellen Range-Join-Algorithmus für PostgreSQL, der mit dem <a href="https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html" target="_blank" rel="noopener">UZH-Semesterpreis</a> ausgezeichnet wurde. Im Master tauchte ich in Zeitreihen-Datenbanken und die Kronecker-Zerlegung ein — eine ungewöhnliche Schnittstelle aus linearer Algebra und Datenkompression, die mich wirklich fasziniert hat.</p>

<p>Neben dem Studium habe ich immer gearbeitet. Mein <a href="#experience">erster richtiger Softwarejob</a> war bei swissbiomechanics, einem ETH-Spin-off, wo ich eigenständig eine Java-Anwendung zur Nachverfolgung biomedizinischer Analysen und zur automatischen Erstellung klinischer Berichte entwickelte. Das warf mich mit 22 direkt ins kalte Wasser — Stakeholder-Kommunikation und eigenverantwortliche Projektleitung. Danach wechselte ich zu PolygonSoftware, einem Startup von UZH-Absolventen, wo ich drei Jahre lang Full-Stack-Entwicklung leitete und in Computer Vision und Machine Learning eintauchte. Ich entwarf Architekturen, betreute Dev-Teams und kommunizierte direkt mit Kunden — typische Startup-Arbeit, bei der man von allem etwas macht und schnell lernt.</p>

<p>Nach dem Master trat ich bei <strong>Ergon Informatik</strong> ein, einem der renommiertesten Softwarehäuser Zürichs, und arbeitete an einem Zeiterfassungs- und Personalplanungssystem für den Detailhandel. Dort verfeinerte ich mein Können in Enterprise Java und Kotlin, übernahm den gesamten Delivery-Zyklus von der Anforderungsanalyse bis zum Support und entdeckte, dass mir Mentoring besonders liegt — ob beim Onboarding neuer Teammitglieder oder beim Organisieren von IT-Workshops für Schüler.</p>

<p>Heute bin ich <strong>Professional AI Engineer</strong> bei <a href="https://en.bbv.ch/" target="_blank" rel="noopener">bbv Software Services</a> in Zürich und arbeite am <a href="https://ai-hub.bbv.ch/" target="_blank" rel="noopener">bbv AI Hub</a> — einer Schweizer, modell-agnostischen Enterprise-KI-Plattform, die bald Open Source wird. Mein Alltag dreht sich um <a href="#skills">RAG-Pipelines, agentische Workflows und LLM-Integrationen</a> in Unternehmenssystemen. Das liegt genau an der Schnittstelle meiner Interessen: echte Engineering-Probleme, modernste KI und die Herausforderung, komplexe Technologie nutzbar und vertrauenswürdig zu machen für Organisationen, die sich keine Fehler leisten können.</p>

<p>Ich <a href="#featured">spreche und schreibe</a> auch über KI-gestützte Softwareentwicklung — wie KI die Art verändert, wie wir Software bauen, nicht nur die Software selbst. Ich habe Vorträge am FHNW Alumni Event und in bbv-Webinaren gehalten, über praktische Methoden zur Integration von KI in den Entwicklungszyklus, von der Anforderungsanalyse bis zum Testing.</p>

<p>Mein <a href="#skills">technisches Toolkit</a> umfasst Python, TypeScript und Java/Kotlin, mit viel Erfahrung in Agent Orchestration, RAG und dem Model Context Protocol. Ich spreche fliessend Deutsch, Englisch und Französisch. Und wenn ich nicht code — heisser Tee, kaltes Bier, gutes Essen, dicke Bücher, alte Musik und lange Brettspielabende.</p>`,
    },
    experience: {
      number: "02",
      title: "Erfahrung",
      jobs: [
        {
          date: "2025 — heute",
          role: "Professional AI Engineer",
          company: "bbv Software Services AG",
          location: "Zürich, Schweiz",
          desc: "Arbeit am bbv AI Hub, einer Schweizer Enterprise-KI-Plattform. Entwicklung von RAG-Pipelines, agentischen Workflows und Integrationen über verschiedene LLMs und Unternehmenssysteme hinweg. Die Plattform ist modell-agnostisch, läuft auf Schweizer Cloud-Infrastruktur und wird Open Source.",
          tech: ["Python", "LLMs / RAG", "Agentic AI", "Vector DB", "Azure", "TypeScript", "Platform Engineering"],
        },
        {
          date: "2023 — 2024",
          role: "Professional Software Engineer",
          company: "Ergon Informatik AG",
          location: "Zürich, Schweiz",
          desc: "Entwicklung eines Zeiterfassungs- und Personalplanungssystems für den Detailhandel. End-to-End-Softwarelieferung von der Anforderungsanalyse und Prototyping bis zum Second-/Third-Level-Support. Mentoring neuer Teammitglieder und Jugendförderung durch IT-Workshops für Schüler.",
          tech: ["Java", "Kotlin", "Angular", "TypeScript", "SQL", "Selenium", "Jenkins", "Git"],
        },
        {
          date: "2020 — 2023",
          role: "Senior Software Developer",
          company: "PolygonSoftware",
          location: "Opfikon, Schweiz",
          desc: "Leitung der Full-Stack-Entwicklung von Webanwendungen sowie Computer-Vision- und Machine-Learning-Projekten bei einem von UZH-Absolventen gegründeten Startup. Entwurf von Softwarearchitekturen, Betreuung von Dev-Teams und direkte Schnittstelle zu Product Owners und Kunden. Ausgezeichnet für herausragende Qualität, Zuverlässigkeit und Eigeninitiative.",
          tech: ["Full Stack", "Computer Vision", "Machine Learning", "Web Apps", "DevOps"],
        },
        {
          date: "2019 — 2020",
          role: "Junior Software Developer",
          company: "swissbiomechanics ag",
          location: "Zürich, Schweiz",
          desc: "Leitung eines eigenständigen Softwareprojekts für dieses ETH-Spin-off: Entwicklung einer Java-Anwendung zur Nachverfolgung biomedizinischer Analysen und automatischen Erstellung klinischer Berichte. Stakeholder-Kommunikation, Anforderungsanalyse und Koordination mit anderen Entwicklern.",
          tech: ["Java", "Report Generation", "Biomedical"],
        },
      ],
    },
    education: {
      number: "03",
      title: "Ausbildung",
      items: [
        {
          degree: "MSc in Informatik",
          school: "Universität Zürich",
          year: "2020 — 2023",
          detail: 'Spezialisierung in Artificial Intelligence. Masterarbeit: <em>KroneDB — Compressing and Querying Time Series Data using the Kronecker Decomposition.</em> Betreut von Johannes Marti und Dan Olteanu in der Gruppe Data Systems and Theory.',
          award: null,
        },
        {
          degree: "BSc in Informatik",
          school: "Universität Zürich",
          year: "2017 — 2020",
          detail: 'Spezialisierung in Software Systems. Bachelorarbeit: <em><a href="http://tpg.inf.unibz.it/project-rmj" target="_blank" rel="noopener" style="color:var(--accent);text-decoration-color:var(--accent-dim);">A General-purpose Range Join Algorithm for PostgreSQL</a></em>. Betreut von Michael Böhlen und Anton Dignös in der Gruppe Database Technology.',
          award: {
            label: "UZH-Semesterpreis 2020",
            href: "https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html",
          },
        },
      ],
    },
    skills: {
      number: "04",
      title: "Skills",
      groups: [
        {
          name: "Sprachen",
          items: [
            { name: "Python", level: 5 },
            { name: "TypeScript / JS", level: 4 },
            { name: "Java / Kotlin", level: 4 },
            { name: "SQL", level: 4 },
          ],
        },
        {
          name: "KI",
          items: [
            { name: "Agent Orchestration", level: 5 },
            { name: "RAG", level: 5 },
            { name: "MCP", level: 4 },
          ],
        },
        {
          name: "Tools",
          items: [
            { name: "Claude Code", level: 5 },
            { name: "Git / GitHub", level: 5 },
            { name: "Docker", level: 4 },
          ],
        },
      ],
    },
    featured: {
      number: "05",
      title: "Vorträge",
      webinar: {
        title: "KI als Entwicklungspartner",
        desc: "bbv-Webinar über praktische Methoden, Tools und bewährte Strategien zur Integration von KI in den Software-Entwicklungszyklus — von der Anforderungsanalyse über die Code-Entwicklung bis zum Testing.",
        watchOnYoutube: "Auf YouTube ansehen",
      },
      fhnw: {
        label: "Alumni Event · FHNW · 2025",
        title: "AI-Augmented<br>Software Engineering",
        desc: 'Vortrag am FHNW Data Science &amp; Data Engineering Alumni Event über die Integration von KI in den Software-Entwicklungszyklus — von der Enterprise-KI-Strategie und dem bbv AI Hub bis hin zur Arbeit mit Coding Agents und dem «Development Funnel» für kontextgesteuerte KI-Workflows.',
        bbvPost: "bbv Post",
        fhnwPost: "FHNW Post",
        slides: "Slides",
      },
      aiHub: {
        title: "Über den bbv AI Hub",
        desc: "Schweizer, modell-agnostische Enterprise-KI-Plattform — bald Open Source. Gelistet auf Siemens Xcelerator, zertifiziert als Swiss Made Software.",
        bbvAiHub: "bbv AI Hub",
        swissMadeSoftware: "Swiss Made Software",
        siemensXcelerator: "Siemens Xcelerator",
        bbvSoftwareServices: "bbv Software Services",
      },
    },
    contact: {
      title: '<em>Kontakt</em> aufnehmen',
      desc: "Melden Sie sich gerne — ich freue mich auf den Austausch.",
    },
    footer: {
      text: "&copy; 2026 Thomas Mannhart · Zürich, Schweiz",
    },
  },
};
