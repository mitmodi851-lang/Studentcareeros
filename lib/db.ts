import { db, firestoreAvailable } from '@/lib/firebase-admin';
import type { CareerEvent, Category, AptitudeQuestion, Certification, AptitudeSubmission, User, CourseProgress, PasswordResetToken, ProgressStatus } from '@/types';
import { CATEGORIES } from '@/lib/categories';

// ─── In-Memory Storage Fallback (Active when Firestore emulator is not running) ───
// Using globalThis to survive Next.js hot reloads — otherwise all registered
// users are lost every time a file is saved during development.
declare global {
  // eslint-disable-next-line no-var
  var __inMemoryUsers: Map<string, User & { password_hash: string }> | undefined;
  // eslint-disable-next-line no-var
  var __inMemorySubmissions: Map<string, AptitudeSubmission> | undefined;
  // eslint-disable-next-line no-var
  var __inMemoryCourseProgress: Map<string, CourseProgress> | undefined;
  // eslint-disable-next-line no-var
  var __inMemoryResetTokens: Map<string, PasswordResetToken> | undefined;
}

const inMemoryUsers: Map<string, User & { password_hash: string }> =
  globalThis.__inMemoryUsers ?? (globalThis.__inMemoryUsers = new Map());
const inMemorySubmissions: Map<string, AptitudeSubmission> =
  globalThis.__inMemorySubmissions ?? (globalThis.__inMemorySubmissions = new Map());
const inMemoryCourseProgress: Map<string, CourseProgress> =
  globalThis.__inMemoryCourseProgress ?? (globalThis.__inMemoryCourseProgress = new Map());
const inMemoryResetTokens: Map<string, PasswordResetToken> =
  globalThis.__inMemoryResetTokens ?? (globalThis.__inMemoryResetTokens = new Map());

// In-memory seed datasets
const SEED_EVENTS: CareerEvent[] = [
  {
    id: 'evt-1',
    title: 'Smart India Hackathon 2026',
    type: 'Hackathon',
    startDate: '2026-09-15T09:00:00.000Z',
    endDate: '2026-09-17T18:00:00.000Z',
    mode: 'Hybrid',
    organizer: 'Ministry of Education, India',
    location: 'Pan India (Multiple Venues)',
    description: 'Smart India Hackathon is a nationwide initiative to provide students with a platform to solve pressing problems. Prize pool of ₹1 Crore awaits top teams.',
    tags: ['government', 'national', 'prize-money', 'innovation'],
    registrationUrl: 'https://www.sih.gov.in',
  },
  {
    id: 'evt-2',
    title: 'Google I/O Extended — Student Edition',
    type: 'AI Summit',
    startDate: '2026-09-22T10:00:00.000Z',
    endDate: '2026-09-22T17:00:00.000Z',
    mode: 'Online',
    organizer: 'Google Developer Groups',
    location: 'Virtual',
    description: 'A student-focused extension of Google I/O featuring talks on Gemini AI, Google Cloud, and Android development.',
    tags: ['google', 'ai', 'android', 'cloud'],
    registrationUrl: 'https://gdg.community.dev',
  },
  {
    id: 'evt-3',
    title: 'HackMIT 2026',
    type: 'Hackathon',
    startDate: '2026-10-03T18:00:00.000Z',
    endDate: '2026-10-04T18:00:00.000Z',
    mode: 'Offline',
    organizer: 'MIT',
    location: 'Cambridge, MA, USA',
    description: 'One of the most prestigious college hackathons in the world, hosted by MIT. 1000+ students gather for 24 hours of innovation.',
    tags: ['mit', 'prestigious', 'international', 'innovation'],
    registrationUrl: 'https://hackmit.org',
  },
  {
    id: 'evt-4',
    title: 'AWS re:Invent Student Day',
    type: 'Workshop',
    startDate: '2026-10-10T09:00:00.000Z',
    endDate: '2026-10-10T16:00:00.000Z',
    mode: 'Online',
    organizer: 'Amazon Web Services',
    location: 'Virtual',
    description: 'A dedicated student track from AWS re:Invent featuring hands-on workshops on serverless computing and machine learning.',
    tags: ['aws', 'cloud', 'workshop', 'certification-prep'],
    registrationUrl: 'https://reinvent.awsevents.com',
  },
  {
    id: 'evt-5',
    title: 'Cybersecurity Awareness Capture The Flag',
    type: 'Competition',
    startDate: '2026-10-18T00:00:00.000Z',
    endDate: '2026-10-19T23:59:59.000Z',
    mode: 'Online',
    organizer: 'OWASP Foundation',
    location: 'Virtual',
    description: 'A 48-hour Capture The Flag competition open to all students. Challenges span web security, cryptography, and forensics.',
    tags: ['ctf', 'security', 'ethical-hacking', 'beginner-friendly'],
    registrationUrl: 'https://owasp.org',
  },
  {
    id: 'evt-6',
    title: 'Figma Design Sprints: Student Challenge',
    type: 'Competition',
    startDate: '2026-10-25T09:00:00.000Z',
    endDate: '2026-10-27T21:00:00.000Z',
    mode: 'Online',
    organizer: 'Figma',
    location: 'Virtual',
    description: 'A 48-hour design sprint where student teams redesign a real product experience. Judged by Figma designers.',
    tags: ['design', 'figma', 'ux', 'product'],
    registrationUrl: 'https://figma.com/education',
  },
  {
    id: 'evt-7',
    title: 'TechCrunch Disrupt — Student Startup Pitch',
    type: 'Competition',
    startDate: '2026-11-05T09:00:00.000Z',
    endDate: '2026-11-06T18:00:00.000Z',
    mode: 'Hybrid',
    organizer: 'TechCrunch',
    location: 'San Francisco, CA + Virtual',
    description: 'Student-led startup battlefield pitching to VCs and tech executives with a $50,000 top prize.',
    tags: ['startup', 'pitch', 'venture-capital', 'entrepreneurship'],
    registrationUrl: 'https://techcrunch.com/events/tc-disrupt',
  },
  {
    id: 'evt-8',
    title: 'Data Science Bootcamp: ML Fundamentals',
    type: 'Workshop',
    startDate: '2026-11-08T10:00:00.000Z',
    endDate: '2026-11-08T14:00:00.000Z',
    mode: 'Online',
    organizer: 'Kaggle & Google',
    location: 'Virtual',
    description: 'Live 4-hour bootcamp covering supervised learning, feature engineering, and scikit-learn.',
    tags: ['machine-learning', 'python', 'kaggle', 'data-science'],
    registrationUrl: 'https://kaggle.com/learn',
  },
  {
    id: 'evt-9',
    title: 'Microsoft Azure AI Summit',
    type: 'AI Summit',
    startDate: '2026-11-12T09:00:00.000Z',
    endDate: '2026-11-13T17:00:00.000Z',
    mode: 'Hybrid',
    organizer: 'Microsoft',
    location: 'Bangalore, India + Virtual',
    description: 'Two-day AI summit focusing on Azure OpenAI, Copilot extensions, and responsible AI.',
    tags: ['microsoft', 'azure', 'openai', 'copilot', 'responsible-ai'],
    registrationUrl: 'https://azure.microsoft.com/en-in/events',
  },
  {
    id: 'evt-10',
    title: 'Meta Frontend Dev Webinar Series',
    type: 'Webinar',
    startDate: '2026-11-20T18:30:00.000Z',
    endDate: '2026-11-20T20:00:00.000Z',
    mode: 'Online',
    organizer: 'Meta Open Source',
    location: 'Virtual',
    description: 'Live webinar by Meta engineers covering React 19 features and performance optimization.',
    tags: ['react', 'javascript', 'frontend', 'performance'],
    registrationUrl: 'https://developers.facebook.com/events',
  },
  {
    id: 'evt-11',
    title: 'National Coding Olympiad — College Track',
    type: 'Competition',
    startDate: '2026-12-01T10:00:00.000Z',
    endDate: '2026-12-01T16:00:00.000Z',
    mode: 'Online',
    organizer: 'CodeChef & IIT Bombay',
    location: 'Virtual',
    description: 'Competitive programming contest for college students with ₹5 Lakh in prizes.',
    tags: ['competitive-programming', 'algorithms', 'dsa', 'iit'],
    registrationUrl: 'https://codechef.com',
  },
  {
    id: 'evt-12',
    title: 'UX Research Methods Workshop',
    type: 'Workshop',
    startDate: '2026-12-05T11:00:00.000Z',
    endDate: '2026-12-05T15:00:00.000Z',
    mode: 'Online',
    organizer: 'Nielsen Norman Group',
    location: 'Virtual',
    description: 'Learn user interviews, usability testing, and information architecture from NNG experts.',
    tags: ['ux-research', 'usability', 'design-thinking', 'product'],
    registrationUrl: 'https://nngroup.com/training',
  },
  {
    id: 'evt-13',
    title: 'Google Cloud Next — Student Scholarship Track',
    type: 'AI Summit',
    startDate: '2026-12-10T09:00:00.000Z',
    endDate: '2026-12-12T18:00:00.000Z',
    mode: 'Hybrid',
    organizer: 'Google Cloud',
    location: 'Las Vegas, NV + Virtual',
    description: 'Free scholarship access to 3 days of Google Cloud Next sessions and networking with Google engineers.',
    tags: ['google-cloud', 'gcp', 'scholarship', 'networking'],
    registrationUrl: 'https://cloud.google.com/next',
  },
  {
    id: 'evt-14',
    title: 'Digital Marketing Bootcamp for Students',
    type: 'Workshop',
    startDate: '2026-12-15T10:00:00.000Z',
    endDate: '2026-12-15T13:00:00.000Z',
    mode: 'Online',
    organizer: 'HubSpot Academy',
    location: 'Virtual',
    description: '3-hour intensive workshop covering SEO, email marketing, social media strategy, and Google Analytics.',
    tags: ['seo', 'email-marketing', 'analytics', 'hubspot'],
    registrationUrl: 'https://academy.hubspot.com',
  },
  {
    id: 'evt-15',
    title: 'Web3 & Blockchain Hackathon',
    type: 'Hackathon',
    startDate: '2027-01-10T09:00:00.000Z',
    endDate: '2027-01-12T18:00:00.000Z',
    mode: 'Hybrid',
    organizer: 'ETHIndia',
    location: 'Bangalore, India + Virtual',
    description: 'India\'s biggest Ethereum hackathon with ₹50 Lakh in prizes and VC connections.',
    tags: ['blockchain', 'ethereum', 'web3', 'defi', 'nft'],
    registrationUrl: 'https://ethindia.co',
  },
  {
    id: 'evt-16',
    title: 'AI Ethics & Responsible Technology Webinar',
    type: 'Webinar',
    startDate: '2027-01-18T16:00:00.000Z',
    endDate: '2027-01-18T17:30:00.000Z',
    mode: 'Online',
    organizer: 'Partnership on AI',
    location: 'Virtual',
    description: 'Panel discussion on algorithmic bias, AI safety, and building ethical AI systems.',
    tags: ['ai-ethics', 'responsible-ai', 'bias', 'safety'],
    registrationUrl: 'https://partnershiponai.org/events',
  },
];

const SEED_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q1',
    order: 1,
    text: 'When you get a new smartphone, what is the first thing you typically do?',
    options: [
      { id: 'q1a', text: 'Explore all the AI features and voice assistants', categoryId: 'ai-applied-ai' },
      { id: 'q1b', text: 'Customize the home screen layout and visual design', categoryId: 'ui-ux-design' },
      { id: 'q1c', text: 'Check the security settings and privacy permissions', categoryId: 'cybersecurity' },
      { id: 'q1d', text: 'See how it connects to your other cloud services', categoryId: 'cloud-computing' },
    ],
  },
  {
    id: 'q2',
    order: 2,
    text: 'Your university club needs a website. What role would you most enjoy?',
    options: [
      { id: 'q2a', text: 'Build the entire website — frontend and backend', categoryId: 'web-software-dev' },
      { id: 'q2b', text: 'Design the user interface and user experience', categoryId: 'ui-ux-design' },
      { id: 'q2c', text: 'Plan the social media and content strategy', categoryId: 'digital-marketing' },
      { id: 'q2d', text: 'Manage the project timeline and team coordination', categoryId: 'business-project-mgmt' },
    ],
  },
  {
    id: 'q3',
    order: 3,
    text: 'Which of these side projects sounds most exciting to you?',
    options: [
      { id: 'q3a', text: 'Building a chatbot that answers questions about your campus', categoryId: 'ai-applied-ai' },
      { id: 'q3b', text: 'Analyzing city traffic patterns to find congestion insights', categoryId: 'data-science-analytics' },
      { id: 'q3c', text: 'Creating a browser extension that blocks trackers', categoryId: 'cybersecurity' },
      { id: 'q3d', text: 'Deploying a full-stack app on AWS for thousands of users', categoryId: 'cloud-computing' },
    ],
  },
  {
    id: 'q4',
    order: 4,
    text: 'If you had a free weekend to learn something new, you would most likely study:',
    options: [
      { id: 'q4a', text: 'TensorFlow or PyTorch for building neural networks', categoryId: 'ai-applied-ai' },
      { id: 'q4b', text: 'React or Next.js for building web applications', categoryId: 'web-software-dev' },
      { id: 'q4c', text: 'SQL and Python for cleaning and visualizing datasets', categoryId: 'data-science-analytics' },
      { id: 'q4d', text: 'Figma to prototype a beautiful mobile app', categoryId: 'ui-ux-design' },
    ],
  },
  {
    id: 'q5',
    order: 5,
    text: 'A startup approaches you. Which technical problem would you most enjoy solving?',
    options: [
      { id: 'q5a', text: 'Building their recommendation engine using ML', categoryId: 'ai-applied-ai' },
      { id: 'q5b', text: 'Setting up a secure cloud infrastructure with auto-scaling', categoryId: 'cloud-computing' },
      { id: 'q5c', text: 'Protecting their database and APIs from attacks', categoryId: 'cybersecurity' },
      { id: 'q5d', text: 'Running A/B tests on marketing campaigns to boost signups', categoryId: 'digital-marketing' },
    ],
  },
  {
    id: 'q6',
    order: 6,
    text: 'When you read tech news, which story would you click first?',
    options: [
      { id: 'q6a', text: 'GPT-5 can now reason about complex scientific problems', categoryId: 'ai-applied-ai' },
      { id: 'q6b', text: 'A major company was breached — how the attackers got in', categoryId: 'cybersecurity' },
      { id: 'q6c', text: 'How Netflix uses data to decide which shows to produce', categoryId: 'data-science-analytics' },
      { id: 'q6d', text: 'The product manager who redesigned Google Maps from scratch', categoryId: 'business-project-mgmt' },
    ],
  },
  {
    id: 'q7',
    order: 7,
    text: 'Which statement best describes how you think about problems?',
    options: [
      { id: 'q7a', text: 'I like turning raw data into charts and actionable insights', categoryId: 'data-science-analytics' },
      { id: 'q7b', text: 'I think about how people feel when they use a product', categoryId: 'ui-ux-design' },
      { id: 'q7c', text: 'I prefer writing code that makes complex things automated', categoryId: 'web-software-dev' },
      { id: 'q7d', text: 'I like strategizing how to reach and grow an audience', categoryId: 'digital-marketing' },
    ],
  },
  {
    id: 'q8',
    order: 8,
    text: 'In a group hackathon, which role do you naturally gravitate toward?',
    options: [
      { id: 'q8a', text: 'The developer who builds the core application logic', categoryId: 'web-software-dev' },
      { id: 'q8b', text: 'The designer who creates wireframes and the prototype', categoryId: 'ui-ux-design' },
      { id: 'q8c', text: 'The data person who finds insights from the dataset', categoryId: 'data-science-analytics' },
      { id: 'q8d', text: 'The project lead who keeps the team on track', categoryId: 'business-project-mgmt' },
    ],
  },
  {
    id: 'q9',
    order: 9,
    text: 'If you could get one certification for free today, which would you choose?',
    options: [
      { id: 'q9a', text: 'AWS Certified Cloud Practitioner', categoryId: 'cloud-computing' },
      { id: 'q9b', text: 'Google Cybersecurity Professional Certificate', categoryId: 'cybersecurity' },
      { id: 'q9c', text: 'Google Project Management Professional Certificate', categoryId: 'business-project-mgmt' },
      { id: 'q9d', text: 'HubSpot Digital Marketing Certification', categoryId: 'digital-marketing' },
    ],
  },
  {
    id: 'q10',
    order: 10,
    text: 'What best describes your dream career in 5 years?',
    options: [
      { id: 'q10a', text: 'AI/ML Engineer building intelligent systems at a tech company', categoryId: 'ai-applied-ai' },
      { id: 'q10b', text: 'Full-stack developer shipping features at a fast-growing startup', categoryId: 'web-software-dev' },
      { id: 'q10c', text: 'Senior UX Designer shaping the product experience at a top app', categoryId: 'ui-ux-design' },
      { id: 'q10d', text: 'Cloud Architect designing the infrastructure for a unicorn', categoryId: 'cloud-computing' },
    ],
  },
];

const SEED_CERTS: Certification[] = [
  // AI & Applied AI
  {
    id: 'cert-ai-1',
    name: 'Machine Learning Specialization',
    provider: 'DeepLearning.AI / Stanford (Coursera)',
    officialIssuer: 'Stanford / DeepLearning.AI',
    level: 'Beginner',
    description: 'Master fundamental ML concepts, supervised learning, neural networks, and decision trees guided by Andrew Ng.',
    categoryId: 'ai-applied-ai',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    rating: 4.9,
    recommendationVerdict: 'Excellent Choice',
    whyGood: 'Industry gold standard for ML beginners; taught by AI pioneer Andrew Ng with hands-on Python labs.',
    watchOut: 'Requires basic algebra and basic Python knowledge to get maximum value.',
  },
  {
    id: 'cert-ai-2',
    name: 'Google AI Essentials Certificate',
    provider: 'Google (Coursera)',
    officialIssuer: 'Google',
    level: 'Beginner',
    description: 'Learn how to use generative AI tools, write effective prompts, and integrate AI into daily productivity.',
    categoryId: 'ai-applied-ai',
    url: 'https://www.coursera.org/learn/google-ai-essentials',
    rating: 4.8,
    recommendationVerdict: 'Good for Beginners',
    whyGood: 'Fast 10-hour course directly from Google with zero coding required.',
    watchOut: 'Focuses on practical AI tool usage rather than building custom machine learning models.',
  },
  {
    id: 'cert-ai-3',
    name: 'IBM AI Engineering Professional Certificate',
    provider: 'IBM (Coursera)',
    officialIssuer: 'IBM',
    level: 'Intermediate',
    description: 'Comprehensive 6-course series on Machine Learning, Deep Learning, Keras, TensorFlow, and PyTorch.',
    categoryId: 'ai-applied-ai',
    url: 'https://www.coursera.org/professional-certificates/ai-engineer',
    rating: 4.7,
    recommendationVerdict: 'Industry Standard',
    whyGood: 'Includes portfolio projects, computer vision, and NLP using real IBM Developer Cloud tools.',
    watchOut: 'Paced for 2-3 months; requires solid Python programming background.',
  },
  {
    id: 'cert-ai-4',
    name: 'Deep Learning Specialization',
    provider: 'DeepLearning.AI (Coursera)',
    officialIssuer: 'DeepLearning.AI',
    level: 'Intermediate',
    description: 'Build and train Deep Neural Networks, CNNs, RNNs, LSTMs, and Transformers using TensorFlow.',
    categoryId: 'ai-applied-ai',
    url: 'https://www.coursera.org/specializations/deep-learning',
    rating: 4.9,
    recommendationVerdict: 'Highly Recommended',
    whyGood: 'Covers modern LLMs and deep learning architectures used at top AI labs globally.',
    watchOut: 'More math-intensive (calculus & matrix multiplication).',
  },
  {
    id: 'cert-ai-5',
    name: 'Google Cloud Professional ML Engineer',
    provider: 'Google Cloud',
    officialIssuer: 'Google Cloud',
    level: 'Advanced',
    description: 'Design, build, and productionize ML models using Google Cloud Vertex AI, BigQuery ML, and MLOps.',
    categoryId: 'ai-applied-ai',
    url: 'https://cloud.google.com/learn/certification/machine-learning-engineer',
    rating: 4.8,
    recommendationVerdict: 'Advanced Specialization',
    whyGood: 'Proves enterprise-grade MLOps deployment skills for top tech employer resume screening.',
    watchOut: 'Proctored certification exam requires prior production cloud experience.',
  },

  // Web & Software Dev
  {
    id: 'cert-web-1',
    name: 'Meta Front-End Developer Professional Certificate',
    provider: 'Meta (Coursera)',
    officialIssuer: 'Meta',
    level: 'Beginner',
    description: 'Learn HTML, CSS, JavaScript, React, Version Control (Git), and UX basics from Meta engineers.',
    categoryId: 'web-software-dev',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    rating: 4.8,
    recommendationVerdict: 'Excellent Choice',
    whyGood: 'Directly backed by Meta with full React portfolio project and interview prep.',
    watchOut: 'Subscribers must complete 9 modules to earn the full certificate badge.',
  },
  {
    id: 'cert-web-2',
    name: 'Meta Back-End Developer Professional Certificate',
    provider: 'Meta (Coursera)',
    officialIssuer: 'Meta',
    level: 'Intermediate',
    description: 'Master Python, Django framework, RESTful APIs, MySQL databases, Cloud Hosting, and Docker containerization.',
    categoryId: 'web-software-dev',
    url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer',
    rating: 4.7,
    recommendationVerdict: 'Industry Standard',
    whyGood: 'Covers practical API engineering and cloud deployment used in modern software companies.',
    watchOut: 'Requires basic understanding of programming logic before starting.',
  },
  {
    id: 'cert-web-3',
    name: 'Responsive Web Design Certification',
    provider: 'freeCodeCamp',
    officialIssuer: 'freeCodeCamp',
    level: 'Beginner',
    description: 'Learn modern HTML5, CSS3, Flexbox, CSS Grid, and responsive design by building 5 real projects.',
    categoryId: 'web-software-dev',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design',
    rating: 4.9,
    recommendationVerdict: 'Good for Beginners',
    whyGood: '100% Free self-paced interactive platform with verified shareable certificate.',
    watchOut: 'Entirely text/code based (no video lectures).',
  },
  {
    id: 'cert-web-4',
    name: 'Full Stack Open',
    provider: 'University of Helsinki',
    officialIssuer: 'University of Helsinki',
    level: 'Advanced',
    description: 'Deep dive into modern web development with React, Redux, Node.js, Express, MongoDB, GraphQL, and TypeScript.',
    categoryId: 'web-software-dev',
    url: 'https://fullstackopen.com',
    rating: 4.9,
    recommendationVerdict: 'Highly Recommended',
    whyGood: 'World-renowned university course updated continuously for modern 2026 tech stacks.',
    watchOut: 'Challenging curriculum requiring high dedication and self-learning discipline.',
  },

  // Data Science & Analytics
  {
    id: 'cert-ds-1',
    name: 'Google Data Analytics Professional Certificate',
    provider: 'Google (Coursera)',
    officialIssuer: 'Google',
    level: 'Beginner',
    description: 'Gain entry-level data skills using spreadsheets, SQL, Tableau visualization, and R programming.',
    categoryId: 'data-science-analytics',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    rating: 4.8,
    recommendationVerdict: 'Excellent Choice',
    whyGood: 'Over 1 million graduates; direct pipeline to 150+ employer hiring consortia.',
    watchOut: 'Teaches R language instead of Python for basic analytics.',
  },
  {
    id: 'cert-ds-2',
    name: 'IBM Data Science Professional Certificate',
    provider: 'IBM (Coursera)',
    officialIssuer: 'IBM',
    level: 'Intermediate',
    description: 'Learn Python, SQL, Data Analysis (Pandas, Numpy), Data Visualization (Matplotlib, Seaborn), and Machine Learning.',
    categoryId: 'data-science-analytics',
    url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    rating: 4.7,
    recommendationVerdict: 'Industry Standard',
    whyGood: 'Focuses heavily on Python ecosystem and IBM Cloud Watson Studio hands-on labs.',
    watchOut: 'Takes ~3-5 months at 5-10 hours per week.',
  },
  {
    id: 'cert-ds-3',
    name: 'Applied Data Science with Python',
    provider: 'University of Michigan (Coursera)',
    officialIssuer: 'University of Michigan',
    level: 'Advanced',
    description: '5-course series covering inferential stats, visual analytics, text mining, and social network analysis in Python.',
    categoryId: 'data-science-analytics',
    url: 'https://www.coursera.org/specializations/data-science-python',
    rating: 4.8,
    recommendationVerdict: 'Advanced Specialization',
    whyGood: 'Rigorously academic and practical for landing Data Analyst/Scientist roles.',
    watchOut: 'Assumes prior Python experience.',
  },

  // Cybersecurity
  {
    id: 'cert-sec-1',
    name: 'Google Cybersecurity Professional Certificate',
    provider: 'Google (Coursera)',
    officialIssuer: 'Google',
    level: 'Beginner',
    description: 'Learn SIEM tools, Linux command line, SQL, Python scripting, and incident response for entry cybersecurity jobs.',
    categoryId: 'cybersecurity',
    url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
    rating: 4.8,
    recommendationVerdict: 'Excellent Choice',
    whyGood: 'Prepares students for CompTIA Security+ exam with a 30% discount voucher.',
    watchOut: 'Best combined with hands-on TryHackMe or HackTheBox practice.',
  },
  {
    id: 'cert-sec-2',
    name: 'CompTIA Security+ Certification',
    provider: 'CompTIA',
    officialIssuer: 'CompTIA',
    level: 'Intermediate',
    description: 'Global benchmark for vendor-neutral cybersecurity skills in threat management, cryptography, and risk assessment.',
    categoryId: 'cybersecurity',
    url: 'https://www.comptia.org/certifications/security',
    rating: 4.9,
    recommendationVerdict: 'Industry Standard',
    whyGood: 'Required by government contractors and top IT enterprises worldwide.',
    watchOut: 'Paid proctored exam; requires thorough study of exam objectives.',
  },
  {
    id: 'cert-sec-3',
    name: 'IBM Cybersecurity Analyst Professional Certificate',
    provider: 'IBM (Coursera)',
    officialIssuer: 'IBM',
    level: 'Intermediate',
    description: 'Develop technical expertise in network security, threat intelligence, database vulnerability, and penetration testing.',
    categoryId: 'cybersecurity',
    url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst',
    rating: 4.7,
    recommendationVerdict: 'Highly Recommended',
    whyGood: 'Hands-on practical labs featuring IBM Security QRadar and real security breach scenarios.',
    watchOut: 'Takes approximately 4 months to complete thoroughly.',
  },

  // Cloud Computing
  {
    id: 'cert-cloud-1',
    name: 'AWS Certified Cloud Practitioner',
    provider: 'Amazon Web Services',
    officialIssuer: 'AWS',
    level: 'Beginner',
    description: 'Overall understanding of AWS Cloud platform, security practices, cloud economics, and core services.',
    categoryId: 'cloud-computing',
    url: 'https://aws.amazon.com/certification/certified-cloud-practitioner',
    rating: 4.9,
    recommendationVerdict: 'Excellent Choice',
    whyGood: '#1 foundational cloud credential worldwide; recognized by almost every tech recruiter.',
    watchOut: 'Exam fee is $100; foundational (not deep technical architecture).',
  },
  {
    id: 'cert-cloud-2',
    name: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    provider: 'Microsoft',
    officialIssuer: 'Microsoft',
    level: 'Beginner',
    description: 'Master core cloud concepts, Azure architectural components, governance, security, and enterprise pricing.',
    categoryId: 'cloud-computing',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals',
    rating: 4.8,
    recommendationVerdict: 'Good for Beginners',
    whyGood: 'Free learning paths on Microsoft Learn; huge demand across enterprise corporate environments.',
    watchOut: 'Focuses strictly on Microsoft Azure cloud ecosystem.',
  },
  {
    id: 'cert-cloud-3',
    name: 'Google Cloud Digital Leader Certification',
    provider: 'Google Cloud',
    officialIssuer: 'Google Cloud',
    level: 'Beginner',
    description: 'Demonstrates knowledge of cloud capabilities, Google Cloud products, solutions, and AI infrastructure.',
    categoryId: 'cloud-computing',
    url: 'https://cloud.google.com/learn/certification/cloud-digital-leader',
    rating: 4.7,
    recommendationVerdict: 'Highly Recommended',
    whyGood: 'Great starting point for understanding GCP cloud products and AI offerings.',
    watchOut: 'Best suited for beginners and tech leads.',
  },
  {
    id: 'cert-cloud-4',
    name: 'AWS Certified Solutions Architect — Associate',
    provider: 'Amazon Web Services',
    officialIssuer: 'AWS',
    level: 'Intermediate',
    description: 'Design cost-efficient, fault-tolerant, scalable, and secure distributed systems on AWS.',
    categoryId: 'cloud-computing',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate',
    rating: 4.9,
    recommendationVerdict: 'Industry Standard',
    whyGood: 'Consistently ranked among the highest-paying IT certifications globally.',
    watchOut: 'Challenging scenario-based exam; hands-on AWS console experience recommended.',
  },

  // UI/UX Design
  {
    id: 'cert-ux-1',
    name: 'Google UX Design Professional Certificate',
    provider: 'Google (Coursera)',
    officialIssuer: 'Google',
    level: 'Beginner',
    description: 'Learn the complete UX design process: research, wireframing, Figma prototyping, and usability testing.',
    categoryId: 'ui-ux-design',
    url: 'https://www.coursera.org/professional-certificates/google-ux-design',
    rating: 4.8,
    recommendationVerdict: 'Excellent Choice',
    whyGood: 'Graduate with 3 complete portfolio case studies (mobile app, responsive site, cross-platform experience).',
    watchOut: 'Portfolio building requires dedicated time beyond watching videos.',
  },
  {
    id: 'cert-ux-2',
    name: 'IBM Design Thinking Practitioner',
    provider: 'IBM',
    officialIssuer: 'IBM',
    level: 'Intermediate',
    description: 'Learn Enterprise Design Thinking framework used to align cross-functional teams around human-centered solutions.',
    categoryId: 'ui-ux-design',
    url: 'https://www.ibm.com/design/thinking/page/courses/Practitioner',
    rating: 4.7,
    recommendationVerdict: 'Highly Recommended',
    whyGood: 'Teaches enterprise-level user research and design collaboration methods.',
    watchOut: 'Focuses on design processes and methodology rather than software tools like Figma.',
  },

  // Business & Project Management
  {
    id: 'cert-biz-1',
    name: 'Google Project Management Professional Certificate',
    provider: 'Google (Coursera)',
    officialIssuer: 'Google',
    level: 'Beginner',
    description: 'Master traditional project management, Agile & Scrum frameworks, documentation, and Asana software.',
    categoryId: 'business-project-mgmt',
    url: 'https://www.coursera.org/professional-certificates/google-project-management',
    rating: 4.8,
    recommendationVerdict: 'Excellent Choice',
    whyGood: 'Fulfills the 35 hours of project management education required for PMI CAPM exam.',
    watchOut: 'Covers broad project concepts across software and business domains.',
  },
  {
    id: 'cert-biz-2',
    name: 'IBM Agile Explorer Professional Credential',
    provider: 'IBM',
    officialIssuer: 'IBM',
    level: 'Intermediate',
    description: 'Learn Agile principles, iterative sprint delivery, backlog prioritization, and team leadership.',
    categoryId: 'business-project-mgmt',
    url: 'https://www.ibm.com/training/badge/agile-explorer',
    rating: 4.7,
    recommendationVerdict: 'Industry Standard',
    whyGood: 'Free official IBM digital badge directly shareable on LinkedIn profile.',
    watchOut: 'Best for students who already understand basic software development lifecycle.',
  },

  // Digital Marketing
  {
    id: 'cert-mkt-1',
    name: 'Google Digital Marketing & E-commerce Certificate',
    provider: 'Google (Coursera)',
    officialIssuer: 'Google',
    level: 'Beginner',
    description: 'Learn SEO, Google Ads, social media strategy, email marketing, marketing analytics, and Shopify e-commerce.',
    categoryId: 'digital-marketing',
    url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce',
    rating: 4.8,
    recommendationVerdict: 'Excellent Choice',
    whyGood: 'Covers Google Analytics 4 and Google Ads hands-on tools; top entry certificate for marketers.',
    watchOut: 'Includes 7 courses, requiring ~2-3 months of steady learning.',
  },
  {
    id: 'cert-mkt-2',
    name: 'HubSpot Digital Marketing Certification',
    provider: 'HubSpot Academy',
    officialIssuer: 'HubSpot',
    level: 'Beginner',
    description: 'Learn inbound marketing, content creation, social media strategy, SEO optimization, and paid search advertising.',
    categoryId: 'digital-marketing',
    url: 'https://academy.hubspot.com/courses/digital-marketing',
    rating: 4.9,
    recommendationVerdict: 'Good for Beginners',
    whyGood: '100% Free official certification from HubSpot; highly valued by digital marketing agencies.',
    watchOut: 'Requires passing a timed 60-question multiple choice exam to earn the badge.',
  },
];

// Helper: Try Firestore call first, fallback to memory if Firestore fails or unavailable
async function tryFirestore<T>(
  action: () => Promise<T>,
  fallbackAction: () => Promise<T>
): Promise<T> {
  // Skip Firestore entirely if not available (no real credentials, emulator not running)
  if (!firestoreAvailable) {
    return await fallbackAction();
  }
  try {
    return await action();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // gRPC code 14 = UNAVAILABLE, code 4 = DEADLINE_EXCEEDED
    const errCode = (err as { code?: number }).code;
    if (
      errCode === 14 ||
      errCode === 4 ||
      msg.includes('UNAVAILABLE') ||
      msg.includes('ECONNREFUSED') ||
      msg.includes('No connection established') ||
      msg.includes('credentials') ||
      msg.includes('invalid-credential') ||
      msg.includes('DEADLINE_EXCEEDED')
    ) {
      return await fallbackAction();
    }
    throw err;
  }
}

// ─── Data Access API ─────────────────────────────────────────────────────────

export async function findUserByEmail(email: string) {
  return tryFirestore(
    async () => {
      const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();
      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() } as User & { password_hash: string };
    },
    async () => {
      for (const u of inMemoryUsers.values()) {
        if (u.email.toLowerCase() === email.toLowerCase()) return u;
      }
      return null;
    }
  );
}

export async function createUser(userData: { name: string; email: string; password_hash: string }) {
  return tryFirestore(
    async () => {
      const ref = await db.collection('users').add({
        ...userData,
        email: userData.email.toLowerCase(),
        created_at: new Date().toISOString(),
      });
      return ref.id;
    },
    async () => {
      const id = 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6);
      const user = {
        id,
        name: userData.name,
        email: userData.email.toLowerCase(),
        password_hash: userData.password_hash,
        created_at: new Date().toISOString(),
      };
      inMemoryUsers.set(id, user);
      return id;
    }
  );
}

export async function findUserById(id: string) {
  return tryFirestore(
    async () => {
      const doc = await db.collection('users').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as User;
    },
    async () => {
      return inMemoryUsers.get(id) || null;
    }
  );
}

export async function getEvents(filters: { type?: string; mode?: string; tag?: string; search?: string }) {
  return tryFirestore(
    async () => {
      let query: FirebaseFirestore.Query = db.collection('events').orderBy('startDate', 'asc');
      if (filters.type && filters.type !== 'all') {
        query = db.collection('events').where('type', '==', filters.type).orderBy('startDate', 'asc');
      } else if (filters.mode && filters.mode !== 'all') {
        query = db.collection('events').where('mode', '==', filters.mode).orderBy('startDate', 'asc');
      }
      const snap = await query.get();
      let events: CareerEvent[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title,
          type: d.type,
          startDate: d.startDate.toDate ? d.startDate.toDate().toISOString() : d.startDate,
          endDate: d.endDate.toDate ? d.endDate.toDate().toISOString() : d.endDate,
          mode: d.mode,
          organizer: d.organizer,
          location: d.location,
          description: d.description,
          tags: d.tags ?? [],
          registrationUrl: d.registrationUrl,
        };
      });

      if (filters.tag && filters.tag !== 'all') events = events.filter((e) => e.tags.includes(filters.tag!));
      if (filters.type && filters.type !== 'all' && filters.mode && filters.mode !== 'all') events = events.filter((e) => e.mode === filters.mode);
      if (filters.search) {
        const s = filters.search.toLowerCase();
        events = events.filter((e) => e.title.toLowerCase().includes(s) || e.organizer.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
      }
      return events;
    },
    async () => {
      let events = [...SEED_EVENTS];
      if (filters.type && filters.type !== 'all') events = events.filter((e) => e.type === filters.type);
      if (filters.mode && filters.mode !== 'all') events = events.filter((e) => e.mode === filters.mode);
      if (filters.tag && filters.tag !== 'all') events = events.filter((e) => e.tags.includes(filters.tag!));
      if (filters.search) {
        const s = filters.search.toLowerCase();
        events = events.filter((e) => e.title.toLowerCase().includes(s) || e.organizer.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
      }
      return events;
    }
  );
}

export async function getEventById(id: string) {
  return tryFirestore(
    async () => {
      const doc = await db.collection('events').doc(id).get();
      if (!doc.exists) return null;
      const d = doc.data()!;
      return {
        id: doc.id,
        title: d.title,
        type: d.type,
        startDate: d.startDate.toDate ? d.startDate.toDate().toISOString() : d.startDate,
        endDate: d.endDate.toDate ? d.endDate.toDate().toISOString() : d.endDate,
        mode: d.mode,
        organizer: d.organizer,
        location: d.location,
        description: d.description,
        tags: d.tags ?? [],
        registrationUrl: d.registrationUrl,
      } as CareerEvent;
    },
    async () => {
      return SEED_EVENTS.find((e) => e.id === id) || null;
    }
  );
}

export async function getQuestions() {
  return tryFirestore(
    async () => {
      const snap = await db.collection('aptitudeQuestions').orderBy('order', 'asc').get();
      if (snap.empty) return SEED_QUESTIONS;
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AptitudeQuestion));
    },
    async () => {
      return SEED_QUESTIONS;
    }
  );
}

export async function getCertifications(categoryIds: string[]) {
  return tryFirestore(
    async () => {
      const certSnapshots = await Promise.all(
        categoryIds.map((catId) => db.collection('certifications').where('categoryId', '==', catId).get())
      );
      const levelOrder: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };
      const certs: Certification[] = [];
      for (const snap of certSnapshots) {
        for (const doc of snap.docs) {
          const d = doc.data();
          certs.push({ id: doc.id, ...d } as Certification);
        }
      }
      if (certs.length === 0) {
        return SEED_CERTS.filter((c) => categoryIds.includes(c.categoryId)).sort(
          (a, b) => (levelOrder[a.level] ?? 0) - (levelOrder[b.level] ?? 0)
        );
      }
      return certs.sort((a, b) => (levelOrder[a.level] ?? 0) - (levelOrder[b.level] ?? 0));
    },
    async () => {
      const levelOrder: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };
      return SEED_CERTS.filter((c) => categoryIds.includes(c.categoryId)).sort(
        (a, b) => (levelOrder[a.level] ?? 0) - (levelOrder[b.level] ?? 0)
      );
    }
  );
}

export async function getCategoriesByIds(ids: string[]) {
  return CATEGORIES.filter((c) => ids.includes(c.id));
}

export async function saveSubmission(submissionData: Omit<AptitudeSubmission, 'id'>) {
  return tryFirestore(
    async () => {
      const ref = await db.collection('aptitudeSubmissions').add(submissionData);
      return ref.id;
    },
    async () => {
      const id = 'sub_' + Date.now() + Math.random().toString(36).substring(2, 6);
      const submission: AptitudeSubmission = { id, ...submissionData };
      inMemorySubmissions.set(id, submission);
      return id;
    }
  );
}

export async function getSubmissionById(id: string, userId: string) {
  return tryFirestore(
    async () => {
      const doc = await db.collection('aptitudeSubmissions').doc(id).get();
      if (!doc.exists) return null;
      const data = doc.data()!;
      if (data.userId !== userId) return null;
      return { id: doc.id, ...data } as AptitudeSubmission;
    },
    async () => {
      const sub = inMemorySubmissions.get(id);
      if (!sub || sub.userId !== userId) return null;
      return sub;
    }
  );
}

export async function getUserSubmissions(userId: string) {
  return tryFirestore(
    async () => {
      const snap = await db
        .collection('aptitudeSubmissions')
        .where('userId', '==', userId)
        .orderBy('submittedAt', 'desc')
        .get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AptitudeSubmission));
    },
    async () => {
      const subs: AptitudeSubmission[] = [];
      for (const s of inMemorySubmissions.values()) {
        if (s.userId === userId) subs.push(s);
      }
      return subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }
  );
}

export async function getCertificationById(id: string) {
  return tryFirestore(
    async () => {
      const doc = await db.collection('certifications').doc(id).get();
      if (!doc.exists) {
        return SEED_CERTS.find((c) => c.id === id) || null;
      }
      return { id: doc.id, ...doc.data() } as Certification;
    },
    async () => {
      return SEED_CERTS.find((c) => c.id === id) || null;
    }
  );
}

export async function getUserCourseProgress(userId: string) {
  return tryFirestore(
    async () => {
      const snap = await db
        .collection('courseProgress')
        .where('user_id', '==', userId)
        .get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseProgress));
    },
    async () => {
      const list: CourseProgress[] = [];
      for (const item of inMemoryCourseProgress.values()) {
        if (item.user_id === userId) {
          list.push(item);
        }
      }
      return list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
  );
}

export async function getCourseProgressByCertId(userId: string, certificationId: string) {
  return tryFirestore(
    async () => {
      const snap = await db
        .collection('courseProgress')
        .where('user_id', '==', userId)
        .where('certification_id', '==', certificationId)
        .limit(1)
        .get();
      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() } as CourseProgress;
    },
    async () => {
      for (const item of inMemoryCourseProgress.values()) {
        if (item.user_id === userId && item.certification_id === certificationId) {
          return item;
        }
      }
      return null;
    }
  );
}

export async function upsertCourseProgress(userId: string, certificationId: string, progress: number) {
  const validProgress = Math.max(0, Math.min(100, Math.round(progress)));
  let status: ProgressStatus = 'Not Started';
  if (validProgress === 100) {
    status = 'Completed';
  } else if (validProgress > 0) {
    status = 'In Progress';
  }

  const now = new Date().toISOString();

  return tryFirestore(
    async () => {
      const snap = await db
        .collection('courseProgress')
        .where('user_id', '==', userId)
        .where('certification_id', '==', certificationId)
        .limit(1)
        .get();

      if (!snap.empty) {
        const docRef = snap.docs[0].ref;
        const existingData = snap.docs[0].data();
        const completed_at =
          validProgress === 100
            ? (existingData.completed_at || now)
            : null;

        const updatePayload = {
          progress: validProgress,
          status,
          updated_at: now,
          completed_at,
        };

        await docRef.update(updatePayload);
        return {
          id: snap.docs[0].id,
          user_id: userId,
          certification_id: certificationId,
          ...existingData,
          ...updatePayload,
        } as CourseProgress;
      } else {
        const completed_at = validProgress === 100 ? now : null;
        const newPayload = {
          user_id: userId,
          certification_id: certificationId,
          progress: validProgress,
          status,
          updated_at: now,
          completed_at,
        };
        const ref = await db.collection('courseProgress').add(newPayload);
        return {
          id: ref.id,
          ...newPayload,
        } as CourseProgress;
      }
    },
    async () => {
      let existing: CourseProgress | null = null;
      for (const item of inMemoryCourseProgress.values()) {
        if (item.user_id === userId && item.certification_id === certificationId) {
          existing = item;
          break;
        }
      }

      if (existing) {
        existing.progress = validProgress;
        existing.status = status;
        existing.updated_at = now;
        if (validProgress === 100) {
          existing.completed_at = existing.completed_at || now;
        } else {
          existing.completed_at = null;
        }
        inMemoryCourseProgress.set(existing.id, existing);
        return existing;
      } else {
        const id = 'cp_' + Date.now() + Math.random().toString(36).substring(2, 6);
        const newItem: CourseProgress = {
          id,
          user_id: userId,
          certification_id: certificationId,
          progress: validProgress,
          status,
          updated_at: now,
          completed_at: validProgress === 100 ? now : null,
        };
        inMemoryCourseProgress.set(id, newItem);
        return newItem;
      }
    }
  );
}

// ─── Password Reset Helpers ─────────────────────────────────────────

export async function createPasswordResetToken(email: string) {
  const token = 'rst_' + Date.now() + Math.random().toString(36).substring(2, 10);
  const expires_at = new Date(Date.now() + 3600 * 1000).toISOString();
  const lowerEmail = email.toLowerCase();

  return tryFirestore(
    async () => {
      const ref = await db.collection('passwordResets').add({
        email: lowerEmail,
        token,
        expires_at,
      });
      return { id: ref.id, email: lowerEmail, token, expires_at } as PasswordResetToken;
    },
    async () => {
      const id = 'pr_' + Date.now();
      const tokenObj: PasswordResetToken = { id, email: lowerEmail, token, expires_at };
      inMemoryResetTokens.set(token, tokenObj);
      return tokenObj;
    }
  );
}

export async function findPasswordResetToken(token: string) {
  return tryFirestore(
    async () => {
      const snap = await db.collection('passwordResets').where('token', '==', token).limit(1).get();
      if (snap.empty) return null;
      const doc = snap.docs[0];
      const data = doc.data() as PasswordResetToken;
      if (new Date(data.expires_at).getTime() < Date.now()) {
        return null;
      }
      const { id: _id, ...rest } = data;
      return { id: doc.id, ...rest } as PasswordResetToken;
    },
    async () => {
      const t = inMemoryResetTokens.get(token);
      if (!t) return null;
      if (new Date(t.expires_at).getTime() < Date.now()) {
        return null;
      }
      return t;
    }
  );
}

export async function deletePasswordResetToken(token: string) {
  return tryFirestore(
    async () => {
      const snap = await db.collection('passwordResets').where('token', '==', token).get();
      const batch = db.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    },
    async () => {
      inMemoryResetTokens.delete(token);
    }
  );
}

export async function updateUserPassword(email: string, newPasswordHash: string) {
  const lowerEmail = email.toLowerCase();
  return tryFirestore(
    async () => {
      const snap = await db.collection('users').where('email', '==', lowerEmail).limit(1).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({ password_hash: newPasswordHash });
      }
    },
    async () => {
      for (const u of inMemoryUsers.values()) {
        if (u.email.toLowerCase() === lowerEmail) {
          u.password_hash = newPasswordHash;
          break;
        }
      }
    }
  );
}

