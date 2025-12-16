import { Scale, Menu, X, LayoutGrid, Mail, ChevronDown, Car, Briefcase, Users, Home } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import svgPaths from '../imports/svg-chxbwqwosn';

// About Icon Component
function AboutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 59 63" preserveAspectRatio="xMidYMid meet">
      <path d={svgPaths.p294ae000} />
    </svg>
  );
}

interface HeaderProps {
  onLogoClick?: () => void;
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onCategoriesClick?: () => void;
  onSelectCategory?: (categoryId: string) => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function Header({ onLogoClick, onAboutClick, onContactClick, onCategoriesClick, onSelectCategory, showBackButton, onBackClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false);

  const categories = [
    { id: 'traffic', name: 'ערעורי תעבורה', icon: Car, color: '#3700D0' },
    { id: 'torts', name: 'תביעות נזיקין', icon: Scale, color: '#0066CC' },
    { id: 'small-claims', name: 'תביעות קטנות', icon: Briefcase, color: '#00A86B' },
    { id: 'labor', name: 'דיני עבודה', icon: Users, color: '#FF6B35' },
    { id: 'housing', name: 'דיור ושכירות', icon: Home, color: '#9D4EDD' },
  ];

  const handleMenuItemClick = (callback?: () => void) => {
    setIsMobileMenuOpen(false);
    setIsCategoriesDropdownOpen(false);
    setIsDesktopCategoriesOpen(false);
    callback?.();
  };

  const handleCategorySelect = (categoryId: string) => {
    setIsCategoriesDropdownOpen(false);
    setIsDesktopCategoriesOpen(false);
    handleMenuItemClick(() => onSelectCategory?.(categoryId));
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navigation - Right Side */}
            <div className="flex items-center gap-8">
              {/* Mobile Menu Button - Right Side */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg active:bg-gray-100 transition-colors"
                aria-label={isMobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>

              {/* Desktop Menu */}
              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={onLogoClick}
                  className="text-gray-700 hover:text-[#3700D0] transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  בית
                </button>
                
                {/* Desktop Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDesktopCategoriesOpen(!isDesktopCategoriesOpen)}
                    className="text-gray-700 hover:text-[#3700D0] transition-colors flex items-center gap-2"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    קטגוריות
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDesktopCategoriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isDesktopCategoriesOpen && (
                    <>
                      {/* Backdrop for desktop */}
                      <div 
                        className="fixed inset-0 z-30"
                        onClick={() => setIsDesktopCategoriesOpen(false)}
                      />
                      
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-40 animate-in slide-in-from-top-2">
                        <div className="p-3 space-y-1">
                          <div className="px-3 py-2">
                            <p className="text-sm text-gray-500">
                              בחר את תחום המשפט שמתאים למקרה שלך
                            </p>
                          </div>
                          
                          {categories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                              <button
                                key={category.id}
                                onClick={() => handleCategorySelect(category.id)}
                                className="w-full text-right px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                              >
                                <div 
                                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: `${category.color}15` }}
                                >
                                  <IconComponent 
                                    className="w-5 h-5" 
                                    style={{ 
                                      color: category.color,
                                      transform: category.icon === Car ? 'scaleX(-1)' : undefined
                                    }} 
                                  />
                                </div>
                                <span className="text-gray-700">
                                  {category.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  onClick={onAboutClick}
                  className="text-gray-700 hover:text-[#3700D0] transition-colors flex items-center gap-2"
                >
                  <AboutIcon className="w-4 h-4" />
                  קצת עלינו
                </button>
                <button
                  onClick={onContactClick}
                  className="text-gray-700 hover:text-[#3700D0] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  צור קשר
                </button>
              </nav>
            </div>

            {/* Logo - Left Side */}
            <button
              onClick={onLogoClick}
              className="flex items-center gap-2 md:hover:opacity-80 transition-opacity active:opacity-70"
            >
              <Logo />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide from Right under Header */}
      <div 
        className={`fixed left-0 right-0 bottom-0 bg-white z-50 transition-transform duration-300 ease-in-out md:hidden shadow-lg ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ direction: 'rtl', top: '64px' }}
      >
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <nav className="flex flex-col px-4 py-6 space-y-2">
            <button
              onClick={() => handleMenuItemClick(onLogoClick)}
              className="text-right px-4 py-4 text-lg text-gray-900 active:bg-gray-100 rounded-xl transition-colors flex items-center gap-3"
            >
              <Home className="w-5 h-5" />
              בית
            </button>
            
            {/* Categories Dropdown */}
            <div>
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className="w-full text-right px-4 py-4 text-lg text-gray-900 active:bg-gray-100 rounded-xl transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5" />
                  קטגוריות
                </div>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isCategoriesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Categories Dropdown List */}
              {isCategoriesDropdownOpen && (
                <div className="mt-2 space-y-1 animate-in slide-in-from-top-2">
                  {/* Categories Subtitle - Only shown when dropdown is open */}
                  <div className="px-4 pb-2 pt-1">
                    <p className="text-sm text-gray-500">
                      בחר את תחום המשפט שמתאים למקרה שלך
                    </p>
                  </div>
                  
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="w-full text-right px-6 py-3 text-base active:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                      >
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                          style={{ backgroundColor: `${category.color}15` }}
                        >
                          <IconComponent 
                            className="w-5 h-5" 
                            style={{ 
                              color: category.color,
                              transform: category.icon === Car ? 'scaleX(-1)' : undefined
                            }} 
                          />
                        </div>
                        <span className="text-gray-700">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <button
              onClick={() => handleMenuItemClick(onAboutClick)}
              className="text-right px-4 py-4 text-lg text-gray-900 active:bg-gray-100 rounded-xl transition-colors flex items-center gap-3"
            >
              <AboutIcon className="w-5 h-5" />
              קצת עלינו
            </button>
            <button
              onClick={() => handleMenuItemClick(onContactClick)}
              className="text-right px-4 py-4 text-lg text-gray-900 active:bg-gray-100 rounded-xl transition-colors flex items-center gap-3"
            >
              <Mail className="w-5 h-5" />
              צור קשר
            </button>

            {showBackButton && (
              <div className="pt-2">
                <button
                  onClick={() => handleMenuItemClick(onBackClick)}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 text-gray-900 rounded-xl transition-all active:border-[#3700D0] active:text-[#3700D0]"
                >
                  חזרה למסך הראשי
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          style={{ top: '64px' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}