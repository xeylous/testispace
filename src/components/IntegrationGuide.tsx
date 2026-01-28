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

  const getCodeSnippet = () => {
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
        <div className="flex gap-2 mb-4">
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

        <div className="relative">
          <SyntaxHighlighter
            language={codeLanguage === 'html' ? 'markup' : codeLanguage}
            style={vscDarkPlus}
            customStyle={{
              borderRadius: '0.75rem',
              padding: '1.5rem',
              fontSize: '0.875rem'
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
