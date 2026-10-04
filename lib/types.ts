export interface LinkItem {
  label: string;
  href: string;
  icon: "resume" | "linkedin" | "github" | "mail";
}

export interface ExperienceEntry {
  id: string;
  company: string;
  logoSrc: string;
  role: string;
  period: string;
  achievements: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  image: string;
  client?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  icon?: string;
}

export interface CertCategory {
  name: string;
  certifications: Certification[];
}

export interface EducationStage {
  label: string;
  school: string;
  detail: string;
  period: string;
}

export interface TechItem {
  name: string;
  icon: string;
  color: string;
}

export interface NavItem {
  id: string;
  label: string;
}
