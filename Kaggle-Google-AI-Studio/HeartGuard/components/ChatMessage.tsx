import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Role, GroundingChunk } from '../types';
import { User, Bot, AlertCircle, ExternalLink } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const isError = message.isError;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-blue-600 text-white' : isError ? 'bg-red-100 text-red-600' : 'bg-teal-600 text-white'
        }`}>
          {isUser ? <User size={20} /> : isError ? <AlertCircle size={20} /> : <Bot size={20} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : isError
                ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-none'
                : 'bg-white text-slate-800 border border-orange-100 rounded-tl-none shadow-sm'
          }`}>
            {isError ? (
              <p>{message.text}</p>
            ) : (
              <div className={`markdown-body ${isUser ? 'text-white' : 'text-slate-800'}`}>
                <ReactMarkdown
                  components={{
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-lg font-bold my-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-base font-bold my-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-sm font-bold my-2" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-teal-200 pl-4 italic my-2 text-slate-600" {...props} />,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Grounding Sources (Search Results) */}
          {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-2 text-xs text-slate-500 max-w-full">
              <p className="mb-1 font-semibold uppercase tracking-wider text-[10px] text-teal-600/70">References</p>
              <div className="flex flex-wrap gap-2">
                {message.groundingChunks.map((chunk, idx) => {
                  if (!chunk.web?.uri) return null;
                  return (
                    <a 
                      key={idx} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-orange-100 hover:bg-orange-200 text-teal-700 border border-orange-200 px-2 py-1 rounded-md transition-colors truncate max-w-[200px]"
                    >
                      <ExternalLink size={10} />
                      <span className="truncate">{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Timestamp */}
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;