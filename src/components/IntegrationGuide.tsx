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
  const [codeLanguage, setCodeLanguage] = useState<'html' | 'react' | 'python'>('html');
  const [copied, setCopied] = useState(false);
  const [reactMode, setReactMode] = useState<'package' | 'tailwind'>('package');

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

  const reactPackageCode = `// Install: npm install testispace-react-embed
      
import TestiSpaceEmbed from 'testispace-react-embed';

<TestiSpaceEmbed 
  spaceId="${spaceId}"
/>`;

  const reactTailwindCode = `import { Star } from 'lucide-react'; 
import { useTestimonials } from 'testispace-react-embed';

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials('${spaceId}');

  if (loading) return <div>Loading...</div>;
  if (!testimonials.length) return null;

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
    return reactMode === 'package' ? reactPackageCode : reactTailwindCode;
  };

  const getCurrentLanguageInfo = () => {
    switch (codeLanguage) {
      case 'html':
        return { title: 'HTML', description: 'Simple script tag integration for any website' };
      case 'react':
        return { title: 'React', description: 'Component integration for React applications' };
      case 'python':
        return { title: 'Python', description: 'Flask/Django template integration' };
    }
  };

  const languageInfo = getCurrentLanguageInfo();
  const currentCode = getCurrentCode();

  return (
    <div className="glass-card p-6 rounded-xl border border-border">
      {/* Language Selection Tabs */}
      <div className="flex gap-2 mb-6">
        {['html', 'react', 'python'].map((lang) => (
          <button
            key={lang}
            onClick={() => setCodeLanguage(lang as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              codeLanguage === lang
                ? 'bg-primary text-white'
                : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
            }`}
          >
            {lang.toUpperCase()}
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

      {/* Code Display */}
      <div className="relative">
        <SyntaxHighlighter
          language={codeLanguage === 'html' ? 'markup' : (codeLanguage === 'react' && reactMode === 'tailwind' ? 'tsx' : codeLanguage)}
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
