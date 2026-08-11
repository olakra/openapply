import { LinkedInJobPosting } from '@openapply/shared-types';

export const SAMPLE_LINKEDIN_JOBS: LinkedInJobPosting[] = [
  {
    jobId: '389201481',
    jobHash: 'a8f10b7194c2e400',
    title: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'Stripe',
    location: 'Remote (US/Canada)',
    isRemote: true,
    applicantCount: 42,
    isPromoted: false,
    postedDate: '2 hours ago',
    url: 'https://www.linkedin.com/jobs/view/389201481',
    scrapedAt: new Date().toISOString(),
    description: `Stripe is looking for a Senior Frontend Engineer to build high-performance web components for global developer dashboards.

Key Responsibilities:
- Design and implement modular React UI systems in TypeScript.
- Optimize frontend web performance, web vitals, and accessibility.
- Collaborate with product designers and backend API engineers.

Requirements:
- 5+ years building complex web applications with React, TypeScript, and modern state management.
- Strong understanding of browser execution models, CSS/Tailwind, and web performance.
- Excellent communication skills for remote-first work environment.`
  },
  {
    jobId: '401928402',
    jobHash: 'f72b90c1283ea190',
    title: 'Staff Full Stack Developer - Remote Platform',
    company: 'SponsorTech Growth Inc.',
    location: 'San Francisco, CA (Promoted)',
    isRemote: false,
    applicantCount: 218,
    isPromoted: true,
    postedDate: '1 day ago',
    url: 'https://www.linkedin.com/jobs/view/401928402',
    scrapedAt: new Date().toISOString(),
    description: `Promoted sponsored opportunity. Looking for Staff Software Engineer to build full-stack cloud microservices.

Requirements:
- 7+ years in Java, React, Docker, Kubernetes.
- Fast-paced startup environment.`
  },
  {
    jobId: '394102948',
    jobHash: 'c90d817291a823b1',
    title: 'Senior React / Node Engineer (100% Remote)',
    company: 'CloudScale Technologies',
    location: 'Austin, TX (Remote)',
    isRemote: true,
    applicantCount: 88,
    isPromoted: false,
    postedDate: '5 hours ago',
    url: 'https://www.linkedin.com/jobs/view/394102948',
    scrapedAt: new Date().toISOString(),
    description: `[DECEPTIVE/FAKE REMOTE DISCLOSURE WARNING]
Title states 100% Remote.

Role Overview:
Join our cloud engineering team building real-time collaboration tools.

Fine Print / Requirements:
- Candidate must reside within 25 miles of our Austin, TX headquarters for mandatory Tuesday/Thursday in-office collaborative sprint meetings.
- First 90 days during onboarding require full-time on-site presence at our Austin office before remote privileges are unlocked.`
  },
  {
    jobId: '410928103',
    jobHash: 'e123a9b81720d001',
    title: 'Principal Software Engineer - Web Infrastructure',
    company: 'GitHub',
    location: 'Remote - United States',
    isRemote: true,
    applicantCount: 174,
    isPromoted: false,
    postedDate: '3 days ago',
    url: 'https://www.linkedin.com/jobs/view/410928103',
    scrapedAt: new Date().toISOString(),
    description: `GitHub is looking for a Principal Software Engineer to lead frontend infrastructure and monorepo developer tooling.

Responsibilities:
- Drive monorepo architecture, Vite build optimizations, and automated testing frameworks.
- Mentor staff engineers and champion open-source software best practices.

Requirements:
- 8+ years experience in large-scale JavaScript/TypeScript codebases.
- Proven track record contributing to major open-source projects.`
  }
];
