"use client";

import { useState } from "react";
import { Copy, Check, Palette, LayoutGrid, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import EmbedPreview from "./EmbedPreview";

interface EmbedCustomizerProps {
  spaceId: string;
  baseUrl: string;
  currentLayout?: string;
  currentStyle?: string;
  currentCustomStyles?: any;
}

export default function EmbedCustomizer({ 
  spaceId, 
  baseUrl, 
  currentLayout = 'grid', 
  currentStyle = 'modern',
  currentCustomStyles = {}
}: EmbedCustomizerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'layout' | 'customize'>('layout');
  
  // Local state for customization
  const [selectedLayout, setSelectedLayout] = useState(currentLayout);
  const [selectedStyle, setSelectedStyle] = useState(currentStyle);
  const [customStyles, setCustomStyles] = useState({
    backgroundColor: currentCustomStyles.backgroundColor || '#1a1a1a',
    textColor: currentCustomStyles.textColor || '#ffffff',
    accentColor: currentCustomStyles.accentColor || '#8b5cf6',
    starColor: currentCustomStyles.starColor || '#eab308',
    fontFamily: currentCustomStyles.fontFamily || 'Inter',
    borderRadius: currentCustomStyles.borderRadius || '12'
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);



  const saveCustomization = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/spaces/${spaceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embedLayout: selectedLayout,
          cardStyle: selectedStyle,
          customStyles: customStyles
        })
      });

      if (response.ok) {
        router.refresh();
        alert('Customization saved successfully!');
      } else {
        alert('Failed to save customization');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving customization');
    } finally {
      setSaving(false);
    }
  };

  const handleLayoutChange = (layout: string) => {
    setSelectedLayout(layout);
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
  };

  const tabs = [
    { id: 'layout' as const, label: 'Layout', icon: <LayoutGrid size={18} /> },
    { id: 'customize' as const, label: 'Customize', icon: <Palette size={18} /> },
  ];

  const layouts = [
    { id: 'grid', name: 'Grid', desc: 'Classic grid layout' },
    { id: 'carousel', name: 'Carousel', desc: 'Sliding carousel' },
    { id: 'masonry', name: 'Masonry', desc: 'Pinterest-style' },
    { id: 'list', name: 'List', desc: 'Vertical list' },
  ];

  const cardStyles = [
    { id: 'modern', name: 'Modern', preview: 'Glassmorphism with shadows' },
    { id: 'minimal', name: 'Minimal', preview: 'Clean and simple' },
    { id: 'classic', name: 'Classic', preview: 'Traditional card style' },
    { id: 'gradient', name: 'Gradient', preview: 'Colorful gradients' },
  ];

  return (
    <div className="glass-card p-6 rounded-xl border border-border mb-8">
      <h2 className="text-xl font-bold mb-4">Embed Customization</h2>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">

        {activeTab === 'layout' && (
          <div className="space-y-6">
            <p className="text-muted-foreground">Choose how testimonials are displayed</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {layouts.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => handleLayoutChange(layout.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                    selectedLayout === layout.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-bold text-foreground mb-1">{layout.name}</div>
                  <div className="text-xs text-muted-foreground">{layout.desc}</div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-bold mb-4">Card Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cardStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                      selectedStyle === style.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-bold text-foreground mb-1">{style.name}</div>
                    <div className="text-xs text-muted-foreground">{style.preview}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={saveCustomization}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-secondary/30 hover:bg-secondary/50 text-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Eye size={18} />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'customize' && (
          <div className="space-y-6">
            <p className="text-muted-foreground">Customize colors and styling</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <input
                  type="color"
                  value={customStyles.backgroundColor}
                  onChange={(e) => setCustomStyles({...customStyles, backgroundColor: e.target.value})}
                  className="w-full h-12 rounded-lg border border-border cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Text Color</label>
                <input
                  type="color"
                  value={customStyles.textColor}
                  onChange={(e) => setCustomStyles({...customStyles, textColor: e.target.value})}
                  className="w-full h-12 rounded-lg border border-border cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Accent Color</label>
                <input
                  type="color"
                  value={customStyles.accentColor}
                  onChange={(e) => setCustomStyles({...customStyles, accentColor: e.target.value})}
                  className="w-full h-12 rounded-lg border border-border cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Star Color</label>
                <input
                  type="color"
                  value={customStyles.starColor}
                  onChange={(e) => setCustomStyles({...customStyles, starColor: e.target.value})}
                  className="w-full h-12 rounded-lg border border-border cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Font Family</label>
                <select 
                  value={customStyles.fontFamily}
                  onChange={(e) => setCustomStyles({...customStyles, fontFamily: e.target.value})}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Border Radius ({customStyles.borderRadius}px)</label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={customStyles.borderRadius}
                  onChange={(e) => setCustomStyles({...customStyles, borderRadius: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={saveCustomization}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Customization'}
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-secondary/30 hover:bg-secondary/50 text-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Eye size={18} />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Eye size={18} className="text-primary" />
            Live Preview - See Changes in Real-Time
          </h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <EmbedPreview 
              layout={selectedLayout}
              cardStyle={selectedStyle}
              customStyles={customStyles}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Preview updates instantly as you change settings. Click "Save Changes" to persist.
          </p>
        </div>
      )}
    </div>
  );
}
