import type {
  CertCategory,
  EducationStage,
  ExperienceEntry,
  LinkItem,
  Project,
  TechItem,
} from "./types";

export const name = "CHARLES";
export const tagline = "I build custom, full-stack software driven entirely by your needs. My philosophy is simple. You cannot defend a system properly if you don't know how to build them.";
export const bio = "Pamantasan ng Lungsod ng Maynila Computer Science Graduate";
export const photo = "/me.jpg";

export const links: LinkItem[] = [
  { label: "Resume", href: "/resume.pdf", icon: "resume" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/charlesfrancischua/", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/reiisuu", icon: "github" },
  { label: "Mail", href: "mailto:cfochua@gmail.com", icon: "mail" },
];

export const experience: ExperienceEntry[] = [
  {
    id: "experience-placeholder-one",
    company: "FlyRank AI",
    logoSrc: "https://internship.flyrank.ai/",
    role: "Backend AI Engineering",
    period: "2026",
    achievements: [
      "Add the main responsibility, contribution, or result from this role.",
      "Describe a project, system, or process you helped build or improve.",
      "Include a measurable outcome, technology, or collaboration highlight.",
    ],
  },
  {
    id: "experience-placeholder-two",
    company: "National Parks Development Committee",
    logoSrc: "https://commons.wikimedia.org/wiki/File:NPDC_New_Logo.png",
    role: "SHS Internship",
    period: "2024",
    achievements: [
      "Learned fundamental Microsoft Excel processes used within the work environment.",
      "Add a concise achievement or responsibility from this experience."
    ],
  },
];

export const organizations: ExperienceEntry[] = [
  {
    id: "organization-placeholder-one",
    company: "Amazon Skill Builders Group - Haribon",
    logoSrc: "https://scontent.fmnl8-1.fna.fbcdn.net/v/t39.30808-6/751414909_122277833228170841_6953833533270337306_n.jpg?stp=dst-jpg_tt6&cstp=mx1000x1000&ctp=s1000x1000&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG36MSl4I6e2AM35TbZBl_kCNp5-Vu2dvII2nn5W7Z28rWcCWtN5MwpANoROP1HjfX0waZWhWI10lJCGUJw8pOD&_nc_ohc=EFNLMFvn3OQQ7kNvwEjwsoX&_nc_oc=AdqotM-pVNSX42GAmTwnFf2DvLTV6Xtfb_K5NsedqK1bJuzm218socxGyP8_ksvmcB8&_nc_zt=23&_nc_ht=scontent.fmnl8-1.fna&_nc_gid=8EDmtGPHOTUpIle3pifHAQ&_nc_ss=7b2a8&oh=00_AQP-IiMSqwNyYVDvspdnID39tDIaLMLUbY_DqWePMx2q4Q&oe=6AC7AE20",
    role: "Cybersecurity Senior Associate",
    period: "2026 — 2027",
    achievements: [
      "Add the organization, community, or student group you were part of.",
      "Describe your role, contribution, or an initiative you helped organize.",
    ],
  },

  {
    id: "organization-placeholder-two",
    company: "Microsoft Student Community - Intramuros",
    logoSrc: "https://scontent.fmnl8-7.fna.fbcdn.net/v/t39.30808-6/762465911_1505728004905900_8464532753418855392_n.jpg?stp=dst-jpg_tt6&cstp=mx720x720&ctp=s720x720&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF2WJvdeC5xV1UjWdCu45mg0b1TFRZRGAXRvVMVFlEYBWgjBTJmpqVg5X3j5GLCeF8bRNp55ISMnCPOpsymcyZ9&_nc_ohc=HxXYU3uNvmwQ7kNvwGxjnZE&_nc_oc=AdoQgr2i80ytmkxnLRaz4FwbSUoTmIgJ_ru1LurOJNL5fiBy0s0i7X_mwlciBCmkr3A&_nc_zt=23&_nc_ht=scontent.fmnl8-7.fna&_nc_gid=RqUPSncva_tpxIFw7IKRxw&_nc_ss=7b2a8&oh=00_AQNVUJ7TF8nCR6UHpjzNtZLrqP5ILVbxpDaf6bCgqelA2w&oe=6AC7B1F0",
    role: "Software Development Officer",
    period: "2026 — 2027",
    achievements: [
      "Add the organization, community, or student group you were part of.",
      "Describe your role, contribution, or an initiative you helped organize.",
    ],
  },

  {
    id: "organization-placeholder-three",
    company: "Google Developer Group on Campus - PLM",
    logoSrc: "https://scontent.fmnl8-8.fna.fbcdn.net/v/t39.30808-6/715353970_122127307245203228_9000139614471154982_n.jpg?stp=dst-jpg_tt6&cstp=mx1560x1560&ctp=s1560x1560&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH4gux7NVD0KJ26i4_mbsfQ218ooIVhbAXbXyighWFsBYnAKm0qbRfF0WPdIKKhVx9LZUi1WQ3uSjH7Tuc7Ws_T&_nc_ohc=QtKpzw1k6ycQ7kNvwG3gu1p&_nc_oc=AdoeZSAkGHe6xrFLIWlGLrk_-3Yg2XL-hh6nA_TaouPoZdjyr4T5psDyvVYdZtULTc4&_nc_zt=23&_nc_ht=scontent.fmnl8-8.fna&_nc_gid=6UOzwCDvSHhBtIbi84r_kg&_nc_ss=7b2a8&oh=00_AQNUdzeCJwErwzBEuD48PsYU595T4XyrdkI0BOSGW5wFLg&oe=6AC79F57",
    role: "Web Development Volunteer",
    period: "2026 — 2027",
    achievements: [
      "Add the organization, community, or student group you were part of.",
      "Describe your role, contribution, or an initiative you helped organize.",
    ],
  },

  {
    id: "organization-placeholder-four",
    company: "Amazon Skill Builders Group - Haribon",
    logoSrc: "https://scontent.fmnl8-1.fna.fbcdn.net/v/t39.30808-6/751414909_122277833228170841_6953833533270337306_n.jpg?stp=dst-jpg_tt6&cstp=mx1000x1000&ctp=s1000x1000&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG36MSl4I6e2AM35TbZBl_kCNp5-Vu2dvII2nn5W7Z28rWcCWtN5MwpANoROP1HjfX0waZWhWI10lJCGUJw8pOD&_nc_ohc=EFNLMFvn3OQQ7kNvwEjwsoX&_nc_oc=AdqotM-pVNSX42GAmTwnFf2DvLTV6Xtfb_K5NsedqK1bJuzm218socxGyP8_ksvmcB8&_nc_zt=23&_nc_ht=scontent.fmnl8-1.fna&_nc_gid=8EDmtGPHOTUpIle3pifHAQ&_nc_ss=7b2a8&oh=00_AQP-IiMSqwNyYVDvspdnID39tDIaLMLUbY_DqWePMx2q4Q&oe=6AC7AE20",
    role: "Live Stream Operator",
    period: "2026 — 2027",
    achievements: [
      "Add the organization, community, or student group you were part of.",
      "Describe your role, contribution, or an initiative you helped organize.",
    ],
  },
];
export const projects: Project[] = [
  {
    slug: "project-placeholder-one",
    title: "Gicho",
    description: "Add a short description of the problem this project solves and the result it delivers.",
    stack: ["Next.js", "TypeScript", "MongoDB", "React"],
    image: "",
    client: "Client / stakeholder placeholder",
    problem: "Describe the user, business, or technical problem this project addresses.",
    solution: "Explain the product, system, or workflow you designed and implemented.",
    impact: "Add the measurable outcome, improvement, or current project status.",
  },
  {
    slug: "project-placeholder-two",
    title: "P(CS)^2",
    description: "Replace this placeholder with a featured project, case study, or client build.",
    stack: ["React", "Node", "PostgreSQL"],
    image: "",
    client: "Client / stakeholder placeholder",
    problem: "Describe the problem or opportunity that started this project.",
    solution: "Describe the main solution and the role you played in delivering it.",
    impact: "Add the result, users served, or next milestone.",
  },
  {
    slug: "project-placeholder-three",
    title: "Project In Progress",
    description: "Use this card for a work-in-progress project, experiment, or upcoming launch.",
    stack: ["Python", "Docker", "Redis"],
    image: "",
    client: "Personal / experimental project",
    problem: "Describe the technical question or workflow this experiment explores.",
    solution: "Describe the architecture, automation, or prototype currently being built.",
    impact: "Work in progress — update this field when the project has a measurable result.",
  },
  {
    slug: "project-placeholder-four",
    title: "Client Build Placeholder",
    description: "Reserve this space for a client-facing application or custom software solution.",
    stack: ["Next.js", "PostgreSQL", "Docker"],
    image: "",
    client: "Client / stakeholder placeholder",
    problem: "Describe the client need, operational bottleneck, or user pain point.",
    solution: "Describe the custom application and the key capabilities it provides.",
    impact: "Add the delivery status or business outcome.",
  },
  {
    slug: "project-placeholder-five",
    title: "Mobile App Placeholder",
    description: "Add a mobile project here with its core features, platform, and technical highlights.",
    stack: ["React Native", "TypeScript", "Node"],
    image: "",
    client: "Client / stakeholder placeholder",
    problem: "Describe the mobile user need and the problem the app solves.",
    solution: "Describe the mobile experience, services, and core features.",
    impact: "Add adoption, performance, or delivery results.",
  },
  {
    slug: "project-placeholder-six",
    title: "Systems Project Placeholder",
    description: "Use this card for a systems, automation, cybersecurity, or infrastructure project.",
    stack: ["C++", "Linux", "Azure"],
    image: "",
    client: "Personal / experimental project",
    problem: "Describe the systems, security, or infrastructure challenge.",
    solution: "Describe the implementation, controls, or automation used.",
    impact: "Add the resulting reliability, security, or efficiency improvement.",
  },
];
export const certCategories: CertCategory[] = [
  {
    name: "Software Development",
    certifications: [
      {
        name: "Certification Placeholder",
        issuer: "Issuer Placeholder",
        date: "20XX",
      },
      {
        name: "Course or Badge Placeholder",
        issuer: "Platform Placeholder",
        date: "20XX",
      },
    ],
  },
  {
    name: "Cybersecurity",
    certifications: [
      {
        name: "Security Certification Placeholder",
        issuer: "Issuer Placeholder",
        date: "20XX",
      },
    ],
  },
  {
    name: "Microsoft & Cloud",
    certifications: [
      {
        name: "Cloud Certification Placeholder",
        issuer: "Microsoft / Azure Placeholder",
        date: "20XX",
      },
    ],
  },
];
export const education: EducationStage[] = [
  {
    label: "College",
    school: "Pamantasan ng Lungsod ng Maynila",
    detail: "Add your college, degree, specialization, and any academic highlights here.",
    period: "2024 — 2028",
  },
  {
    label: "Senior High School",
    school: "Paco Catholic School",
    detail: "STEM  Graduate - Honor Student",
    period: "2022 — 2024",
  },
];

export const TECHS: TechItem[] = [
  { name: "MongoDB", icon: "DB", color: "#47a248" },
  { name: "Express", icon: "Ex", color: "#ffffff" },
  { name: "Node", icon: "N", color: "#68a063" },
  { name: "React", icon: "R", color: "#61dafb" },
  { name: "React Native", icon: "RN", color: "#61dafb" },
  { name: "HTML", icon: "H", color: "#e34f26" },
  { name: "TailwindCSS", icon: "TW", color: "#38bdf8" },
  { name: "JavaScript", icon: "JS", color: "#f7df1e" },
  { name: "C", icon: "C", color: "#659ad2" },
  { name: "Java", icon: "J", color: "#ed8b00" },
  { name: "Python", icon: "Py", color: "#ffd343" },
  { name: "Assembly", icon: "ASM", color: "#dd72fd" },
  { name: "Docker", icon: "D", color: "#2496ed" },
  { name: "Copilot CLI", icon: "CP", color: "#ffffff" },
  { name: "Azure", icon: "AZ", color: "#0078d4" },
  { name: "Copilot", icon: "CP", color: "#ffffff" },
  { name: "Linux", icon: "LNX", color: "#fcc624" },
  { name: "Oracle SQL", icon: "ORA", color: "#f80000" },
  { name: "PostgreSQL", icon: "PG", color: "#4169e1" },
  { name: "Redis", icon: "R", color: "#dc382d" },
  { name: "GitHub", icon: "GH", color: "#ffffff" },
  { name: "TypeScript", icon: "TS", color: "#3178c6" },
  { name: "Next.js", icon: "NX", color: "#ffffff" },
  { name: "C++", icon: "C+", color: "#00599c" },
];
