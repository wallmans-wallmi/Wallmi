import { Mail, MessageCircle, Clock } from 'lucide-react';

export function ContactPage() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '972501234567';
    const message = encodeURIComponent('שלום, אני מעוניין/ת במידע נוסף');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@wallmans.co.il';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white" style={{ direction: 'rtl' }}>
      {/* Hero Section */}
      <div className="bg-gradient-to-l from-[#3700D0] to-[#5a2de8] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mb-4">צור קשר</h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              נשמח לעמוד לשירותכם ולענות על כל שאלה. צוות Wallmans כאן בשבילכם
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          
          {/* Contact Cards */}
          <div className="space-y-6">

            {/* WhatsApp Card */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-white rounded-2xl p-6 md:hover:bg-gray-50 transition-all group text-right active:bg-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center md:group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">וואטסאפ</h3>
                  <p className="text-sm text-gray-600 mb-2">זמינו עבורכם בצ'אט</p>
                  <p className="text-[#25D366]" dir="ltr">050-123-4567</p>
                </div>
              </div>
            </button>

            {/* Email Card */}
            <button
              onClick={handleEmailClick}
              className="w-full bg-white rounded-2xl p-6 md:hover:bg-gray-50 transition-all group text-right active:bg-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#3700D0] to-[#5a2de8] rounded-xl flex items-center justify-center md:group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">דואר אלקטרוני</h3>
                  <p className="text-sm text-gray-600 mb-2">שלחו לנו הודעה</p>
                  <p className="text-[#3700D0]" dir="ltr">info@wallmans.co.il</p>
                </div>
              </div>
            </button>

            {/* Hours Card */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#3700D0] to-[#5a2de8] rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">שעות פעילות</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ראשון - חמישי: 9:00 - 18:00</p>
                    <p>שישי: 9:00 - 13:00</p>
                    <p className="text-[#3700D0]">שבת: סגור</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}