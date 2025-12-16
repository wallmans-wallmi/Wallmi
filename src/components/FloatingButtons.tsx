import { Accessibility, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { AccessibilityMenu } from './AccessibilityMenu';

export function FloatingButtons() {
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number (in international format without + or -)
    const phoneNumber = '972500000000'; // Example: Israeli number
    const message = encodeURIComponent('שלום, אני מעוניין/ת במידע נוסף על השירותים המשפטיים');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-end justify-between">
          
          {/* Accessibility Button - Right Side */}
          <div className="pointer-events-auto">
            <button
              onClick={() => setShowAccessibilityMenu(true)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              style={{ backgroundColor: '#3700D0' }}
              aria-label="נגישות"
            >
              <Accessibility className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* WhatsApp Button - Left Side */}
          <div className="pointer-events-auto">
            <button
              onClick={handleWhatsAppClick}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
              aria-label="צור קשר בוואטסאפ"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" />
            </button>
          </div>
          
        </div>
      </div>

      {/* Accessibility Menu */}
      <AccessibilityMenu 
        isOpen={showAccessibilityMenu} 
        onClose={() => setShowAccessibilityMenu(false)} 
      />
    </>
  );
}