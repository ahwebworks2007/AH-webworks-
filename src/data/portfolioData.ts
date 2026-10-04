import chayeKhanaImg from '@/src/assets/images/chaye_khana_preview_1790523246502.jpg';
import karigariImg from '@/src/assets/images/karigari_preview_1790523265216.jpg';
import hamdanImg from '@/src/assets/images/hamdan_profile_1790523281179.jpg';
import ahadImg from '@/src/assets/images/ahad_profile_1790523297080.jpg';
import showreelImg from '@/src/assets/images/showreel_digital_studio_1790523309352.jpg';

export const DEFAULT_FOUNDER_AVATARS = {
  hamdan: hamdanImg,
  ahad: ahadImg,
};

export interface Founder {
  name: string;
  role: string;
  bio: string;
  focus: string[];
  avatar: string;
  email?: string;
  github?: string;
  linkedin?: string;
}

export interface Service {
  number: string;
  title: string;
  description: string;
  highlights: string[];
  iconName: string;
}

export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  liveUrl: string;
  githubUrl?: string;
  featured: boolean;
  technologies: string[];
  clientType: string;
  deliverables: string[];
  caseStudy: {
    challenge: string;
    solution: string;
    result: string;
  };
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  details: string[];
}

export interface WhyUsItem {
  number: string;
  title: string;
  description: string;
  iconName: string;
}

export interface TechItem {
  name: string;
  category: string;
  badge: string;
  description: string;
}

export interface PortfolioConfig {
  brand: {
    name: string;
    studioName: string;
    tagline: string;
    subheadline: string;
    heroHeadline: string;
    aboutHeadline: string;
    aboutText: string;
  };
  contact: {
    email: string;
    whatsappNumber: string;
    whatsappFormatted: string;
    whatsappDefaultMessage: string;
    instagramUrl: string;
    instagramHandle: string;
    githubUrl: string;
    availability: string;
  };
  founders: Founder[];
  services: Service[];
  projects: Project[];
  technologies: TechItem[];
  process: ProcessStep[];
  whyUs: WhyUsItem[];
  showreel: {
    title: string;
    subtitle: string;
    posterImage: string;
    videoUrl?: string; // Add mp4/webm url here when ready
    interactiveShowcases: {
      id: string;
      title: string;
      category: string;
      description: string;
      image: string;
      link: string;
    }[];
  };
}

export const PORTFOLIO_DATA: PortfolioConfig = {
  brand: {
    name: "AH PRODUCTIONS",
    studioName: "AH PRODUCTIONS",
    tagline: "WE BUILD DIGITAL EXPERIENCES.",
    subheadline: "Modern websites designed, developed, and delivered for businesses that want to stand out online.",
    heroHeadline: "WE BUILD DIGITAL EXPERIENCES.",
    aboutHeadline: "Two Minds. One Digital Vision.",
    aboutText: "AH PRODUCTIONS is a web development studio founded by Hamdan and Ahad. We create modern, responsive and user-focused websites for businesses and brands."
  },
  contact: {
    email: "hamdansaleemi729@gmail.com",
    whatsappNumber: "923001234567", // Update with your direct phone number anytime
    whatsappFormatted: "+92 300 1234567",
    whatsappDefaultMessage: "Hi AH Productions team, I would like to discuss a website project for my business.",
    instagramUrl: "https://instagram.com/ahproductions.dev",
    instagramHandle: "@ahproductions.dev",
    githubUrl: "https://github.com/hamdansaleemi",
    availability: "Available for new client projects"
  },
  founders: [
    {
      name: "HAMDAN SALEEMI",
      role: "Co-Founder & Web Developer",
      bio: "Focuses on high-impact frontend architecture, UI/UX aesthetics, and bespoke web solutions tailored to business growth.",
      focus: [
        "Web Development",
        "UI/UX Design",
        "Frontend Development",
        "Business Websites",
        "E-commerce"
      ],
      avatar: hamdanImg,
      email: "hamdansaleemi729@gmail.com",
      github: "https://github.com/hamdansaleemi",
      linkedin: "https://linkedin.com/in/hamdansaleemi"
    },
    {
      name: "ABDUL AHAD",
      role: "Co-Founder & Web Developer",
      bio: "Specializes in modern responsive web builds, interactive functionality, robust backend integrations, and reliable performance.",
      focus: [
        "Web Development",
        "Frontend Development",
        "Backend Integration",
        "Business Websites",
        "Web Applications"
      ],
      avatar: ahadImg,
      email: "hamdansaleemi729@gmail.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com/in/abdulahad"
    }
  ],
  services: [
    {
      number: "01",
      title: "BUSINESS WEBSITES",
      description: "Professional websites for companies, startups and local businesses.",
      highlights: ["Brand positioning", "SEO ready architecture", "Fast loading times", "Lead capture forms"],
      iconName: "Briefcase"
    },
    {
      number: "02",
      title: "RESTAURANT & CAFE WEBSITES",
      description: "Modern digital menus, ordering experiences and restaurant websites.",
      highlights: ["Interactive digital menus", "Table reservation links", "Location & hours integration", "Mobile-optimized for diners"],
      iconName: "Utensils"
    },
    {
      number: "03",
      title: "E-COMMERCE WEBSITES",
      description: "Online stores with product management and customer-friendly shopping experiences.",
      highlights: ["Product showcase grids", "Cart & checkout flows", "Direct WhatsApp ordering", "Inventory display"],
      iconName: "ShoppingBag"
    },
    {
      number: "04",
      title: "CUSTOM WEB APPLICATIONS",
      description: "Interactive web applications built around specific business requirements.",
      highlights: ["Custom workflows", "Database integration", "Admin interfaces", "Authentication"],
      iconName: "Code2"
    },
    {
      number: "05",
      title: "PORTFOLIO WEBSITES",
      description: "Professional personal and creative portfolios.",
      highlights: ["High visual impact", "Media showcases", "Personal branding", "Client conversion focus"],
      iconName: "Layout"
    },
    {
      number: "06",
      title: "WEBSITE MAINTENANCE",
      description: "Updates, improvements, fixes and ongoing website support.",
      highlights: ["Speed optimization", "Content updates", "Hosting & domain setup", "Security & bug fixes"],
      iconName: "Wrench"
    }
  ],
  projects: [
    {
      id: "chaye-khana-dha",
      number: "01",
      name: "CHAYE KHANA DHA",
      category: "Restaurant Website",
      tagline: "A modern dining & tea house digital experience",
      description: "A modern restaurant website designed to provide customers with an easy and engaging digital experience.",
      image: chayeKhanaImg,
      liveUrl: "https://chaye-khana-dha-4.vercel.app/",
      featured: true,
      technologies: ["React", "Tailwind CSS", "JavaScript", "Vercel"],
      clientType: "Hospitality & Restaurant",
      deliverables: ["Responsive UI", "Digital Menu", "Location Integration", "Atmosphere Showcase"],
      caseStudy: {
        challenge: "Chaye Khana DHA needed a dedicated digital presence that reflects their warm artisanal tea house ambiance while enabling patrons to quickly explore the menu, specials, and location information seamlessly on mobile phones.",
        solution: "Engineered a fast, responsive single-page web experience with a tailored dark aesthetic, smooth interactive sections, clear menu browsing, and frictionless contact actions.",
        result: "Delivered a clean, reliable, and visually distinctive web presence that elevates brand perception and makes dining details accessible to guests across all screen sizes."
      }
    },
    {
      id: "karigari",
      number: "02",
      name: "KARIGARI__",
      category: "E-Commerce Website",
      tagline: "Handcrafted home décor online store",
      description: "A modern e-commerce experience for a handcrafted home décor brand.",
      image: karigariImg,
      liveUrl: "https://karigari-self.vercel.app/",
      featured: true,
      technologies: ["React", "Tailwind CSS", "JavaScript", "Vercel"],
      clientType: "Retail & Home Décor",
      deliverables: ["Product Catalog", "Cart Experience", "Editorial Layout", "Mobile Storefront"],
      caseStudy: {
        challenge: "Karigari needed an online storefront that captures the craftsmanship and tactile quality of handcrafted brass, ceramic, and home décor items without the clutter of generic e-commerce templates.",
        solution: "Crafted a minimalist, high-contrast store interface highlighting high-resolution photography, structured category filtering, and straightforward purchase inquiries.",
        result: "A sleek, responsive digital storefront providing a frictionless shopping journey for customers seeking premium artisanal pieces."
      }
    }
  ],
  technologies: [
    { name: "HTML5", category: "Core", badge: "Semantic Structure", description: "Accessible, standards-compliant markup." },
    { name: "CSS3 / Modern CSS", category: "Styling", badge: "Visual Architecture", description: "Fluid layouts, keyframes, and custom properties." },
    { name: "JavaScript (ES6+)", category: "Language", badge: "Logic & Dynamics", description: "Performant client-side scripting." },
    { name: "TypeScript", category: "Language", badge: "Type Safety", description: "Robust and maintainable codebases." },
    { name: "React", category: "Framework", badge: "Component UI", description: "Modular, reactive user interfaces." },
    { name: "Tailwind CSS", category: "Styling", badge: "Utility-First", description: "Tailored bespoke styling and rapid development." },
    { name: "Firebase", category: "Backend", badge: "Cloud & Auth", description: "Database persistence and backend integrations." },
    { name: "GitHub", category: "Workflow", badge: "Version Control", description: "Collaborative and structured code delivery." },
    { name: "Vercel", category: "Deployment", badge: "Edge Hosting", description: "Lightning-fast global deployments with SSL." }
  ],
  process: [
    {
      step: "01",
      title: "DISCOVER",
      description: "We understand your business, goals and requirements.",
      details: ["Initial consultation & project brief", "Target audience analysis", "Key feature identification"]
    },
    {
      step: "02",
      title: "PLAN",
      description: "We structure the website, content and user experience.",
      details: ["Information architecture", "Wireframe & content flow", "Technology stack selection"]
    },
    {
      step: "03",
      title: "DESIGN & DEVELOP",
      description: "We turn the concept into a modern responsive website.",
      details: ["Bespoke dark/modern UI styling", "Clean component engineering", "Interactive micro-details"]
    },
    {
      step: "04",
      title: "TEST & REFINE",
      description: "We test the experience across devices and refine the details.",
      details: ["Cross-browser & mobile testing", "Performance & speed audit", "Client review & fine-tuning"]
    },
    {
      step: "05",
      title: "LAUNCH",
      description: "Your website goes live and is ready for your customers.",
      details: ["Domain & DNS connection", "Vercel/Cloud deployment", "Handover & post-launch support"]
    }
  ],
  whyUs: [
    {
      number: "01",
      title: "MODERN DESIGN",
      description: "Clean and contemporary interfaces crafted with purposeful typography and contrast.",
      iconName: "Sparkles"
    },
    {
      number: "02",
      title: "RESPONSIVE EXPERIENCE",
      description: "Every build is tested and engineered to look sharp on desktop, tablet and mobile.",
      iconName: "Smartphone"
    },
    {
      number: "03",
      title: "BUSINESS FOCUSED",
      description: "Websites designed around real business needs, client conversions, and user clarity.",
      iconName: "Target"
    },
    {
      number: "04",
      title: "DIRECT COMMUNICATION",
      description: "Work directly with Hamdan and Ahad — simple, transparent, and responsive collaboration.",
      iconName: "MessageSquare"
    }
  ],
  showreel: {
    title: "SEE WHAT WE BUILD.",
    subtitle: "A quick glimpse into responsive layouts, e-commerce flows, and restaurant experiences crafted for the web.",
    posterImage: showreelImg,
    interactiveShowcases: [
      {
        id: "restaurant-dha",
        title: "Chaye Khana DHA",
        category: "Restaurant & Cafe Experience",
        description: "Atmospheric digital presence with menu navigation and fast mobile access.",
        image: chayeKhanaImg,
        link: "https://chaye-khana-dha-4.vercel.app/"
      },
      {
        id: "karigari-store",
        title: "Karigari E-Commerce",
        category: "Handcrafted Home Store",
        description: "Editorial product galleries and streamlined customer discovery.",
        image: karigariImg,
        link: "https://karigari-self.vercel.app/"
      },
      {
        id: "digital-studio",
        title: "AH Productions Studio Suite",
        category: "Creative Digital Platform",
        description: "Fluid interactions, dark aesthetic, and component architecture.",
        image: showreelImg,
        link: "#work"
      }
    ]
  }
};
