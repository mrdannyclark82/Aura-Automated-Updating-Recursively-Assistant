import React, { useState, useRef } from 'react';
import {
  UploadedMemory,
  MemoryCategory,
} from '../types';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  FileCode,
  BookOpen,
  User,
  ShieldCheck,
  CheckCircle2,
  X,
  Copy,
  Check,
  Search,
  Tag,
  Eye,
  ToggleLeft,
  ToggleRight,
  Database,
  Sparkles,
  FilePlus2,
} from 'lucide-react';

interface MemoryBankViewProps {
  memories: UploadedMemory[];
  onToggleMemory: (id: string) => void;
  onDeleteMemory: (id: string) => void;
  onAddMemory: (memory: Omit<UploadedMemory, 'id' | 'uploadedAt'>) => void;
}

const CATEGORY_ICONS: Record<MemoryCategory, React.ComponentType<{ className?: string }>> = {
  domain_knowledge: BookOpen,
  coding_guidelines: FileCode,
  project_context: FileText,
  personal_bio: User,
  sop_standards: ShieldCheck,
  reference_doc: FileText,
};

const CATEGORY_COLORS: Record<MemoryCategory, { text: string; bg: string; border: string }> = {
  domain_knowledge: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  coding_guidelines: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  project_context: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  personal_bio: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  sop_standards: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  reference_doc: { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
};

export const MemoryBankView: React.FC<MemoryBankViewProps> = ({
  memories,
  onToggleMemory,
  onDeleteMemory,
  onAddMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [inspectingMemory, setInspectingMemory] = useState<UploadedMemory | null>(null);
  const [copied, setCopied] = useState(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('domain_knowledge');
  const [newTags, setNewTags] = useState('');
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Memories
  const filteredMemories = memories.filter((mem) => {
    const matchesCategory = selectedCategory === 'all' || mem.category === selectedCategory;
    const matchesQuery =
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const activeCount = memories.filter((m) => m.enabled).length;
  const totalTokens = memories
    .filter((m) => m.enabled)
    .reduce((sum, m) => sum + m.tokenEstimate, 0);

  // File parsing handler
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setFileName(file.name);
      setFileSize(file.size);
      setNewContent(text);

      // Auto-extract or suggest title
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      if (!newTitle) {
        setNewTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      // Generate brief summary snippet
      const firstLines = text.split('\n').filter((l) => l.trim().length > 0).slice(0, 3).join(' ');
      setNewSummary(firstLines.slice(0, 180) + (firstLines.length > 180 ? '...' : ''));

      // Suggest category based on extension
      if (file.name.endsWith('.md') || file.name.endsWith('.ts') || file.name.endsWith('.js')) {
        setNewCategory('coding_guidelines');
      } else if (file.name.endsWith('.json')) {
        setNewCategory('personal_bio');
      } else {
        setNewCategory('reference_doc');
      }

      // Pre-fill tag based on name
      const suggestedTag = cleanName.toLowerCase().split(' ')[0];
      if (suggestedTag && !newTags) {
        setNewTags(suggestedTag);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const tokenEstimate = Math.ceil(newContent.length / 4);

    onAddMemory({
      title: newTitle.trim(),
      content: newContent.trim(),
      summary:
        newSummary.trim() ||
        newContent.slice(0, 160).replace(/\n/g, ' ') + (newContent.length > 160 ? '...' : ''),
      category: newCategory,
      tags: parsedTags.length > 0 ? parsedTags : ['custom-memory'],
      tokenEstimate,
      fileName,
      fileSize,
      fileType: fileName?.endsWith('.md') ? 'text/markdown' : 'text/plain',
      enabled: true,
    });

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewSummary('');
    setNewTags('');
    setFileName(undefined);
    setFileSize(undefined);
    setIsUploading(false);
  };

  const handleLoadTemplate = (type: 'architecture' | 'memo' | 'profile') => {
    if (type === 'architecture') {
      setNewTitle('Cloud & Microservices Reliability Specs');
      setNewCategory('coding_guidelines');
      setNewTags('cloud, kubernetes, latency, sla');
      setNewSummary('Requirements for high-reliability cloud services: 99.99% uptime, p99 latency < 250ms.');
      setNewContent(`# Cloud & Microservices Reliability Specs
- SLA Target: 99.99% multi-region active-active uptime.
- Latency Budget: p95 latency under 120ms, p99 latency under 250ms.
- Fallback Policy: Circuit breaker trips after 3 consecutive 5xx errors; fall back to local cached state.
- Security: Zero plain-text credentials in logs or git commits.`);
    } else if (type === 'memo') {
      setNewTitle('Stakeholder Briefing Standard Format');
      setNewCategory('sop_standards');
      setNewTags('sop, memos, executive, reporting');
      setNewSummary('Standardized briefing template: Context, Core Findings, Risks, and Explicit Next Actions.');
      setNewContent(`# Stakeholder Briefing Format
1. Context & Scope: Purpose of analysis.
2. Executive Summary: Maximum 3 bullet points with quantifiable results.
3. Identified Risks: Severity level (Critical, Moderate, Low) with mitigation strategy.
4. Immediate Next Actions: Designated owner and completion target.`);
    } else {
      setNewTitle('Team Roles & Organizational Directory');
      setNewCategory('project_context');
      setNewTags('org-chart, elena-rostova, marcus-vance, product');
      setNewSummary('Key team contacts: Elena Rostova (VP Product), Marcus Vance (Lead Architect).');
      setNewContent(`# Team Directory & Roles
- Elena Rostova: VP of Product. Primary focus: Q4 Enterprise compute budgets and AI features.
- Marcus Vance: Lead Architect. Primary focus: WebGPU runtime performance and microservice security.
- Sarah Chen: Head of Infrastructure. Point of contact for SOC2 compliance audits.`);
    }
    setFileName(undefined);
    setFileSize(undefined);
  };

  const handleCopyInspect = () => {
    if (!inspectingMemory) return;
    navigator.clipboard.writeText(inspectingMemory.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Overview Stat Badges */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="text-[10px] text-white/50 uppercase font-mono">Indexed Documents</div>
          <div className="text-base font-bold text-cyan-400 mt-0.5">
            {activeCount} <span className="text-xs text-white/40">/ {memories.length}</span>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="text-[10px] text-white/50 uppercase font-mono">Active Memory Tokens</div>
          <div className="text-base font-bold text-purple-400 mt-0.5">
            ~{totalTokens.toLocaleString()}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="text-[10px] text-white/50 uppercase font-mono">Grounding Scope</div>
          <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Authoritative</span>
          </div>
        </div>
      </div>

      {/* Action Bar (Upload Button, Search, Category Filter) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search uploaded memories, tags, or content..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setIsUploading(!isUploading)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-950/40 transition-all flex-shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Memory</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono no-scrollbar">
          {['all', 'domain_knowledge', 'coding_guidelines', 'project_context', 'personal_bio', 'sop_standards'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-all flex-shrink-0 capitalize ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-white/50 hover:text-white bg-white/5 border border-white/5'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Upload & Indexing Drawer Form */}
      {isUploading && (
        <form
          onSubmit={handleSaveMemory}
          className="p-3.5 bg-gradient-to-b from-[#121738] to-[#0c102b] border border-cyan-500/30 rounded-2xl space-y-3 animate-fade-in shadow-2xl relative"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <FilePlus2 className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-semibold text-white">Upload Grounding Document into Memory</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Pre-fill Templates */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-white/40 font-mono">Sample Templates:</span>
            <button
              type="button"
              onClick={() => handleLoadTemplate('architecture')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-cyan-300"
            >
              Architecture Specs
            </button>
            <button
              type="button"
              onClick={() => handleLoadTemplate('memo')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-emerald-300"
            >
              Briefing SOP
            </button>
            <button
              type="button"
              onClick={() => handleLoadTemplate('profile')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-purple-300"
            >
              Team Directory
            </button>
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/15 hover:border-cyan-500/40 bg-black/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.md,.json,.csv,.doc,.pdf"
              className="hidden"
            />
            <Upload className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <p className="text-xs text-white/80 font-medium">
              {fileName ? (
                <span className="text-cyan-300 font-mono font-bold">Attached: {fileName} ({(fileSize! / 1024).toFixed(1)} KB)</span>
              ) : (
                'Drop files (.txt, .md, .json, .csv) or click to browse'
              )}
            </p>
            <p className="text-[10px] text-white/40 mt-0.5">Files are parsed client-side and stored securely in local memory.</p>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono text-white/50 block mb-1">Document Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Q4 Infrastructure Architecture Specs"
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-white/50 block mb-1">Memory Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="domain_knowledge">Domain Knowledge</option>
                <option value="coding_guidelines">Coding Guidelines</option>
                <option value="project_context">Project Context</option>
                <option value="personal_bio">Personal Bio / Profile</option>
                <option value="sop_standards">SOP & Standards</option>
                <option value="reference_doc">Reference Document</option>
              </select>
            </div>
          </div>

          {/* Tags & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono text-white/50 block mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="e.g. react-19, typescript, latency"
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-white/50 block mb-1">Short Summary (optional)</label>
              <input
                type="text"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="One sentence description"
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Memory Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-white/50">Full Document Content *</label>
              <span className="text-[10px] font-mono text-white/40">
                ~{Math.ceil(newContent.length / 4)} tokens ({newContent.length} chars)
              </span>
            </div>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Paste Markdown, code, guidelines, or reference notes here..."
              className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-3 py-1.5 text-xs text-white/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim() || !newContent.trim()}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Index into Memory Bank</span>
            </button>
          </div>
        </form>
      )}

      {/* Memory List Cards */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {filteredMemories.length === 0 ? (
          <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
            <Database className="w-8 h-8 text-white/30 mx-auto" />
            <p className="text-xs text-white/60 font-medium">No matching uploaded memories found</p>
            <p className="text-[11px] text-white/40 max-w-xs mx-auto">
              Upload markdown docs, engineering specs, or personal notes to ground Aura's answers in verified knowledge.
            </p>
            <button
              onClick={() => setIsUploading(true)}
              className="mt-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-medium inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload First Memory</span>
            </button>
          </div>
        ) : (
          filteredMemories.map((mem) => {
            const Icon = CATEGORY_ICONS[mem.category] || FileText;
            const colors = CATEGORY_COLORS[mem.category] || CATEGORY_COLORS.domain_knowledge;

            return (
              <div
                key={mem.id}
                className={`p-3 rounded-2xl border transition-all ${
                  mem.enabled
                    ? 'bg-[#101438]/80 border-white/10 hover:border-cyan-500/40 shadow-lg'
                    : 'bg-black/20 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-semibold text-white tracking-wide">{mem.title}</h4>
                        <span
                          className={`text-[9px] px-2 py-0.2 rounded-full font-mono uppercase ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          {mem.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed">
                        {mem.summary}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Enable */}
                  <button
                    onClick={() => onToggleMemory(mem.id)}
                    className="p-1 text-white/60 hover:text-white transition-colors flex-shrink-0"
                    title={mem.enabled ? 'Disable from active prompt injection' : 'Enable memory injection'}
                  >
                    {mem.enabled ? (
                      <ToggleRight className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-white/30" />
                    )}
                  </button>
                </div>

                {/* Footer Metadata & Action Buttons */}
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-white/60">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      {mem.tags.slice(0, 3).join(', ')}
                    </span>
                    <span>•</span>
                    <span>~{mem.tokenEstimate} tokens</span>
                    {mem.fileName && (
                      <>
                        <span>•</span>
                        <span className="text-white/50 truncate max-w-[110px]">{mem.fileName}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setInspectingMemory(mem)}
                      className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      title="Inspect full memory document"
                    >
                      <Eye className="w-3 h-3" />
                      <span className="text-[10px]">Inspect</span>
                    </button>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="p-1 rounded hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Inspect Memory Modal */}
      {inspectingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b0f2d] border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">{inspectingMemory.title}</h3>
                  <p className="text-[10px] text-white/50 font-mono">
                    Category: {inspectingMemory.category} • ~{inspectingMemory.tokenEstimate} tokens
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyInspect}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setInspectingMemory(null)}
                  className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-3 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                <span className="font-semibold text-cyan-300">Summary: </span>
                {inspectingMemory.summary}
              </div>

              <pre className="p-3 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white/85 whitespace-pre-wrap leading-relaxed select-text">
                {inspectingMemory.content}
              </pre>
            </div>

            <div className="px-4 py-2.5 border-t border-white/10 bg-black/20 flex items-center justify-between text-[11px] text-white/50 font-mono">
              <span>Tags: {inspectingMemory.tags.join(', ')}</span>
              <span>Uploaded {inspectingMemory.uploadedAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryBankView;
