"use client";
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Sparkles,
  Undo,
  Redo,
  Languages,
  Loader2
} from 'lucide-react';

interface TipTapEditorProps {
  initialContentEn?: any;
  initialContentSi?: any;
  articleTitle?: string;
  onChangeEn?: (json: any) => void;
  onChangeSi?: (json: any) => void;
}

export function TipTapEditor({
  initialContentEn,
  initialContentSi,
  articleTitle = '',
  onChangeEn,
  onChangeSi,
}: TipTapEditorProps) {
  const [activeTab, setActiveTab] = useState<'EN' | 'SI'>('EN');
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  const editorEn = useEditor({
    extensions: [StarterKit],
    content: initialContentEn || {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Begin drafting your scientific article in English...' }] }]
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChangeEn?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4 text-[var(--color-text-primary)] font-body leading-relaxed',
      },
    },
  });

  const editorSi = useEditor({
    extensions: [StarterKit],
    content: initialContentSi || {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ලිපිය සිංහලෙන් මෙහි ලියන්න...' }] }]
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChangeSi?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4 text-[var(--color-text-primary)] font-body leading-relaxed',
      },
    },
  });

  const currentEditor = activeTab === 'EN' ? editorEn : editorSi;

  useEffect(() => {
    if (editorEn && initialContentEn) {
      try {
        editorEn.commands.setContent(initialContentEn);
      } catch (e) {
        console.warn('Set English content error:', e);
      }
    }
  }, [editorEn, initialContentEn]);

  useEffect(() => {
    if (editorSi && initialContentSi) {
      try {
        editorSi.commands.setContent(initialContentSi);
      } catch (e) {
        console.warn('Set Sinhala content error:', e);
      }
    }
  }, [editorSi, initialContentSi]);

  const handleGenerateOutline = async () => {
    if (!articleTitle.trim()) {
      setOutlineError('Please enter an article title first.');
      return;
    }
    setOutlineError(null);
    setIsGeneratingOutline(true);

    try {
      const prompt = `Generate a rigorous, 5-point academic magazine article outline for the article titled "${articleTitle}". Include concise bullet points and suggested scientific headings for a high-end science publication. Language: ${activeTab === 'EN' ? 'English' : 'Sinhala'}.`;
      
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate outline');

      const outlineText = data.text || data.reply || data.choices?.[0]?.message?.content || '';
      
      if (currentEditor && outlineText) {
        currentEditor.commands.insertContent(`\n\n<h3>✨ AI Editorial Outline</h3><p>${outlineText.replace(/\n/g, '<br/>')}</p>\n\n`);
      }
    } catch (err: any) {
      console.error(err);
      setOutlineError(err.message || 'Error communicating with AI service');
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  if (!editorEn || !editorSi) {
    return <div className="p-8 text-center text-sm text-[var(--color-text-muted)] animate-pulse">Initializing TipTap Editorial Suite...</div>;
  }

  return (
    <div className="border border-[var(--color-glass-border)] rounded-xl overflow-hidden bg-white/40 backdrop-blur-md shadow-sm">
      {/* Top Header & Language Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/60 border-b border-[var(--color-glass-border)]">
        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('EN')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'EN'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            English Edition
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SI')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'SI'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            සිංහල අනුවාදය (Sinhala)
          </button>
        </div>

        {/* AI Outline Generator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateOutline}
            disabled={isGeneratingOutline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
          >
            {isGeneratingOutline ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Outline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>AI Outline Generator</span>
              </>
            )}
          </button>
        </div>
      </div>

      {outlineError && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
          {outlineError}
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-white/40 border-b border-[var(--color-glass-border)] text-gray-700">
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('bold') ? 'bg-black/15 text-black font-bold' : ''}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('italic') ? 'bg-black/15 text-black' : ''}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('heading', { level: 1 }) ? 'bg-black/15 text-black font-bold' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('heading', { level: 2 }) ? 'bg-black/15 text-black font-bold' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('heading', { level: 3 }) ? 'bg-black/15 text-black font-bold' : ''}`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('bulletList') ? 'bg-black/15 text-black' : ''}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('orderedList') ? 'bg-black/15 text-black' : ''}`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('blockquote') ? 'bg-black/15 text-black' : ''}`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${currentEditor.isActive('codeBlock') ? 'bg-black/15 text-black' : ''}`}
          title="Code Block"
        >
          <Code size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().undo().run()}
          disabled={!currentEditor.can().undo()}
          className="p-1.5 rounded hover:bg-black/10 disabled:opacity-30 transition-colors"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => currentEditor.chain().focus().redo().run()}
          disabled={!currentEditor.can().redo()}
          className="p-1.5 rounded hover:bg-black/10 disabled:opacity-30 transition-colors"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content Canvas */}
      <div className="min-h-[350px] bg-white/70">
        <div className={activeTab === 'EN' ? 'block' : 'hidden'}>
          <EditorContent editor={editorEn} />
        </div>
        <div className={activeTab === 'SI' ? 'block' : 'hidden'}>
          <EditorContent editor={editorSi} />
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 text-[11px] text-gray-500 bg-white/60 border-t border-[var(--color-glass-border)] flex items-center justify-between">
        <span>Editing {activeTab === 'EN' ? 'English' : 'Sinhala'} version</span>
        <span>TipTap Engine • Content serialized to JSON</span>
      </div>
    </div>
  );
}
