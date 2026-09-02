import type { Category, CategoryId } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'ai-applied-ai',
    name: 'Artificial Intelligence & Applied AI',
    description: 'Build intelligent systems using ML, deep learning, and AI frameworks.',
    icon: '🤖',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  },
  {
    id: 'web-software-dev',
    name: 'Web & Software Development',
    description: 'Create modern web apps with frontend, backend, and full-stack skills.',
    icon: '💻',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
  {
    id: 'data-science-analytics',
    name: 'Data Science & Analytics',
    description: 'Uncover insights through statistical analysis, Python, and data visualization.',
    icon: '📊',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Protect systems, networks, and data from digital threats and attacks.',
    icon: '🛡️',
    color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    description: 'Deploy and manage scalable infrastructure on AWS, GCP, and Azure.',
    icon: '☁️',
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX & Product Design',
    description: 'Design intuitive user experiences with research, Figma, and prototyping.',
    icon: '🎨',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300',
  },
  {
    id: 'business-project-mgmt',
    name: 'Business & Project Management',
    description: 'Lead teams and deliver projects with agile, strategy, and leadership skills.',
    icon: '📋',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Drive growth with SEO, content marketing, and data-driven campaigns.',
    icon: '📣',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
