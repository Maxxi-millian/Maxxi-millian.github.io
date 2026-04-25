import { useTheme } from '../utils/hooks';
import { Icon } from './Icon';
import type { AllowedIcon } from '../types/portal';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  defaultTheme?: Theme;
}

export function ThemeToggle({ defaultTheme = 'system' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme(defaultTheme);

  const options: { value: Theme; label: string; icon: AllowedIcon }[] = [
    { value: 'light', label: 'Claro', icon: 'sun' },
    { value: 'dark', label: 'Oscuro', icon: 'moon' },
    { value: 'system', label: 'Sistema', icon: 'monitor' },
  ];

  return (
    <div className="theme-toggle-group" role="group" aria-label="Cambiar tema">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`theme-toggle-btn ${theme === opt.value ? 'theme-toggle-btn--active' : ''}`}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          aria-pressed={theme === opt.value}
        >
          <Icon name={opt.icon} size={14} />
        </button>
      ))}
    </div>
  );
}
