import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <div className="relative">
      <div className="relative flex items-end gap-2 bg-white p-2 rounded-xl border border-orange-200 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all shadow-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[50px] max-h-[160px] py-3 px-2 text-slate-800 placeholder:text-slate-400 text-base"
          rows={1}
          disabled={isLoading || disabled}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={!input.trim() || isLoading || disabled}
          className={`p-3 rounded-lg flex-shrink-0 transition-all mb-1 ${
            input.trim() && !isLoading && !disabled
              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
              : 'bg-orange-100 text-orange-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;