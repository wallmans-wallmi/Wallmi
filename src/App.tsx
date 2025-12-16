import { useState, useRef } from 'react';
import { TrafficTicketLanding } from './components/TrafficTicketLanding';
import { CategoriesPage } from './components/CategoriesPage';
import { ChatCategoryPage } from './components/ChatCategoryPage';
import { TortsLanding } from './components/TortsLanding';
import { SmallClaimsLanding } from './components/SmallClaimsLanding';
import { LaborLanding } from './components/LaborLanding';
import { HousingLanding } from './components/HousingLanding';
import { ContactPage } from './components/ContactPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { AccessibilityStatementPage } from './components/AccessibilityStatementPage';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { Header } from './components/Header';
import { Logo } from './components/Logo';
import { FloatingButtons } from './components/FloatingButtons';
import { Scale, Car, Briefcase, Users, Home, Mail, Phone, MapPin, ShoppingCart, Lightbulb, Clock, Coins, Calendar, FileCheck } from 'lucide-react';

type Page = 'home' | 'categories' | 'about' | 'contact' | 'terms' | 'privacy' | 'accessibility' | 'traffic' | 'torts' | 'small-claims' | 'labor' | 'housing';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('categories');
  const [uploadMode, setUploadMode] = useState<'upload' | 'manual' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const handleStartChat = (mode: 'upload' | 'manual') => {
    setUploadMode(mode);
    setCurrentStep(1);
  };

  const handleBackToHome = () => {
    setCurrentPage('categories');
    setUploadMode(null);
    setCurrentStep(0);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setCurrentPage('categories');
    setUploadMode(null);
    setCurrentStep(0);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAboutClick = () => {
    setCurrentPage('about');
    setUploadMode(null);
    setCurrentStep(0);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactClick = () => {
    setCurrentPage('contact');
    setUploadMode(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    setCurrentPage('categories');
    setUploadMode(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId: string) => {
    const categoryMap: Record<string, Page> = {
      'traffic': 'traffic',
      'torts': 'torts',
      'small-claims': 'small-claims',
      'labor': 'labor',
      'housing': 'housing',
    };
    setCurrentPage(categoryMap[categoryId] || 'home');
    setUploadMode(null);
    setCurrentStep(0);
    
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleTermsClick = () => {
    setCurrentPage('terms');
    setUploadMode(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrivacyClick = () => {
    setCurrentPage('privacy');
    setUploadMode(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAccessibilityClick = () => {
    setCurrentPage('accessibility');
    setUploadMode(null);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCategoryInfo = (page: Page) => {
    const categoryInfo = {
      'traffic': { title: 'תעבורה', color: '#3700D0' },
      'torts': { title: 'נזיקין', color: '#0066CC' },
      'small-claims': { title: 'תביעות קטנות', color: '#00A86B' },
      'labor': { title: 'דיני עבודה', color: '#FF6B35' },
      'housing': { title: 'דיור ושכירות', color: '#9D4EDD' },
    };
    return categoryInfo[page as keyof typeof categoryInfo] || { title: '', color: '#3700D0' };
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'categories':
        return <CategoriesPage onSelectCategory={handleSelectCategory} />;
      
      case 'about':
        return (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl text-gray-900 mb-6">קצת עלינו – ברוכים הבאים ל-Wallmans</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  אנחנו יודעים שבירוקרטיה משפטית היא כאב ראש אחד גדול. לכן הקמנו את Wallmans: פלטפורמה דיגיטלית שפותחת את העולם המשפטי בשפה פשוטה, ברורה ובגובה העיניים. המטרה שלנו היא שתבינו במהירות את המצב, לפני שאתם מתחייבים לעורך דין.
                </p>
              </div>

              <div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  המערכת שלנו היא בעצם כלי השוואה חכם. היא מנתח את הפרטים שאתם מזינים ומשווה אותם לנתונים משפטיים וסטטיסטיקות ממקרים דומים – כדי לתת לכם תמונה כללית על המצב והאפשרויות שעומדות בפניכם.
                </p>
              </div>

              <div>
                <h2 className="text-2xl text-gray-900 mb-4">מה Wallmans עושה בדיוק?</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  אנחנו נותנים לכם מידע וכלים ראשוניים שיחסכו לכם זמן וכסף:
                </p>
                <ul className="space-y-3 text-gray-700 text-lg">
                  <li className="leading-relaxed">
                    <strong className="text-gray-900">מפת דרכים ראשונית:</strong> הצגת מידע כללי על מסלולי פעולה אפשריים (למשל: לבדוק אפשות לערעור, פנייה לרשות מסוימת).
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-gray-900">הערכת מצב כללית:</strong> הצגת נתונים סטטיסטיים כלליים לגבי אח��זי הצלחה וממוצעי פיצוי במקרים דומים לשלכם, לצורך קבלת תמונת מצב.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-gray-900">כלים לעבודה עצמית:</strong> יצירת טיוטות ותבניות מסמכים סטנדרטיות שתוכלו למלא בעצמכם (באחריות ובשיקול דעתכם).
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-gray-900">קישור לאנשי מקצוע:</strong> הצגת אפשרות לאיתור עורכי דין רלוונטיים, מנוסים וקרובים אליכם – כאשר כל פנייה והתקשרות נעשות ישירות ביניכם לבינם.
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                <h2 className="text-2xl text-gray-900 mb-4">סייג משפטי ושקיפות מלאה (חשוב לקרוא)</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  כדי להיות שקופים לחלוטין, חשוב שתדעו מה אנחנו לא עושים:
                </p>
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    <strong className="text-gray-900">נחנו לא עורכי דין.</strong> אף עובד או אלגוריתם ב-Wallmans אינו מוסמך לתת לכם ייעוץ משפטי אישי.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    <strong className="text-gray-900">השימוש בפלטפורמה לא מהווה ולא מחליף ייעוץ משפטי אישי.</strong> המידע שהמערכת מציגה הוא כללי וסטטיסטי בלבד.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    <strong className="text-gray-900">אנחנו שקופים לגבי המודל העסקי:</strong> עורכי הדין מופיעים אצלנו משלמים דמי פרסום קבועים עבור חשיפה בפלטפורמה.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    <strong className="text-gray-900">למען הסר ספק:</strong> אין בשימוש בתר כדי ליצור יחסי עורך דין–לקוח. עבור כל החלטה משפטית מהותית, ההמלצה שלנו היא לפנות לעורך דין מוסמך.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'contact':
        return <ContactPage />;
      
      case 'terms':
        return <TermsOfServicePage onBackClick={handleBackToHome} />;
      
      case 'privacy':
        return <PrivacyPolicyPage onBackClick={handleBackToHome} />;
      
      case 'accessibility':
        return <AccessibilityStatementPage onBackClick={handleBackToHome} />;
      
      case 'traffic':
        return (
          <ChatCategoryPage
            categoryId="traffic"
            categoryTitle={getCategoryInfo('traffic').title}
            categoryColor={getCategoryInfo('traffic').color}
            onNavigateHome={handleBackToHome}
          />
        );
      
      case 'torts':
        return (
          <ChatCategoryPage
            categoryId="torts"
            categoryTitle={getCategoryInfo('torts').title}
            categoryColor={getCategoryInfo('torts').color}
            onNavigateHome={handleBackToHome}
          />
        );
      
      case 'small-claims':
        return (
          <ChatCategoryPage
            categoryId="small-claims"
            categoryTitle={getCategoryInfo('small-claims').title}
            categoryColor={getCategoryInfo('small-claims').color}
            onNavigateHome={handleBackToHome}
          />
        );
      
      case 'labor':
        return (
          <ChatCategoryPage
            categoryId="labor"
            categoryTitle={getCategoryInfo('labor').title}
            categoryColor={getCategoryInfo('labor').color}
            onNavigateHome={handleBackToHome}
          />
        );
      
      case 'housing':
        return (
          <ChatCategoryPage
            categoryId="housing"
            categoryTitle={getCategoryInfo('housing').title}
            categoryColor={getCategoryInfo('housing').color}
            onNavigateHome={handleBackToHome}
          />
        );
      
      default: // 'home'
        return (
          <TrafficTicketLanding 
            onStartChat={handleStartChat} 
            currentStep={currentStep}
            uploadMode={uploadMode}
          />
        );
    }
  };

  return (
    <div ref={topRef} className="min-h-screen bg-gray-50" dir="rtl">
      <Header 
        onLogoClick={handleLogoClick}
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
        onCategoriesClick={handleCategoriesClick}
        onSelectCategory={handleSelectCategory}
        showBackButton={uploadMode !== null || currentPage === 'about' || currentPage === 'contact' || currentPage === 'terms' || currentPage === 'privacy' || ['traffic', 'torts', 'small-claims', 'labor', 'housing'].includes(currentPage)}
        onBackClick={handleBackToHome}
      />
      
      {renderPage()}
      
      {/* Statistics & Insights Section - Show only on categories page */}
      {currentPage === 'categories' && (
        <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                מבט על המערכת המשפטית בישראל
              </h2>
              <p className="text-gray-600 text-lg">
                נתונים וסטטיסטיקות שיעזרו לך להבין את הסיכויים שלך
              </p>
            </div>

            {/* Success Rates by Category */}
            <div className="mb-16">
              <h3 className="text-2xl text-gray-900 mb-8 text-center">
                אחוזי הצלחה בתביעות לפי קטגוריה
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { 
                    icon: Car, 
                    title: 'ערעורי תעבורה', 
                    rate: 35, 
                    color: '#3700D0',
                    description: 'מערעורים מצליחים לבטל או להקטין את הדוח'
                  },
                  { 
                    icon: Scale, 
                    title: 'נזיקין', 
                    rate: 60, 
                    color: '#0066CC',
                    description: 'מתביעות הנזיקין מסתיימות בפיצוי כלשהו'
                  },
                  { 
                    icon: Briefcase, 
                    title: 'תביעות קטנות', 
                    rate: 70, 
                    color: '#00A86B',
                    description: 'מהתובעים בתביעות טנות זוכים בתיק'
                  },
                  { 
                    icon: Users, 
                    title: 'דיני עבודה', 
                    rate: 55, 
                    color: '#FF6B35',
                    description: 'מהתיקים מסתיימים לטובת העובד'
                  },
                  { 
                    icon: Home, 
                    title: 'דיור ושכירות', 
                    rate: 50, 
                    color: '#9D4EDD',
                    description: 'מהתיקים מסתיימים בפשרה או זכייה'
                  },
                ].map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div 
                      key={category.title}
                      className="bg-white rounded-xl p-4 md:hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto"
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
                      <h4 className="text-gray-900 mb-2 text-center text-xs">
                        {category.title}
                      </h4>
                      <div className="mb-2">
                        <div 
                          className="text-3xl text-center mb-1"
                          style={{ color: category.color }}
                        >
                          {category.rate}%
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs text-center leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                * נתונים משוערים המבוססים על סטטיסטיקות כלליות ומשתנים בהתאם לנסיבות המקרה
              </p>
            </div>

            {/* Popular Cases */}
            <div className="mb-16">
              <h3 className="text-2xl text-gray-900 mb-8 text-center">
                התביעות הנפוצות ביותר
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                    <Car className="w-10 h-10 text-purple-600" style={{ transform: 'scaleX(-1)' }} />
                  </div>
                  <h4 className="text-xl text-gray-900 mb-3">דוחות מהירות</h4>
                  <p className="text-gray-600 mb-4">
                    הסוג הנפוץ ביותר של דוחות תנועה בישראל. רוב הערעורים מתמקדים בטיעוני כיול מצלמות, שלטי אזהרה, ותנאי דרך.
                  </p>
                  <div className="text-sm text-purple-700 bg-purple-100 rounded-lg px-3 py-2 inline-block">
                    ~500,000 דוחות בשנה
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                    <Briefcase className="w-10 h-10 text-blue-600" />
                  </div>
                  <h4 className="text-xl text-gray-900 mb-3">סכסוכי עבודה</h4>
                  <p className="text-gray-600 mb-4">
                    פיטורים שלא כדין, שכר שלא שולם, ושעות נוספות. בתי הדין לעבודה מטפלים באלפי תיקים מדי שנה.
                  </p>
                  <div className="text-sm text-blue-700 bg-blue-100 rounded-lg px-3 py-2 inline-block">
                    ~35,000 תיקים בשנה
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-xl text-gray-900 mb-3">תביעות צרכנות</h4>
                  <p className="text-gray-600 mb-4">
                    מוצרים פגומים, שירותים לא אחידים, והחרים כספיים. תביעות קטנות מאפשרות פתרון מהיר וזול.
                  </p>
                  <div className="text-sm text-green-700 bg-green-100 rounded-lg px-3 py-2 inline-block">
                    ~45,000 תיקים בשנה
                  </div>
                </div>
              </div>
            </div>

            {/* Key Facts */}
            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl mb-12 text-center">
                  עובדות חשובות שכדאי לדעת
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: Clock,
                      number: '45',
                      unit: 'מים',
                      description: 'זמן ממוצע לטיפול בערעור תעבורה'
                    },
                    {
                      icon: Coins,
                      number: '₪33,500',
                      unit: 'ממוצע',
                      description: 'סכום פיצוי ממוצע בתביעות נזיקין קטנות'
                    },
                    {
                      icon: Calendar,
                      number: '90',
                      unit: 'ימים',
                      description: 'תקופת התיישנות להגשת תלונה לצרכנות'
                    },
                    {
                      icon: FileCheck,
                      number: '80%',
                      unit: 'מהמקרים',
                      description: 'מסתיימים בפשרה לפני משפט'
                    }
                  ].map((fact, index) => {
                    const IconComponent = fact.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 md:hover:bg-white/15 md:hover:border-white/30 transition-all duration-300 md:hover:scale-105"
                      >
                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl md:text-5xl mb-2">
                            {fact.number}
                          </div>
                          <div className="text-purple-200 text-sm mb-3">
                            {fact.unit}
                          </div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {fact.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-12 text-center">
                  <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl py-5 px-6 max-w-2xl mx-auto border border-white/20 shadow-lg">
                    <Lightbulb className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                    <p className="text-white text-sm leading-relaxed">
                      <span className="font-semibold">טיפ חשוב:</span> ככל שתפעלו מהר יותר, כך הסיכויים שלכם טובים יותר. מסמכים ועדויות טריות הם המפתח להצלחה.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl p-10 border border-gray-100">
                <h3 className="text-2xl md:text-3xl text-gray-900 mb-4">
                  מוכנים לבדוק את המקרה שלכם?
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  קבלו את המידע המשפטי הרלוונטי – תוך דקות ללא עלות וללא התחייבות
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-[#3700D0] text-white px-10 py-4 rounded-full md:hover:bg-[#2d0099] transition-all duration-300 active:opacity-90 text-lg"
                >
                  התחל עכשיו
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer - Hide on chat pages */}
      {!['traffic', 'torts', 'small-claims', 'labor', 'housing'].includes(currentPage) && (
        <footer className="bg-white border-t border-gray-200 py-16 mt-auto">
          <div className="max-w-6xl mx-auto px-4">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <div className="mb-4">
                  <Logo size="sm" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  פלטפורמה דיגיטלית חדשנית למידע משפטי נגיש ומהיר
                </p>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-gray-900 font-semibold mb-4">שירותים</h4>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => handleSelectCategory('traffic')}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm flex items-center gap-2"
                    >
                      <Car className="w-4 h-4" style={{ transform: 'scaleX(-1)' }} />
                      תעבורה וערעורים
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleSelectCategory('torts')}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm flex items-center gap-2"
                    >
                      <Scale className="w-4 h-4" />
                      תביעות נזיקין
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleSelectCategory('small-claims')}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      תביעות קטנות
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleSelectCategory('labor')}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      דיני עבודה
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleSelectCategory('housing')}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      דיור ושכירות
                    </button>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-gray-900 font-semibold mb-4">קישורים</h4>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={handleAboutClick}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm"
                    >
                      אודות Wallmans
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handleTermsClick}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm"
                    >
                      תנאי שימוש
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handlePrivacyClick}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm"
                    >
                      מדיניות פרטיות
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handleAccessibilityClick}
                      className="text-gray-600 hover:text-[#3700D0] transition-colors text-sm"
                    >
                      הצהרת נגישות
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-gray-900 font-semibold mb-4">צור קשר</h4>
                <ul className="space-y-3">
                  <li className="text-gray-600 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#3700D0]" />
                    info@wallmans.co.il
                  </li>
                  <li className="text-gray-600 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#3700D0]" />
                    03-1234567
                  </li>
                  <li className="text-gray-600 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#3700D0]" />
                    ראשון לציון, ישראל
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} Wallmans. כל הזכויות שמורות.
                </p>
                <div className="flex items-center gap-6">
                  <button 
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#3700D0] hover:text-white transition-all flex items-center justify-center"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#3700D0] hover:text-white transition-all flex items-center justify-center"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#3700D0] hover:text-white transition-all flex items-center justify-center"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
      <FloatingButtons />
      <CookieConsentBanner onOpenPrivacyPolicy={handlePrivacyClick} />
    </div>
  );
}