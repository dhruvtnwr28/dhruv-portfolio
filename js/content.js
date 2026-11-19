/* All portfolio copy lives here. Edit freely — the page is generated from it. */

export const PROFILE = {
  name: 'Dhruv Tanwar',
  role: 'Full-stack engineer · open-source contributor · builder',
  email: 'dhruvtnwr28@gmail.com',
  github: 'https://github.com/dhruvtnwr28',
  githubHandle: '@dhruvtnwr28',
};

/* The six stones. Each one guards a chapter of the site and is claimed in its own way. */
export const STONES = [
  { id: 'space',   name: 'Space',   chapter: 'Origin',      hex: '#3d8bff', rgb: [0.24, 0.55, 1.00],
    lore: 'It bends distance until every place is next door.',
    how: 'Shatter the cube in the opening scene.' },
  { id: 'mind',    name: 'Mind',    chapter: 'Arsenal',     hex: '#ffcc33', rgb: [1.00, 0.78, 0.18],
    lore: 'It does not give you ideas. It shows you the ones already there.',
    how: 'Wake three linked skills in the constellation.' },
  { id: 'reality', name: 'Reality', chapter: 'Creations',   hex: '#ff2d3c', rgb: [1.00, 0.12, 0.16],
    lore: 'What you see is a choice. Choose again.',
    how: 'It only exists in the other reality. Flip it first.' },
  { id: 'power',   name: 'Power',   chapter: 'Experience',  hex: '#a24dff', rgb: [0.62, 0.25, 1.00],
    lore: 'Raw output. It does not care how you feel about it.',
    how: 'Grip it. Hold until it stops resisting.' },
  { id: 'time',    name: 'Time',    chapter: 'Chronicle',   hex: '#1fe07a', rgb: [0.10, 0.92, 0.45],
    lore: 'Every commit is a moment you can return to.',
    how: 'Turn the dial through one full revolution.' },
  { id: 'soul',    name: 'Soul',    chapter: 'Contact',     hex: '#ff8a1e', rgb: [1.00, 0.50, 0.10],
    lore: 'It is never found. It is exchanged.',
    how: 'It answers only to one who carries the other five.' },
];

export const ABOUT = {
  lead: 'I build systems that hold up under load and interfaces that people remember.',
  body: [
    'I work across the whole stack: React on the front, Node, Express and Spring Boot behind it, MongoDB and MySQL underneath. When the work calls for it I go lower, to a shell written in C, a RISC-V simulator, or a benchmark in Rust for Apache Arrow.',
    'Lately that has meant a research internship at CoSyLab, IIIT-Delhi, open-source patches to Apache Arrow and Uno Platform, and freelance builds for clients who wanted something that felt alive.',
  ],
  alt: [
    'In another reality I am still debugging the same semicolon. In this one, it shipped.',
  ],
  stats: [
    { n: '15+', label: 'repositories' },
    { n: '3',   label: 'open-source orgs' },
    { n: '1',   label: 'research internship' },
    { n: '∞',   label: 'cups of chai' },
  ],
};

/* Skill constellation. `links` connect skills that I use together. */
export const SKILLS = {
  groups: [
    { id: 'front', name: 'Interface', items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Three.js', 'GLSL / WebGL', 'Vite'] },
    { id: 'back',  name: 'Systems',   items: ['Node.js', 'Express', 'Spring Boot', 'REST APIs', 'Server-Sent Events', 'JWT / OAuth'] },
    { id: 'data',  name: 'Data',      items: ['MongoDB', 'MySQL', 'SQL design', 'Mongoose'] },
    { id: 'low',   name: 'Low level', items: ['C', 'Rust', 'Python', 'Java', 'Linux / Shell', 'RISC-V'] },
    { id: 'craft', name: 'Craft',     items: ['Git & GitHub', 'CI / CD', 'Code review', 'Open source'] },
  ],
  links: [
    ['React','TypeScript'],['React','Tailwind CSS'],['React','Three.js'],['Three.js','GLSL / WebGL'],['React','Vite'],
    ['TypeScript','JavaScript'],['JavaScript','Node.js'],['Node.js','Express'],['Express','MongoDB'],['MongoDB','Mongoose'],
    ['Express','REST APIs'],['REST APIs','JWT / OAuth'],['Spring Boot','MySQL'],['Spring Boot','Server-Sent Events'],['Spring Boot','Java'],
    ['MySQL','SQL design'],['C','Linux / Shell'],['C','RISC-V'],['Python','RISC-V'],['Rust','Open source'],
    ['Git & GitHub','Open source'],['Git & GitHub','CI / CD'],['Open source','Code review'],['Java','SQL design'],['React','REST APIs'],
  ],
};

export const PROJECTS = [
  {
    title: 'IngredientIQ',
    tag: 'Research · Live',
    blurb: 'A food-literacy game: inspect real product labels and guess their NOVA processing level. Live on the CoSyLab, IIIT-Delhi site.',
    under: 'MERN + Vite + Tailwind v4. Guest sessions persisted in MongoDB from the first card, one-click Google sign-in that merges guest progress, a deterministic daily challenge with anti-cheat reveal, and a streak engine.',
    stack: ['React', 'Node', 'Express', 'MongoDB', 'Tailwind'],
    links: [{ label: 'Live', url: 'https://cosylab.iiitd.edu.in/ingredient-iq' }, { label: 'Code', url: 'https://github.com/dhruv-dagar/IngredientIQ' }],
  },
  {
    title: 'RunwayOne',
    tag: 'Platform',
    blurb: 'An intelligent airline operations platform covering flights, crew and operations data in one control surface.',
    under: 'Spring Boot with a layered controller / service / DAO / DTO design, MySQL schema with seeded data, HikariCP pooling, and server-sent events for live operational updates.',
    stack: ['Java', 'Spring Boot', 'MySQL', 'SSE'],
    links: [{ label: 'Code', url: 'https://github.com/dhruvtnwr28/RunwayOne---Intelligent-Airline-Operations-Platform-' }],
  },
  {
    title: 'UniFLIX ERP',
    tag: 'Desktop',
    blurb: 'A university ERP with separate admin, instructor and student worlds: enrolment, grading and records.',
    under: 'Java Swing UI over a DAO data layer and service tier, role-based dashboards, plus a written test plan and test summary.',
    stack: ['Java', 'Swing', 'SQL', 'Maven'],
    links: [{ label: 'Code', url: 'https://github.com/dhruvtnwr28/UniFLIX-ERP' }],
  },
  {
    title: 'OS Shell & MLFQ Scheduler',
    tag: 'Systems',
    blurb: 'A Unix-style shell with pipes and process control, paired with a loader and a multi-level feedback queue scheduler.',
    under: 'C, fork / execvp, piped command execution, signal handling and scheduling queues that demote CPU-heavy jobs.',
    stack: ['C', 'POSIX', 'Linux'],
    links: [{ label: 'Code', url: 'https://github.com/dhruvtnwr28/SimpleUnixCommandLineInterpreter' }],
  },
  {
    title: 'RISC-V Simulator',
    tag: 'Architecture',
    blurb: 'An instruction-set simulator that executes RISC-V binaries instruction by instruction.',
    under: 'Python decoder for R, I, S, B and J formats, 32 registers, data and stack memory, two\'s-complement handling and a program counter you can trace.',
    stack: ['Python', 'RISC-V'],
    links: [{ label: 'Code', url: 'https://github.com/dhruvtnwr28/RISC-V-Instruction-Set-Simulator' }],
  },
  {
    title: 'Fleet Management System',
    tag: 'OOP',
    blurb: 'Vehicle fleet tracking with persistence, rebuilt from the ground up in a second, cleaner iteration.',
    under: 'Java with an inheritance-driven vehicle model, custom exceptions and CSV-backed storage.',
    stack: ['Java', 'OOP'],
    links: [{ label: 'Code', url: 'https://github.com/dhruvtnwr28/Updated-Fleet-management-System' }],
  },
];

export const EXPERIENCE = [
  {
    role: 'Research Intern',
    org: 'CoSyLab · IIIT-Delhi',
    when: '2026',
    points: [
      'Co-built IngredientIQ, an educational game deployed on the lab website, with Dhruv Dagar and Shaffil Saini.',
      'Designed guest-to-account progress merging, the daily challenge API and the streak and scoring engine.',
      'Worked with real product ingredient data and the NOVA food-processing classification.',
    ],
    url: 'https://cosylab.iiitd.edu.in/ingredient-iq',
  },
  {
    role: 'Freelance Developer',
    org: 'Independent',
    when: 'Ongoing',
    points: [
      'Designed and shipped websites and web apps for independent clients, from first sketch to deployment.',
      'Owned scope, design, build and hand-off end to end.',
    ],
  },
];

/* Open source + the timeline the Time Stone scrubs through. */
export const OPEN_SOURCE = [
  { org: 'Apache Arrow', repo: 'arrow-rs', lang: 'Rust', what: 'Added boolean interleave benchmarks (#11503) and working on a faster boolean interleave kernel for issue #11379.', url: 'https://github.com/apache/arrow-rs' },
  { org: 'Uno Platform', repo: 'uno', lang: 'C# / docs', what: 'Fixed stale platform and Gitpod documentation for issue #25332, revised after maintainer review.', url: 'https://github.com/unoplatform/uno' },
  { org: 'KanaDojo', repo: 'kana-dojo', lang: 'Content', what: 'Contributed Japanese idiom entries to the learning app.', url: 'https://github.com/lingdojo/kana-dojo' },
];

export const TIMELINE = [
  { when: 'The beginning', title: 'First lines of code', text: 'Java, C and a lot of segmentation faults. Fleet management and ERP systems built the habit of finishing things.' },
  { when: 'Going deeper', title: 'Into the machine', text: 'A Unix shell, an MLFQ scheduler, a RISC-V simulator. Learning what actually happens beneath the abstractions.' },
  { when: 'Building platforms', title: 'Full-stack systems', text: 'RunwayOne on Spring Boot and MySQL. Databases designed instead of just used.' },
  { when: '2026', title: 'CoSyLab, IIIT-Delhi', text: 'Research internship. IngredientIQ goes live on the lab website.' },
  { when: '2026', title: 'Open source', text: 'Patches to Apache Arrow and Uno Platform. Code reviewed by people who maintain infrastructure for millions.' },
  { when: 'Now', title: 'This moment', text: 'Freelancing, contributing, and looking for the next hard problem. Maybe yours.' },
];
