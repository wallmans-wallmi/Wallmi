import { useState } from 'react';
import { X, MapPin, Scale, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';

interface LawyerRecommendationProps {
  onClose: () => void;
  caseType: string;
  onNavigateHome: () => void;
}

export function LawyerRecommendation({ onClose, caseType, onNavigateHome }: LawyerRecommendationProps) {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  // Mock lawyer data - in real app this would come from API
  const lawyer = {
    name: 'עו״ד דניאל כהן',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop',
    specialty: 'ערעורי תנועה ודיני עבודה',
    location: 'תל אביב - קרוב אליך',
    experience: '15 שנות ניסיון',
  };

  const handleSubmit = async () => {
    if (!isTermsAccepted) {
      setShowValidationError(true);
      // Scroll to checkbox to draw attention
      setTimeout(() => {
        setShowValidationError(false);
      }, 4000);
      return;
    }
    
    setShowValidationError(false);
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessPopup(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" style={{ direction: 'rtl' }}>
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl">עורך דין מומלץ עבורך</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Lawyer Card */}
          <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-2xl p-6 space-y-4">
            {/* Lawyer Photo and Info */}
            <div className="flex gap-4 items-start">
              <img
                src={lawyer.image}
                alt={lawyer.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-xl text-[#2A2A2A]">{lawyer.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Scale className="w-4 h-4 text-[#3700D0]" />
                  <span>{lawyer.specialty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#3700D0]" />
                  <span>{lawyer.location}</span>
                </div>
              </div>
            </div>

            {/* Experience Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-200">
              <div className="w-2 h-2 rounded-full bg-[#3700D0]"></div>
              <span className="text-sm text-[#2A2A2A]">{lawyer.experience}</span>
            </div>
          </div>

          {/* Transparency Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-[#2A2A2A]">
                  <strong>הצהרת שקיפות:</strong>
                </p>
                <p className="text-sm text-gray-700">
                  {lawyer.name} משלם דמי פרסום חודשיים קבועים לפלטפורמה זו.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div 
            className={`bg-gray-50 border-2 rounded-xl p-5 space-y-4 transition-all ${
              showValidationError ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="flex gap-3 items-start">
              <Checkbox
                id="terms"
                checked={isTermsAccepted}
                onCheckedChange={(checked) => {
                  setIsTermsAccepted(checked === true);
                  if (checked) setShowValidationError(false);
                }}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-[#2A2A2A] leading-relaxed cursor-pointer select-none"
              >
                אני מאשר/ת את{' '}
                <a href="#" className="text-[#3700D0] underline hover:text-[#2A00A0]">
                  תנאי השימוש
                </a>{' '}
                ומסכים/ה להעברת פרטיי ואת תיאור המקרה ל{lawyer.name} לצורך יצירת קשר ראשוני.
              </label>
            </div>

            {/* Validation Error */}
            {showValidationError && (
              <div className="flex items-start gap-2 bg-red-100 border border-red-300 rounded-lg p-3 animate-in">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  יש לאשר את תנאי השימוש על מנת להמשיך
                </p>
              </div>
            )}

            {/* Legal Disclaimer */}
            <div className="pt-3 border-t border-gray-300">
              <p className="text-xs text-gray-600 leading-relaxed">
                ⚠️ <strong>חשוב:</strong> העברת המידע אינה מהווה התקשרות משפטית או התחייבות לשירות. עורך הדין יצור עמך קשר לשם בדיקה ראשונית בלבד.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-6 rounded-2xl text-lg transition-all"
            style={{
              backgroundColor: '#3700D0',
              color: 'white',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>שולח...</span>
              </div>
            ) : (
              `${lawyer.name} יצור איתי קשר`
            )}
          </Button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" style={{ direction: 'rtl' }}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in">
            {/* Success Icon Header */}
            <div className="px-6 pt-8 pb-4 flex flex-col items-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl text-[#2A2A2A] mb-2">הפרטים נשלחו בהצלחה!</h2>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-6">
              {/* Info Cards */}
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#2A2A2A]">
                      <strong>הפרטים שלך הועברו ל{lawyer.name}</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      עורך הדין קיבל את פרטי המקרה שלך ויצור איתך קשר בהקדם
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#2A2A2A]">
                      <strong>קיבלת אישור במייל</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      נשלח אליך מייל עם סיכום הפרטים ופרטי ההתקשרות
                    </p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-sm text-[#2A2A2A]">
                  בהצלחה עם המקרה שלך!
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  אנחנו כאן בשבילך בכל שאלה
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    onNavigateHome();
                  }}
                  className="w-full py-4 rounded-xl text-base transition-all"
                  style={{
                    backgroundColor: '#3700D0',
                    color: 'white'
                  }}
                >
                  סיימתי
                </Button>
                
                <Button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    onClose();
                    onNavigateHome();
                  }}
                  className="w-full py-4 rounded-xl text-base transition-all border-2"
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#3700D0',
                    color: '#3700D0'
                  }}
                >
                  בחינת מקרה נוסף
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}