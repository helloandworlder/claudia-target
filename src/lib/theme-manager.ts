/**
 * 主题管理器 - 支持多种主题切换
 */

export type ThemeName = 'dark' | 'light' | 'custom';

export interface ThemeColor {
  name: string;
  primary: string;
  hue: number; // 色相值，用于生成配色
}

export interface BackgroundTheme {
  name: string;
  key: 'dark' | 'light';
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  secondary: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  border: string;
  input: string;
}

export const PRESET_COLORS: ThemeColor[] = [
  { name: 'Blue', primary: 'oklch(0.5 0.15 250)', hue: 250 },
  { name: 'Green', primary: 'oklch(0.5 0.15 130)', hue: 130 },
  { name: 'Purple', primary: 'oklch(0.5 0.15 290)', hue: 290 },
  { name: 'Red', primary: 'oklch(0.5 0.15 20)', hue: 20 },
  { name: 'Orange', primary: 'oklch(0.6 0.15 50)', hue: 50 },
  { name: 'Pink', primary: 'oklch(0.6 0.15 330)', hue: 330 },
  { name: 'Cyan', primary: 'oklch(0.5 0.15 190)', hue: 190 },
  { name: 'Yellow', primary: 'oklch(0.7 0.15 80)', hue: 80 },
  { name: 'Indigo', primary: 'oklch(0.5 0.15 270)', hue: 270 },
  { name: 'Teal', primary: 'oklch(0.5 0.15 170)', hue: 170 },
  { name: 'Emerald', primary: 'oklch(0.5 0.15 160)', hue: 160 },
  { name: 'Rose', primary: 'oklch(0.6 0.15 350)', hue: 350 },
  { name: 'Amber', primary: 'oklch(0.7 0.15 70)', hue: 70 },
  { name: 'Lime', primary: 'oklch(0.6 0.15 110)', hue: 110 },
  { name: 'Violet', primary: 'oklch(0.5 0.15 280)', hue: 280 },
  { name: 'Sky', primary: 'oklch(0.5 0.15 210)', hue: 210 },
  { name: 'Slate', primary: 'oklch(0.5 0.05 240)', hue: 240 },
  { name: 'Gray', primary: 'oklch(0.5 0.0 0)', hue: 0 },
  { name: 'Zinc', primary: 'oklch(0.5 0.01 240)', hue: 240 },
  { name: 'Stone', primary: 'oklch(0.5 0.02 60)', hue: 60 },
];

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    name: 'Dark',
    key: 'dark',
    background: 'oklch(0.12 0.01 240)',
    foreground: 'oklch(0.98 0.01 240)',
    card: 'oklch(0.14 0.01 240)',
    cardForeground: 'oklch(0.98 0.01 240)',
    secondary: 'oklch(0.16 0.01 240)',
    muted: 'oklch(0.16 0.01 240)',
    mutedForeground: 'oklch(0.68 0.01 240)',
    accent: 'oklch(0.16 0.01 240)',
    border: 'oklch(0.16 0.01 240)',
    input: 'oklch(0.16 0.01 240)',
  },
  {
    name: 'Light',
    key: 'light',
    background: 'oklch(0.98 0.01 240)',
    foreground: 'oklch(0.12 0.01 240)',
    card: 'oklch(1.0 0.0 0)',
    cardForeground: 'oklch(0.12 0.01 240)',
    secondary: 'oklch(0.95 0.01 240)',
    muted: 'oklch(0.95 0.01 240)',
    mutedForeground: 'oklch(0.45 0.01 240)',
    accent: 'oklch(0.95 0.01 240)',
    border: 'oklch(0.88 0.01 240)',
    input: 'oklch(0.95 0.01 240)',
  },
];

export interface Theme {
  id: ThemeName;
  name: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    popover: string;
    'popover-foreground': string;
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    muted: string;
    'muted-foreground': string;
    accent: string;
    'accent-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    border: string;
    input: string;
    ring: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  dark: {
    id: 'dark',
    name: 'Dark Theme',
    description: 'Classic dark theme (current default)',
    colors: {
      background: 'oklch(0.12 0.01 240)',
      foreground: 'oklch(0.98 0.01 240)',
      card: 'oklch(0.14 0.01 240)',
      'card-foreground': 'oklch(0.98 0.01 240)',
      popover: 'oklch(0.12 0.01 240)',
      'popover-foreground': 'oklch(0.98 0.01 240)',
      primary: 'oklch(0.98 0.01 240)',
      'primary-foreground': 'oklch(0.17 0.01 240)',
      secondary: 'oklch(0.16 0.01 240)',
      'secondary-foreground': 'oklch(0.98 0.01 240)',
      muted: 'oklch(0.16 0.01 240)',
      'muted-foreground': 'oklch(0.68 0.01 240)',
      accent: 'oklch(0.16 0.01 240)',
      'accent-foreground': 'oklch(0.98 0.01 240)',
      destructive: 'oklch(0.6 0.2 25)',
      'destructive-foreground': 'oklch(0.98 0.01 240)',
      border: 'oklch(0.16 0.01 240)',
      input: 'oklch(0.16 0.01 240)',
      ring: 'oklch(0.52 0.015 240)',
    }
  },
  light: {
    id: 'light',
    name: 'Light Theme',
    description: 'Clean and bright light theme',
    colors: {
      background: 'oklch(0.98 0.01 240)',
      foreground: 'oklch(0.12 0.01 240)',
      card: 'oklch(1.0 0.0 0)',
      'card-foreground': 'oklch(0.12 0.01 240)',
      popover: 'oklch(1.0 0.0 0)',
      'popover-foreground': 'oklch(0.12 0.01 240)',
      primary: 'oklch(0.12 0.01 240)',
      'primary-foreground': 'oklch(0.98 0.01 240)',
      secondary: 'oklch(0.95 0.01 240)',
      'secondary-foreground': 'oklch(0.12 0.01 240)',
      muted: 'oklch(0.95 0.01 240)',
      'muted-foreground': 'oklch(0.45 0.01 240)',
      accent: 'oklch(0.95 0.01 240)',
      'accent-foreground': 'oklch(0.12 0.01 240)',
      destructive: 'oklch(0.6 0.2 25)',
      'destructive-foreground': 'oklch(0.98 0.01 240)',
      border: 'oklch(0.88 0.01 240)',
      input: 'oklch(0.95 0.01 240)',
      ring: 'oklch(0.52 0.015 240)',
    }
  },
  custom: {
    id: 'custom',
    name: 'Custom Theme',
    description: 'User-defined personalized theme',
    colors: {
      background: 'oklch(0.12 0.01 240)',
      foreground: 'oklch(0.98 0.01 240)',
      card: 'oklch(0.14 0.01 240)',
      'card-foreground': 'oklch(0.98 0.01 240)',
      popover: 'oklch(0.12 0.01 240)',
      'popover-foreground': 'oklch(0.98 0.01 240)',
      primary: 'oklch(0.98 0.01 240)',
      'primary-foreground': 'oklch(0.17 0.01 240)',
      secondary: 'oklch(0.16 0.01 240)',
      'secondary-foreground': 'oklch(0.98 0.01 240)',
      muted: 'oklch(0.16 0.01 240)',
      'muted-foreground': 'oklch(0.68 0.01 240)',
      accent: 'oklch(0.16 0.01 240)',
      'accent-foreground': 'oklch(0.98 0.01 240)',
      destructive: 'oklch(0.6 0.2 25)',
      'destructive-foreground': 'oklch(0.98 0.01 240)',
      border: 'oklch(0.16 0.01 240)',
      input: 'oklch(0.16 0.01 240)',
      ring: 'oklch(0.52 0.015 240)',
    }
  }
};

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeName = 'light'; // 默认白色主题
  private customColors: Partial<Theme['colors']> = {};
  private customThemeColor: ThemeColor = PRESET_COLORS[0];
  private customBackgroundTheme: BackgroundTheme = BACKGROUND_THEMES[0];

  private constructor() {
    this.loadThemeFromStorage();
    this.applyTheme(this.currentTheme);
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  getCurrentTheme(): ThemeName {
    return this.currentTheme;
  }

  setTheme(themeName: ThemeName): void {
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    this.saveThemeToStorage();
  }

  getCustomColors(): Partial<Theme['colors']> {
    return { ...this.customColors };
  }

  setCustomColors(colors: Partial<Theme['colors']>): void {
    this.customColors = { ...colors };
    themes.custom.colors = { ...themes.custom.colors, ...colors };
    if (this.currentTheme === 'custom') {
      this.applyTheme('custom');
    }
    this.saveThemeToStorage();
  }

  setCustomTheme(themeColor: ThemeColor, backgroundTheme: BackgroundTheme): void {
    this.customThemeColor = themeColor;
    this.customBackgroundTheme = backgroundTheme;
    
    const customColors: Partial<Theme['colors']> = {
      primary: themeColor.primary,
      background: backgroundTheme.background,
      foreground: backgroundTheme.foreground,
      card: backgroundTheme.card,
      'card-foreground': backgroundTheme.cardForeground,
      popover: backgroundTheme.card,
      'popover-foreground': backgroundTheme.cardForeground,
      'primary-foreground': backgroundTheme.key === 'dark' ? backgroundTheme.background : backgroundTheme.foreground,
      secondary: backgroundTheme.secondary,
      'secondary-foreground': backgroundTheme.foreground,
      muted: backgroundTheme.muted,
      'muted-foreground': backgroundTheme.mutedForeground,
      accent: backgroundTheme.accent,
      'accent-foreground': backgroundTheme.foreground,
      border: backgroundTheme.border,
      input: backgroundTheme.input,
      ring: themeColor.primary,
      destructive: 'oklch(0.6 0.2 25)',
      'destructive-foreground': backgroundTheme.foreground,
    };
    this.setCustomColors(customColors);
  }

  getPresetColors(): ThemeColor[] {
    return PRESET_COLORS;
  }

  getBackgroundThemes(): BackgroundTheme[] {
    return BACKGROUND_THEMES;
  }

  getCurrentCustomThemeColor(): ThemeColor {
    return this.customThemeColor;
  }

  getCurrentCustomBackgroundTheme(): BackgroundTheme {
    return this.customBackgroundTheme;
  }



  private applyTheme(themeName: ThemeName): void {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;

    // 应用主题颜色
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // 触发主题变更事件
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: themeName } 
    }));
  }

  private saveThemeToStorage(): void {
    try {
      localStorage.setItem('claudia-theme', this.currentTheme);
      if (this.currentTheme === 'custom') {
        localStorage.setItem('claudia-custom-colors', JSON.stringify(this.customColors));
        localStorage.setItem('claudia-custom-theme-color', JSON.stringify(this.customThemeColor));
        localStorage.setItem('claudia-custom-background-theme', JSON.stringify(this.customBackgroundTheme));
      }
    } catch (error) {
      console.warn('Failed to save theme settings to localStorage:', error);
    }
  }

  private loadThemeFromStorage(): void {
    try {
      const savedTheme = localStorage.getItem('claudia-theme') as ThemeName;
      if (savedTheme && themes[savedTheme]) {
        this.currentTheme = savedTheme;
      }

      if (savedTheme === 'custom') {
        const savedCustomColors = localStorage.getItem('claudia-custom-colors');
        const savedThemeColor = localStorage.getItem('claudia-custom-theme-color');
        const savedBackgroundTheme = localStorage.getItem('claudia-custom-background-theme');
        
        if (savedCustomColors) {
          this.customColors = JSON.parse(savedCustomColors);
          themes.custom.colors = { ...themes.custom.colors, ...this.customColors };
        }
        
        if (savedThemeColor) {
          this.customThemeColor = JSON.parse(savedThemeColor);
        }
        
        if (savedBackgroundTheme) {
          this.customBackgroundTheme = JSON.parse(savedBackgroundTheme);
        }
      }
    } catch (error) {
      console.warn('Failed to load theme settings from localStorage:', error);
    }
  }

  getAllThemes(): Theme[] {
    return Object.values(themes);
  }
}

// 导出单例实例
export const themeManager = ThemeManager.getInstance(); 