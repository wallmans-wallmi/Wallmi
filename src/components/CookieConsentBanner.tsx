import { useState, useEffect } from 'react';
import { Shield, X, Settings } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy?: () => void;
}

export function CookieConsentBanner({ onOpenPrivacyPolicy }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Animate out
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleOpenSettings = () => {
    onOpenPrivacyPolicy?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isAnimatingOut ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      dir="rtl"
    >
      {/* Backdrop blur for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      
      {/* Banner Content */}
      <div className="relative bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Icon & Text Section */}
            <div className="flex items-start gap-3 flex-1">
              {/* Security Shield Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-lg bg-[#3700D0]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#3700D0]" />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  האתר משתמש בעוגיות (Cookies) ובטכנולוגיות מעקב לצורך ניתוח שימוש, שיפור השירות והגנה על אבטחת המידע. השימוש נעשה בהתאם{' '}
                  <button
                    onClick={handleOpenSettings}
                    className="text-[#3700D0] hover:underline inline-flex items-center gap-1"
                  >
                    למדיניות הפרטיות
                  </button>
                  .
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {/* Secondary Action - Settings */}
              <button
                onClick={handleOpenSettings}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 text-sm whitespace-nowrap"
              >
                <Settings className="w-4 h-4" />
                הגדרות פרטיות ומידע נוסף
              </button>

              {/* Primary CTA - Accept */}
              <button
                onClick={handleAccept}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3700D0] text-white rounded-lg hover:bg-[#2D00A8] transition-all duration-200 shadow-sm hover:shadow-md text-sm whitespace-nowrap font-medium"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                אישור והמשך גלישה
              </button>
            </div>

            {/* Close Button (Mobile) */}
            <button
              onClick={handleAccept}
              className="absolute top-3 left-3 sm:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="סגור"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
