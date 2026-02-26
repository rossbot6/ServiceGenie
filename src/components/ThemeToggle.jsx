import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="
        relative p-2 rounded-xl transition-all duration-200
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
        border border-gray-200 dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        group
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">
        {isDark ? 'Currently dark mode - click to switch to light mode' : 'Currently light mode - click to switch to dark mode'}
      </span>
      <div className="relative w-5 h-5">
        <Sun 
          className={`
            absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300
            ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
        />
        <Moon 
          className={`
            absolute inset-0 w-5 h-5 text-slate-600 dark:text-slate-300 transition-all duration-300
            ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `}
        />
      </div>
      
      {/* Glow effect */}
      <div className={`
        absolute -inset-1 rounded-xl blur transition-all duration-300
        ${isDark 
          ? 'bg-indigo-500/20 dark:bg-indigo-400/30' 
          : 'bg-amber-400/20 group-hover:bg-amber-400/30'
        }
      `} />
    </button>
  );
}