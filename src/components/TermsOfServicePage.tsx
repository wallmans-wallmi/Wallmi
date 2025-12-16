import { ArrowRight } from 'lucide-react';

interface TermsOfServicePageProps {
  onBackClick?: () => void;
}

export function TermsOfServicePage({ onBackClick }: TermsOfServicePageProps) {
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
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-4">
            תנאי שימוש באתר Wallmans
          </h1>
          <p className="text-gray-600">
            תאריך עדכון אחרון: דצמבר 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              ברוכים הבאים לאתר Wallmans (להלן: "האתר"). האתר מנוהל ומתופעל על ידי וולמנס דיגיטל בע"מ (להלן: "החברה").
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              הגישה לאתר והשימוש בו, לרבות שימוש במידע ובכלי ה-AI/צ'אט המוצעים בו, כפופים לתנאי שימוש אלה (להלן: "התקנון"). אנא קרא את התקנון בקפידה.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              1. הגדרות ומהות השירות
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">1.1. מהות האתר:</h3>
                <p className="text-gray-700 leading-relaxed">
                  האתר הוא פלטפורמה דיגיטלית המשתמשת באוטומציה ובבינה מלאכותית (AI) לצורך איסוף נתונים ראשוני, ניתוח סטטיסטי כללי, והצגת מידע משפטי רלוונטי למשתמשים.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">1.2. שירותי האתר:</h3>
                <div className="mr-4 space-y-3">
                  <div>
                    <h4 className="text-base text-gray-800 mb-1">1.2.1. שירותי מידע ראשוני:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      איסוף נתונים דרך הצ'אט/AI ומסירת מידע סטטיסטי, סיכום והערכה כללית ממוחשבת.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base text-gray-800 mb-1">1.2.2. שירותי הפניה לגורמים חיצוניים:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      האתר עשוי להפנות את המשתמש לעורכי דין, משרדי עורכי דין או גורמים חיצוניים אחרים (להלן: "הגורם המפנה") לצורך קבלת ייעוץ משפטי אישי או שירותים משפטיים בפועל.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-base text-gray-800 mb-1">1.2.3. שירותי הכנה בתשלום:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      שירותים כגון הכנת כתבי תביעה קטנים או מסמכים משפטיים אחרים, הניתנים תמורת תשלום (ככל שרלוונטי).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">1.3. המשתמש:</h3>
                <p className="text-gray-700 leading-relaxed">
                  בגיר (מעל גיל 18) וכשיר משפטית, אשר קרא והסכים לתנאים המפורטים בתקנון זה.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              2. הסכמה ושינוי התנאים
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">2.1. הסכמה:</h3>
                <p className="text-gray-700 leading-relaxed">
                  עצם הכניסה לאתר, השימוש בכלי הצ'אט, ו/או שימוש בשירותים, מעידים על הסכמה מלאה ובלתי מסויגת של המשתמש לכל תנאי התקנון.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">2.2. עדכונים ושינויים:</h3>
                <p className="text-gray-700 leading-relaxed">
                  החברה שומרת לעצמה את הזכות לשנות את התקנון, את מבנה האתר או את מכלול השירותים המוצעים בו, בכל עת ולפי שיקול דעתה הבלעדי. השימוש באתר לאחר עדכון התקנון יהווה הסכמה אוטומטית לתנאים המעודכנים.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">2.3. הפסקת גישה:</h3>
                <p className="text-gray-700 leading-relaxed">
                  החברה רשאית, בכל עת ומכל סיבה, לחסום באופן מיידי את גישת המשתמש לאתר, אם הפר את התקנון או נחשד בהפרתו, מבלי שתחול עליה אחריות כלשהי כלפי המשתמש או צד שלישי.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              3. דיסקליימר קריטי והגבלת אחריות (חובה משפטית)
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800 leading-relaxed">
                <strong>הודעה חשובה:</strong> המידע באתר אינו מהווה ייעוץ משפטי.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.1. אינו ייעוץ משפטי:</h3>
                <p className="text-gray-700 leading-relaxed">
                  מובהר ומודגש באופן חד-משמעי כי המידע, הניתוח הסטטיסטי, הסיכומים וההערכות המופקים על ידי מערכת ה-AI/אוטומציה, אינם מהווים בשום אופן ייעוץ משפטי, חוות דעת משפטית, טיפול משפטי או תחליף לייעוץ משפטי אישי ומקיף של עורך דין מוסמך.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.2. אחריות המשתמש:</h3>
                <p className="text-gray-700 leading-relaxed">
                  המשתמש מסכים כי כל החלטה המבוססת על המידע המתקבל מהאתר ו/או הנגזר ממנו, לרבות ההחלטה האם לפנות להליך משפטי, היא באחריותו הבלעדית ועל סיכונו האישי.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.3. אחריות לתוכן:</h3>
                <p className="text-gray-700 leading-relaxed">
                  החברה אינה אחראית לדיוק, לשלמות או לטיב המידע המופק על ידי מערכות הבינה המלאכותית או לתוצאות השימוש במידע זה. החברה לא מתחייבת כי המידע או המסמכים המופקים יענו על צרכיו הספציפיים של המשתמש.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.4. אחריות על הפניה (Referral):</h3>
                <ul className="mr-6 space-y-2 list-disc text-gray-700">
                  <li>החברה משמשת כמתווך (Referral) בלבד לצורך יצירת קשר עם הגורם המפנה.</li>
                  <li>החברה אינה אחראית לאיכות, מקצועיות, תוצאות או טיב השירות המשפטי שניתן על ידי הגורם המפנה. יחסי עורך דין-לקוח נוצרים בין המשתמש לבין הגורם המפנה בלבד.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">3.5. הגבלת אחריות לנזקים:</h3>
                <p className="text-gray-700 leading-relaxed">
                  החברה ו/או מי מטעמה לא יישאו בכל אחריות לכל נזק (ישיר או עקיף), הפסד, או חסרון כיס שיגרמו למשתמש או לצד שלישי כתוצאה משימוש באתר, אי-יכולת להשתמש באתר, או הסתמכות על התכנים/שירותים, לרבות נזקי תוכנה או חומרה.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              4. שירותי הכנה בתשלום (אם רלוונטי)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">4.1. אופי השירות:</h3>
                <p className="text-gray-700 leading-relaxed">
                  שירותי הכנה כגון כתבי תביעות קטנות או מסמכים משפטיים אחרים, ככל שמוצעים, ניתנים כטיוטה ראשונית בלבד ומבוססים על הנתונים שהמשתמש מזין.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">4.2. חובת העריכה:</h3>
                <p className="text-gray-700 leading-relaxed">
                  האחריות הבלעדית לעריכה, בדיקה, אימות ועדכון המסמכים המופקים היא על המשתמש בלבד. על המשתמש לוודא שהנתונים שהוזנו תואמים למסמך הסופי ושהם מדויקים ועדכניים.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">4.3. הגשה והליכים משפטיים:</h3>
                <ul className="mr-6 space-y-2 list-disc text-gray-700">
                  <li>אם נרכש שירות הגשה, החברה אחראית למסירת המסמך למזכירות בית המשפט בלבד.</li>
                  <li>החברה אינה אחראית לניהול ההליך, מעקב אחר מועדים, החלטות בית המשפט או עדכון הלקוח. האחריות הבלעדית להתעדכן ולהופיע לדיונים היא על המשתמש.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl text-gray-900 mb-4">
              5. מדיניות תשלומים וביטול עסקה
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-800 mb-2">5.1. תנאי תשלום:</h3>
                <p className="text-gray-700 leading-relaxed">
                  תשלום עבור השירותים יבוצע מראש, בהתאם למחיר המופיע באתר בעת ביצוע הרכישה.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">5.2. ביטול עסקה (שירותי מידע/הכנה):</h3>
                <p className="text-gray-700 leading-relaxed">
                  ככלל, שירותים הכוללים הפקה או חילול מסמכים אישיים על בסיס נתונים שהוזנו על ידי המשתמש (קרי: מוצרים שיוצרו לפי דרישות מיוחדות של הלקוח), אינם ניתנים לביטול על פי חוק הגנת הצרכן, התשמ"א-1981, ותקנותיו. חוסר שביעות רצון מנוסח או תוכן הטיוטה לא יזכה את המשתמש בהשבת התמורה.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-800 mb-2">5.3. ביטול שירותי הגשה:</h3>
                <p className="text-gray-700 leading-relaxed">
                  ביטול שירותי הגשה יהיה כפוף להוראות חוק הגנת הצרכן ולמדיניות הביטול המפורטת במפורש בעמוד הרכישה, ובלבד שההגשה לא בוצעה בפועל.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              המשך השימוש באתר לאחר תאריך עדכון התנאים מהווה הסכמה לתנאים המעודכנים. לשאלות נוספות, ניתן ליצור קשר דרך עמוד "צור קשר" באתר.
            </p>
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
