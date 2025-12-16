import { ArrowRight, Shield, Lock, Eye, Mail } from 'lucide-react';
import React from 'react';

interface PrivacyPolicyPageProps {
  onBackClick?: () => void;
}

export function PrivacyPolicyPage({ onBackClick }: PrivacyPolicyPageProps) {
  const [cookieConsent, setCookieConsent] = React.useState<string | null>(null);
  const [consentDate, setConsentDate] = React.useState<string | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = React.useState(false);

  React.useEffect(() => {
    // Check consent status
    const consent = localStorage.getItem('cookieConsent');
    const date = localStorage.getItem('cookieConsentDate');
    setCookieConsent(consent);
    setConsentDate(date);
  }, []);

  const handleRevokeConsent = () => {
    // Remove consent from localStorage
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    setCookieConsent(null);
    setConsentDate(null);
    setShowRevokeConfirm(false);
    
    // Show success message
    alert('ההסכמה לשימוש בעוגיות בוטלה בהצלחה. בכניסה הבאה לאתר תתבקש לתת הסכמה מחדש.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#3700D0] transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה
          </button>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#3700D0]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl text-gray-900">
                מדיניות פרטיות
              </h1>
              <p className="text-gray-600 mt-1">
                עדכון אחרון: דצמבר 2024
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              מדיניות פרטיות זו (להלן: "מדיניות הפרטיות") הינה חלק בלתי נפרד מתנאי השימוש של אתר Wallmans. החברה מכבדת ומקפידה על שמירת פרטיות המשתמשים ומבהירה להלן את אופן איסוף המידע, שמירתו והשימוש בו.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              1. הסכמה ועדכון המדיניות
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">1.1. הסכמת המשתמש:</h3>
                <p className="text-gray-700 leading-relaxed">
                  עצם השימוש באתר ו/או בכלי הצ'אט/AI, ובכלל זה מסירת פרטים במהלך השיחה, מעידים על הסכמתך המלאה לתנאי מדיניות פרטיות זו. המשתמש מצהיר כי מסירת הפרטים נעשית מרצונו החופשי ובהסכמתו.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">1.2. עדכון המדיניות:</h3>
                <p className="text-gray-700 leading-relaxed">
                  החברה שומרת לעצמה את הזכות לשנות את מדיניות הפרטיות מעת לעת, על פי שיקול דעתה הבלעדי. השינויים ייכנסו לתוקף מיד עם פרסומם באתר. המשך השימוש שלך לאחר שינוי התנאים מהווה הסכמה לגרסה המעודכנת.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 - Table */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              2. המידע הנאסף ומטרתו
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              החברה אוספת ושומרת במאגריה מידע מסוים ביחס למשתמש על מנת לספק את השירותים.
            </p>

            {/* Information Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                      סוג המידע
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                      פירוט ודוגמאות
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                      מטרת האיסוף
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 align-top">
                      <span className="text-gray-800">מידע אישי רגיש (נאסף בצ'אט)</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                      שם מלא, טלפון, כתובת דוא"ל, ופרטים אודות התיק המשפטי (עובדות, סכומים, שמות צדדים).
                    </td>
                    <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                      לצורך ביצוע ניתוח ה-AI, הפקת הסיכום/טיוטה המותאמת אישית, שליחת סיכום בדוא"ל, ויצירת קשר לצורך טיפול בבקשה והשלמת ההפניה.
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 align-top">
                      <span className="text-gray-800">דברי פרסומת ומסרי שירות</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                      כתובת הדוא"ל ו/או מ��פרי טלפון שנמסרו.
                    </td>
                    <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                      לצורך שליחת מסרים שירות (כגון סיכום התיק, סטטוס הגשה), וכן מסרים פרסומיים (דבר פרסומת), בכפוף לזכות המשתמש לבקש הסרה מרשימת התפוצה.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 align-top">
                      <span className="text-gray-800">נתונים טכניים ואנונימיים</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                      כתובת IP, מזהה מכשיר (IMEI/Advertising ID), נתוני קריסה, נתונים סטטיסטיים לגבי שימוש (תאריך, שעה, משך שימוש).
                    </td>
                    <td className="border border-gray-300 px-4 py-3 align-top text-gray-700">
                      לצורך ניתוח סטטיסטי, שיפור ופיתוח האתר והאלגוריתמים, אבטחת מידע וטיפול בתקלות.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#3700D0]" />
              3. שמירת המידע ואבטחתו
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.1. הפרדת נתונים:</h3>
                <p className="text-gray-700 leading-relaxed">
                  המידע הרגיש שנאסף דרך הצ'אט/AI אינו נשמר בבסיס הנתונים הראשי של האתר (כדוגמת וורדפרס), אלא מועבר למערכת ניהול לקוחות (CRM) או למאגר נתונים ייעודי ומאובטח.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.2. אבטחה והצפנה:</h3>
                <p className="text-gray-700 leading-relaxed">
                  החברה עושה ככל שביכולתה על מנת לשמור על אבטחת המידע שנמסר באמצעות אמצעי הגנה סבירים ומקובלים, לרבות העברת השיחה בצ'אט בחיבור מוצפן (SSL/HTTPS). עם זאת, אין ודאות מוחלטת והחברה אינה מתחייבת לחסינות מוחלטת מפני חדירה בלתי-מורשית.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.3. שמירת נתונים בענן:</h3>
                <p className="text-gray-700 leading-relaxed">
                  המשתמש נותן בזאת הסכמתו לשמירת המידע ו/או עיבודו בענן של צד ג' (כגון ספקי CRM או שירותי אחסון בענן), אשר יכול להיות ממוקם אף מחוץ לגבולות מדינת ישראל, בכפוף למדיניות פרטיות והגנה על המידע הנהוגות אצל אותו צד ג'.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.4. פרטיות קטינים:</h3>
                <p className="text-gray-700 leading-relaxed">
                  האתר מיועד לשימוש על ידי בגירים בלבד (מעל גיל 18). החברה לא אוספת מידע ביודעין מקטינים שגילם נמוך מ-13.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              4. מסירת מידע לצדדים שלישיים
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              החברה תמנע ככל הניתן מלהעביר את פרטיך האישיים המזהים לצדדים שלישיים, למעט במקרים הבאים:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">4.1. לצורך השירות המבוקש:</h3>
                <p className="text-gray-700 leading-relaxed">
                  כאשר המשתמש ביקש הפניה לעורך דין או רכש שירות הכולל הגשה/טיפול חיצוני, החברה תהא רשאית להעביר את הפרטים הרלוונטיים לגורם המפנה (עורך הדין/ספק השירות) לצורך מתן השירות המבוקש.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">4.2. שינוי מבני בחברה:</h3>
                <p className="text-gray-700 leading-relaxed">
                  במקרה בו החברה תימכר, תמוזג או תעביר את פעילותה, אזי תהא זכאית להעביר את מלוא המידע שנשמר ו/או נאסף לצד ג' רוכש, ובלבד שהצד השלישי יקבל על עצמו את הוראות מדיניות פרטיות זו.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">4.3. צו שיפוטי או חובה חוקית:</h3>
                <p className="text-gray-700 leading-relaxed">
                  אם יתקבל צו שיפוטי המחייב מסירת המידע, או בכל מקרה שהחברה תסבור כי מסירת המידע נחוצה כדי למנוע נזק לגוף או לרכוש.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">4.4. הפרת תקנון:</h3>
                <p className="text-gray-700 leading-relaxed">
                  במקרה בו יימצא כי פעולות המשתמש מפרות את תנאי השימוש ו/או מנוגדות לדין.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              5. שימוש בקבצי Cookies וטכנולוגיות מעקב
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">5.1. שימוש בקבצים:</h3>
                <p className="text-gray-700 leading-relaxed">
                  האתר עושה שימוש בקבצי Cookies ובטכנולוגיות מעקב דומות (פיקסלים). קבצים אלו משמשים לאיסוף נתונים סטטיסטיים, אימות פרטים, התאמת האתר להעדפות המשתמש ולצרכי אבטחת מידע.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">5.2. הסכמה ומחיקה:</h3>
                <p className="text-gray-700 leading-relaxed">
                  בהסכמתך לתנאי השימוש ומדיניות הפרטיות, הנך נותן את רשותך לחברה להשתמש בקבצי Cookies. המשתמש יכול בכל עת להימנע מכך על ידי שינוי הגדרות הדפדפן או מחיקת הקבצים באופן ידני, תוך ידיעה כי פעולה זו עלולה לפגוע ביכולת השימוש בחלק משירותי האתר.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Consent Management Section */}
          <section className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#3700D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ניהול הסכמה לעוגיות
            </h2>

            {/* Explanation Text */}
            <p className="text-gray-700 leading-relaxed mb-6">
              אם ברצונכם לבטל את ההסכמה לשימוש בעוגיות שנתתם בעבר, תוכלו לעשות זאת באמצעות הכפתור למטה. לאחר ביטול ההסכמה, תתבקשו לתת הסכמה מחדש בעת השימוש הבא באתר.
            </p>

            {/* Current Status Display */}
            <div className="mb-6">
              {cookieConsent === 'accepted' ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg mb-1">
                      <span className="text-gray-700">סטטוס נוכחי: </span>
                      <strong className="text-green-800">נתתם הסכמה לשימוש בעוגיות</strong>
                    </p>
                    {consentDate && (
                      <p className="text-sm text-green-700">
                        תאריך הסכמה: {new Date(consentDate).toLocaleDateString('he-IL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg">
                      <span className="text-gray-700">סטטוס נוכחי: </span>
                      <strong className="text-gray-800">לא ניתנה הסכמה לשימוש בעוגיות</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      תתבקשו לתת הסכמה בעת הכניסה הבאה לאתר
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            {cookieConsent === 'accepted' && (
              <>
                {!showRevokeConfirm ? (
                  <button
                    onClick={() => setShowRevokeConfirm(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    בטל הסכמה לעוגיות
                  </button>
                ) : (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                    <p className="text-gray-800 mb-4">
                      <strong>האם אתם בטוחים?</strong> לאחר ביטול ההסכמה, האתר עשוי לא לפעול כראוי ותתבקשו לתת הסכמה מחדש בכניסה הבאה.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleRevokeConsent}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        כן, בטל הסכמה
                      </button>
                      <button
                        onClick={() => setShowRevokeConfirm(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Info Note */}
            {cookieConsent !== 'accepted' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>שימו לב:</strong> ללא הסכמה לשימוש בעוגיות, חלק מהשירותים והפונקציות באתר עשויים להיות מוגבלים.
                </p>
              </div>
            )}
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-[#3700D0]" />
              6. זכויותיך בנוגע למידע האישי
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">6.1. זכות העיון והתיקון:</h3>
                <p className="text-gray-700 leading-relaxed">
                  המשתמש רשאי, בהתאם להוראות חוק הגנת הפרטיות, התשמ"א-1981, לעיין במידע האישי שאנו מחזיקים عنه ולבקש את תיקונו או מחיקתו.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">6.2. פנייה למימוש זכויות:</h3>
                <p className="text-gray-700 leading-relaxed">
                  כל בקשה לעיון, תיקון או מחיקת מידע כפופה להוראות הדין ותיבחן על ידי החברה. ניתן לפנות בעניין זה באמצעות פרטי יצירת הקשר המופיעים מטה.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="pt-6 border-t border-gray-200">
            <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#3700D0]" />
              פרטי יצירת קשר
            </h2>
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                בכל שאלה, בקשה או פנייה בנוגע למדיניות פרטיות זו, ניתן ליצור קשר:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-lg bg-[#3700D0] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">כתובת דוא"ל:</p>
                    <a href="mailto:info@wallmans.co.il" className="text-[#3700D0] hover:underline">
                      info@wallmans.co.il
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <section className="pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>הערה חשובה:</strong> מדיניות פרטיות זו עשויה להתעדכן מעת לעת. אנו ממליצים לעיין במדיניות באופן קבוע כדי להישאר מעודכנים בנוגע לאופן שבו אנו מגינים על המידע שלך.
              </p>
            </div>
          </section>
        </div>

        {/* Back Button - Bottom */}
        {onBackClick && (
          <div className="mt-6 text-center">
            <button
              onClick={onBackClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3700D0] text-white rounded-xl hover:bg-[#2D00A8] transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              חזרה למסך הראשי
            </button>
          </div>
        )}
      </div>
    </div>
  );
}