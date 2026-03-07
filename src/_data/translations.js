export default {
  en: {
    meta: {
      description: "Thomas Mannhart — Professional AI Engineer at bbv Software Services in Zürich. Building enterprise AI solutions, RAG systems, and agentic workflows.",
    },
    nav: {
      about: "About",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      beyondWork: "Beyond Work",
      contact: "Contact",
      langSwitch: "DE",
      langSwitchHref: "/de/",
      menuAriaLabel: "Menu",
      themeAriaLabel: "Toggle theme",
      themeLightAriaLabel: "Switch to dark mode",
      themeDarkAriaLabel: "Switch to light mode",
    },
    hero: {
      label: "Professional AI Engineer · Zürich, CH",
      name: 'Thomas<br>Rolf<br><em>Mannhart</em>',
      desc: "Building enterprise AI in Zürich. Together with my team at bbv, I'm developing the Swiss AI Hub, design custom AI solutions, lead customer projects, and write about how AI is changing the way we build software.",
      getInTouch: "Get in touch",
      github: "GitHub",
      downloadCV: "Download CV",
    },
    about: {
      number: "01",
      title: "About",
      abstract: `<p>I'm a <strong>Professional AI Engineer</strong> at <a href="https://en.bbv.ch/" target="_blank" rel="noopener">bbv Software Services</a> in Zürich, building enterprise AI on the <a href="https://ai-hub.bbv.ch/" target="_blank" rel="noopener">Swiss AI Hub</a>. I studied Informatics at the <strong>University of Zürich</strong> (BSc + MSc, AI specialization) and have been shipping software professionally since 2019 — from biomedical Java apps to full-stack web platforms to LLM-powered agentic systems.</p>`,
      viewMore: "View more",
      viewLess: "View less",
      personal: "Enjoys hot tea, cold beer, good food, thick books, old music, and long board game nights.",
      languages: "German (native), English (fluent), French (basic)",
      prose: `<p>I grew up in Galgenen in the canton of Schwyz and, after a year of military service, studied Informatics at the <strong>University of Zürich</strong>, where I spent over six years — first a <a href="#education">Bachelor's in Software Systems</a>, then a <a href="#education">Master's specializing in Artificial Intelligence</a>. For my bachelor thesis I built a general-purpose range join algorithm for PostgreSQL, which won the <a href="https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html" target="_blank" rel="noopener">Semesterpreis HS20</a> — a faculty-level award from the Faculty of Business, Economics and Informatics, recognizing one of only four students across the entire faculty that semester. The thesis took me to the Free University of Bozen-Bolzano for a research stay in South Tyrol. For my master's I dove into time series databases and the Kronecker decomposition — an unusual intersection of linear algebra and data compression that I found genuinely fascinating. The programme included an exchange semester at the National Taiwan University in Taipei, where I lived for four months, took a semester of Mandarin, and explored East Asia.</p>

<p>Throughout my studies I was always working alongside. My <a href="#experience">first real software job</a> was at swissbiomechanics, an ETH spin-off, where I single-handedly built a Java application for tracking biomedical analyses and generating clinical reports. That threw me into the deep end of stakeholder communication and independent project ownership at twenty-two. From there I moved to PolygonSoftware, a startup founded by fellow UZH graduates, where I spent three years leading full-stack development and diving into computer vision and machine learning. I designed architectures, supervised dev teams, and talked directly with clients — the kind of small-company work where you end up doing a bit of everything and learning fast.</p>

<p>After finishing my Master's, I joined <strong>Ergon Informatik</strong>, one of Zürich's most respected software houses, and worked on a time-tracking and workforce planning system for the retail sector. There I sharpened my craft in enterprise Java and Kotlin, handled the full delivery cycle from requirements to support, and found that I really enjoyed mentoring — whether that was onboarding new team members or organizing IT workshops for local students. I loved working at Ergon but left after about a year when bbv offered the chance to move into my preferred specialization: AI.</p>

<p>These days I'm a <strong>Professional AI Engineer</strong> at <a href="https://en.bbv.ch/" target="_blank" rel="noopener">bbv Software Services</a> in Zürich, where, together with my team, I'm developing the <a href="https://ai-hub.bbv.ch/" target="_blank" rel="noopener">Swiss AI Hub</a> — a comprehensive, Swiss-made enterprise AI platform — and design its architecture together with the software architect. Beyond the platform, I design and implement customized AI solutions — especially <a href="#skills">RAG systems</a> — for customer projects in industry and market research, and serve as technical lead (Dev Lead) on these AI projects. I also operate and maintain the platform at customer sites, and consult customers on developing and implementing their IT and AI strategy. It sits at the exact intersection of my interests: real engineering problems, cutting-edge AI, and the challenge of making complex technology usable and trustworthy for organisations that can't afford to get it wrong.</p>

<p>I also <a href="#featured">speak and write</a> about AI-augmented software engineering — how AI is changing the way we build software, not just the software itself. I've given talks at the FHNW Alumni Event and bbv webinars on practical methods for integrating AI into the development lifecycle, from requirements analysis through to testing.</p>

<p>My <a href="#skills">technical toolkit</a> centres on Python, TypeScript, and Java/Kotlin, with deep experience in agent orchestration, RAG, and the Model Context Protocol. I'm fluent in German and English, and speak some French. And when I'm not coding — hot tea, cold beer, good food, thick books, old music, and long boardgame nights.</p>`,
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
          desc: "Development of a comprehensive enterprise AI platform, including architecture design in collaboration with the software architect. Design and implementation of customized AI solutions — especially RAG systems — for customer projects in industry and market research. Technical leadership (Dev Lead) of customer AI projects. Operation and maintenance of the AI platform and customer-specific solutions. Consulting customers on their IT and AI strategy.",
          tech: ["Python", "LLMs / RAG", "Agentic AI", "Dev Lead", "AI Strategy", "Azure", "TypeScript", "Platform Engineering"],
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
          desc: "Led full-stack development of web applications and computer vision / machine learning projects at a UZH-founded startup. Projects included an OCR pipeline for a logistics company and a data visualization application for vibration measurement devices. Designed software architectures, supervised dev teams, and interfaced directly with product owners and clients.",
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
          degree: "BSc in Informatics",
          specialization: "Software Systems",
          school: "University of Zürich",
          year: "2017 — 2020",
          detail: 'Specialization in Software Systems. Thesis: <em><a href="http://tpg.inf.unibz.it/project-rmj" target="_blank" rel="noopener" class="thesis-link">A General-purpose Range Join Algorithm for PostgreSQL</a></em>. Written at the Free University of Bozen-Bolzano under the guidance of Anton Dignös. Awarded the Semesterpreis HS20 by the Faculty of Business, Economics and Informatics — one of four students recognized across the entire faculty that semester.',
          award: {
            label: "Semesterpreis HS20",
            href: "https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html",
          },
        },
        {
          degree: "MSc in Informatics",
          specialization: "Artificial Intelligence",
          school: "University of Zürich",
          year: "2020 — 2023",
          detail: 'Specialization in Artificial Intelligence. Exchange semester at the National Taiwan University (NTU) in Taipei. Thesis: <em>KroneDB — Compressing and Querying Time Series Data using the Kronecker Decomposition.</em> Supervised by Johannes Marti and Dan Olteanu at the Data Systems and Theory group.',
          award: null,
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
        desc: 'Talk at the FHNW Data Science &amp; Data Engineering Alumni Event on integrating AI into the software development lifecycle — from enterprise AI strategy and the Swiss AI Hub, to working with coding agents and the "Development Funnel" for context-driven AI workflows.',
        bbvPost: "bbv Post",
        fhnwPost: "FHNW Post",
        slides: "Slides",
      },
      aiHub: {
        title: "About the Swiss AI Hub",
        desc: "Swiss-made, model-agnostic enterprise AI platform. Listed on Siemens Xcelerator, certified Swiss Made Software.",
        bbvAiHub: "Swiss AI Hub",
        swissAiHubDocs: "Swiss AI Hub Docs",
        aiHubCoreDocs: "AI Hub Core Docs",
        swissMadeSoftware: "Swiss Made Software",
        siemensXcelerator: "Siemens Xcelerator",
        bbvSoftwareServices: "bbv Software Services",
      },
    },
    beyondWork: {
      number: "06",
      title: "Beyond Work",
      intro: `<p>Some of my most formative experiences happened far from a desk — locked in an Airbnb during a pandemic, exploring Taiwan during an exchange semester, or stumbling through Mandarin with classmates from all over the world.</p>`,
      stories: [
        {
          location: "Bozen, South Tyrol",
          context: "Bachelor thesis · 2020",
          text: "I went to the Free University of Bozen-Bolzano to write my bachelor thesis — and arrived just as COVID shut everything down. I could only attend the university for two weeks before it closed. I ended up locked in an Airbnb in the countryside of South Tyrol, walking the host's dog twice a day through apple fields to keep sane. The isolation turned out to be remarkably effective for getting work done.",
        },
        {
          location: "Taipei, Taiwan",
          context: "Exchange semester · NTU · 2022–2023",
          text: "I lived in Taipei for about four months during my Master's, studying at the National Taiwan University. I took a semester of Mandarin — I still remember some, but not nearly enough for a real conversation. I travelled around the island whenever I could.",
        },
        {
          location: "Korea & Japan",
          context: "Side trips from Taipei · 2023",
          text: "From Taipei I went to Korea for a week with two Japanese friends from my Mandarin course. Towards the end of the semester my girlfriend visited, and we travelled to Japan together, flying back to Switzerland from Tokyo. I also visited one of my Japanese friends in his hometown Sasebo.",
        },
      ],
    },
    chatbot: {
      title: "Chat with AI",
      greeting: "Hi! I'm Thomas's AI assistant. I can:",
      greetingFeatures: [
        "Answer questions about Thomas",
        "Download his CV",
        "Navigate to any section",
        "Toggle dark mode",
        "Switch language (DE/EN)",
      ],
      placeholder: "Ask a question...",
      toggleAriaLabel: "Chat",
      closeAriaLabel: "Close chat",
      sendAriaLabel: "Send",
      confirmLangSwitchNote: "This will reload the page and reset the chat.",
      confirmLangSwitchLink: "Switch to German?",
      alreadyOnLanguage: "The site is already in English!",
      alreadyOnTheme: "The site is already in {theme} mode!",
      toggleThemeResponse: "Sure, toggling for you!",
      fallbackGreeting: "I'm Thomas's AI assistant! Ask me about him, or I can toggle dark mode, switch language, or show you his CV.",
      cvResponse: "Here's Thomas's CV: [Download CV]({url})",
      experienceResponse: "Check out Thomas's work experience: [Experience](#experience)",
      skillsResponse: "Here are Thomas's skills: [Skills](#skills)",
      educationResponse: "Here's Thomas's education: [Education](#education)",
      contactResponse: "Contact Thomas by email: [thomas@mannhart.ai](mailto:thomas@mannhart.ai)",
      aboutResponse: "Thomas Mannhart is a Professional AI Engineer based in Zürich. He builds enterprise AI solutions and leads customer projects. More at [About](#about).",
      errors: {
        rateLimited: "Too many requests. Please wait a moment.",
        quotaExceeded: "The daily quota has been reached. Please try again tomorrow.",
        connection: "Connection error. Please try again.",
        timeout: "The response took too long. Please try again.",
        emptyResponse: "Sorry, I couldn't generate a response.",
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
    meta: {
      description: "Thomas Mannhart — Professional AI Engineer bei bbv Software Services in Zürich. Enterprise-KI-Lösungen, RAG-Systeme und agentische Workflows.",
    },
    nav: {
      about: "Über mich",
      experience: "Erfahrung",
      education: "Ausbildung",
      skills: "Skills",
      beyondWork: "Persönliches",
      contact: "Kontakt",
      langSwitch: "EN",
      langSwitchHref: "/en/",
      menuAriaLabel: "Menü",
      themeAriaLabel: "Farbschema wechseln",
      themeLightAriaLabel: "Zum dunklen Modus wechseln",
      themeDarkAriaLabel: "Zum hellen Modus wechseln",
    },
    hero: {
      label: "Professional AI Engineer · Zürich, CH",
      name: 'Thomas<br>Rolf<br><em>Mannhart</em>',
      desc: "Ich entwickle Enterprise-KI in Zürich. Zusammen mit meinem Team bei bbv entwickle ich den Swiss AI Hub, designe kundenspezifische KI-Lösungen, leite Kundenprojekte und schreibe darüber, wie KI die Softwareentwicklung verändert.",
      getInTouch: "Kontakt aufnehmen",
      github: "GitHub",
      downloadCV: "CV herunterladen",
    },
    about: {
      number: "01",
      title: "Über mich",
      abstract: `<p>Ich bin <strong>Professional AI Engineer</strong> bei <a href="https://en.bbv.ch/" target="_blank" rel="noopener">bbv Software Services</a> in Zürich und entwickle Enterprise-KI auf dem <a href="https://ai-hub.bbv.ch/" target="_blank" rel="noopener">Swiss AI Hub</a>. Ich habe Informatik an der <strong>Universität Zürich</strong> studiert (BSc + MSc, Spezialisierung KI) und liefere seit 2019 professionell Software — von biomedizinischen Java-Anwendungen über Full-Stack-Webplattformen bis hin zu LLM-gestützten agentischen Systemen.</p>`,
      viewMore: "Mehr anzeigen",
      viewLess: "Weniger anzeigen",
      personal: "Hobbys: heisser Tee, kaltes Bier, gutes Essen, dicke Bücher, alte Musik und lange Brettspielabende.",
      languages: "Deutsch (Muttersprache), Englisch (fliessend), Französisch (Grundkenntnisse)",
      prose: `<p>Ich bin in Galgenen im Kanton Schwyz aufgewachsen und habe nach einem Jahr Militärdienst Informatik an der <strong>Universität Zürich</strong> studiert, wo ich über sechs Jahre verbrachte — zuerst einen <a href="#education">Bachelor in Software Systems</a>, dann einen <a href="#education">Master mit Spezialisierung in Artificial Intelligence</a>. In meiner Bachelorarbeit entwickelte ich einen universellen Range-Join-Algorithmus für PostgreSQL, der mit dem <a href="https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html" target="_blank" rel="noopener">Semesterpreis HS20</a> der Wirtschaftswissenschaftlichen Fakultät ausgezeichnet wurde — einer von nur vier Studierenden, die in diesem Semester fakultätsweit gewürdigt wurden. Für die Arbeit ging ich an die Freie Universität Bozen in Südtirol. Im Master tauchte ich in Zeitreihen-Datenbanken und die Kronecker-Zerlegung ein — eine ungewöhnliche Schnittstelle aus linearer Algebra und Datenkompression, die mich wirklich fasziniert hat. Das Programm beinhaltete ein Austauschsemester an der National Taiwan University in Taipei, wo ich vier Monate lebte, einen Semesterkurs Mandarin belegte und Ostasien erkundete.</p>

<p>Neben dem Studium habe ich immer gearbeitet. Mein <a href="#experience">erster richtiger Softwarejob</a> war bei swissbiomechanics, einem ETH-Spin-off, wo ich eigenständig eine Java-Anwendung zur Nachverfolgung biomedizinischer Analysen und zur automatischen Erstellung klinischer Berichte entwickelte. Das warf mich mit 22 direkt ins kalte Wasser — Stakeholder-Kommunikation und eigenverantwortliche Projektleitung. Danach wechselte ich zu PolygonSoftware, einem Startup von UZH-Absolventen, wo ich drei Jahre lang Full-Stack-Entwicklung leitete und in Computer Vision und Machine Learning eintauchte. Ich entwarf Architekturen, betreute Dev-Teams und kommunizierte direkt mit Kunden — typische Startup-Arbeit, bei der man von allem etwas macht und schnell lernt.</p>

<p>Nach dem Master trat ich bei <strong>Ergon Informatik</strong> ein, einem der renommiertesten Softwarehäuser Zürichs, und arbeitete an einem Zeiterfassungs- und Personalplanungssystem für den Detailhandel. Dort verfeinerte ich mein Können in Enterprise Java und Kotlin, übernahm den gesamten Delivery-Zyklus von der Anforderungsanalyse bis zum Support und entdeckte, dass mir Mentoring besonders liegt — ob beim Onboarding neuer Teammitglieder oder beim Organisieren von IT-Workshops für Schüler. Ich habe die Arbeit bei Ergon sehr geschätzt, bin aber nach rund einem Jahr zu bbv gewechselt, als sich die Möglichkeit bot, in meine bevorzugte Spezialisierung einzusteigen: KI.</p>

<p>Heute bin ich <strong>Professional AI Engineer</strong> bei <a href="https://en.bbv.ch/" target="_blank" rel="noopener">bbv Software Services</a> in Zürich, wo ich zusammen mit meinem Team den <a href="https://ai-hub.bbv.ch/" target="_blank" rel="noopener">Swiss AI Hub</a> — eine umfassende, Schweizer Enterprise-KI-Plattform — entwickle und deren Architektur gemeinsam mit dem Software-Architekten gestalte. Neben der Plattform designe und implementiere ich kundenspezifische KI-Lösungen — insbesondere <a href="#skills">RAG-Systeme</a> — für Kundenprojekte im industriellen Umfeld und in der Marktforschung und übernehme die technische Leitung (Dev Lead) dieser KI-Projekte. Zudem betreibe und warte ich die Plattform beim Kunden und berate Kunden bei der Entwicklung und Umsetzung ihrer IT- und KI-Strategie. Das liegt genau an der Schnittstelle meiner Interessen: echte Engineering-Probleme, modernste KI und die Herausforderung, komplexe Technologie nutzbar und vertrauenswürdig zu machen für Organisationen, die sich keine Fehler leisten können.</p>

<p>Ich <a href="#featured">spreche und schreibe</a> auch über KI-gestützte Softwareentwicklung — wie KI die Art verändert, wie wir Software bauen, nicht nur die Software selbst. Ich habe Vorträge am FHNW Alumni Event und in bbv-Webinaren gehalten, über praktische Methoden zur Integration von KI in den Entwicklungszyklus, von der Anforderungsanalyse bis zum Testing.</p>

<p>Mein <a href="#skills">technisches Toolkit</a> umfasst Python, TypeScript und Java/Kotlin, mit viel Erfahrung in Agent Orchestration, RAG und dem Model Context Protocol. Ich spreche fliessend Deutsch und Englisch und etwas Französisch. Und wenn ich nicht code — heisser Tee, kaltes Bier, gutes Essen, dicke Bücher, alte Musik und lange Brettspielabende.</p>`,
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
          desc: "Entwicklung einer umfassenden Enterprise-KI-Plattform, einschliesslich Architektur-Design in Zusammenarbeit mit dem Software-Architekten. Design und Implementierung kundenspezifischer KI-Lösungen — insbesondere RAG-Systeme — für Kundenprojekte im industriellen Umfeld und in der Marktforschung. Technische Leitung (Dev Lead) von KI-Kundenprojekten. Betrieb und Wartung der KI-Plattform und kundenspezifischer Lösungen. Beratung von Kunden bei der Entwicklung und Umsetzung ihrer IT- und KI-Strategie.",
          tech: ["Python", "LLMs / RAG", "Agentic AI", "Dev Lead", "AI Strategy", "Azure", "TypeScript", "Platform Engineering"],
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
          desc: "Leitung der Full-Stack-Entwicklung von Webanwendungen sowie Computer-Vision- und Machine-Learning-Projekten bei einem von UZH-Absolventen gegründeten Startup. Projekte umfassten u.\u00a0a. eine OCR-Pipeline für ein Logistikunternehmen und eine Datenvisualisierungs-Anwendung für Erschütterungsmessgeräte. Entwurf von Softwarearchitekturen, Betreuung von Dev-Teams und direkte Schnittstelle zu Product Owners und Kunden.",
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
          degree: "BSc in Informatik",
          specialization: "Software Systems",
          school: "Universität Zürich",
          year: "2017 — 2020",
          detail: 'Spezialisierung in Software Systems. Bachelorarbeit: <em><a href="http://tpg.inf.unibz.it/project-rmj" target="_blank" rel="noopener" class="thesis-link">A General-purpose Range Join Algorithm for PostgreSQL</a></em>. Geschrieben an der Freien Universität Bozen unter der Betreuung von Anton Dignös. Ausgezeichnet mit dem Semesterpreis HS20 der Wirtschaftswissenschaftlichen Fakultät — einer von vier Studierenden, die in diesem Semester fakultätsweit ausgezeichnet wurden.',
          award: {
            label: "Semesterpreis HS20",
            href: "https://www.ifi.uzh.ch/en/archive/news-archive/outstanding-scientific-work-thomas-mannhart.html",
          },
        },
        {
          degree: "MSc in Informatik",
          specialization: "Artificial Intelligence",
          school: "Universität Zürich",
          year: "2020 — 2023",
          detail: 'Spezialisierung in Artificial Intelligence. Austauschsemester an der National Taiwan University (NTU) in Taipei. Masterarbeit: <em>KroneDB — Compressing and Querying Time Series Data using the Kronecker Decomposition.</em> Betreut von Johannes Marti und Dan Olteanu in der Gruppe Data Systems and Theory.',
          award: null,
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
        desc: 'Vortrag am FHNW Data Science &amp; Data Engineering Alumni Event über die Integration von KI in den Software-Entwicklungszyklus — von der Enterprise-KI-Strategie und dem Swiss AI Hub bis hin zur Arbeit mit Coding Agents und dem «Development Funnel» für kontextgesteuerte KI-Workflows.',
        bbvPost: "bbv Post",
        fhnwPost: "FHNW Post",
        slides: "Slides",
      },
      aiHub: {
        title: "Über den Swiss AI Hub",
        desc: "Schweizer, modell-agnostische Enterprise-KI-Plattform. Gelistet auf Siemens Xcelerator, zertifiziert als Swiss Made Software.",
        bbvAiHub: "Swiss AI Hub",
        swissAiHubDocs: "Swiss AI Hub Docs",
        aiHubCoreDocs: "AI Hub Core Docs",
        swissMadeSoftware: "Swiss Made Software",
        siemensXcelerator: "Siemens Xcelerator",
        bbvSoftwareServices: "bbv Software Services",
      },
    },
    beyondWork: {
      number: "06",
      title: "Persönliches",
      intro: `<p>Einige meiner prägendsten Erfahrungen fanden fernab vom Schreibtisch statt — eingesperrt in einem Airbnb während einer Pandemie, auf Entdeckungstour in Taiwan während eines Austauschsemesters oder beim Stammeln auf Mandarin mit Kommilitonen aus aller Welt.</p>`,
      stories: [
        {
          location: "Bozen, Südtirol",
          context: "Bachelorarbeit · 2020",
          text: "Ich ging an die Freie Universität Bozen, um meine Bachelorarbeit zu schreiben — und kam genau dann an, als COVID alles lahmlegte. Ich konnte nur zwei Wochen an der Universität teilnehmen, bevor sie schloss. Ich sass dann in einem Airbnb auf dem Land in Südtirol fest und führte den Hund der Gastgeberin zweimal täglich durch Apfelfelder aus, um bei Verstand zu bleiben. Die Isolation erwies sich als erstaunlich effektiv für die Arbeit.",
        },
        {
          location: "Taipei, Taiwan",
          context: "Austauschsemester · NTU · 2022–2023",
          text: "Während meines Masters lebte ich etwa vier Monate in Taipei und studierte an der National Taiwan University. Ich belegte einen Semesterkurs Mandarin — ich erinnere mich noch an einiges, aber bei weitem nicht genug für ein richtiges Gespräch. Wann immer ich konnte, reiste ich über die Insel.",
        },
        {
          location: "Korea & Japan",
          context: "Abstecher von Taipei · 2023",
          text: "Von Taipei aus fuhr ich für eine Woche nach Korea, mit zwei japanischen Freunden aus meinem Mandarinkurs. Gegen Ende des Semesters besuchte mich meine Freundin, und wir reisten zusammen nach Japan und flogen von Tokio zurück in die Schweiz. Ich besuchte auch einen meiner japanischen Freunde in seiner Heimatstadt Sasebo.",
        },
      ],
    },
    chatbot: {
      title: "KI-Chat",
      greeting: "Hallo! Ich bin Thomas' KI-Assistent. Ich kann:",
      greetingFeatures: [
        "Fragen über Thomas beantworten",
        "Seinen CV herunterladen",
        "Zu jedem Bereich navigieren",
        "Dark Mode umschalten",
        "Sprache wechseln (DE/EN)",
      ],
      placeholder: "Stelle eine Frage...",
      toggleAriaLabel: "Chat",
      closeAriaLabel: "Chat schliessen",
      sendAriaLabel: "Senden",
      confirmLangSwitchNote: "Die Seite wird neu geladen und der Chat zurückgesetzt.",
      confirmLangSwitchLink: "Zu Englisch wechseln?",
      alreadyOnLanguage: "Die Seite ist bereits auf Deutsch!",
      alreadyOnTheme: "Die Seite ist bereits im {theme}!",
      toggleThemeResponse: "Klar, ich schalte das für dich um!",
      fallbackGreeting: "Ich bin Thomas' KI-Assistent! Frag mich etwas über ihn, oder ich kann den Dark Mode umschalten, die Sprache wechseln oder dir seinen CV zeigen.",
      cvResponse: "Hier ist Thomas' CV: [CV herunterladen]({url})",
      experienceResponse: "Schau dir Thomas' Berufserfahrung an: [Erfahrung](#experience)",
      skillsResponse: "Hier sind Thomas' Skills: [Skills](#skills)",
      educationResponse: "Hier ist Thomas' Ausbildung: [Ausbildung](#education)",
      contactResponse: "Kontaktiere Thomas per E-Mail: [thomas@mannhart.ai](mailto:thomas@mannhart.ai)",
      aboutResponse: "Thomas Mannhart ist ein Professional AI Engineer aus Zürich. Er entwickelt Enterprise-KI-Lösungen und leitet Kundenprojekte. Mehr unter [Über mich](#about).",
      errors: {
        rateLimited: "Zu viele Anfragen. Bitte warte einen Moment.",
        quotaExceeded: "Das Tageslimit wurde erreicht. Bitte versuche es morgen erneut.",
        connection: "Verbindungsfehler. Bitte versuche es erneut.",
        timeout: "Die Antwort hat zu lange gedauert. Bitte versuche es erneut.",
        emptyResponse: "Entschuldigung, ich konnte keine Antwort generieren.",
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
