"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

interface IntegrationGuideProps {
  spaceId: string;
  baseUrl: string;
}

export default function IntegrationGuide({ spaceId, baseUrl }: IntegrationGuideProps) {
  const [codeLanguage, setCodeLanguage] = useState<'html' | 'react' | 'nextjs' | 'python'>('html');
  const [copied, setCopied] = useState(false);
  const [reactMode, setReactMode] = useState<'vite' | 'cra'>('vite');
  const [nextMode, setNextMode] = useState<'app' | 'pages'>('app');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const htmlCode = `<!-- Add this to your HTML -->
<script 
  src="${baseUrl}/embed.js" 
  data-space-id="${spaceId}">
</script>`;

  // React Vite Code
  const reactViteCode = `// React + Vite Component
// Install: npm install testispace-react-embed

import TestiSpaceEmbed from 'testispace-react-embed';

export default function Testimonials() {
  return (
    <TestiSpaceEmbed 
      spaceId="${spaceId}" 
      baseUrl="${baseUrl}"
    />
  );
}`;

  // Create React App Code (with CSS import)
  const reactCRACode = `// Create React App Component
// Install: npm install testispace-react-embed

import TestiSpaceEmbed from 'testispace-react-embed';

export default function Testimonials() {
  return (
    <TestiSpaceEmbed 
      spaceId="${spaceId}" 
      baseUrl="${baseUrl}"
    />
  );
}`;

  // Next.js App Router Code
  const nextjsAppCode = `// Next.js 13+ App Router Component
// Install: npm install testispace-react-embed
// app/components/Testimonials.tsx
'use client';

import TestiSpaceEmbed from 'testispace-react-embed';

export default function Testimonials() {
  return (
    <TestiSpaceEmbed 
      spaceId="${spaceId}" 
      baseUrl="${baseUrl}"
    />
  );
}`;

  // Next.js Pages Router Code
  const nextjsPagesCode = `// Next.js Pages Router Component
// Install: npm install testispace-react-embed
// pages/index.tsx or components/Testimonials.tsx

import TestiSpaceEmbed from 'testispace-react-embed';

export default function Testimonials() {
  return (
    <TestiSpaceEmbed 
      spaceId="${spaceId}" 
      baseUrl="${baseUrl}"
    />
  );
}`;

  const pythonCode = `# Flask/Django template example

from flask import render_template

@app.route('/testimonials')
def testimonials():
    embed_config = {
        'src': '${baseUrl}/embed.js',
        'space_id': '${spaceId}'
    }
    return render_template('page.html', embed=embed_config)

# In your template:
# <script src="{{ embed.src }}" 
#   data-space-id="{{ embed.space_id }}"></script>`;

  // Get current code and language info based on selection
  const getCurrentCode = () => {
    if (codeLanguage === 'html') return htmlCode;
    if (codeLanguage === 'python') return pythonCode;
    if (codeLanguage === 'react') {
      return reactMode === 'vite' ? reactViteCode : reactCRACode;
    }
    if (codeLanguage === 'nextjs') {
      return nextMode === 'app' ? nextjsAppCode : nextjsPagesCode;
    }
    return htmlCode;
  };

  const getCurrentLanguageInfo = () => {
    switch (codeLanguage) {
      case 'html':
        return { title: 'HTML', description: 'Simple script tag integration for any website' };
      case 'react':
        return { 
          title: reactMode === 'vite' ? 'React + Vite' : 'Create React App', 
          description: reactMode === 'vite' ? 'Modern React with Vite bundler' : 'Traditional Create React App setup'
        };
      case 'nextjs':
        return { 
          title: nextMode === 'app' ? 'Next.js App Router' : 'Next.js Pages Router',
          description: nextMode === 'app' ? 'Next.js 13+ with App Directory' : 'Next.js with Pages Directory'
        };
      case 'python':
        return { title: 'Python', description: 'Flask/Django template integration' };
    }
  };

  const languageInfo = getCurrentLanguageInfo();
  const currentCode = getCurrentCode();

  return (
    <div className="glass-card p-6 rounded-xl border border-border">
      {/* Language Selection Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['html', 'react', 'nextjs', 'python'].map((lang) => (
          <button
            key={lang}
            onClick={() => setCodeLanguage(lang as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              codeLanguage === lang
                ? 'bg-primary text-white'
                : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
            }`}
          >
            {lang === 'nextjs' ? 'Next.js' : lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{languageInfo.title}</h3>
          <p className="text-sm text-muted-foreground">{languageInfo.description}</p>
        </div>
        <button
          onClick={() => handleCopy(currentCode)}
          className="p-2 bg-secondary/80 hover:bg-secondary rounded-lg transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      
      {/* React Sub-options */}
      {codeLanguage === 'react' && (
        <div className="flex gap-2 bg-secondary/20 p-1 rounded-lg mb-4 w-fit">
          <button
            onClick={() => setReactMode('vite')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              reactMode === 'vite' ? 'bg-primary text-white shadow' : 'hover:bg-white/10'
            }`}
          >
            Vite
          </button>
          <button
            onClick={() => setReactMode('cra')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              reactMode === 'cra' ? 'bg-primary text-white shadow' : 'hover:bg-white/10'
            }`}
          >
            Create React App
          </button>
        </div>
      )}

      {/* Next.js Sub-options */}
      {codeLanguage === 'nextjs' && (
        <div className="flex gap-2 bg-secondary/20 p-1 rounded-lg mb-4 w-fit">
          <button
            onClick={() => setNextMode('app')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              nextMode === 'app' ? 'bg-primary text-white shadow' : 'hover:bg-white/10'
            }`}
          >
            App Router (13+)
          </button>
          <button
            onClick={() => setNextMode('pages')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              nextMode === 'pages' ? 'bg-primary text-white shadow' : 'hover:bg-white/10'
            }`}
          >
            Pages Router
          </button>
        </div>
      )}

      {/* Code Display */}
      <div className="relative">
        <SyntaxHighlighter
          language={
            codeLanguage === 'html' ? 'markup' : 
            (codeLanguage === 'react' || codeLanguage === 'nextjs') ? 'tsx' : 
            codeLanguage
          }
          style={vscDarkPlus}
          customStyle={{
            borderRadius: '0.75rem',
            padding: '1.5rem',
            fontSize: '0.875rem',
            maxHeight: '500px',
            margin: 0
          }}
        >
          {currentCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
