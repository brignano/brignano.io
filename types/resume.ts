export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education?: Education[];
  skills?: Skill[];
  certifications?: Certification[];
  projects?: Project[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  company: string;
  logo?: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  summary?: string;
  highlights: string[];
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  honors?: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  expirationDate?: string;
  credentialId?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}
