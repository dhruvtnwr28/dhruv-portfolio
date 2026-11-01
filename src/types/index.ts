export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  metrics?: string;
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  color: string;
  mockupType: '3d-mesh' | 'neural-ai' | 'cloud-db' | 'terminal';
}

export interface SkillCategory {
  category: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0-100
    tag: string;
  }[];
}

export interface TerminalEntry {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}
