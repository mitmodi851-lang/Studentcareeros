import type { CoursePrerequisite } from '@/types';

export const COURSE_PREREQUISITES_MAP: Record<string, CoursePrerequisite[]> = {
  // Cybersecurity
  cybersecurity: [
    {
      id: 'prereq-cyber-1',
      title: 'Basic Networking Fundamentals',
      description: 'Understanding of IP addressing, DNS, DHCP, and the TCP/UDP client-server model.',
      category: 'Networking',
    },
    {
      id: 'prereq-cyber-2',
      title: 'Operating System & Terminal Basics',
      description: 'Familiarity with basic Linux/Bash commands (ls, cd, grep, chmod) and Windows navigation.',
      category: 'Systems',
    },
    {
      id: 'prereq-cyber-3',
      title: 'Core Security Concepts',
      description: 'The CIA Triad (Confidentiality, Integrity, Availability), authentication vs authorization.',
      category: 'Security',
    },
    {
      id: 'prereq-cyber-4',
      title: 'Foundational Scripting',
      description: 'Ability to read and write elementary Python or Bash automation scripts.',
      category: 'Programming',
    },
  ],

  // Artificial Intelligence & Applied AI
  'ai-applied-ai': [
    {
      id: 'prereq-ai-1',
      title: 'Python Programming Essentials',
      description: 'Comfortable with data structures (lists, dicts), functions, loops, and object-oriented syntax.',
      category: 'Programming',
    },
    {
      id: 'prereq-ai-2',
      title: 'Basic Linear Algebra & Calculus',
      description: 'Understanding vectors, matrices, dot products, and basic gradient descent intuition.',
      category: 'Math',
    },
    {
      id: 'prereq-ai-3',
      title: 'Data Handling Libraries',
      description: 'Basic manipulation using NumPy and Pandas for data preprocessing.',
      category: 'Data',
    },
    {
      id: 'prereq-ai-4',
      title: 'API Integration & JSON',
      description: 'Sending HTTP POST/GET requests and parsing JSON responses from LLM APIs.',
      category: 'Tools',
    },
  ],

  // Web & Software Development
  'web-software-dev': [
    {
      id: 'prereq-web-1',
      title: 'Semantic HTML5 & Modern CSS',
      description: 'Box model, Flexbox, responsive layouts (media queries), and semantic markup tags.',
      category: 'Frontend',
    },
    {
      id: 'prereq-web-2',
      title: 'JavaScript Essentials (ES6+)',
      description: 'Variables (let/const), arrow functions, array methods (map, filter), and async/await Promises.',
      category: 'Frontend',
    },
    {
      id: 'prereq-web-3',
      title: 'Git & GitHub Version Control',
      description: 'Basic clone, branch, commit, push workflows and opening pull requests.',
      category: 'Tooling',
    },
    {
      id: 'prereq-web-4',
      title: 'Web Architecture & HTTP',
      description: 'How browsers request resources, REST API fundamentals, and status codes (200, 404, 500).',
      category: 'Architecture',
    },
  ],

  // Data Science & Analytics
  'data-science-analytics': [
    {
      id: 'prereq-ds-1',
      title: 'Python for Data Analysis',
      description: 'Pandas dataframes, series manipulation, and handling missing values.',
      category: 'Programming',
    },
    {
      id: 'prereq-ds-2',
      title: 'Descriptive Statistics & Probability',
      description: 'Mean, median, standard deviation, normal distribution, and hypothesis testing basics.',
      category: 'Mathematics',
    },
    {
      id: 'prereq-ds-3',
      title: 'SQL Query Fundamentals',
      description: 'SELECT, WHERE, JOIN, GROUP BY, and aggregate functions for querying relational databases.',
      category: 'Databases',
    },
    {
      id: 'prereq-ds-4',
      title: 'Data Visualization Intuition',
      description: 'Choosing appropriate charts (scatter, bar, histogram, boxplot) to convey insights.',
      category: 'Visualization',
    },
  ],

  // Cloud Computing
  'cloud-computing': [
    {
      id: 'prereq-cloud-1',
      title: 'Computer Networking & Ports',
      description: 'CIDR notation, VPC basics, subnets, routers, firewalls, and ports 80/443/22.',
      category: 'Networking',
    },
    {
      id: 'prereq-cloud-2',
      title: 'Linux Server Administration',
      description: 'SSH key-based access, system processes, user permissions, and package management (apt/yum).',
      category: 'Systems',
    },
    {
      id: 'prereq-cloud-3',
      title: 'Cloud Service Models',
      description: 'Differences between IaaS, PaaS, SaaS, serverless computing, and shared responsibility.',
      category: 'Cloud',
    },
    {
      id: 'prereq-cloud-4',
      title: 'Basic Virtualization & Containers',
      description: 'Basic concept of Docker containers vs Virtual Machines.',
      category: 'DevOps',
    },
  ],

  // UI/UX & Product Design
  'ui-ux-design': [
    {
      id: 'prereq-ux-1',
      title: 'Visual Hierarchy & Typography',
      description: 'Contrast, whitespace, line heights, font pairing, and content scannability.',
      category: 'Visual Design',
    },
    {
      id: 'prereq-ux-2',
      title: 'Figma Basics & Navigation',
      description: 'Frames, shapes, text layers, auto-layout, and exporting assets.',
      category: 'Tools',
    },
    {
      id: 'prereq-ux-3',
      title: 'User-Centered Thinking',
      description: 'Empathy mapping, user personas, problem statement definition, and usability heuristics.',
      category: 'UX Research',
    },
    {
      id: 'prereq-ux-4',
      title: 'Wireframing & Prototyping',
      description: 'Translating concepts from low-fidelity sketches into interactive clickable prototypes.',
      category: 'Prototyping',
    },
  ],

  // Business & Project Management
  'business-project-mgmt': [
    {
      id: 'prereq-biz-1',
      title: 'Agile & Scrum Fundamentals',
      description: 'Sprints, standups, product backlogs, user stories, and retrospectives.',
      category: 'Methodologies',
    },
    {
      id: 'prereq-biz-2',
      title: 'Project Tracking & Collaboration',
      description: 'Familiarity with task boards like Trello, Jira, or Notion.',
      category: 'Tools',
    },
    {
      id: 'prereq-biz-3',
      title: 'Clear Stakeholder Communication',
      description: 'Structuring status updates, managing expectations, and writing concise emails/notes.',
      category: 'Soft Skills',
    },
    {
      id: 'prereq-biz-4',
      title: 'Risk Identification & Scoping',
      description: 'Understanding project constraints: time, budget, scope, and quality trade-offs.',
      category: 'Strategy',
    },
  ],

  // Digital Marketing
  'digital-marketing': [
    {
      id: 'prereq-mkt-1',
      title: 'Customer Journey & Marketing Funnel',
      description: 'Awareness, Consideration, Conversion, Retention (AIDA model).',
      category: 'Strategy',
    },
    {
      id: 'prereq-mkt-2',
      title: 'SEO Basics & Search Intent',
      description: 'On-page keywords, meta tags, search intent, and Google ranking factors.',
      category: 'SEO',
    },
    {
      id: 'prereq-mkt-3',
      title: 'Content Writing & Tone of Voice',
      description: 'Creating clear, persuasive copy tailored for headlines, captions, and call-to-actions.',
      category: 'Content',
    },
    {
      id: 'prereq-mkt-4',
      title: 'Analytics & Basic Metrics',
      description: 'Understanding CTR (Click-Through Rate), CPC, ROI, and basic Google Analytics metrics.',
      category: 'Analytics',
    },
  ],
};

// Course-specific custom overrides for popular courses / certifications
export const SPECIFIC_COURSE_PREREQUISITES: Record<string, CoursePrerequisite[]> = {
  // Google Cybersecurity
  'cert-google-cyber': [
    {
      id: 'cert-gc-1',
      title: 'Computer Hardware & Network Basics',
      description: 'How devices connect to local routers and communicate over the internet.',
      category: 'Foundations',
    },
    {
      id: 'cert-gc-2',
      title: 'Linux Command Line (CLI)',
      description: 'Navigating directories and editing files via bash/terminal.',
      category: 'Operating Systems',
    },
    {
      id: 'cert-gc-3',
      title: 'Foundational SQL Concepts',
      description: 'Basic SQL filtering queries to extract security log events.',
      category: 'Database',
    },
    {
      id: 'cert-gc-4',
      title: 'Basic Python Syntax',
      description: 'Variables, loops, and conditions for security script automation.',
      category: 'Programming',
    },
  ],

  // Meta Front-End Developer
  'cert-meta-front': [
    {
      id: 'cert-mf-1',
      title: 'HTML & CSS Layout Structure',
      description: 'Semantic tags, forms, input types, and CSS selectors.',
      category: 'Markup',
    },
    {
      id: 'cert-mf-2',
      title: 'JavaScript Data Types & Functions',
      description: 'Strings, arrays, objects, functions, and manipulating DOM elements.',
      category: 'JavaScript',
    },
    {
      id: 'cert-mf-3',
      title: 'Browser Developer Tools',
      description: 'Inspecting elements, testing styles, and debugging console errors.',
      category: 'Tools',
    },
    {
      id: 'cert-mf-4',
      title: 'Package Manager (npm/yarn)',
      description: 'Understanding node_modules, package.json, and running scripts.',
      category: 'Environment',
    },
  ],

  // AWS Certified Cloud Practitioner
  'cert-aws-cloud': [
    {
      id: 'cert-aws-1',
      title: 'Basic Computing Architecture',
      description: 'Understanding CPU, storage, memory, and database servers.',
      category: 'Architecture',
    },
    {
      id: 'cert-aws-2',
      title: 'Internet & DNS Protocols',
      description: 'How domain names resolve to IP addresses and SSL/TLS certificates work.',
      category: 'Networking',
    },
    {
      id: 'cert-aws-3',
      title: 'High Availability & Scalability Intuition',
      description: 'Why businesses use redundancy, backups, and load balancing.',
      category: 'Cloud Concepts',
    },
  ],
};

/**
 * Resolves course-specific prerequisites based on course id, subject title, or category.
 */
export function getPrerequisitesForCourse(
  courseIdentifier: string,
  categoryId?: string,
  title?: string
): CoursePrerequisite[] {
  const cleanId = (courseIdentifier || '').toLowerCase().trim();
  const cleanCat = (categoryId || '').toLowerCase().trim();
  const cleanTitle = (title || '').toLowerCase().trim();

  // 1. Direct specific course match
  if (SPECIFIC_COURSE_PREREQUISITES[cleanId]) {
    return SPECIFIC_COURSE_PREREQUISITES[cleanId];
  }

  // 2. Direct category match
  if (COURSE_PREREQUISITES_MAP[cleanCat]) {
    return COURSE_PREREQUISITES_MAP[cleanCat];
  }

  // 3. Subject title keyword match
  if (cleanTitle.includes('cyber') || cleanTitle.includes('security') || cleanId.includes('cyber')) {
    return COURSE_PREREQUISITES_MAP['cybersecurity'];
  }
  if (cleanTitle.includes('ai') || cleanTitle.includes('generative') || cleanTitle.includes('deep learning') || cleanTitle.includes('llm') || cleanId.includes('ai')) {
    return COURSE_PREREQUISITES_MAP['ai-applied-ai'];
  }
  if (cleanTitle.includes('web') || cleanTitle.includes('react') || cleanTitle.includes('full stack') || cleanTitle.includes('frontend') || cleanTitle.includes('backend') || cleanTitle.includes('javascript') || cleanTitle.includes('node')) {
    return COURSE_PREREQUISITES_MAP['web-software-dev'];
  }
  if (cleanTitle.includes('data') || cleanTitle.includes('sql') || cleanTitle.includes('analytics') || cleanTitle.includes('python & dsa') || cleanTitle.includes('python')) {
    return COURSE_PREREQUISITES_MAP['data-science-analytics'];
  }
  if (cleanTitle.includes('cloud') || cleanTitle.includes('aws') || cleanTitle.includes('gcp') || cleanTitle.includes('azure') || cleanTitle.includes('devops')) {
    return COURSE_PREREQUISITES_MAP['cloud-computing'];
  }
  if (cleanTitle.includes('design') || cleanTitle.includes('ui') || cleanTitle.includes('ux') || cleanTitle.includes('figma')) {
    return COURSE_PREREQUISITES_MAP['ui-ux-design'];
  }
  if (cleanTitle.includes('business') || cleanTitle.includes('project') || cleanTitle.includes('scrum') || cleanTitle.includes('agile')) {
    return COURSE_PREREQUISITES_MAP['business-project-mgmt'];
  }
  if (cleanTitle.includes('marketing') || cleanTitle.includes('seo') || cleanTitle.includes('digital')) {
    return COURSE_PREREQUISITES_MAP['digital-marketing'];
  }

  // Default fallback to Web Development foundations
  return COURSE_PREREQUISITES_MAP['web-software-dev'];
}
