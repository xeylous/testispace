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
    borderRadius: currentCustomStyles.borderRadius || '12',
    containerBackground: currentCustomStyles.containerBackground || 'transparent',
    showImages: currentCustomStyles.showImages !== undefined ? currentCustomStyles.showImages : true,
    showContentMedia: currentCustomStyles.showContentMedia !== undefined ? currentCustomStyles.showContentMedia : true
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);



  // Initial state for comparison
  const initialCustomStyles = {
    backgroundColor: currentCustomStyles.backgroundColor || '#1a1a1a',
    textColor: currentCustomStyles.textColor || '#ffffff',
    accentColor: currentCustomStyles.accentColor || '#8b5cf6',
    starColor: currentCustomStyles.starColor || '#eab308',
    fontFamily: currentCustomStyles.fontFamily || 'Inter',
    borderRadius: currentCustomStyles.borderRadius || '12',
    containerBackground: currentCustomStyles.containerBackground || 'transparent',
    showImages: currentCustomStyles.showImages !== undefined ? currentCustomStyles.showImages : true,
    showContentMedia: currentCustomStyles.showContentMedia !== undefined ? currentCustomStyles.showContentMedia : true
  };

  const hasChanges = 
    selectedLayout !== currentLayout ||
    selectedStyle !== currentStyle ||
    JSON.stringify(customStyles) !== JSON.stringify(initialCustomStyles);

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

  const handlePreview = (e: React.MouseEvent, type: 'layout' | 'style', id: string) => {
    e.stopPropagation(); // Prevent card selection logic if necessary, though here we want both
    if (type === 'layout') setSelectedLayout(id);
    if (type === 'style') setSelectedStyle(id);
    setShowPreview(true);
  };

  const tabs = [
    { id: 'layout' as const, label: 'Layout', icon: <LayoutGrid size={18} /> },
    { id: 'customize' as const, label: 'Customize', icon: <Palette size={18} /> },
  ];

  const layouts = [
    { 
      id: 'animated', 
      name: 'Animated', 
      desc: 'Auto-playing carousel with smooth transitions',
      preview: 'image-quote-carousel'
    },
    { 
      id: 'marquee', 
      name: '3D Marquee', 
      desc: 'Infinite scrolling with 3D perspective',
      preview: '3d-marquee-scroll'
    },
    { 
      id: 'stack', 
      name: 'Card Stack', 
      desc: 'Stacked cards with interval transitions',
      preview: 'card-stack'
    },
    { 
      id: 'grid', 
      name: 'Grid', 
      desc: 'Classic responsive grid layout',
      preview: 'grid-layout'
    },
    { 
      id: 'carousel', 
      name: 'Carousel', 
      desc: 'Horizontal sliding carousel',
      preview: 'carousel-slide'
    },
    { 
      id: 'masonry', 
      name: 'Masonry', 
      desc: 'Pinterest-style masonry layout',
      preview: 'masonry-layout'
    },
    { 
      id: 'list', 
      name: 'List', 
      desc: 'Clean vertical list view',
      preview: 'list-layout'
    },
  ];

  const cardStyles = [
    { id: 'modern', name: 'Modern', preview: 'Glassmorphism with shadows' },
    { id: 'minimal', name: 'Minimal', preview: 'Clean and simple' },
    { id: 'classic', name: 'Classic', preview: 'Traditional card style' },
    { id: 'gradient', name: 'Gradient', preview: 'Colorful gradients' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Testimonials Customization</h2>
          <p className="text-muted-foreground">Customize how your testimonials will appear on your website.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 md:flex-none border border-border hover:bg-secondary/50 text-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            Live Preview
          </button>
          <button
            onClick={saveCustomization}
            disabled={saving || !hasChanges}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

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
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Choose your testimonial display style</p>
              </div>
              
              {/* Layout Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {layouts.map((layout) => {
                  // Generate mini preview visualization
                  const getPreviewContent = () => {
                    if (layout.preview === 'image-quote-carousel') {
                      return (
                        <div className="relative h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                          <div className="flex gap-2 items-center">
                            <div className="w-10 h-10 bg-white/20 rounded-full" />
                            <div className="flex flex-col gap-1">
                              <div className="w-12 h-2 bg-white/40 rounded" />
                              <div className="w-10 h-1.5 bg-white/30 rounded" />
                            </div>
                          </div>
                        </div>
                      );
                    } else if (layout.preview === '3d-marquee-scroll') {
                      return (
                        <div className="relative h-20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg overflow-hidden flex items-center justify-center">
                          <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="min-w-[35px] h-14 bg-white/20 rounded-lg transform -skew-y-3" />
                            ))}
                          </div>
                        </div>
                      );
                    } else if (layout.preview === 'card-stack') {
                      return (
                        <div className="relative h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-16 h-12 bg-white/20 rounded-lg"
                              style={{
                                transform: `translateY(${i * 3}px) translateX(${i * 2.5}px) scale(${1 - i * 0.05})`,
                                zIndex: 3 - i,
                                opacity: 1 - i * 0.3
                              }}
                            />
                          ))}
                        </div>
                      );
                    } else if (layout.preview === 'grid-layout') {
                      return (
                        <div className="h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-2">
                          <div className="grid grid-cols-2 gap-2 h-full">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="bg-white/20 rounded" />
                            ))}
                          </div>
                        </div>
                      );
                    } else if (layout.preview === 'carousel-slide') {
                      return (
                        <div className="relative h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center overflow-hidden">
                          <div className="flex gap-2">
                            <div className="w-12 h-12 bg-white/10 rounded-lg" />
                            <div className="w-12 h-12 bg-white/30 rounded-lg" />
                            <div className="w-12 h-12 bg-white/10 rounded-lg" />
                          </div>
                        </div>
                      );
                    } else if (layout.preview === 'masonry-layout') {
                      return (
                        <div className="h-20 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg p-2">
                          <div className="grid grid-cols-2 gap-2 h-full">
                            <div className="bg-white/20 rounded row-span-2" />
                            <div className="bg-white/20 rounded" />
                            <div className="bg-white/20 rounded" />
                          </div>
                        </div>
                      );
                    } else if (layout.preview === 'list-layout') {
                      return (
                        <div className="h-20 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg p-2 flex flex-col gap-1.5">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white/20 rounded h-5" />
                          ))}
                        </div>
                      );
                    }
                  };

                  return (
                    <button
                      key={layout.id}
                      onClick={() => handleLayoutChange(layout.id)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all text-left group/card ${
                        selectedLayout === layout.id
                          ? 'border-primary bg-primary/5 shadow-lg scale-105'
                          : 'border-border hover:border-primary/50 hover:shadow-md hover:scale-105'
                      }`}
                    >
                      {/* Preview Content */}
                      <div className="p-2.5">
                        {getPreviewContent()}
                      </div>
                      
                      {/* Descriptions */}
                      <div className="px-3 pb-3">
                        <div className="font-semibold text-sm text-foreground mb-1 flex items-center justify-between">
                          {layout.name}
                          {selectedLayout === layout.id && (
                            <div className="bg-primary text-white rounded-full p-1">
                              <Check size={10} />
                            </div>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-tight line-clamp-2 mb-2">
                          {layout.desc}
                        </div>
                        
                        {/* Preview Button */}
                        <div 
                          onClick={(e) => handlePreview(e, 'layout', layout.id)}
                          className={`w-full py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                            selectedLayout === layout.id
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 opacity-0 group-hover/card:opacity-100'
                          }`}
                        >
                          <Eye size={12} />
                          Preview
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8">
                <h3 className="font-bold mb-4">Card Style</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {cardStyles.map((style) => {
                    // Determine preview style based on type
                    let previewStyle: any = {
                      backgroundColor: customStyles.backgroundColor,
                      color: customStyles.textColor,
                      border: '1px solid transparent',
                    };

                    if (style.id === 'modern') {
                      previewStyle.background = `linear-gradient(135deg, ${customStyles.backgroundColor}EE, ${customStyles.backgroundColor}DD)`;
                      previewStyle.border = `1px solid ${customStyles.accentColor}40`;
                      previewStyle.boxShadow = `0 4px 12px ${customStyles.accentColor}20`;
                    } else if (style.id === 'minimal') {
                      previewStyle.border = `1px solid ${customStyles.textColor}20`;
                    } else if (style.id === 'classic') {
                      previewStyle.border = `2px solid ${customStyles.accentColor}50`;
                    } else if (style.id === 'gradient') {
                      previewStyle.background = `linear-gradient(135deg, ${customStyles.accentColor}40, ${customStyles.backgroundColor})`;
                      previewStyle.border = 'none';
                    }

                    return (
                      <button
                        key={style.id}
                        onClick={() => handleStyleChange(style.id)}
                        className={`relative overflow-hidden p-6 rounded-xl transition-all h-32 flex flex-col justify-end items-start text-left group/card ${
                          selectedStyle === style.id
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                            : 'hover:opacity-90'
                        }`}
                        style={previewStyle}
                      >
                        <div className="font-bold text-sm mb-1 z-10">{style.name}</div>
                        <div className="text-[10px] opacity-70 leading-tight mb-2 z-10">{style.preview}</div>
                        
                        {selectedStyle === style.id && (
                          <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 z-10">
                            <Check size={12} />
                          </div>
                        )}

                        {/* Preview Button */}
                        <div 
                           onClick={(e) => handlePreview(e, 'style', style.id)}
                           className={`relative z-10 mt-auto w-full py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                             selectedStyle === style.id
                               ? 'bg-background/20 backdrop-blur hover:bg-background/30'
                               : 'bg-background/20 backdrop-blur hover:bg-background/30 opacity-0 group-hover/card:opacity-100'
                           }`}
                         >
                           <Eye size={12} />
                           Preview
                         </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customize' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Customize your testimonial colors and styling</p>
              </div>
              
              {/* Colors Section */}
              <div className="glass-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Palette size={18} className="text-primary" />
                  Colors & Theme
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card Background */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Card Background</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customStyles.backgroundColor}
                        onChange={(e) => setCustomStyles({...customStyles, backgroundColor: e.target.value})}
                        className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer shadow-md"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customStyles.backgroundColor}
                          onChange={(e) => setCustomStyles({...customStyles, backgroundColor: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono"
                        />
                        <div className="flex gap-2 mt-2">
                          {['#1a1a1a', '#ffffff', '#2563eb', '#8b5cf6'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setCustomStyles({...customStyles, backgroundColor: color})}
                              className="w-8 h-8 rounded-md border-2 border-border hover:scale-110 transition-transform shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Text Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customStyles.textColor}
                        onChange={(e) => setCustomStyles({...customStyles, textColor: e.target.value})}
                        className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer shadow-md"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customStyles.textColor}
                          onChange={(e) => setCustomStyles({...customStyles, textColor: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono"
                        />
                        <div className="flex gap-2 mt-2">
                          {['#ffffff', '#000000', '#f3f4f6', '#1f2937'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setCustomStyles({...customStyles, textColor: color})}
                              className="w-8 h-8 rounded-md border-2 border-border hover:scale-110 transition-transform shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customStyles.accentColor}
                        onChange={(e) => setCustomStyles({...customStyles, accentColor: e.target.value})}
                        className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer shadow-md"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customStyles.accentColor}
                          onChange={(e) => setCustomStyles({...customStyles, accentColor: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono"
                        />
                        <div className="flex gap-2 mt-2">
                          {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setCustomStyles({...customStyles, accentColor: color})}
                              className="w-8 h-8 rounded-md border-2 border-border hover:scale-110 transition-transform shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Star Color */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Star Rating Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customStyles.starColor}
                        onChange={(e) => setCustomStyles({...customStyles, starColor: e.target.value})}
                        className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer shadow-md"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customStyles.starColor}
                          onChange={(e) => setCustomStyles({...customStyles, starColor: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono"
                        />
                        <div className="flex gap-2 mt-2">
                          {['#eab308', '#fbbf24', '#f59e0b', '#fb923c'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setCustomStyles({...customStyles, starColor: color})}
                              className="w-8 h-8 rounded-md border-2 border-border hover:scale-110 transition-transform shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Gradients Section */}
              <div className="glass-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg mb-4">Container Background</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose a gradient or solid color for the background</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    { name: 'Transparent', value: 'transparent', gradient: 'bg-gray-200 dark:bg-gray-800' },
                    { name: 'Ocean Blue', value: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', gradient: 'bg-gradient-to-r from-blue-400 to-cyan-400' },
                    { name: 'Sunset', value: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)', gradient: 'bg-gradient-to-br from-pink-400 to-red-400' },
                    { name: 'Forest', value: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)', gradient: 'bg-gradient-to-br from-lime-300 to-green-400' },
                    { name: 'Purple Dreams', value: 'linear-gradient(to right, #a8edea 0%, #fed6e3 100%)', gradient: 'bg-gradient-to-r from-cyan-200 to-pink-200' },
                    { name: 'Dark Night', value: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', gradient: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700' },
                    { name: 'Warm Flame', value: 'linear-gradient(45deg, #ff9a56, #ff6a88)', gradient: 'bg-gradient-to-br from-orange-400 to-pink-500' },
                    { name: 'Cool Blues', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setCustomStyles({...customStyles, containerBackground: preset.value})}
                      className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                        customStyles.containerBackground === preset.value
                          ? 'border-primary shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`h-20 ${preset.gradient}`} />
                      <div className="p-2 bg-background/90 backdrop-blur-sm">
                      <p className="text-xs font-medium text-center">{preset.name}</p>
                      </div>
                      {customStyles.containerBackground === preset.value && (
                        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Custom Gradient / Color</label>
                  <input
                    type="text"
                    placeholder="e.g. #000000 or linear-gradient(to right, #ff0000, #00ff00)"
                    value={customStyles.containerBackground}
                    onChange={(e) => setCustomStyles({...customStyles, containerBackground: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono"
                  />
                </div>
              </div>

              {/* Typography & Style Section */}
              <div className="glass-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg mb-4">Typography & Styling</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Font Family</label>
                    <select 
                      value={customStyles.fontFamily}
                      onChange={(e) => setCustomStyles({...customStyles, fontFamily: e.target.value})}
                      className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground font-medium"
                    >
                      <option value="Inter">Inter - Modern & Clean</option>
                      <option value="Roboto">Roboto - Professional</option>
                      <option value="Poppins">Poppins - Friendly & Bold</option>
                      <option value="Montserrat">Montserrat - Elegant</option>
                      <option value="Open Sans">Open Sans - Readable</option>
                      <option value="Lato">Lato - Versatile</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Border Radius: {customStyles.borderRadius}px
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({customStyles.borderRadius === '0' ? 'Sharp' : customStyles.borderRadius < '8' ? 'Slight' : customStyles.borderRadius < '16' ? 'Rounded' : 'Very Rounded'})
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={customStyles.borderRadius}
                      onChange={(e) => setCustomStyles({...customStyles, borderRadius: e.target.value})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between mt-2">
                      {[0, 8, 16, 24].map((val) => (
                        <button
                          key={val}
                          onClick={() => setCustomStyles({...customStyles, borderRadius: val.toString()})}
                          className="text-xs px-2 py-1 rounded border border-border hover:bg-white/5 transition-colors"
                        >
                          {val}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Settings Section */}
              <div className="glass-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Eye size={18} className="text-primary" />
                  Display Settings
                </h3>
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                  <div>
                    <label className="font-semibold block text-sm">Show Reviewer Images</label>
                    <p className="text-[11px] text-muted-foreground">Toggle to show or hide user avatars and photos</p>
                  </div>
                  <button
                    onClick={() => setCustomStyles({...customStyles, showImages: !customStyles.showImages})}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      customStyles.showImages ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        customStyles.showImages ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border mt-3">
                  <div>
                    <label className="font-semibold block text-sm">Show Content Media</label>
                    <p className="text-[11px] text-muted-foreground">Toggle to show or hide attached images/videos</p>
                  </div>
                  <button
                    onClick={() => setCustomStyles({...customStyles, showContentMedia: !customStyles.showContentMedia})}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      customStyles.showContentMedia ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        customStyles.showContentMedia ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setCustomStyles({
                    backgroundColor: '#1a1a1a',
                    textColor: '#ffffff',
                    accentColor: '#8b5cf6',
                    starColor: '#eab308',
                    fontFamily: 'Inter',
                    borderRadius: '12',
                    containerBackground: 'transparent',
                    showImages: true,
                    showContentMedia: true
                  })}

                  className="px-6 py-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors text-sm font-medium w-full md:w-auto"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-background rounded-2xl shadow-2xl border border-border flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-primary" />
                <h2 className="font-bold text-lg">Live Preview</h2>
                <span className="text-sm text-muted-foreground ml-2 px-2 py-0.5 rounded-full bg-secondary/50 border border-border">
                  {layouts.find(l => l.id === selectedLayout)?.name} • {cardStyles.find(s => s.id === selectedStyle)?.name}
                </span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-8 bg-secondary/10 min-h-[500px] flex items-center justify-center">
              <div className="w-full">
                <EmbedPreview 
                  layout={selectedLayout}
                  cardStyle={selectedStyle}
                  customStyles={customStyles}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
