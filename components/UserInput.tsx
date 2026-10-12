import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Loader2, Paperclip, FileText, Check, X, Database } from 'lucide-react';
import { UploadedMemory } from '../types';

interface UserInputProps {
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  onLiveSessionToggle?: () => void;
  onQuickUploadMemory?: (memory: Omit<UploadedMemory, 'id' | 'uploadedAt'>) => void;
  onOpenMemoryBank?: () => void;
}

export const UserInput: React.FC<UserInputProps> = ({
  onSendMessage,
  isStreaming,
  onQuickUploadMemory,
  onOpenMemoryBank,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number; tokens: number } | null>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use keyboard input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const tokenEstimate = Math.ceil(text.length / 4);
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const firstLine = text.split('\n')[0]?.slice(0, 140) || cleanTitle;

        if (onQuickUploadMemory) {
          onQuickUploadMemory({
            title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
            content: text,
            summary: firstLine,
            category: file.name.endsWith('.md') ? 'coding_guidelines' : 'domain_knowledge',
            tags: [cleanTitle.toLowerCase().split(' ')[0] || 'attachment'],
            tokenEstimate,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || 'text/plain',
            enabled: true,
          });
        }

        setAttachedFile({
          name: file.name,
          size: file.size,
          tokens: tokenEstimate,
        });

        // Prompt helper if input is empty
        if (!inputValue.trim()) {
          setInputValue(`I've uploaded "${file.name}" to your memory bank. Please analyze it and summarize the key requirements.`);
        }
      };
      reader.readAsText(file);
    }
    // reset input so same file can be re-selected if needed
    if (e.target) e.target.value = '';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      setAttachedFile(null);
    }
  };

  return (
    <div className="w-full px-4 pt-2 pb-4">
      <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
        {/* Attached memory indicator pill */}
        {attachedFile && (
          <div className="mb-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-xs flex items-center justify-between animate-fade-in shadow-md">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              <FileText className="w-3.5 h-3.5 text-cyan-300" />
              <span className="font-semibold text-white truncate max-w-[220px]">{attachedFile.name}</span>
              <span className="text-[10px] text-cyan-400/70 font-mono">
                ({(attachedFile.size / 1024).toFixed(1)} KB • ~{attachedFile.tokens} tokens indexed)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onOpenMemoryBank && (
                <button
                  type="button"
                  onClick={onOpenMemoryBank}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Database className="w-3 h-3" />
                  <span>Memory Bank</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="p-0.5 rounded text-cyan-400/60 hover:text-cyan-200"
                title="Dismiss pill"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div
          className={`relative w-full flex items-center bg-[#101538]/90 border rounded-2xl shadow-xl transition-all duration-300 backdrop-blur-xl ${
            isStreaming
              ? 'border-purple-500/50 shadow-purple-900/30'
              : 'border-white/15 hover:border-cyan-500/40 focus-within:border-cyan-400 focus-within:shadow-2xl focus-within:shadow-cyan-950/50'
          }`}
        >
          {/* Prefix indicator */}
          <div className="pl-4 pr-1 text-cyan-400/80 flex items-center justify-center">
            {isStreaming ? (
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          {/* Text Input */}
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : isStreaming
                ? 'Aura is reasoning & streaming response...'
                : 'Ask Aura anything, test complex NLU, or attach a document into memory...'
            }
            className="w-full bg-transparent text-white placeholder-white/40 px-3 py-3.5 focus:outline-none resize-none text-sm leading-relaxed"
            disabled={isStreaming}
          />

          {/* Action buttons (Paperclip Upload, Mic, Send) */}
          <div className="flex items-center gap-1.5 pr-3">
            {/* Hidden File Input for Memory Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".txt,.md,.json,.csv,.doc,.pdf"
              className="hidden"
            />

            {/* Memory Upload Paperclip */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isStreaming}
              className="p-2 rounded-xl text-white/50 hover:text-cyan-300 hover:bg-white/10 transition-all duration-300"
              title="Upload file into Aura's Memory Bank"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              disabled={isStreaming}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/50'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
              title={isListening ? 'Stop recording' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                inputValue.trim() && !isStreaming
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/50 scale-100'
                  : 'bg-white/5 text-white/20 cursor-not-allowed scale-95'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Small Helper hint */}
        <div className="flex items-center justify-between text-[11px] text-white/40 px-3 pt-1.5 font-mono">
          <span>Enter ↵ to send • Shift+Enter for newline</span>
          <span className="hidden sm:inline">Memory Bank Grounding & Continuous Learning Active</span>
        </div>
      </form>
    </div>
  );
};

export default UserInput;
