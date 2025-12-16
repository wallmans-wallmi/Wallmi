import { ArrowRight, Eye, Keyboard, MousePointer, MonitorSmartphone, FileText, Mail, Phone, User, Accessibility } from 'lucide-react';
import React from 'react';

interface AccessibilityStatementPageProps {
  onBackClick?: () => void;
}

export function AccessibilityStatementPage({ onBackClick }: AccessibilityStatementPageProps) {
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
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Accessibility className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl text-gray-900">
                הצהרת נגישות
              </h1>
              <p className="text-gray-600 mt-1">
                עדכון אחרון: דצמבר 2024
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 space-y-8">
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4 flex items-center gap-2">
              1. כללי
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                אתר <strong>Wallmans - התובע האינטרנטי</strong> (להלן: "האתר") רואה חשיבות עליונה בהנגשת שירותיו הדיגיטליים לאנשים עם מוגבלויות, מתוך תפיסת עולם שוויונית והכרה בכבוד האדם. אנו פועלים להבטחת נגישות מלאה לכלל המשתמשים, כך שגם אנשים עם מוגבלויות יוכלו לגלוש ולהשתמש בכלים האוטומטיים והמידע המשפטי שבאתר בצורה יעילה ונוחה.
              </p>
              <p className="text-gray-700 leading-relaxed">
                החברה <strong>Wallmans בע"מ</strong> משקיעה מאמצים רבים על מנת שהאתר יעמוד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013, ובכלל זה עמידה בתקן הבינלאומי <strong>WCAG 2.0 ברמת AA</strong>.
              </p>
            </div>
          </section>

          {/* Section 2: Accessibility Features */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
              2. הסדרי נגישות באתר האינטרנט
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              האתר עבר התאמות נגישות יסודיות והוא מותאם לצפייה בדפדפנים נפוצים ובשימוש בטלפונים סלולריים. הנגשת האתר כללה, בין היתר, את הפעולות הבאות:
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                      <MonitorSmartphone className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">תאימות לדפדפנים וכלי עזר</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      האתר מותאם לעבודה עם דפדפנים מודרניים וכלי סיוע, לרבות שימוש בתוכנות קורא מסך נפוצות (כגון NVDA ו-JAWS).
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[#3700D0] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">מבנה סמנטי</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      שימוש במבנה סמנטי תקין לכותרות (H1, H2, וכו') להקלת השימוש בקוראי מסך.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                      <Keyboard className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">ניווט במקלדת</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      מתאפשר ניווט מלא ושימוש בכל רכיבי האתר (כולל כלי הצ'אט/AI) באמצעות המקלדת בלבד (באמצעות מקש Tab).
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">טקסטים חלופיים</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      לכל התמונות והאלמנטים הגרפיים הוגדר טקסט חלופי (Alt Text) המסייע לקוראי מסך.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-gray-900 mb-4">התאמות ויזואליות:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-[#3700D0] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>התאמה לצבעים (ניגודיות מספקת בין טקסט לרקע)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-[#3700D0] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>אפשרות הגדלת גופן באמצעות הדפדפן</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-[#3700D0] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>מנגנון לעצירת אנימציות ומהבהבים</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Limitations */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              3. סייגים והסדרי נגישות לשירות
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              נכון לתאריך <strong>דצמבר 2024</strong>, נגישות האתר עומדת ברוב הדרישות, למעט במקרים הבאים:
            </p>

            <div className="space-y-4">
              {/* Limitation 1 */}
              <div className="bg-yellow-50 border-r-4 border-yellow-400 p-5 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">תוכן צד שלישי</h3>
                    <p className="text-gray-700 leading-relaxed">
                      האתר עושה שימוש ברכיבים ושירותים של צדדים שלישיים (כגון פלטפורמת הצ'אט/AI, סליקה, או תוספי צד ג'). ייתכן כי רכיבים אלה אינם נגישים באופן מלא, והחברה פועלת לקידום נגישותם מול הספקים.
                    </p>
                  </div>
                </div>
              </div>

              {/* Limitation 2 */}
              <div className="bg-yellow-50 border-r-4 border-yellow-400 p-5 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">הצגת מסמכים</h3>
                    <p className="text-gray-700 leading-relaxed">
                      מסמכים שהועלו לאתר בפורמט PDF (כגון דוגמאות למסמכים משפטיים) לפני <strong>דצמבר 2024</strong> עשויים להיות פחות נגישים. אנו עובדים על המרת מסמכים אלה או יצירת גרסאות נגישות.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Physical Accessibility */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              4. הסדרי נגישות במשרדי החברה
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700 leading-relaxed">
                  <strong>שירותי האתר ניתנים באופן מקוון בלבד</strong>, ואין קבלת קהל פרונטלית במשרדי החברה. לפיכך, אין הסדרי נגישות פיזיים רלוונטיים.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Contact & Reporting */}
          <section className="pt-6 border-t border-gray-200">
            <h2 className="text-2xl text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#3700D0]" />
              5. יצירת קשר ודיווח על בעיות נגישות
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              אם במהלך הגלישה באתר נתקלתם בבעיית נגישות, נשמח לקבל מכם משוב. אנא צרו קשר עם רכז הנגישות של החברה, כדי שנוכל לטפל בבעיה ולשפר את השירות.
            </p>

            {/* Contact Information Table */}
            <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#3700D0]" />
                פרטי רכז הנגישות
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">שם איש קשר (רכז נגישות):</p>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <User className="w-5 h-5 text-[#3700D0]" />
                    <span className="text-gray-800">[יש למלא שם מלא]</span>
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">תפקיד:</p>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <svg className="w-5 h-5 text-[#3700D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-800">[יש למלא תפקיד]</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">טלפון ישיר/נייד:</p>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <Phone className="w-5 h-5 text-[#3700D0]" />
                    <span className="text-gray-800">[יש למלא מספר טלפון]</span>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">דוא"ל לטיפול בנגישות:</p>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <Mail className="w-5 h-5 text-[#3700D0]" />
                    <a href="mailto:accessibility@wallmans.co.il" className="text-[#3700D0] hover:underline">
                      accessibility@wallmans.co.il
                    </a>
                  </div>
                </div>
              </div>

              {/* Update Dates */}
              <div className="mt-6 pt-6 border-t border-purple-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">תאריך עדכון ההצהרה:</p>
                  <p className="text-gray-800">דצמבר 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">תאריך בדיקת הנגישות האחרונה:</p>
                  <p className="text-gray-800">דצמבר 2024</p>
                </div>
              </div>
            </div>
          </section>

          {/* Commitment Statement */}
          <section className="pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">המחויבות שלנו</h3>
                  <p className="text-gray-700 leading-relaxed">
                    אנו ממשיכים לפעול ללא הרף לשיפור נגישות האתר ומחויבים לספק חוויית משתמש שווה ונגישה לכלל המשתמשים. נגישות היא תהליך מתמשך, ואנו מקדישים משאבים ומאמצים כדי להבטיח שהאתר יעמוד בסטנדרטים הגבוהים ביותר של נגישות דיגיטלית.
                  </p>
                </div>
              </div>
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
