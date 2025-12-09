import React from 'react';
import { AppMode } from '../types';
import { BookOpen, GraduationCap, Users, Map, ClipboardList } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isMobile?: boolean; // Kept for compatibility but not strictly used in new layout
}

const MODES = [
  {
    id: AppMode.QA,
    label: 'Mentor',
    description: 'Q&A',
    icon: BookOpen,
  },
  {
    id: AppMode.LEARNING,
    label: 'Learning Path',
    description: 'Curriculum',
    icon: Map,
  },
  {
    id: AppMode.QUIZ,
    label: 'Training Quiz',
    description: 'Test',
    icon: GraduationCap,
  },
  {
    id: AppMode.SIMULATION,
    label: 'Patient Sim',
    description: 'Roleplay',
    icon: Users,
  },
  {
    id: AppMode.CASE_MANAGEMENT,
    label: 'Patient Records',
    description: 'MCP Tools',
    icon: ClipboardList,
  }
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-orange-100 rounded-lg w-full sm:w-auto">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            currentMode === mode.id
              ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5'
              : 'text-slate-600 hover:bg-orange-200 hover:text-slate-900'
          }`}
        >
          <mode.icon size={16} />
          <span className="whitespace-nowrap">{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;