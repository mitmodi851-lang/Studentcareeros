'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { CategoryId, CareerPathDetails } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import { CAREER_SIMULATOR_PATHS } from '@/lib/simulatorData';

// Extended details for tracks to ensure all 8 tracks have rich tools & project cards
const TRACK_EXTRAS: Record<
  CategoryId,
  {
    shortName: string;
    salary: string;
    tools: string[];
    extraProjects: { id: string; title: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced' }[];
  }
> = {
  'ai-applied-ai': {
    shortName: 'AI / Machine Learning',
    salary: 'Avg $120k - $160k',
    tools: ['Jupyter', 'HuggingFace', 'MLflow', 'Docker', 'Git', 'LangChain', 'OpenCV'],
    extraProjects: [
      { id: '01', title: 'Custom RAG Chatbot powered by Gemini API', difficulty: 'Beginner' },
      { id: '02', title: 'Real-time Object Detection with OpenCV & YOLO', difficulty: 'Intermediate' },
      { id: '03', title: 'Customer Churn Prediction model with XGBoost', difficulty: 'Intermediate' },
      { id: '04', title: 'Image Style Transfer Neural Network', difficulty: 'Advanced' },
    ],
  },
  'web-software-dev': {
    shortName: 'Web Development',
    salary: 'Avg $85k - $130k',
    tools: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Vercel'],
    extraProjects: [
      { id: '01', title: 'Real-Time Collaborative Markdown Editor', difficulty: 'Beginner' },
      { id: '02', title: 'Full-Stack E-Commerce Platform with Stripe Checkout', difficulty: 'Intermediate' },
      { id: '03', title: 'Microservices Task Orchestrator with Redis & BullMQ', difficulty: 'Intermediate' },
      { id: '04', title: 'High-Concurrency Chat Application with WebSockets', difficulty: 'Advanced' },
    ],
  },
  'cybersecurity': {
    shortName: 'Cybersecurity',
    salary: 'Avg $95k - $155k',
    tools: ['Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'Snort', 'Python'],
    extraProjects: [
      { id: '01', title: 'Vulnerability Scanner & Network Port Mapper', difficulty: 'Beginner' },
      { id: '02', title: 'Zero-Trust Identity & Access Management Proxy', difficulty: 'Intermediate' },
      { id: '03', title: 'Malware Sandboxing & Static Analysis Pipeline', difficulty: 'Intermediate' },
      { id: '04', title: 'Automated SIEM Log Ingestion & Threat Detector', difficulty: 'Advanced' },
    ],
  },
  'cloud-computing': {
    shortName: 'Cloud Computing',
    salary: 'Avg $95k - $150k',
    tools: ['AWS', 'Google Cloud', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'Prometheus'],
    extraProjects: [
      { id: '01', title: 'Automated Serverless Thumbnail Resizer (AWS Lambda)', difficulty: 'Beginner' },
      { id: '02', title: 'Multi-Region Kubernetes Microservices Cluster', difficulty: 'Intermediate' },
      { id: '03', title: 'Infrastructure as Code Deployment using Terraform', difficulty: 'Intermediate' },
      { id: '04', title: 'FinOps Cloud Cost Optimization Bot with Metric Alarms', difficulty: 'Advanced' },
    ],
  },
  'data-science-analytics': {
    shortName: 'Data Science',
    salary: 'Avg $90k - $145k',
    tools: ['Python', 'Pandas', 'SQL', 'Tableau', 'Scikit-Learn', 'PowerBI', 'Spark'],
    extraProjects: [
      { id: '01', title: 'Exploratory Data Analysis Dashboard on Student Mobility', difficulty: 'Beginner' },
      { id: '02', title: 'Predictive Hospital Readmission Classification Model', difficulty: 'Intermediate' },
      { id: '03', title: 'Automated ETL Pipeline with dbt & BigQuery', difficulty: 'Intermediate' },
      { id: '04', title: 'Real-Time Fraud Detection Stream using PySpark', difficulty: 'Advanced' },
    ],
  },
  'ui-ux-design': {
    shortName: 'UI/UX Design',
    salary: 'Avg $75k - $130k',
    tools: ['Figma', 'FigJam', 'Framer', 'Design Tokens', 'Maze', 'Notion', 'Adobe XD'],
    extraProjects: [
      { id: '01', title: 'Fintech Mobile App Onboarding Redesign & User Testing', difficulty: 'Beginner' },
      { id: '02', title: 'Comprehensive Accessible Multi-Brand Design System', difficulty: 'Intermediate' },
      { id: '03', title: 'Interactive High-Fidelity Prototype with Micro-Interactions', difficulty: 'Intermediate' },
      { id: '04', title: 'SaaS Analytics Dashboard Information Architecture Overhaul', difficulty: 'Advanced' },
    ],
  },
  'business-project-mgmt': {
    shortName: 'Software & Product',
    salary: 'Avg $85k - $140k',
    tools: ['Jira', 'Agile/Scrum', 'Mixpanel', 'Linear', 'SQL', 'Notion', 'Miro'],
    extraProjects: [
      { id: '01', title: 'Product Requirements Document (PRD) for EdTech Mobile App', difficulty: 'Beginner' },
      { id: '02', title: 'Sprint Backlog & Velocity Dashboard using Agile Frameworks', difficulty: 'Intermediate' },
      { id: '03', title: 'User Cohort Funnel Analysis & Churn Reduction Roadmap', difficulty: 'Intermediate' },
      { id: '04', title: 'Market Opportunity Sizing & GTM Strategy for B2B SaaS', difficulty: 'Advanced' },
    ],
  },
  'digital-marketing': {
    shortName: 'Digital Growth',
    salary: 'Avg $70k - $125k',
    tools: ['Google Analytics 4', 'Ahrefs', 'Semrush', 'HubSpot', 'Meta Ads', 'Search Console', 'Canva'],
    extraProjects: [
      { id: '01', title: 'Full SEO Audit & Keyword Gap Analysis for Startup Blog', difficulty: 'Beginner' },
      { id: '02', title: 'Automated Email Nurture Sequence with 40%+ Open Rates', difficulty: 'Intermediate' },
      { id: '03', title: 'Omnichannel Paid Ads Performance & CAC Optimization Model', difficulty: 'Intermediate' },
      { id: '04', title: 'Viral Growth Loop & Content Distribution Engine', difficulty: 'Advanced' },
    ],
  },
};

// Default Roadmap Steps if needed for detailed breakdown
const DEFAULT_DETAILED_STEPS: Record<
  CategoryId,
  { title: string; desc: string }[]
> = {
  'ai-applied-ai': [
    { title: 'Python Fundamentals', desc: 'Master data structures, OOP, and scientific libraries (NumPy, Pandas).' },
    { title: 'Math & Statistics', desc: 'Linear algebra, probability, calculus, and matrix calculus essentials.' },
    { title: 'Machine Learning', desc: 'Supervised & unsupervised algorithms, feature engineering, and cross-validation.' },
    { title: 'Deep Learning & Neural Nets', desc: 'Build CNNs, RNNs, and Transformers using PyTorch or TensorFlow.' },
    { title: 'Portfolio Projects', desc: 'Develop real-world AI applications (e.g., custom RAG agent, image classifier).' },
    { title: 'Internship & Research', desc: 'Gain industry experience or publish open source AI models.' },
    { title: 'AI / ML Specialist Career', desc: 'Deploy models in production like an MLOps engineer.' },
  ],
  'web-software-dev': [
    { title: 'Modern JavaScript & TypeScript', desc: 'Master ES6+, asynchronous promises, strong types, and DOM fundamentals.' },
    { title: 'React & Component Architecture', desc: 'Hooks, state management, memoization, and component design patterns.' },
    { title: 'Full-Stack Next.js App Router', desc: 'Server components, API routes, streaming SSR, and SEO best practices.' },
    { title: 'Databases & Backend APIs', desc: 'PostgreSQL, ORMs (Prisma), REST & GraphQL API security and caching.' },
    { title: 'Full-Stack Portfolio Projects', desc: 'Build end-to-end applications with authentication, payments, and deployment.' },
    { title: 'Testing & CI/CD Pipelines', desc: 'Unit testing with Vitest/Jest, end-to-end testing with Playwright, and GitHub Actions.' },
    { title: 'Software Engineer Role', desc: 'Join engineering teams building resilient, scalable web products.' },
  ],
  'cybersecurity': [
    { title: 'Networking & OS Internals', desc: 'TCP/IP stack, DNS, subnetting, Linux systems, and command-line forensics.' },
    { title: 'Security Principles & Cryptography', desc: 'Public key crypto, hashing, TLS/SSL, and authentication architectures.' },
    { title: 'Threat Analysis & Defense', desc: 'Firewalls, IDS/IPS, vulnerability scanning, and Wireshark packet inspection.' },
    { title: 'Ethical Hacking & Web App Security', desc: 'OWASP Top 10 vulnerabilities, penetration testing tools, and Burp Suite.' },
    { title: 'Hands-on CTF Competitions', desc: 'Solve live Capture The Flag security challenges in cryptography and binary analysis.' },
    { title: 'Security Certifications Prep', desc: 'Prepare for CompTIA Security+, CEH, or AWS Security Specialty.' },
    { title: 'Cybersecurity Analyst Career', desc: 'Monitor SOC alerts, incident response, and protect enterprise infrastructure.' },
  ],
  'cloud-computing': [
    { title: 'Cloud Core Concepts', desc: 'Virtual machines, object storage, IAM access control, and cloud VPC networks.' },
    { title: 'Containerization with Docker', desc: 'Dockerfiles, multi-stage builds, container security, and local orchestration.' },
    { title: 'Container Orchestration with Kubernetes', desc: 'Pods, Deployments, Services, Ingress, and Helm chart deployments.' },
    { title: 'Infrastructure as Code (Terraform)', desc: 'Declarative resource provisioning, state locking, and modular cloud architectures.' },
    { title: 'CI/CD & Cloud Monitoring', desc: 'Automated GitHub Actions pipelines, Prometheus metrics, and Grafana dashboards.' },
    { title: 'Cloud Architect Certification', desc: 'AWS Solutions Architect Associate or Google Cloud Associate Cloud Engineer.' },
    { title: 'Cloud & DevOps Engineer Career', desc: 'Manage high-availability multi-region cloud infrastructures in production.' },
  ],
  'data-science-analytics': [
    { title: 'Python & SQL Mastery', desc: 'Complex relational joins, window functions, and Pandas data manipulation.' },
    { title: 'Statistical Modeling & Hypothesis Testing', desc: 'Distributions, p-values, A/B testing frameworks, and confidence intervals.' },
    { title: 'Data Cleaning & Feature Engineering', desc: 'Handling missing values, outlier detection, scaling, and categorical encoding.' },
    { title: 'Applied Machine Learning', desc: 'Supervised regression, classification with Scikit-Learn, and model metrics.' },
    { title: 'Interactive BI Dashboards', desc: 'Crafting storytelling visualizations in Tableau, PowerBI, or Streamlit.' },
    { title: 'Big Data & Cloud Warehouses', desc: 'Google BigQuery, Snowflake, and basic PySpark cluster transformations.' },
    { title: 'Data Scientist / Analyst Career', desc: 'Deliver actionable revenue, product, and customer insights to leadership.' },
  ],
  'ui-ux-design': [
    { title: 'Design Principles & Visual Hierarchy', desc: 'Typography, grid systems, contrast ratios, color theory, and accessibility (WCAG).' },
    { title: 'User Research & Personas', desc: 'User interviews, journey mapping, empathy maps, and competitor benchmarking.' },
    { title: 'Wireframing & Information Architecture', desc: 'Low-fidelity sketching, card sorting, user flows, and site architecture maps.' },
    { title: 'High-Fidelity Prototyping in Figma', desc: 'Auto-layout, variables, components, interactive state variants, and animations.' },
    { title: 'Design Systems & Token Architecture', desc: 'Creating scalable design systems handoff-ready for frontend developers.' },
    { title: 'Usability Testing & Iteration', desc: 'Unmoderated user testing via Maze, heuristic evaluations, and analytics feedback.' },
    { title: 'Product & UI/UX Designer Career', desc: 'Design delightful software experiences used by millions of customers.' },
  ],
  'business-project-mgmt': [
    { title: 'Agile & Scrum Methodologies', desc: 'Sprint planning, user stories, retrospectives, and Jira board optimization.' },
    { title: 'Product Discovery & Customer Research', desc: 'Problem definition, user interviews, feature validation, and value proposition design.' },
    { title: 'Roadmapping & Prioritization Frameworks', desc: 'RICE scoring, MoSCoW prioritization, and measurable OKR goal setting.' },
    { title: 'Data-Driven Product Analytics', desc: 'North Star metrics, user retention funnels, churn tracking, and Mixpanel analytics.' },
    { title: 'Cross-Functional Stakeholder Leadership', desc: 'Collaborating with engineers, designers, marketing, and executive sponsors.' },
    { title: 'Product Strategy & GTM Execution', desc: 'Go-to-market launch checklists, pricing strategies, and product release cycles.' },
    { title: 'Product Manager Career', desc: 'Lead high-impact engineering squads building transformative technology products.' },
  ],
  'digital-marketing': [
    { title: 'Digital Growth Foundations', desc: 'Inbound marketing funnels, customer acquisition cost (CAC), and LTV economics.' },
    { title: 'Search Engine Optimization (SEO)', desc: 'On-page SEO, technical audits, backlink outreach, and keyword clustering.' },
    { title: 'Content & Social Strategy', desc: 'Audience persona targeting, viral storytelling, and thought leadership campaigns.' },
    { title: 'Paid Performance Advertising', desc: 'Google Search Ads, Meta performance marketing, pixel tracking, and ROAS optimization.' },
    { title: 'Marketing Analytics & Attribution', desc: 'Google Analytics 4 setup, conversion tracking, UTM tagging, and funnel analysis.' },
    { title: 'Conversion Rate Optimization (CRO)', desc: 'Landing page copy, A/B testing headlines, and lead capture optimization.' },
    { title: 'Growth Marketer Career', desc: 'Drive sustainable, multi-channel user acquisition and brand expansion.' },
  ],
};

export default function CareerSimulatorPage() {
  const { data: session } = useSession();
  const [selectedCareerId, setSelectedCareerId] = useState<CategoryId>('ai-applied-ai');
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [userTopCategories, setUserTopCategories] = useState<string[]>([]);

  // Load user's aptitude test result if available
  useEffect(() => {
    async function loadUserAptitude() {
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            if (data.submissions && data.submissions.length > 0) {
              const latest = data.submissions[0];
              if (latest.topCategoryIds && latest.topCategoryIds.length > 0) {
                setUserTopCategories(latest.topCategoryIds);
                // Pre-select user's top aptitude field if valid
                if (latest.topCategoryIds[0] in CAREER_SIMULATOR_PATHS) {
                  setSelectedCareerId(latest.topCategoryIds[0] as CategoryId);
                }
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }
    loadUserAptitude();
  }, [session]);

  const activeCareer: CareerPathDetails = useMemo(() => {
    return CAREER_SIMULATOR_PATHS[selectedCareerId] || CAREER_SIMULATOR_PATHS['ai-applied-ai'];
  }, [selectedCareerId]);

  const extras = TRACK_EXTRAS[selectedCareerId] || TRACK_EXTRAS['ai-applied-ai'];
  const detailedSteps = DEFAULT_DETAILED_STEPS[selectedCareerId] || DEFAULT_DETAILED_STEPS['ai-applied-ai'];

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) => {
      const current = prev[selectedCareerId] || [];
      const updated = current.includes(stepIndex)
        ? current.filter((i) => i !== stepIndex)
        : [...current, stepIndex];
      return { ...prev, [selectedCareerId]: updated };
    });
  };

  const stepsDone = completedSteps[selectedCareerId] || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#080d1a] text-gray-100 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb Pill */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-[#0f172a] border border-blue-900/40 text-blue-400 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-inner">
            <span>🧭</span>
            <span>SCO COMMUNITY NETWORK</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Career Path Simulator</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Career Path Simulator
          </h1>
          <p className="text-sm text-gray-400 max-w-3xl mt-1.5 leading-relaxed">
            Experiment with different technology domains to visualize step-by-step career roadmaps, key skills, and real-world project ideas.
          </p>

          {/* Tip Callout Banner */}
          <div className="mt-3.5 inline-flex items-center gap-2 bg-[#0f172a] border border-blue-900/40 text-blue-300 text-xs px-3.5 py-2 rounded-lg">
            <span>💡</span>
            <span>
              <strong>Tip:</strong> Explore learning paths below, and take our career quiz to discover recommendations!
            </span>
          </div>
        </div>

        {/* Aptitude Match Callout (if student completed test) */}
        {userTopCategories.length > 0 && (
          <div className="mb-6 p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🎯</span>
              <span>
                <strong>Aptitude Assessment Match:</strong> Your top recommended tracks based on your quiz results are{' '}
                <span className="font-bold underline text-white">
                  {userTopCategories
                    .map((id) => CATEGORIES.find((c) => c.id === id)?.name)
                    .filter(Boolean)
                    .join(' and ')}
                </span>
                .
              </span>
            </div>
            <Link
              href="/assessment"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shrink-0"
            >
              Retake Quiz
            </Link>
          </div>
        )}

        {/* Career Track Selector Grid */}
        <div className="mb-8">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            SELECT A CAREER TRACK TO EXPLORE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCareerId === cat.id;
              const extra = TRACK_EXTRAS[cat.id] || { shortName: cat.name, salary: 'High Demand' };

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCareerId(cat.id)}
                  className={`rounded-xl p-4 cursor-pointer transition-all border relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0f172a] border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.22)] ring-1 ring-blue-500'
                      : 'bg-[#0f172a]/70 hover:bg-[#0f172a] border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xl leading-none">
                      {cat.id === 'ai-applied-ai' && '🤖'}
                      {cat.id === 'web-software-dev' && '💻'}
                      {cat.id === 'data-science-analytics' && '📊'}
                      {cat.id === 'cybersecurity' && '🛡️'}
                      {cat.id === 'cloud-computing' && '☁️'}
                      {cat.id === 'ui-ux-design' && '🎨'}
                      {cat.id === 'business-project-mgmt' && '💼'}
                      {cat.id === 'digital-marketing' && '📈'}
                    </span>

                    {isSelected && (
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                      {extra.shortName}
                    </h3>
                    <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                      {extra.salary}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Career Path Detail Hero Card */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 shadow-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-600/40 text-2xl flex items-center justify-center shrink-0">
                {activeCareer.icon || '🚀'}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg font-bold text-white">
                    {extras.shortName} Path
                  </h2>
                  <span className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Demand: Very High
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mt-1.5 max-w-2xl">
                  {activeCareer.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Explore Top Courses</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Step-by-Step Learning & Career Roadmap */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold text-sm">📍</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Step-by-Step Learning &amp; Career Roadmap
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {stepsDone.length} of {detailedSteps.length} Steps Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {detailedSteps.map((step, idx) => {
              const isDone = stepsDone.includes(idx);

              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`bg-[#0f172a] border rounded-xl p-4 flex items-start gap-3.5 cursor-pointer transition-all ${
                    isDone
                      ? 'border-emerald-600/60 bg-emerald-950/15'
                      : 'border-gray-800/80 hover:border-gray-700/80'
                  }`}
                >
                  {/* Step Number Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-900/30 border border-blue-500/40 text-blue-400'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          isDone ? 'text-emerald-300 line-through' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {isDone ? 'Completed' : 'Click to complete'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Left: Key Required Skills */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-400 text-xs">⚡</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                KEY REQUIRED SKILLS
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeCareer.coreSkills.map((sk) => (
                <span
                  key={sk.name}
                  className="bg-[#131d33] border border-gray-800 text-gray-200 text-xs px-3 py-1.5 rounded-lg font-mono"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: In-Demand Tools & Frameworks */}
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-400 text-xs">🛠️</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                IN-DEMAND TOOLS &amp; FRAMEWORKS
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {extras.tools.map((tool) => (
                <span
                  key={tool}
                  className="bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Portfolio Projects Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="text-yellow-400 text-xs">💡</span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Suggested Portfolio Projects for {extras.shortName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {extras.extraProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0f172a] border border-gray-800/90 hover:border-gray-700 rounded-xl p-4 flex items-center justify-between gap-3 shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-mono font-bold text-xs shrink-0">
                    {proj.id}.
                  </span>
                  <span className="text-xs font-semibold text-gray-200">
                    {proj.title}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#131d33] text-gray-400 border border-gray-800 shrink-0 font-medium">
                  {proj.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-r from-blue-950/50 to-indigo-950/40 border border-blue-900/50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white">
              Ready to start building this career?
            </h3>
            <p className="text-xs text-gray-300 max-w-xl mt-1 leading-relaxed">
              Take the SCO Career Quiz to get personalized recommendations tailored to your current learning stage and goals.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              href="/assessment"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Take Aptitude Quiz</span>
              <span>→</span>
            </Link>
            <Link
              href="/teammates"
              className="px-4 py-2.5 bg-[#0f172a] hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Find Teammates
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
