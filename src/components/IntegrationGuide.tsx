"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Code } from "lucide-react";

interface IntegrationGuideProps {
  spaceId: string;
  baseUrl: string;
}

export default function IntegrationGuide({ spaceId, baseUrl }: IntegrationGuideProps) {
  const [codeLanguage, setCodeLanguage] = useState<'html' | 'react' | 'python'>('html');
  const [copied, setCopied] = useState(false);
  const [reactMode, setReactMode] = useState<'package' | 'tailwind'>('package');

  const getCodeSnippet = () => {
    if (codeLanguage === 'react' && reactMode === 'tailwind') {
      return `import { useEffect, useState } from 'react';
import { Star } from 'lucide-react'; // Make sure to verify icon imports

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch testimonials from TestiSpace
    fetch('${baseUrl}/api/embed/${spaceId}')
      .then(res => res.json())
      .then(data => setTestimonials(data.testimonials || []))
      .catch(err => console.error('Error fetching testimonials:', err));
  }, []);

  return (
    <section className="py-12 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={t._id || i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col h-full">
              {/* Header: Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index} 
                    size={16} 
                    className={index < t.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                  />
                ))}
              </div>

              {/* Content */}
              <div className="flex-grow">
                 {t.content && <p className="text-gray-700 dark:text-gray-300 italic mb-4">"{t.content}"</p>}
                 {/* Handle mediaType === 'video' or 'image' if needed */}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                  {t.userDetails?.name?.[0] || 'A'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t.userDetails?.name || 'Anonymous'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t.userDetails?.designation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;
    }

    const snippets = {
      html: `<!-- Add this to your HTML -->
<script 
  src="${baseUrl}/embed.js" 
  data-space-id="${spaceId}">
</script>`,
      
      react: `// Install: npm install testispace-react-embed
      
import TestiSpaceEmbed from 'testispace-react-embed';

<TestiSpaceEmbed 
  spaceId="${spaceId}"
/>`,
      
      python: `# Flask/Django template example

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
#   data-space-id="{{ embed.space_id }}"></script>`
    };
    
    return snippets[codeLanguage];
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Code size={24} className="text-primary" />
        Integration Guide
      </h2>
      <p className="text-muted-foreground mb-6">
        Choose your preferred framework or language to get the embed code for your website.
      </p>

      <div className="space-y-4">
        {/* Language Selection */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
           <div className="flex gap-2">
            {['html', 'react', 'python'].map((lang) => (
                <button
                key={lang}
                onClick={() => setCodeLanguage(lang as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    codeLanguage === lang
                    ? 'bg-primary text-white'
                    : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
                }`}
                >
                {lang.toUpperCase()}
                </button>
            ))}
           </div>

           {/* React Sub-options */}
           {codeLanguage === 'react' && (
               <div className="flex gap-2 bg-secondary/20 p-1 rounded-lg">
                   <button
                    onClick={() => setReactMode('package')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        reactMode === 'package' ? 'bg-primary text-white shadow' : 'hover:bg-white/10'
                    }`}
                   >
                       NPM Package
                   </button>
                   <button
                    onClick={() => setReactMode('tailwind')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        reactMode === 'tailwind' ? 'bg-primary text-white shadow' : 'hover:bg-white/10'
                    }`}
                   >
                       Tailwind Code
                   </button>
               </div>
           )}
        </div>

        <div className="relative">
          <SyntaxHighlighter
            language={codeLanguage === 'html' ? 'markup' : (codeLanguage === 'react' && reactMode === 'tailwind' ? 'tsx' : codeLanguage)}
            style={vscDarkPlus}
            customStyle={{
              borderRadius: '0.75rem',
              padding: '1.5rem',
              fontSize: '0.875rem',
              maxHeight: '500px'
            }}
          >
            {getCodeSnippet()}
          </SyntaxHighlighter>
          
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-secondary/80 hover:bg-secondary rounded-lg transition-colors"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
