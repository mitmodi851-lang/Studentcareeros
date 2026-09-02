/**
 * Student Career OS — Firestore Seed Script
 *
 * Usage:
 *   Against Emulator: npm run seed:emulator
 *   Against Production: npm run seed
 *
 * Requires .env.local to be present with Firebase Admin credentials.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ─── Init Firebase Admin ─────────────────────────────────────────
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`🔧 Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
    admin.initializeApp({ projectId: projectId || 'student-career-os' });
  } else {
    if (!projectId || !clientEmail || !privateKey) {
      console.error('❌ Missing Firebase credentials. Check your .env.local');
      process.exit(1);
    }
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }
}

const db = admin.firestore();

// ─── Categories ──────────────────────────────────────────────────
const categories = [
  { id: 'ai-applied-ai', name: 'Artificial Intelligence & Applied AI', description: 'Build intelligent systems using ML, deep learning, and AI frameworks.', icon: '🤖' },
  { id: 'web-software-dev', name: 'Web & Software Development', description: 'Create modern web apps with frontend, backend, and full-stack skills.', icon: '💻' },
  { id: 'data-science-analytics', name: 'Data Science & Analytics', description: 'Uncover insights through statistical analysis, Python, and data visualization.', icon: '📊' },
  { id: 'cybersecurity', name: 'Cybersecurity', description: 'Protect systems, networks, and data from digital threats.', icon: '🛡️' },
  { id: 'cloud-computing', name: 'Cloud Computing', description: 'Deploy and manage scalable infrastructure on AWS, GCP, and Azure.', icon: '☁️' },
  { id: 'ui-ux-design', name: 'UI/UX & Product Design', description: 'Design intuitive user experiences with research, Figma, and prototyping.', icon: '🎨' },
  { id: 'business-project-mgmt', name: 'Business & Project Management', description: 'Lead teams and deliver projects with agile and strategy.', icon: '📋' },
  { id: 'digital-marketing', name: 'Digital Marketing', description: 'Drive growth with SEO, content marketing, and data-driven campaigns.', icon: '📣' },
];

// ─── Events ──────────────────────────────────────────────────────
const events = [
  {
    title: 'Smart India Hackathon 2026',
    type: 'Hackathon',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-09-15T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-09-17T18:00:00')),
    mode: 'Hybrid',
    organizer: 'Ministry of Education, India',
    location: 'Pan India (Multiple Venues)',
    description: 'Smart India Hackathon is a nationwide initiative to provide students with a platform to solve some of pressing problems we face in our daily lives. Teams of 6 work on government-defined problem statements spanning agriculture, health, finance, and smart cities. A prize pool of ₹1 Crore awaits the top teams.',
    tags: ['government', 'national', 'prize-money', 'innovation'],
    registrationUrl: 'https://www.sih.gov.in',
  },
  {
    title: 'Google I/O Extended — Student Edition',
    type: 'AI Summit',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-09-22T10:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-09-22T17:00:00')),
    mode: 'Online',
    organizer: 'Google Developer Groups',
    location: 'Virtual',
    description: 'A student-focused extension of Google I/O featuring talks on Gemini AI, Google Cloud, and the latest in Android development. Includes hands-on codelabs, Q&A sessions with Googlers, and swag giveaways for participants who complete challenges.',
    tags: ['google', 'ai', 'android', 'cloud'],
    registrationUrl: 'https://gdg.community.dev',
  },
  {
    title: 'HackMIT 2026',
    type: 'Hackathon',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-03T18:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-04T18:00:00')),
    mode: 'Offline',
    organizer: 'MIT',
    location: 'Cambridge, MA, USA',
    description: 'One of the most prestigious college hackathons in the world, hosted by MIT. 1000+ students from top universities gather for 24 hours to build innovative solutions. Sponsored by leading tech companies with prizes exceeding $50,000.',
    tags: ['mit', 'prestigious', 'international', 'innovation'],
    registrationUrl: 'https://hackmit.org',
  },
  {
    title: 'AWS re:Invent Student Day',
    type: 'Workshop',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-10T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-10T16:00:00')),
    mode: 'Online',
    organizer: 'Amazon Web Services',
    location: 'Virtual',
    description: 'A dedicated student track from AWS re:Invent featuring hands-on workshops on serverless computing, machine learning with SageMaker, and cloud security. Participants who complete all modules receive a voucher for an AWS Cloud Practitioner exam.',
    tags: ['aws', 'cloud', 'workshop', 'certification-prep'],
    registrationUrl: 'https://reinvent.awsevents.com',
  },
  {
    title: 'Cybersecurity Awareness Capture The Flag',
    type: 'Competition',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-18T00:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-19T23:59:59')),
    mode: 'Online',
    organizer: 'OWASP Foundation',
    location: 'Virtual',
    description: 'A 48-hour Capture The Flag competition open to all students. Challenges span web security, reverse engineering, cryptography, and forensics. A great entry point into ethical hacking with beginner-friendly tracks and mentors on Discord.',
    tags: ['ctf', 'security', 'ethical-hacking', 'beginner-friendly'],
    registrationUrl: 'https://owasp.org',
  },
  {
    title: 'Figma Design Sprints: Student Challenge',
    type: 'Competition',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-25T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-10-27T21:00:00')),
    mode: 'Online',
    organizer: 'Figma',
    location: 'Virtual',
    description: 'A 48-hour design sprint where student teams redesign a real product experience. Judged by Figma designers on aesthetics, usability, and innovation. Winners receive Figma Professional licenses, swag, and portfolio features.',
    tags: ['design', 'figma', 'ux', 'product'],
    registrationUrl: 'https://figma.com/education',
  },
  {
    title: 'TechCrunch Disrupt — Student Startup Pitch',
    type: 'Competition',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-05T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-06T18:00:00')),
    mode: 'Hybrid',
    organizer: 'TechCrunch',
    location: 'San Francisco, CA + Virtual',
    description: 'TechCrunch Disrupt Battlefield is one of the world\'s most competitive startup competitions. This track is exclusively for student-led startups. Teams pitch to a panel of VCs and tech executives with a $50,000 first prize.',
    tags: ['startup', 'pitch', 'venture-capital', 'entrepreneurship'],
    registrationUrl: 'https://techcrunch.com/events/tc-disrupt',
  },
  {
    title: 'Data Science Bootcamp: ML Fundamentals',
    type: 'Workshop',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-08T10:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-08T14:00:00')),
    mode: 'Online',
    organizer: 'Kaggle & Google',
    location: 'Virtual',
    description: 'A live 4-hour bootcamp covering the fundamentals of machine learning including supervised learning, model evaluation, and feature engineering using Python and scikit-learn. Kaggle notebooks included. Certificate of completion provided.',
    tags: ['machine-learning', 'python', 'kaggle', 'data-science'],
    registrationUrl: 'https://kaggle.com/learn',
  },
  {
    title: 'Microsoft Azure AI Summit',
    type: 'AI Summit',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-12T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-13T17:00:00')),
    mode: 'Hybrid',
    organizer: 'Microsoft',
    location: 'Bangalore, India + Virtual',
    description: 'A two-day AI summit from Microsoft focusing on Azure OpenAI, Copilot extensions, and responsible AI. Includes hands-on labs for building AI-powered applications, sessions by Microsoft MVPs, and a student hackathon on Day 2.',
    tags: ['microsoft', 'azure', 'openai', 'copilot', 'responsible-ai'],
    registrationUrl: 'https://azure.microsoft.com/en-in/events',
  },
  {
    title: 'Meta Frontend Dev Webinar Series',
    type: 'Webinar',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-20T18:30:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-11-20T20:00:00')),
    mode: 'Online',
    organizer: 'Meta Open Source',
    location: 'Virtual',
    description: 'A live webinar by Meta engineers covering React 19 features, concurrent rendering, and best practices for performance optimization in modern React applications. Q&A session included. Recording available after 24 hours.',
    tags: ['react', 'javascript', 'frontend', 'performance'],
    registrationUrl: 'https://developers.facebook.com/events',
  },
  {
    title: 'National Coding Olympiad — College Track',
    type: 'Competition',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-01T10:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-01T16:00:00')),
    mode: 'Online',
    organizer: 'CodeChef & IIT Bombay',
    location: 'Virtual',
    description: 'A competitive programming contest specifically for college students, featuring 6 algorithmic problems across easy, medium, and hard difficulty. Top 100 students are invited to an on-campus finale at IIT Bombay with ₹5 Lakh in prizes.',
    tags: ['competitive-programming', 'algorithms', 'dsa', 'iit'],
    registrationUrl: 'https://codechef.com',
  },
  {
    title: 'UX Research Methods Workshop',
    type: 'Workshop',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-05T11:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-05T15:00:00')),
    mode: 'Online',
    organizer: 'Nielsen Norman Group',
    location: 'Virtual',
    description: 'Learn UX research methods from industry experts at NNG. This workshop covers user interviews, usability testing, affinity mapping, and translating research into actionable design decisions. Case studies from real products included.',
    tags: ['ux-research', 'usability', 'design-thinking', 'product'],
    registrationUrl: 'https://nngroup.com/training',
  },
  {
    title: 'Google Cloud Next — Student Scholarship Track',
    type: 'AI Summit',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-10T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-12T18:00:00')),
    mode: 'Hybrid',
    organizer: 'Google Cloud',
    location: 'Las Vegas, NV + Virtual',
    description: 'Google Cloud Next is the premier cloud conference. Through the Student Scholarship Track, qualified students get free access to 3 days of sessions, hands-on labs in Google Cloud Skills Boost, and exclusive networking with Google engineers.',
    tags: ['google-cloud', 'gcp', 'scholarship', 'networking'],
    registrationUrl: 'https://cloud.google.com/next',
  },
  {
    title: 'Digital Marketing Bootcamp for Students',
    type: 'Workshop',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-15T10:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2026-12-15T13:00:00')),
    mode: 'Online',
    organizer: 'HubSpot Academy',
    location: 'Virtual',
    description: 'A 3-hour intensive workshop covering the fundamentals of digital marketing including SEO, email marketing, social media strategy, and Google Analytics. Participants receive a HubSpot Academy certificate upon completion.',
    tags: ['seo', 'email-marketing', 'analytics', 'hubspot'],
    registrationUrl: 'https://academy.hubspot.com',
  },
  {
    title: 'Web3 & Blockchain Hackathon',
    type: 'Hackathon',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2027-01-10T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2027-01-12T18:00:00')),
    mode: 'Hybrid',
    organizer: 'ETHIndia',
    location: 'Bangalore, India + Virtual',
    description: 'ETHIndia is India\'s biggest Ethereum hackathon. Build dApps, DeFi protocols, NFT platforms, or DAO tools in 48 hours. Mentors from leading Web3 companies, ₹50 Lakh in prizes, and investor connections for the best teams.',
    tags: ['blockchain', 'ethereum', 'web3', 'defi', 'nft'],
    registrationUrl: 'https://ethindia.co',
  },
  {
    title: 'AI Ethics & Responsible Technology Webinar',
    type: 'Webinar',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2027-01-18T16:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2027-01-18T17:30:00')),
    mode: 'Online',
    organizer: 'Partnership on AI',
    location: 'Virtual',
    description: 'A panel discussion featuring researchers from Stanford HAI, Oxford Internet Institute, and industry AI safety teams. Topics include algorithmic bias, AI transparency, and how students can contribute to building ethical AI systems.',
    tags: ['ai-ethics', 'responsible-ai', 'bias', 'safety'],
    registrationUrl: 'https://partnershiponai.org/events',
  },
  {
    title: 'Product Management Summit for Students',
    type: 'AI Summit',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2027-01-24T09:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2027-01-25T17:00:00')),
    mode: 'Offline',
    organizer: 'Product School',
    location: 'Mumbai, India',
    description: 'Two days of PM-focused learning featuring talks by product leaders from Zomato, CRED, and Razorpay. Workshops on product strategy, prioritization frameworks, and breaking into PM roles. Networking dinner included on Day 1.',
    tags: ['product-management', 'strategy', 'career', 'networking'],
    registrationUrl: 'https://productschool.com/events',
  },
  {
    title: 'Open Source Contribution Sprint',
    type: 'Workshop',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2027-02-05T10:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2027-02-05T18:00:00')),
    mode: 'Online',
    organizer: 'GitHub Education',
    location: 'Virtual',
    description: 'Join GitHub Education for a guided open source contribution sprint. Maintainers from popular repos (Next.js, Django, VS Code) will be online to guide first-time contributors. All participants receive GitHub swag and contribution certificates.',
    tags: ['open-source', 'github', 'contribution', 'community'],
    registrationUrl: 'https://education.github.com',
  },
  {
    title: 'Cloud Security Essentials Webinar',
    type: 'Webinar',
    startDate: admin.firestore.Timestamp.fromDate(new Date('2027-02-12T17:00:00')),
    endDate: admin.firestore.Timestamp.fromDate(new Date('2027-02-12T18:30:00')),
    mode: 'Online',
    organizer: 'SANS Institute',
    location: 'Virtual',
    description: 'SANS experts walk through the fundamentals of cloud security including IAM best practices, S3 misconfiguration risks, container security, and zero-trust architecture. Targeted at students exploring cloud and security career paths.',
    tags: ['cloud-security', 'iam', 'aws', 'zero-trust'],
    registrationUrl: 'https://sans.org/webcasts',
  },
];

// ─── Aptitude Questions ───────────────────────────────────────────
const aptitudeQuestions = [
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

// ─── Certifications ───────────────────────────────────────────────
const certifications = [
  // AI & Applied AI
  { id: 'cert-ai-1', name: 'Machine Learning Specialization', provider: 'DeepLearning.AI / Stanford (Coursera)', level: 'Beginner', description: 'Learn the fundamentals of ML including supervised, unsupervised, and reinforcement learning from Andrew Ng — the gold standard for ML education.', categoryId: 'ai-applied-ai', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
  { id: 'cert-ai-2', name: 'Google AI Essentials', provider: 'Google (Coursera)', level: 'Beginner', description: 'A beginner-friendly course covering AI concepts, responsible AI practices, and using generative AI tools in professional workflows.', categoryId: 'ai-applied-ai', url: 'https://www.coursera.org/learn/google-ai-essentials' },
  { id: 'cert-ai-3', name: 'Deep Learning Specialization', provider: 'DeepLearning.AI (Coursera)', level: 'Intermediate', description: 'A 5-course deep dive into neural networks, CNNs, RNNs, and sequence models. Build real projects using TensorFlow with Andrew Ng.', categoryId: 'ai-applied-ai', url: 'https://www.coursera.org/specializations/deep-learning' },
  { id: 'cert-ai-4', name: 'IBM AI Engineering Professional Certificate', provider: 'IBM (Coursera)', level: 'Intermediate', description: 'Covers ML, DL, and AI with IBM tools. Build AI applications using Python, TensorFlow, and Keras across 6 comprehensive courses.', categoryId: 'ai-applied-ai', url: 'https://www.coursera.org/professional-certificates/ai-engineer' },
  { id: 'cert-ai-5', name: 'Google AI Professional Certificate', provider: 'Google Cloud (Coursera)', level: 'Advanced', description: 'Advanced certification covering ML on Google Cloud, including Vertex AI, MLOps, and large language model deployment at scale.', categoryId: 'ai-applied-ai', url: 'https://www.coursera.org/professional-certificates/preparing-for-google-cloud-machine-learning-engineer-professional-certificate' },

  // Web & Software Dev
  { id: 'cert-web-1', name: 'Responsive Web Design', provider: 'freeCodeCamp', level: 'Beginner', description: 'Learn HTML and CSS fundamentals by building 5 real certification projects. The original free web dev certification trusted by millions.', categoryId: 'web-software-dev', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design' },
  { id: 'cert-web-2', name: 'JavaScript Algorithms and Data Structures', provider: 'freeCodeCamp', level: 'Beginner', description: 'Master JavaScript fundamentals, ES6+, regular expressions, debugging, and data structures with 300+ interactive coding challenges.', categoryId: 'web-software-dev', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8' },
  { id: 'cert-web-3', name: 'Meta Front-End Developer Professional Certificate', provider: 'Meta (Coursera)', level: 'Intermediate', description: 'Learn React, HTML/CSS, JavaScript, and version control across 9 courses from Meta engineers. Build a portfolio-ready capstone project.', categoryId: 'web-software-dev', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
  { id: 'cert-web-4', name: 'Meta Back-End Developer Professional Certificate', provider: 'Meta (Coursera)', level: 'Intermediate', description: 'Master Python, Django, REST APIs, databases, and cloud deployment. A comprehensive backend path with a capstone project for your portfolio.', categoryId: 'web-software-dev', url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer' },
  { id: 'cert-web-5', name: 'Full Stack Open', provider: 'University of Helsinki', level: 'Advanced', description: 'A rigorous, free full-stack web development course covering React, Node.js, GraphQL, TypeScript, and CI/CD from a top European university.', categoryId: 'web-software-dev', url: 'https://fullstackopen.com' },

  // Data Science & Analytics
  { id: 'cert-ds-1', name: 'Google Data Analytics Professional Certificate', provider: 'Google (Coursera)', level: 'Beginner', description: 'Learn data analysis with spreadsheets, SQL, Tableau, and R. This 8-course certificate helps you launch a data analytics career in under 6 months.', categoryId: 'data-science-analytics', url: 'https://www.coursera.org/professional-certificates/google-data-analytics' },
  { id: 'cert-ds-2', name: 'IBM Data Science Professional Certificate', provider: 'IBM (Coursera)', level: 'Intermediate', description: '12 courses covering Python, data analysis, visualization, SQL, ML, and real-world data science projects on IBM Cloud.', categoryId: 'data-science-analytics', url: 'https://www.coursera.org/professional-certificates/ibm-data-science' },
  { id: 'cert-ds-3', name: 'Applied Data Science with Python', provider: 'University of Michigan (Coursera)', level: 'Advanced', description: 'A 5-course specialization using Python to analyze, visualize, and model data with pandas, matplotlib, scikit-learn, and NLTK.', categoryId: 'data-science-analytics', url: 'https://www.coursera.org/specializations/data-science-python' },

  // Cybersecurity
  { id: 'cert-sec-1', name: 'Google Cybersecurity Professional Certificate', provider: 'Google (Coursera)', level: 'Beginner', description: 'Learn security fundamentals, network security, Linux, SQL, Python, and SIEM tools across 8 courses. No prior experience needed.', categoryId: 'cybersecurity', url: 'https://www.coursera.org/professional-certificates/google-cybersecurity' },
  { id: 'cert-sec-2', name: 'CompTIA Security+', provider: 'CompTIA', level: 'Intermediate', description: 'The industry-standard entry-level cybersecurity certification recognized by employers worldwide. Validates skills in threats, vulnerabilities, and security architecture.', categoryId: 'cybersecurity', url: 'https://www.comptia.org/certifications/security' },
  { id: 'cert-sec-3', name: 'Certified Ethical Hacker (CEH)', provider: 'EC-Council', level: 'Advanced', description: 'Master ethical hacking methodologies and penetration testing techniques used by professional security experts and red teams globally.', categoryId: 'cybersecurity', url: 'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh' },

  // Cloud Computing
  { id: 'cert-cloud-1', name: 'AWS Cloud Practitioner', provider: 'Amazon Web Services', level: 'Beginner', description: 'The foundational AWS certification covering cloud concepts, core AWS services, security, architecture, and billing. Perfect first cloud cert.', categoryId: 'cloud-computing', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner' },
  { id: 'cert-cloud-2', name: 'Microsoft Azure Fundamentals (AZ-900)', provider: 'Microsoft', level: 'Beginner', description: 'Validates your foundational understanding of cloud services and Microsoft Azure. Great for students new to cloud computing.', categoryId: 'cloud-computing', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals' },
  { id: 'cert-cloud-3', name: 'Google Cloud Digital Leader', provider: 'Google Cloud', level: 'Beginner', description: 'Demonstrates knowledge of cloud concepts and Google Cloud products. Ideal for students exploring cloud career paths.', categoryId: 'cloud-computing', url: 'https://cloud.google.com/learn/certification/cloud-digital-leader' },
  { id: 'cert-cloud-4', name: 'AWS Solutions Architect — Associate', provider: 'Amazon Web Services', level: 'Intermediate', description: 'Learn to design resilient, high-performing, secure, and cost-optimized architectures on AWS. One of the most recognized cloud certs globally.', categoryId: 'cloud-computing', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate' },
  { id: 'cert-cloud-5', name: 'Google Cloud Professional Cloud Architect', provider: 'Google Cloud', level: 'Advanced', description: 'Design, develop, and manage robust, secure, scalable Google Cloud solutions. One of the most prestigious and well-compensated cloud certifications.', categoryId: 'cloud-computing', url: 'https://cloud.google.com/learn/certification/cloud-architect' },

  // UI/UX Design
  { id: 'cert-ux-1', name: 'Google UX Design Professional Certificate', provider: 'Google (Coursera)', level: 'Beginner', description: 'A 7-course program teaching UX research, wireframing, prototyping, and Figma. Build a professional UX portfolio with 3 real case studies.', categoryId: 'ui-ux-design', url: 'https://www.coursera.org/professional-certificates/google-ux-design' },
  { id: 'cert-ux-2', name: 'Interaction Design Foundation UX Courses', provider: 'Interaction Design Foundation', level: 'Intermediate', description: 'Industry-recognized UX courses on design thinking, usability testing, information architecture, and mobile UX from IDF.', categoryId: 'ui-ux-design', url: 'https://www.interaction-design.org/courses' },
  { id: 'cert-ux-3', name: 'Figma Advanced Design Systems', provider: 'Figma (Coursera)', level: 'Advanced', description: 'Master Figma components, auto layout, design tokens, and building scalable design systems used at enterprise product companies.', categoryId: 'ui-ux-design', url: 'https://www.coursera.org/learn/figma-advanced-course' },

  // Business & Project Management
  { id: 'cert-biz-1', name: 'Google Project Management Professional Certificate', provider: 'Google (Coursera)', level: 'Beginner', description: 'Learn project management with agile, Scrum, and traditional methodologies across 6 courses. Prepares you for the CAPM exam.', categoryId: 'business-project-mgmt', url: 'https://www.coursera.org/professional-certificates/google-project-management' },
  { id: 'cert-biz-2', name: 'Product Management Fundamentals', provider: 'Product School (Coursera)', level: 'Intermediate', description: 'Learn product strategy, roadmapping, prioritization, and stakeholder management from experienced PMs at top tech companies.', categoryId: 'business-project-mgmt', url: 'https://www.coursera.org/learn/product-management-fundamentals' },
  { id: 'cert-biz-3', name: 'PMP — Project Management Professional', provider: 'PMI', level: 'Advanced', description: 'The gold standard in project management certification. Recognized worldwide and significantly boosts career prospects in any industry.', categoryId: 'business-project-mgmt', url: 'https://www.pmi.org/certifications/project-management-pmp' },

  // Digital Marketing
  { id: 'cert-mkt-1', name: 'Google Digital Marketing & E-commerce', provider: 'Google (Coursera)', level: 'Beginner', description: 'A 7-course certificate covering digital marketing foundations, SEO, email marketing, Ads, and e-commerce. No experience needed.', categoryId: 'digital-marketing', url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce' },
  { id: 'cert-mkt-2', name: 'HubSpot Content Marketing Certification', provider: 'HubSpot Academy', level: 'Beginner', description: 'A free, comprehensive certification covering content strategy, blogging, video marketing, visual content, and measuring ROI.', categoryId: 'digital-marketing', url: 'https://academy.hubspot.com/courses/content-marketing' },
  { id: 'cert-mkt-3', name: 'Meta Social Media Marketing Professional Certificate', provider: 'Meta (Coursera)', level: 'Intermediate', description: 'Learn to create, manage, and optimize social media campaigns on Facebook and Instagram from Meta marketing experts across 6 courses.', categoryId: 'digital-marketing', url: 'https://www.coursera.org/professional-certificates/facebook-social-media-marketing' },
];

// ─── Main Seed Function ───────────────────────────────────────────
async function seed() {
  console.log('🌱 Starting Student Career OS seed...\n');

  // 1. Seed Categories
  console.log('📁 Seeding categories...');
  for (const cat of categories) {
    await db.collection('categories').doc(cat.id).set(cat);
    console.log(`  ✓ ${cat.name}`);
  }

  // 2. Seed Events
  console.log('\n📅 Seeding events...');
  for (const event of events) {
    const docRef = await db.collection('events').add(event);
    console.log(`  ✓ ${event.title} (${docRef.id})`);
  }

  // 3. Seed Aptitude Questions
  console.log('\n❓ Seeding aptitude questions...');
  for (const q of aptitudeQuestions) {
    await db.collection('aptitudeQuestions').doc(q.id).set(q);
    console.log(`  ✓ Q${q.order}: ${q.text.substring(0, 60)}...`);
  }

  // 4. Seed Certifications
  console.log('\n🏆 Seeding certifications...');
  for (const cert of certifications) {
    await db.collection('certifications').doc(cert.id).set(cert);
    console.log(`  ✓ ${cert.name} [${cert.level}]`);
  }

  console.log('\n✅ Seed complete!');
  console.log(`   ${categories.length} categories`);
  console.log(`   ${events.length} events`);
  console.log(`   ${aptitudeQuestions.length} questions`);
  console.log(`   ${certifications.length} certifications`);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
