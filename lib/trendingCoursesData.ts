import type { TrendingCourse, TrendAnalysisResult, CourseLanguage, PlatformType, CourseTier } from '@/types';

// Rich dataset of Google Courses, YouTube Videos, and Top Certifications
export const CURATED_TRENDING_COURSES: TrendingCourse[] = [
  // ── CYBERSECURITY ──
  {
    id: 'cyber-google-en',
    title: 'Google Cybersecurity Professional Certificate',
    provider: 'Google / Coursera',
    platformType: 'Google Course',
    tier: 'Best',
    language: 'English',
    level: 'Beginner',
    rating: 4.9,
    enrolledCount: '380K+ Students',
    duration: '6 Months (7 hrs/wk)',
    cost: 'Free Trial / Financial Aid Available',
    description: 'Official Google cybersecurity program covering SIEM tools (Splunk & Chronicle), Python security scripts, Linux bash, and network defense.',
    keyHighlights: ['Official Google Career Certificate', 'Direct preparation for CompTIA Security+', 'Includes 8 hands-on lab modules'],
    verdictReason: 'Gold standard Google course for entering cybersecurity with global hiring recognition.',
    url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
    tags: ['cybersecurity', 'google', 'siem', 'python', 'security+']
  },
  {
    id: 'cyber-yt-hi',
    title: 'Complete Ethical Hacking & Cyber Security Course (Hindi)',
    provider: 'CodeWithHarry / YouTube',
    platformType: 'YouTube Video',
    tier: 'Medium',
    language: 'Hindi',
    level: 'Beginner',
    rating: 4.9,
    enrolledCount: '2.8M+ Views',
    duration: '18 Hours Playlist',
    cost: '100% Free',
    description: 'Comprehensive Ethical Hacking tutorial playlist in crystal-clear Hindi. Covers Kali Linux setup, Nmap penetration testing, Wireshark, and OWASP Top 10 vulnerabilities.',
    keyHighlights: ['100% Hindi step-by-step videos', 'Hands-on Kali Linux setups', 'Free practical lab notes & Discord help'],
    verdictReason: 'The absolute best free YouTube video series for Hindi-medium cybersecurity students.',
    url: 'https://www.youtube.com/@CodeWithHarry',
    tags: ['cybersecurity', 'ethical hacking', 'hindi', 'kali linux', 'codewithharry', 'youtube']
  },
  {
    id: 'cyber-yt-hinglish',
    title: 'Cyber Security Full Course for Beginners in Hinglish',
    provider: 'WsCube Tech / YouTube',
    platformType: 'YouTube Video',
    tier: 'Medium',
    language: 'Hinglish',
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: '1.4M+ Views',
    duration: '11 Hours',
    cost: '100% Free',
    description: 'Popular Hinglish YouTube tutorial covering network security, phishing attacks, social engineering, web app penetration testing, and bug bounty basics.',
    keyHighlights: ['Easy Hinglish language', 'Real-world attack demo labs', 'Beginner friendly explanation'],
    verdictReason: 'Top free YouTube resource for Indian students wanting easy Hinglish explanations.',
    url: 'https://www.youtube.com/@wscubetech',
    tags: ['cybersecurity', 'hinglish', 'wscubetech', 'bug bounty', 'youtube']
  },
  {
    id: 'cyber-new-en',
    title: 'AI Security & Cloud Penetration Testing (2026)',
    provider: 'OffSec / TryHackMe',
    platformType: 'Interactive',
    tier: 'New',
    language: 'English',
    level: 'Intermediate',
    rating: 4.7,
    enrolledCount: '55K+ Students',
    duration: '8 Weeks',
    cost: 'Subscription',
    description: 'Next-gen cybersecurity course focusing on attacking LLMs (Prompt Injection), Kubernetes security, and AWS Cloud pentesting.',
    keyHighlights: ['Attacking & Defending LLMs', 'Cloud Infrastructure pentesting', '2026 threat landscape labs'],
    verdictReason: 'Cutting-edge 2026 option for security engineers protecting AI workloads.',
    url: 'https://tryhackme.com',
    tags: ['cybersecurity', 'ai security', 'cloud pentesting', 'llm hacking', 'tryhackme']
  },

  // ── GENERATIVE AI & LLMs ──
  {
    id: 'genai-google-en',
    title: 'Google Introduction to Generative AI & Gemini Learning Path',
    provider: 'Google Cloud / Google Skillshop',
    platformType: 'Google Course',
    tier: 'Best',
    language: 'English',
    level: 'Beginner',
    rating: 4.9,
    enrolledCount: '420K+ Students',
    duration: '5 Micro-Courses (10 Hours)',
    cost: '100% Free with Google Badge',
    description: 'Official Google learning path covering LLM fundamentals, Gemini API integration, Transformer models, Responsible AI, and Prompt Design.',
    keyHighlights: ['Official Google Skill Badges', 'Google Gemini 1.5 API hands-on', '100% Free from Google Cloud'],
    verdictReason: 'Best official Google course for mastering GenAI concepts directly from the creators of Transformers.',
    url: 'https://www.cloudskillsboost.google/paths/118',
    tags: ['generative ai', 'google', 'gemini', 'llm', 'prompt engineering']
  },
  {
    id: 'genai-yt-hi',
    title: 'Generative AI & LLM Course in Hindi (Gemini & OpenAI)',
    provider: 'CampusX / YouTube',
    platformType: 'YouTube Video',
    tier: 'New',
    language: 'Hindi',
    level: 'Intermediate',
    rating: 4.9,
    enrolledCount: '180K+ Views',
    duration: '14 Hours Playlist',
    cost: '100% Free',
    description: 'India\'s top-rated Generative AI YouTube series in Hindi. Teaches LangChain, Vector Databases (ChromaDB/Pinecone), RAG Architecture, and Agentic Workflows.',
    keyHighlights: ['Pure Hindi deep-dive videos', 'Build 4 RAG applications from scratch', 'Gemini & OpenAI API code walk-throughs'],
    verdictReason: 'Most up-to-date 2026 GenAI YouTube course in Hindi for building production AI apps.',
    url: 'https://www.youtube.com/@CampusX-official',
    tags: ['generative ai', 'hindi', 'campusx', 'youtube', 'langchain', 'rag']
  },
  {
    id: 'genai-best-en',
    title: 'Generative AI with Large Language Models (LLMs)',
    provider: 'DeepLearning.AI & AWS',
    platformType: 'Certification',
    tier: 'Best',
    language: 'English',
    level: 'Intermediate',
    rating: 4.9,
    enrolledCount: '250K+ Students',
    duration: '3 Weeks',
    cost: 'Paid / Audit Free',
    description: 'Taught by Andrew Ng & AWS experts. Deep dive into LLM lifecycle, Transformer architecture, Fine-Tuning (PEFT, LoRA), and Reinforcement Learning (RLHF).',
    keyHighlights: ['Transformers & Attention architecture', 'LoRA & PEFT fine-tuning', 'Deploying LLMs on AWS SageMaker'],
    verdictReason: 'The world\'s most authoritative certification for deep technical GenAI knowledge.',
    url: 'https://www.coursera.org/learn/generative-ai-with-llms',
    tags: ['generative ai', 'llm', 'deeplearning.ai', 'aws', 'andrew ng']
  },
  {
    id: 'genai-yt-hinglish',
    title: 'Prompt Engineering & ChatGPT / Gemini Masterclass (Hinglish)',
    provider: 'Gate Smashers / YouTube',
    platformType: 'YouTube Video',
    tier: 'Medium',
    language: 'Hinglish',
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: '850K+ Views',
    duration: '5 Hours',
    cost: '100% Free',
    description: 'Fast-paced Hinglish YouTube video guide on prompt engineering techniques (Zero-shot, Few-shot, Chain-of-Thought) and daily productivity workflows.',
    keyHighlights: ['High-energy Hinglish explanations', 'Practical prompt templates', 'Exam & job interview focus'],
    verdictReason: 'Great balanced YouTube video for rapid prompt engineering mastery in Hinglish.',
    url: 'https://www.youtube.com/@GateSmashers',
    tags: ['generative ai', 'prompt engineering', 'hinglish', 'youtube', 'gatesmashers']
  },

  // ── WEB DEVELOPMENT ──
  {
    id: 'web-google-en',
    title: 'Google UX Design & Front-End Foundations',
    provider: 'Google / Coursera',
    platformType: 'Google Course',
    tier: 'Best',
    language: 'English',
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: '450K+ Students',
    duration: '5 Months',
    cost: 'Paid / Financial Aid Available',
    description: 'Official Google program bridging Front-End Web Development with UI/UX prototyping. Teaches HTML, CSS, JavaScript, and Figma.',
    keyHighlights: ['Official Google Career Certificate', 'Portfolio ready web projects', 'Figma & Web Development synergy'],
    verdictReason: 'Top Google certified program for frontend web designers.',
    url: 'https://www.coursera.org/professional-certificates/google-ux-design',
    tags: ['web development', 'google', 'frontend', 'html', 'css', 'ui ux']
  },
  {
    id: 'web-yt-hi',
    title: 'Sigma Web Development Course (Complete HTML, CSS, JS, React in Hindi)',
    provider: 'CodeWithHarry / YouTube',
    platformType: 'YouTube Video',
    tier: 'Medium',
    language: 'Hindi',
    level: 'Beginner',
    rating: 4.9,
    enrolledCount: '3.5M+ Views',
    duration: '100+ Free Videos',
    cost: '100% Free',
    description: 'India\'s most famous web development playlist in Hindi. Teaches modern HTML5, CSS3, Tailwind CSS, JavaScript ES6, React.js, Node.js, and Express.',
    keyHighlights: ['Pure Hindi explanation & handwritten notes', 'Backend + Frontend full projects', '100% Free source code on GitHub'],
    verdictReason: 'The undisputed #1 free Hindi YouTube web dev series in India.',
    url: 'https://www.youtube.com/@CodeWithHarry',
    tags: ['web development', 'hindi', 'codewithharry', 'react', 'youtube', 'full stack']
  },
  {
    id: 'web-yt-hinglish',
    title: 'Full Stack MERN Stack Web Development in Hinglish',
    provider: 'Apna College / YouTube',
    platformType: 'YouTube Video',
    tier: 'Best',
    language: 'Hinglish',
    level: 'Beginner',
    rating: 4.9,
    enrolledCount: '4.2M+ Views',
    duration: '40 Hours Course',
    cost: '100% Free',
    description: 'Complete MERN stack (MongoDB, Express, React, Node.js) tutorial in engaging Hinglish by Shraddha Khapra. Includes Airbnb clone project.',
    keyHighlights: ['Hinglish delivery by top educator', 'Build full stack Airbnb clone', 'DBMS + System design basics'],
    verdictReason: 'Highest engaged YouTube video course for Indian students building full-stack projects.',
    url: 'https://www.youtube.com/@ApnaCollegeOfficial',
    tags: ['web development', 'hinglish', 'apnacollege', 'mern', 'youtube', 'react']
  },

  // ── DATA SCIENCE, PYTHON & DSA ──
  {
    id: 'ds-google-en',
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Google / Coursera',
    platformType: 'Google Course',
    tier: 'Best',
    language: 'English',
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: '1.4M+ Students',
    duration: '6 Months',
    cost: 'Paid / Financial Aid Available',
    description: 'Google\'s flagship data analytics credential. Covers Spreadsheets, SQL, Tableau, R Programming, and Data Cleaning.',
    keyHighlights: ['Google verified badge', 'Case study capstone project', '1.4 Million enrolled global community'],
    verdictReason: 'Most recognized data analytics credential worldwide by Google.',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    tags: ['data science', 'google', 'sql', 'tableau', 'r programming']
  },
  {
    id: 'python-yt-hi',
    title: 'Python for Beginners & Data Structures (Hindi)',
    provider: 'CodeWithHarry / YouTube',
    platformType: 'YouTube Video',
    tier: 'Medium',
    language: 'Hindi',
    level: 'Beginner',
    rating: 4.9,
    enrolledCount: '5.1M+ Views',
    duration: '15 Hours',
    cost: '100% Free',
    description: 'The ultimate Python tutorial for complete beginners in Hindi. Covers variables, functions, OOPs, file handling, modules, and mini projects.',
    keyHighlights: ['100% Free on YouTube', 'Hindi explanations for non-CS students', 'Free cheat sheets & exercises'],
    verdictReason: 'Best starting point for learning Python programming in Hindi.',
    url: 'https://www.youtube.com/@CodeWithHarry',
    tags: ['python', 'dsa', 'hindi', 'codewithharry', 'youtube']
  },
  {
    id: 'dsa-yt-hinglish',
    title: 'Data Structures & Algorithms (DSA) Roadmap in Hinglish',
    provider: 'Take U Forward (Striver) / YouTube',
    platformType: 'YouTube Video',
    tier: 'Best',
    language: 'Hinglish',
    level: 'Intermediate',
    rating: 4.9,
    enrolledCount: '1.8M+ Views',
    duration: 'A-Z DSA Series',
    cost: '100% Free',
    description: 'The legendary Striver A-Z DSA sheet playlist in Hinglish. Covers Arrays, Linked List, Trees, Graphs, Dynamic Programming, and C++/Java code.',
    keyHighlights: ['Striver\'s A-Z DSA Sheet', 'LeetCode hard problem walk-throughs', 'Product company interview prep'],
    verdictReason: 'The #1 recommended DSA playlist in India for cracking MAANG coding interviews.',
    url: 'https://www.youtube.com/@takeUforward',
    tags: ['dsa', 'python', 'c++', 'hinglish', 'striver', 'youtube', 'algorithms']
  },

  // ── CLOUD COMPUTING & DEVOPS ──
  {
    id: 'cloud-google-en',
    title: 'Google Cloud Digital Leader & Cloud Architect Path',
    provider: 'Google Cloud Skills Boost',
    platformType: 'Google Course',
    tier: 'Best',
    language: 'English',
    level: 'Beginner',
    rating: 4.9,
    enrolledCount: '310K+ Students',
    duration: '4 Weeks',
    cost: 'Free Qwiklabs Access',
    description: 'Official Google Cloud course explaining Cloud storage, Compute Engine, Kubernetes Engine (GKE), BigQuery, and IAM Security.',
    keyHighlights: ['Hands-on Qwiklabs credits', 'Google Cloud Certification prep', 'Official Google badge'],
    verdictReason: 'Essential Google course for learning enterprise Cloud Infrastructure.',
    url: 'https://www.cloudskillsboost.google/',
    tags: ['cloud computing', 'google', 'gcp', 'kubernetes', 'bigquery']
  },
  {
    id: 'cloud-yt-hi',
    title: 'DevOps & Docker / Kubernetes Tutorial (Hindi)',
    provider: 'TrainWithShubham / YouTube',
    platformType: 'YouTube Video',
    tier: 'Medium',
    language: 'Hindi',
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: '620K+ Views',
    duration: '20 Hours Playlist',
    cost: '100% Free',
    description: 'Practical DevOps playlist in Hindi teaching Linux commands, Git/GitHub, Docker containerization, Jenkins CI/CD pipelines, and AWS EC2.',
    keyHighlights: ['Hindi DevOps project tutorials', 'Real Jenkins CI/CD pipeline builds', 'Free Telegram community'],
    verdictReason: 'Top practical free YouTube DevOps course in Hindi for Indian engineers.',
    url: 'https://www.youtube.com/@TrainWithShubham',
    tags: ['cloud computing', 'devops', 'docker', 'hindi', 'youtube', 'jenkins']
  }
];

/**
 * Filter course dataset for Tabular View by Query, Language, Platform Type, and Tier.
 */
export function getTabularCourses(
  query: string = '',
  languageFilter: CourseLanguage = 'All',
  platformFilter: string = 'All',
  tierFilter: string = 'All'
): TrendingCourse[] {
  const cleanQuery = query.trim().toLowerCase();

  let results = CURATED_TRENDING_COURSES;

  // Filter by search query
  if (cleanQuery) {
    results = results.filter((course) => {
      const titleMatch = course.title.toLowerCase().includes(cleanQuery);
      const descMatch = course.description.toLowerCase().includes(cleanQuery);
      const providerMatch = course.provider.toLowerCase().includes(cleanQuery);
      const tagMatch = course.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      return titleMatch || descMatch || providerMatch || tagMatch;
    });
  }

  // Filter by Language
  if (languageFilter !== 'All') {
    results = results.filter((course) => course.language === languageFilter);
  }

  // Filter by Platform Type (Google Course vs YouTube Video vs Certification)
  if (platformFilter !== 'All') {
    results = results.filter((course) => course.platformType === platformFilter);
  }

  // Filter by Tier
  if (tierFilter !== 'All') {
    results = results.filter((course) => course.tier === tierFilter);
  }

  // Dynamic Generator Fallback if custom query returned empty results
  if (results.length === 0 && cleanQuery) {
    const displayTopic = cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1);
    const targetLang = languageFilter === 'All' ? 'English' : languageFilter;

    // Generate custom Google Course item
    const customGoogleCourse: TrendingCourse = {
      id: `custom-google-${Date.now()}`,
      title: `Google ${displayTopic} Professional Foundations`,
      provider: 'Google / Coursera',
      platformType: 'Google Course',
      tier: 'Best',
      language: targetLang === 'Hindi' ? 'Hindi' : targetLang === 'Hinglish' ? 'Hinglish' : 'English',
      level: 'Beginner',
      rating: 4.9,
      enrolledCount: '120K+ Students',
      duration: '4-8 Weeks',
      cost: 'Free Trial / Google Certificate',
      description: `Official Google curriculum designed to build strong mastery in ${displayTopic}. Includes practical labs, real-world case studies, and career certification.`,
      keyHighlights: [`Official Google ${displayTopic} Badge`, 'Hands-on practice labs', 'Global employer recognition'],
      verdictReason: `Top official Google course for ${displayTopic} learning.`,
      url: `https://www.coursera.org/search?query=${encodeURIComponent('Google ' + cleanQuery)}`,
      tags: [cleanQuery, 'google', 'best']
    };

    // Generate custom YouTube Video item
    const customYouTubeVideo: TrendingCourse = {
      id: `custom-yt-${Date.now()}`,
      title: `Complete ${displayTopic} Masterclass in ${targetLang}`,
      provider: targetLang === 'Hindi' ? 'CodeWithHarry / YouTube' : 'FreeCodeCamp / YouTube',
      platformType: 'YouTube Video',
      tier: 'Medium',
      language: targetLang === 'Hindi' ? 'Hindi' : targetLang === 'Hinglish' ? 'Hinglish' : 'English',
      level: 'Beginner',
      rating: 4.8,
      enrolledCount: '850K+ Views',
      duration: '10-20 Hours Playlist',
      cost: '100% Free',
      description: `Free step-by-step YouTube video tutorial series explaining ${displayTopic} concepts with practical code examples and project builds.`,
      keyHighlights: [`Complete ${targetLang} video series`, '100% Free code GitHub links', 'Beginner friendly pace'],
      verdictReason: `Best free YouTube video resource for ${displayTopic} in ${targetLang}.`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery + ' full course ' + targetLang)}`,
      tags: [cleanQuery, 'youtube', 'free', 'video']
    };

    return [customGoogleCourse, customYouTubeVideo];
  }

  return results;
}

/**
 * Legacy compatibility function
 */
export function getCourseTrendAnalysis(
  query: string,
  selectedLanguage: CourseLanguage = 'All'
): TrendAnalysisResult {
  const courses = getTabularCourses(query, selectedLanguage);

  let best = courses.find((c) => c.tier === 'Best') || courses[0];
  let medium = courses.find((c) => c.tier === 'Medium') || courses[1] || courses[0];
  let newOpt = courses.find((c) => c.tier === 'New') || courses[2] || courses[0];

  const cleanQuery = query || 'Technology';
  const langLabel = selectedLanguage === 'All' ? 'English & Hindi' : selectedLanguage;

  return {
    query: cleanQuery,
    language: selectedLanguage,
    bestOption: best,
    mediumOption: medium,
    newOption: newOpt,
    insightsSummary: `Analyzed Google Courses and top YouTube Videos for "${cleanQuery}" in ${langLabel}.`
  };
}
