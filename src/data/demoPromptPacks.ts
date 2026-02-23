import type { Database } from '../types/database.types';

type PromptPackRow = Database['public']['Tables']['prompt_packs']['Row'];

export interface DemoPromptPack extends PromptPackRow {
  creator_name: string;
  creator_avatar: string;
  creator_bio: string | null;
  favorite_count: number;
  is_favorited: boolean;
}

export const DEMO_PROMPT_PACKS: DemoPromptPack[] = [
  {
    id: 'demo-1',
    title: 'Professional Blog Post Writer',
    prompt: 'Write a professional blog post on any topic with SEO optimization.',
    full_prompt: 'You are an expert content writer and SEO specialist. Write a comprehensive, engaging blog post on the topic provided by the user. The post should:\n\n1. Start with a compelling headline and hook\n2. Include an introduction that establishes the problem or topic\n3. Break content into scannable sections with H2/H3 headings\n4. Use short paragraphs (2-3 sentences max)\n5. Include relevant statistics or data points\n6. Add a clear call-to-action at the end\n7. Optimize for the target keyword naturally (2-3% density)\n8. Write in a conversational yet authoritative tone\n9. Aim for 1,500-2,000 words\n10. Include meta description suggestion (155 characters)\n\nTopic: [USER INPUT]\nTarget Keyword: [USER INPUT]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/60a5fa?text=Blog+Writer',
      'https://placehold.co/600x400/1e293b/60a5fa?text=SEO+Optimized',
    ],
    ai_model: 'GPT-4',
    category: 'Writing',
    price: 0,
    creator_id: 'demo-creator-1',
    description: 'Generate professional, SEO-optimized blog posts on any topic.',
    created_at: '2025-12-15T10:00:00Z',
    updated_at: '2025-12-15T10:00:00Z',
    creator_name: 'Sarah Chen',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
    creator_bio: 'Content strategist and SEO expert with 8 years of experience in digital marketing.',
    favorite_count: 142,
    is_favorited: false,
  },
  {
    id: 'demo-2',
    title: 'Cinematic Concept Art Generator',
    prompt: 'Create detailed concept art descriptions for cinematic scenes.',
    full_prompt: 'You are a world-class concept artist and art director. Generate a highly detailed visual description for AI image generation based on the user\'s concept. Your output should include:\n\n**Scene Composition:**\n- Camera angle and perspective (e.g., low-angle hero shot, bird\'s eye view)\n- Focal point and rule-of-thirds placement\n- Foreground, midground, and background elements\n\n**Lighting & Atmosphere:**\n- Primary light source direction and color temperature\n- Secondary/fill lighting\n- Atmospheric effects (fog, volumetric rays, particles)\n- Time of day and weather conditions\n\n**Style & Rendering:**\n- Art style reference (e.g., "in the style of Syd Mead meets Studio Ghibli")\n- Color palette (specify 3-5 hex colors)\n- Texture and material qualities\n- Level of detail and finish\n\n**Technical Specifications:**\n- Aspect ratio recommendation\n- Suggested negative prompts\n- CFG scale and sampling method suggestions\n\nConcept: [USER INPUT]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/f472b6?text=Concept+Art',
      'https://placehold.co/600x400/1e293b/f472b6?text=Cinematic',
    ],
    ai_model: 'Claude 3',
    category: 'Art & Design',
    price: 0,
    creator_id: 'demo-creator-2',
    description: 'Generate stunning cinematic concept art descriptions for AI image tools.',
    created_at: '2025-12-20T14:30:00Z',
    updated_at: '2025-12-20T14:30:00Z',
    creator_name: 'Marcus Rivera',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusRivera',
    creator_bio: 'Digital artist and filmmaker specializing in sci-fi and fantasy concept art.',
    favorite_count: 238,
    is_favorited: false,
  },
  {
    id: 'demo-3',
    title: 'Full-Stack Code Architect',
    prompt: 'Design and generate production-ready code architecture.',
    full_prompt: 'You are a senior full-stack architect with expertise in modern web development. Given a feature or application description, provide a complete technical architecture and implementation plan:\n\n**Architecture Overview:**\n- System diagram description (components, data flow)\n- Technology stack recommendation with justification\n- Database schema design (tables, relationships, indexes)\n- API endpoint design (RESTful or GraphQL)\n\n**Implementation:**\n- Project structure / folder organization\n- Key files with production-ready code\n- Type definitions / interfaces\n- Error handling patterns\n- Authentication & authorization approach\n\n**Best Practices:**\n- Security considerations (OWASP top 10)\n- Performance optimization strategies\n- Testing strategy (unit, integration, e2e)\n- CI/CD pipeline suggestions\n- Monitoring and logging approach\n\n**Scalability:**\n- Caching strategy\n- Database optimization\n- Horizontal scaling considerations\n\nFeature/Application: [USER INPUT]\nPreferred Stack: [USER INPUT or "recommend"]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/34d399?text=Code+Architect',
      'https://placehold.co/600x400/1e293b/34d399?text=Full+Stack',
    ],
    ai_model: 'GPT-4',
    category: 'Programming',
    price: 0,
    creator_id: 'demo-creator-3',
    description: 'Get production-ready architecture and code for any full-stack project.',
    created_at: '2026-01-05T09:15:00Z',
    updated_at: '2026-01-05T09:15:00Z',
    creator_name: 'Alex Patel',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexPatel',
    creator_bio: 'Staff engineer at a FAANG company. Open-source contributor and tech blogger.',
    favorite_count: 315,
    is_favorited: false,
  },
  {
    id: 'demo-4',
    title: 'Business Plan Generator',
    prompt: 'Create comprehensive business plans for startups and ventures.',
    full_prompt: 'You are a seasoned business consultant and startup advisor. Create a comprehensive business plan based on the user\'s business idea:\n\n**Executive Summary:**\n- Business concept (2-3 sentences)\n- Value proposition and unique selling points\n- Target market overview\n- Revenue model summary\n- Funding requirements (if applicable)\n\n**Market Analysis:**\n- Total addressable market (TAM) estimation\n- Target market segmentation\n- Competitive landscape (direct & indirect competitors)\n- SWOT analysis\n- Market trends and opportunities\n\n**Business Model:**\n- Revenue streams (primary and secondary)\n- Pricing strategy with justification\n- Customer acquisition strategy\n- Customer retention approach\n- Key partnerships needed\n\n**Financial Projections:**\n- Year 1-3 revenue projections\n- Key cost categories\n- Break-even analysis\n- Key financial metrics (CAC, LTV, margins)\n\n**Go-to-Market Strategy:**\n- Launch timeline (90-day plan)\n- Marketing channels prioritized by ROI\n- Initial team requirements\n- Key milestones and KPIs\n\nBusiness Idea: [USER INPUT]\nIndustry: [USER INPUT]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/fbbf24?text=Business+Plan',
      'https://placehold.co/600x400/1e293b/fbbf24?text=Startup',
    ],
    ai_model: 'GPT-4',
    category: 'Business',
    price: 0,
    creator_id: 'demo-creator-1',
    description: 'Generate investor-ready business plans for any startup idea.',
    created_at: '2026-01-10T16:45:00Z',
    updated_at: '2026-01-10T16:45:00Z',
    creator_name: 'Sarah Chen',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
    creator_bio: 'Content strategist and SEO expert with 8 years of experience in digital marketing.',
    favorite_count: 89,
    is_favorited: false,
  },
  {
    id: 'demo-5',
    title: 'Social Media Campaign Planner',
    prompt: 'Plan and create multi-platform social media campaigns.',
    full_prompt: 'You are a social media marketing expert with a track record of viral campaigns. Create a complete social media campaign plan:\n\n**Campaign Overview:**\n- Campaign name and hashtag suggestion\n- Objective (awareness, engagement, conversion)\n- Target audience personas (2-3 detailed personas)\n- Campaign duration and phases\n\n**Platform Strategy:**\nFor each platform (Instagram, TikTok, Twitter/X, LinkedIn):\n- Content format recommendations\n- Posting frequency and optimal times\n- Platform-specific best practices\n- Example post copy (3 variations per platform)\n\n**Content Calendar:**\n- Week-by-week content themes\n- Content pillar breakdown (educational, entertaining, promotional)\n- User-generated content strategy\n- Influencer collaboration suggestions\n\n**Engagement Strategy:**\n- Community management guidelines\n- Response templates for common interactions\n- Crisis management approach\n- Hashtag strategy (branded + trending)\n\n**Measurement:**\n- KPIs per platform\n- Reporting cadence\n- A/B testing recommendations\n- Budget allocation suggestions\n\nProduct/Brand: [USER INPUT]\nCampaign Goal: [USER INPUT]\nBudget Range: [USER INPUT]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/a78bfa?text=Social+Media',
      'https://placehold.co/600x400/1e293b/a78bfa?text=Campaign',
    ],
    ai_model: 'Gemini Pro',
    category: 'Productivity',
    price: 0,
    creator_id: 'demo-creator-4',
    description: 'Create viral social media campaigns across all major platforms.',
    created_at: '2026-01-18T11:20:00Z',
    updated_at: '2026-01-18T11:20:00Z',
    creator_name: 'Jordan Kim',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JordanKim',
    creator_bio: 'Social media strategist who has managed campaigns for Fortune 500 brands.',
    favorite_count: 176,
    is_favorited: false,
  },
  {
    id: 'demo-6',
    title: 'Interactive Course Builder',
    prompt: 'Design engaging online courses with structured curricula.',
    full_prompt: 'You are an instructional designer and e-learning specialist. Create a complete online course outline with interactive elements:\n\n**Course Design:**\n- Course title and subtitle\n- Learning objectives (3-5 measurable outcomes using Bloom\'s taxonomy)\n- Prerequisites\n- Estimated completion time\n- Difficulty level\n\n**Curriculum Structure:**\nFor each module (suggest 6-8 modules):\n- Module title and description\n- Learning outcomes specific to module\n- Lesson breakdown (3-5 lessons per module)\n- Key concepts and terminology\n- Practical exercises / hands-on projects\n\n**Interactive Elements:**\n- Quiz questions (multiple choice, true/false, short answer) per module\n- Discussion prompts for peer learning\n- Case studies or real-world scenarios\n- Assignments with rubrics\n- Final capstone project description\n\n**Engagement Features:**\n- Gamification elements (badges, progress tracking)\n- Community building activities\n- Guest expert interview suggestions\n- Supplementary resource recommendations\n\n**Assessment Strategy:**\n- Formative assessments per module\n- Summative assessment design\n- Grading criteria\n- Certificate of completion requirements\n\nCourse Topic: [USER INPUT]\nTarget Audience: [USER INPUT]\nSkill Level: [Beginner/Intermediate/Advanced]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/fb923c?text=Course+Builder',
      'https://placehold.co/600x400/1e293b/fb923c?text=Education',
    ],
    ai_model: 'Claude 3',
    category: 'Education',
    price: 0,
    creator_id: 'demo-creator-5',
    description: 'Build comprehensive online courses with quizzes, projects, and assessments.',
    created_at: '2026-01-25T08:00:00Z',
    updated_at: '2026-01-25T08:00:00Z',
    creator_name: 'Dr. Emily Watson',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyWatson',
    creator_bio: 'PhD in Education Technology. Former professor turned e-learning consultant.',
    favorite_count: 203,
    is_favorited: false,
  },
  {
    id: 'demo-7',
    title: 'API Documentation Writer',
    prompt: 'Generate comprehensive API documentation from endpoint descriptions.',
    full_prompt: 'You are a technical writer specializing in API documentation. Generate clear, developer-friendly API documentation:\n\n**For each endpoint, provide:**\n\n1. **Endpoint Header:**\n   - HTTP Method + Path (e.g., `POST /api/v1/users`)\n   - Brief description (one line)\n   - Authentication requirement\n\n2. **Request:**\n   - Headers (with examples)\n   - Path parameters (name, type, required, description)\n   - Query parameters (name, type, required, default, description)\n   - Request body schema (JSON with TypeScript-style types)\n   - Example request (cURL + JavaScript fetch)\n\n3. **Response:**\n   - Success response (status code + JSON body)\n   - Error responses (common error codes with body examples)\n   - Response field descriptions\n\n4. **Code Examples:**\n   - JavaScript/TypeScript\n   - Python\n   - cURL\n\n5. **Additional Notes:**\n   - Rate limiting details\n   - Pagination format (if applicable)\n   - Webhook events triggered (if applicable)\n   - Related endpoints\n\nFormat output in clean Markdown suitable for documentation sites (Docusaurus, GitBook, etc.).\n\nAPI/Endpoints to document: [USER INPUT]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/34d399?text=API+Docs',
      'https://placehold.co/600x400/1e293b/34d399?text=Developer',
    ],
    ai_model: 'GPT-3.5',
    category: 'Programming',
    price: 0,
    creator_id: 'demo-creator-3',
    description: 'Auto-generate professional API docs with code examples in multiple languages.',
    created_at: '2026-02-01T13:00:00Z',
    updated_at: '2026-02-01T13:00:00Z',
    creator_name: 'Alex Patel',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexPatel',
    creator_bio: 'Staff engineer at a FAANG company. Open-source contributor and tech blogger.',
    favorite_count: 127,
    is_favorited: false,
  },
  {
    id: 'demo-8',
    title: 'Brand Identity Designer',
    prompt: 'Create complete brand identity systems from a brief.',
    full_prompt: 'You are a brand strategist and identity designer. Create a comprehensive brand identity system:\n\n**Brand Foundation:**\n- Brand story and origin narrative\n- Mission statement\n- Vision statement\n- Core values (3-5 with descriptions)\n- Brand personality traits (using brand archetypes)\n- Brand voice and tone guidelines\n\n**Visual Identity:**\n- Logo concept description (primary, secondary, icon variations)\n- Color palette:\n  - Primary colors (2-3 with hex, RGB, CMYK values)\n  - Secondary colors (2-3)\n  - Neutral colors (2-3)\n  - Color usage guidelines\n- Typography system:\n  - Primary typeface (headings)\n  - Secondary typeface (body)\n  - Font size scale\n  - Line height and spacing guidelines\n- Imagery style guide:\n  - Photography direction\n  - Illustration style\n  - Icon style\n\n**Brand Applications:**\n- Business card layout description\n- Email signature template\n- Social media profile/cover specs\n- Presentation template guidelines\n- Website design direction\n\n**Brand Guidelines Document:**\n- Do\'s and Don\'ts\n- Logo clear space and minimum size\n- Incorrect usage examples\n- Co-branding guidelines\n\nBrand Name: [USER INPUT]\nIndustry: [USER INPUT]\nTarget Audience: [USER INPUT]',
    preview_images: [
      'https://placehold.co/600x400/1e293b/f472b6?text=Brand+Identity',
      'https://placehold.co/600x400/1e293b/f472b6?text=Design+System',
    ],
    ai_model: 'Mistral',
    category: 'Art & Design',
    price: 0,
    creator_id: 'demo-creator-2',
    description: 'Build complete brand identities with colors, typography, and guidelines.',
    created_at: '2026-02-10T15:30:00Z',
    updated_at: '2026-02-10T15:30:00Z',
    creator_name: 'Marcus Rivera',
    creator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusRivera',
    creator_bio: 'Digital artist and filmmaker specializing in sci-fi and fantasy concept art.',
    favorite_count: 94,
    is_favorited: false,
  },
];

interface FilterOptions {
  categories: string[];
  aiModel: string;
  sortBy: string;
  searchQuery: string;
}

export function filterDemoData(
  data: DemoPromptPack[],
  { categories, aiModel, sortBy, searchQuery }: FilterOptions
): DemoPromptPack[] {
  let filtered = [...data];

  // Category filter
  if (categories.length > 0 && !categories.includes('All')) {
    filtered = filtered.filter((p) => categories.includes(p.category));
  }

  // AI model filter
  if (aiModel !== 'All') {
    filtered = filtered.filter((p) => p.ai_model === aiModel);
  }

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sortBy === 'popular') {
    filtered.sort((a, b) => b.favorite_count - a.favorite_count);
  } else {
    // newest
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return filtered;
}

export function getDemoPromptPackById(
  id: string
): DemoPromptPack | undefined {
  return DEMO_PROMPT_PACKS.find((p) => p.id === id);
}
