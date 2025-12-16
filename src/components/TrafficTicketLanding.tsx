import { Search, CheckSquare, FileText, Camera, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrafficTicketChat } from './TrafficTicketChat';

interface TrafficTicketLandingProps {
  onStartChat: (mode: 'upload' | 'manual') => void;
  currentStep?: number; // 0 = not started, 1-3 = current step
  uploadMode?: 'upload' | 'manual' | null; // Current upload mode for chat
}

export function TrafficTicketLanding({ onStartChat, currentStep = 0, uploadMode = null }: TrafficTicketLandingProps) {
  const getStepStyle = (step: number) => {
    if (currentStep === 0) {
      // Not started - all steps are inactive
      return {
        circle: { 
          borderColor: '#E5E7EB', 
          backgroundColor: 'white',
          color: '#9CA3AF'
        },
        text: { color: '#9CA3AF' },
        line: { backgroundColor: '#E5E7EB' }
      };
    } else if (step < currentStep) {
      // Completed step
      return {
        circle: { 
          borderColor: '#3700D0', 
          backgroundColor: '#3700D0',
          color: 'white'
        },
        text: { color: '#2A2A2A' },
        line: { backgroundColor: '#3700D0' }
      };
    } else if (step === currentStep) {
      // Current step
      return {
        circle: { 
          borderColor: '#3700D0', 
          backgroundColor: 'white',
          color: '#3700D0'
        },
        text: { color: '#2A2A2A' },
        line: { backgroundColor: '#E5E7EB' }
      };
    } else {
      // Future step
      return {
        circle: { 
          borderColor: '#E5E7EB', 
          backgroundColor: 'white',
          color: '#9CA3AF'
        },
        text: { color: '#9CA3AF' },
        line: { backgroundColor: '#E5E7EB' }
      };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-6">
        <h1 className="text-3xl md:text-5xl text-gray-900 mb-2 md:mb-4">
          בודקים סיכויי ערעור על הדוח
        </h1>
        
        <h2 className="text-base md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          נותנים לך הערכה מהירה על סיכויי הצלחה בערעור ומסבירים מה כדאי לעשות.
        </h2>
      </div>

      {/* Main Content - Chat Box Full Width on Mobile */}
      <div className="max-w-4xl mx-auto">
        {/* Security Notice */}
        <div className="mb-4 px-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-green-800">
                <strong className="text-green-900">אבטחה ופרטיות:</strong> המידע שלך מוגן ונשמר אצלנו בצורה מאובטחת. הוא לא מועבר לצדדים שלישיים.
              </p>
            </div>
          </div>
        </div>
        
        {/* Chat Starter Section */}
        <div className="bg-white rounded-2xl p-4 md:p-8 min-h-[500px]">
          {uploadMode === null ? (
            <>
              {/* Assistant Message Bubble */}
              <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#3700D00D' }}>
                <p className="leading-relaxed" style={{ color: '#2A2A2A' }}>
                  היי, בוא נבדוק ביחד מה סיכויי הצלחה שלך ונראה איך הכי כדאי להתקדם מפה.
                  <br />
                  איך נוח לך להתחיל?
                </p>
              </div>

              {/* Option Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={() => onStartChat('upload')}
                  className="w-full h-auto py-6 px-6 rounded-xl bg-white border-2 border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-all"
                  style={{ 
                    '--hover-border': '#3700D0',
                    '--hover-bg': '#3700D00D'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3700D0';
                    e.currentTarget.style.backgroundColor = '#3700D00D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  variant="outline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3700D01A' }}>
                      <Camera className="w-5 h-5" style={{ color: '#3700D0' }} />
                    </div>
                    <span className="text-lg">להעלות צילום של הדוח שקיבלת</span>
                  </div>
                </Button>

                <Button
                  onClick={() => onStartChat('manual')}
                  className="w-full h-auto py-6 px-6 rounded-xl bg-white border-2 border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-all"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3700D0';
                    e.currentTarget.style.backgroundColor = '#3700D00D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                  variant="outline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3700D01A' }}>
                      <Edit3 className="w-5 h-5" style={{ color: '#3700D0' }} />
                    </div>
                    <span className="text-lg">למלא את פרט הדוח ידנית</span>
                  </div>
                </Button>
              </div>
            </>
          ) : (
            <div className="h-full">
              <TrafficTicketChat 
                uploadMode={uploadMode} 
                onBackToHome={() => {}} 
                onLogoClick={() => {}}
                embedded={true}
                currentStep={currentStep}
              />
            </div>
          )}
        </div>
        
        {/* Legal Disclaimer */}
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-gray-900">הצהרה משפטית:</strong> אנחנו לא עורכי דין, ולכן לא נותנים ייעוץ משפטי. אבל כן יודעים לעזור, להסביר, ולכוון אותך למהלך הנכון ביותר עבורך.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}