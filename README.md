# Achraf AAMRI - Personal Blog

A modern, fast, and SEO-optimized personal blog built with Astro, featuring technical content about PHP internals, systems programming, and performance optimization.

![Blog Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![Astro](https://img.shields.io/badge/Astro-5.9.1-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Features

### 🎨 Design & UX
- **Clean, professional design** with dark/light mode support
- **Responsive layout** optimized for all devices
- **Fast loading** with optimized images and static generation
- **Accessible** with proper semantic HTML and ARIA labels

### 📝 Content Management
- **Markdown-based blog posts** with frontmatter
- **Syntax highlighting** for code blocks
- **Reading time estimation** and post metadata
- **Tag-based categorization** and filtering
- **Related posts** based on shared tags

### 🔍 Search & Discovery
- **Pagefind search** for instant content discovery
- **Automatic sitemap** generation for SEO
- **RSS feed** for subscribers
- **Social sharing** buttons (Twitter, LinkedIn)

### 📞 Contact & Social
- **Contact form** with Formspree integration
- **Social media links** (LinkedIn, GitHub, Twitter)
- **Professional contact cards** with clear CTAs

### 🚀 Performance
- **Static site generation** for maximum speed
- **Optimized images** with proper lazy loading
- **Minimal JavaScript** for fast interactions
- **SEO optimized** with meta tags and structured data

## 🏗️ Project Structure

```
/
├── public/                 # Static assets
│   ├── images/
│   │   ├── blog/          # Blog post images
│   │   └── projects/      # Project screenshots
│   └── favicon.svg
├── src/
│   ├── components/        # Reusable Astro components
│   │   ├── Card.astro
│   │   ├── Hero.astro
│   │   ├── Navigation.astro
│   │   └── Search.astro
│   ├── content/
│   │   └── blog/          # Blog posts (Markdown)
│   ├── data/
│   │   └── projects.json  # Project data
│   ├── layouts/
│   │   └── Layout.astro   # Base layout template
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── [slug].astro  # Dynamic blog post pages
│   │   │   └── index.astro   # Blog listing
│   │   ├── contact.astro
│   │   ├── projects.astro
│   │   └── index.astro    # Homepage
│   └── types/
│       └── pagefind.d.ts  # TypeScript declarations
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind CSS config
└── pagefind.yml          # Search configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/achrafAa/Achrafblog.git
   cd Achrafblog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:4321
   ```

## 🧞 Commands

| Command                 | Action                                           |
| :---------------------- | :----------------------------------------------- |
| `npm install`           | Install dependencies                             |
| `npm run dev`           | Start local dev server at `localhost:4321`      |
| `npm run build`         | Build production site to `./dist/`              |
| `npm run build:astro`   | Build Astro only (without search index)         |
| `npm run build:search`  | Generate Pagefind search index                   |
| `npm run preview`       | Preview build locally before deploying          |

## 📝 Content Management

### Adding a New Blog Post

1. **Create a new Markdown file** in `src/content/blog/`
   ```bash
   touch src/content/blog/my-new-post.md
   ```

2. **Add frontmatter**
   ```yaml
   ---
   title: "Your Post Title"
   author: "Achraf AAMRI"
   description: "Brief description for SEO"
   date: "2024-05-02"
   pubDate: 2024-05-02
   heroImage: "/images/blog/your-image.png"
   tags: ["Programming", "Web Development"]
   ---
   ```

3. **Write your content** in Markdown below the frontmatter

### Adding Projects

Edit `src/data/projects.json` to add new projects with:
- Title, description, and long description
- Tags and full tags
- GitHub repository link
- Demo URL (optional)
- Hero image (optional)
- Status (ready, beta, development)

## 🔍 Search Configuration

The blog uses **Pagefind** for client-side search:

- **Automatic indexing** of all blog posts
- **Tag filtering** support
- **Excerpt generation** for search results
- **Dark mode** compatible styling

Search index is built automatically during the production build.

## 🚀 Deployment

### Option 1: Cloudflare Pages (Recommended)

1. **Connect your repository** to Cloudflare Pages
2. **Set build settings:**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js version: `18`

### Option 2: GitHub Actions + Cloudflare Pages

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: your-project-name
          directory: dist
```

### Option 3: Other Static Hosts

The site builds to static HTML and can be deployed to:
- **Netlify** - Connect GitHub repo, set build command to `npm run build`
- **Vercel** - Import project, builds automatically
- **GitHub Pages** - Use GitHub Actions for deployment

## 🛠️ Customization

### Styling
- **Tailwind CSS** for utility-first styling
- **Dark mode** support with `dark:` prefix classes
- **Custom color scheme** defined in `tailwind.config.mjs`

### Configuration
- **Site metadata** in `src/layouts/Layout.astro`
- **Navigation links** in `src/components/Navigation.astro`
- **Social links** in `src/pages/contact.astro`
- **SEO settings** in `astro.config.mjs`

### Contact Form
The contact form uses **Formspree** for form handling:
1. Update the form action URL in `src/pages/contact.astro`
2. Replace `xqaberzq` with your Formspree endpoint ID

## 📊 Performance

- **Lighthouse Score:** 95+ across all metrics
- **Core Web Vitals:** All green
- **Bundle Size:** < 50KB JS, optimized CSS
- **Loading Speed:** < 1s on fast 3G

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ About

Created by **Achraf AAMRI** - Senior Software Engineer specializing in PHP internals, systems programming, and performance optimization.

- **LinkedIn:** [linkedin.com/in/achrafaamri](https://linkedin.com/in/achrafaamri)
- **GitHub:** [github.com/achrafAa](https://github.com/achrafAa)
- **Website:** [achrafaamri.com](https://achrafaamri.com)

---

⭐ **Star this repo** if you found it helpful!
