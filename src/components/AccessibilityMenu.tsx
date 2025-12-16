import { useState, useEffect } from 'react';
import { 
  X, 
  Type, 
  Contrast, 
  Palette, 
  Eye, 
  Keyboard, 
  MousePointer, 
  Zap,
  RotateCcw,
  Plus,
  Minus,
  Link as LinkIcon,
  AlignLeft,
  Circle
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number; // percentage: 100, 110, 120, etc.
  highContrast: boolean;
  darkText: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
  increaseLineHeight: boolean;
  keyboardFocus: boolean;
  reduceMotion: boolean;
  largeCursor: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  darkText: false,
  grayscale: false,
  underlineLinks: false,
  readableFont: false,
  increaseLineHeight: false,
  keyboardFocus: false,
  reduceMotion: false,
  largeCursor: false,
};

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityMenu({ isOpen, onClose }: AccessibilityMenuProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Apply settings to document
  useEffect(() => {
    // Font size
    document.documentElement.style.fontSize = `${settings.fontSize}%`;

    // High contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Dark text on light background
    if (settings.darkText) {
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#000000';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }

    // Grayscale
    if (settings.grayscale) {
      document.body.style.filter = 'grayscale(100%)';
    } else if (!settings.highContrast) {
      document.body.style.filter = 'none';
    }

    // Underline links
    if (settings.underlineLinks) {
      document.body.classList.add('underline-links');
    } else {
      document.body.classList.remove('underline-links');
    }

    // Readable font
    if (settings.readableFont) {
      document.body.style.fontFamily = 'Arial, sans-serif';
    } else {
      document.body.style.fontFamily = '';
    }

    // Increase line height
    if (settings.increaseLineHeight) {
      document.body.style.lineHeight = '2';
    } else {
      document.body.style.lineHeight = '';
    }

    // Keyboard focus
    if (settings.keyboardFocus) {
      document.body.classList.add('keyboard-focus');
    } else {
      document.body.classList.remove('keyboard-focus');
    }

    // Reduce motion
    if (settings.reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }

    // Large cursor
    if (settings.largeCursor) {
      document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath fill=\'black\' stroke=\'white\' stroke-width=\'2\' d=\'M2,2 L2,28 L12,20 L17,30 L21,28 L16,18 L28,18 Z\'/%3E%3C/svg%3E") 16 16, auto';
    } else {
      document.body.style.cursor = '';
    }
  }, [settings]);

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof AccessibilitySettings]
    }));
  };

  const increaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 10, 150)
    }));
  };

  const decreaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 10, 80)
    }));
  };

  const resetFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: 100
    }));
  };

  const skipToMainContent = () => {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      (main as HTMLElement).focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div 
        className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-2xl z-50 overflow-y-auto"
        style={{ direction: 'rtl' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl text-gray-900">תפריט נגישות</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="סגור תפריט נגישות"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Description */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              תפריט הנגישות מאפשר להתאים את האתר לצרכים האישיים שלכם. השינויים משפיעים רק על אתר Wallmans.
            </p>
          </div>

          {/* Skip to Main Content */}
          <div className="border-b border-gray-200 pb-6">
            <button
              onClick={skipToMainContent}
              className="w-full py-3 px-4 bg-[#3700D0] text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <AlignLeft className="w-5 h-5" />
              <span>דלג לתוכן הראשי</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              מופיע ראשון בניווט מקלדת
            </p>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Type className="w-5 h-5 text-[#3700D0]" />
              <h3 className="text-base">שינוי גודל טקסט</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={decreaseFontSize}
                disabled={settings.fontSize <= 80}
                className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-[#3700D0] hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Minus className="w-4 h-4" />
                <span className="text-sm">הקטנה</span>
              </button>
              <div className="px-4 py-3 bg-gray-100 rounded-xl min-w-[80px] text-center">
                <span className="text-sm">{settings.fontSize}%</span>
              </div>
              <button
                onClick={increaseFontSize}
                disabled={settings.fontSize >= 150}
                className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-[#3700D0] hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">הגדלה</span>
              </button>
            </div>
            {settings.fontSize !== 100 && (
              <button
                onClick={resetFontSize}
                className="w-full py-2 text-sm text-[#3700D0] hover:underline"
              >
                איפוס גודל טקסט
              </button>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6" />

          {/* Contrast */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Contrast className="w-5 h-5 text-[#3700D0]" />
              <h3 className="text-base">ניגודיות</h3>
            </div>
            
            <ToggleOption
              label="ניגודיות גבוהה"
              description="הגברת הניגודיות בין טקסט לרקע"
              checked={settings.highContrast}
              onChange={() => toggleSetting('highContrast')}
            />
            
            <ToggleOption
              label="טקסט כהה על רקע בהיר"
              description="מעבר לרקע לבן וטקסט שחור"
              checked={settings.darkText}
              onChange={() => toggleSetting('darkText')}
            />
          </div>

          <div className="border-t border-gray-200 pt-6" />

          {/* Colors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Palette className="w-5 h-5 text-[#3700D0]" />
              <h3 className="text-base">צבעים</h3>
            </div>
            
            <ToggleOption
              label="מצב שחור לבן"
              description="הסרת כל הצבעים מהאתר"
              checked={settings.grayscale}
              onChange={() => toggleSetting('grayscale')}
            />
            
            <ToggleOption
              label="הדגשת קישורים"
              description="כל הקישורים יופיעו עם קו תחתון"
              checked={settings.underlineLinks}
              onChange={() => toggleSetting('underlineLinks')}
            />
          </div>

          <div className="border-t border-gray-200 pt-6" />

          {/* Readability */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Eye className="w-5 h-5 text-[#3700D0]" />
              <h3 className="text-base">קריאות טקסט</h3>
            </div>
            
            <ToggleOption
              label="פונט קריא"
              description="מעבר לפונט פשוט וברור יותר"
              checked={settings.readableFont}
              onChange={() => toggleSetting('readableFont')}
            />
            
            <ToggleOption
              label="הגדלת מרווח בין שורות"
              description="הגדלת המרחק בין שורות לקריאה נוחה"
              checked={settings.increaseLineHeight}
              onChange={() => toggleSetting('increaseLineHeight')}
            />
          </div>

          <div className="border-t border-gray-200 pt-6" />

          {/* Keyboard Navigation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Keyboard className="w-5 h-5 text-[#3700D0]" />
              <h3 className="text-base">ניווט מקלדת</h3>
            </div>
            
            <ToggleOption
              label="הדגשת פוקוס במקלדת"
              description="הצגת מסגרת ברורה סביב אלמנטים בפוקוס"
              checked={settings.keyboardFocus}
              onChange={() => toggleSetting('keyboardFocus')}
            />
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                💡 אפשר לעבור בין אזורים עם מקש Tab
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6" />

          {/* Motion and Animations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Zap className="w-5 h-5 text-[#3700D0]" />
              <h3 className="text-base">תנועה והבהובים</h3>
            </div>
            
            <ToggleOption
              label="ביטול אנימציות ותנועה"
              description="עצירת אנימציות אוטומטיות ומעברים"
              checked={settings.reduceMotion}
              onChange={() => toggleSetting('reduceMotion')}
            />
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                ⚠️ שינוי זה עשוי לפשט חלק מהאלמנטים הויזואליים
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6" />

          {/* Cursor */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <MousePointer className="w-5 h-5 text-[#3700D0]" />
              <h3 className="text-base">סמן עכבר</h3>
            </div>
            
            <ToggleOption
              label="הגדלת סמן"
              description="הצגת סמן עכבר גדול וברור יותר"
              checked={settings.largeCursor}
              onChange={() => toggleSetting('largeCursor')}
            />
          </div>

          <div className="border-t border-gray-200 pt-6" />

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-4 px-6 border-2 border-gray-300 rounded-xl hover:border-[#3700D0] hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-gray-900"
          >
            <RotateCcw className="w-5 h-5" />
            <span>איפוס כל ההגדרות</span>
          </button>

          {/* Bottom padding for mobile */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}

// Toggle Option Component
interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleOption({ label, description, checked, onChange }: ToggleOptionProps) {
  return (
    <button
      onClick={onChange}
      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#3700D0] hover:bg-purple-50 transition-all text-right"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm text-gray-900 mb-1">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-6 rounded-full transition-colors relative ${
              checked ? 'bg-[#3700D0]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                checked ? 'translate-x-[-26px]' : 'translate-x-[-1px]'
              }`}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
