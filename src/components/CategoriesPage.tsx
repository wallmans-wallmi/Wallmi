import { Search } from 'lucide-react';
import { useState } from 'react';
import { Car, Scale, Briefcase, Users, Home, LucideIcon } from 'lucide-react';
import { Logo } from './Logo';

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  keywords: string[];
}

const categories: Category[] = [
  { 
    id: 'traffic', 
    title: 'תעבורה', 
    icon: Car, 
    color: '#3700D0',
    keywords: [
      // דוחות וקנסות
      'דוח', 'דוחות', 'קיבלתי דוח', 'קנס', 'קנסות', 'דו״ח', 
      // תעבורה כללי
      'תעבורה', 'משטרה', 'שוטר', 'משטרת ישראל', 'דרכים', 'כביש',
      // עבירות מהירות
      'מהירות', 'מהירות מופרזת', 'עודף מהירות', 'מצלמה', 'מכ״מ', 'רדאר', 'מהר מדי',
      // חניה
      'חניה', 'חניתי', 'חנייה', 'חנה', 'חונה', 'חניון', 'תו חניה', 'חניה אסורה', 'מגרש',
      // נהיגה
      'נהיגה', 'נהג', 'נהגתי', 'סעתי', 'נסיעה', 'רכב', 'מכונית', 'אוטו', 'רכב פרטי',
      'אופנוע', 'אופנוען', 'אופניים', 'אופניים חשמליים', 'קורקינט', 'קטנוע',
      // עבירות ספציפיות
      'רמזור', 'רמזור אדום', 'עצור', 'תמרור', 'עצרתי', 'לא עצרתי',
      'טלפון', 'טלפון נייד', 'נייד', 'דיבור בטלפון', 'פלאפון', 'סלולרי',
      'חגורה', 'חגורת בטיחות', 'לא חגור', 'חגור', 'ילד', 'מושב בטיחות',
      'אלכוהול', 'שתייה', 'שתיתי', 'שיכור', 'אלכו', 'נשיפה', 'בדיקת אלכוהול',
      // נקודות ורישיון
      'נקודות', 'נקודות ברישיון', 'צברתי נקודות', 'איבוד רישיון', 'פסילת רישיון',
      'רישיון', 'רישיון נהיגה', 'שלילת רישיון',
      // תאונות
      'תאונה', 'תאונת דרכים', 'התנגשות', 'פגעתי', 'פגע בי', 'נתaggedתי',
      // ביטוח
      'ביטוח', 'ביטוח רכב', 'חברת ביטוח', 'תביעת ביטוח',
      // כללי
      'ערעור', 'ערער', 'לערער', 'ביטול דוח', 'מחיקת דוח', 'צריך עזרה'
    ]
  },
  { 
    id: 'torts', 
    title: 'נזיקין', 
    icon: Scale, 
    color: '#0066CC',
    keywords: [
      // נזק כללי
      'נזק', 'נזקים', 'נתaggedתי', 'נתagged', 'פגיעה', 'פגע בי', 'גרם לי נזק',
      // תאונות
      'תאונה', 'תאונות', 'תאונת עבודה', 'תאונת דרכים', 'התנגשות', 'תנגשתי',
      // פציעות
      'פציעה', 'פצוע', 'נפצעתי', 'פצעתי', 'חבלה', 'חבלת גוף', 'כאב', 'כואב לי',
      'שבר', 'שברתי', 'שבור', 'עצם שבורה', 'גבס',
      'כוויה', 'כוויות', 'נכווה', 'נכוויתי',
      'נפילה', 'נפלתי', 'החלקה', 'החלקתי', 'מדרגות', 'רצפה רטובה',
      // רפואי
      'רפואי', 'רפואה', 'רשלנות רפואית', 'טעות רפואית',
      'רופא', 'רופאים', 'דוקטור', 'מנתח',
      'בית חולים', 'ביה״ח', 'קופת חולים', 'מרפאה', 'ניתוח',
      'אבחון', 'אבחון שגוי', 'טיפול', 'טיפול רפואי', 'זיהום',
      // בעלי חיים
      'כלב', 'כלבים', 'נשיכה', 'נשך', 'נשכתי', 'כלב נשך', 'בעל חיים',
      // עבודה
      'תאונת עבודה', 'נתaggedתי בעבודה', 'ביטוח לאומי', 'ביל״ו', 'נתagged עבודה',
      // פיצויים
      'פיצוי', 'פיצויים', 'תביעה', 'נזיקין', 'תשלום', 'דרוש פיצוי',
      // רשלנות
      'רשלנות', 'רשלני', 'התרשל', 'התרשלות', 'אשמה',
      // כללי
      'נזק גוף', 'נזק ממון', 'צריך לתבוע', 'מגיע לי', 'זכאי', 'זכאות'
    ]
  },
  { 
    id: 'small-claims', 
    title: 'תביעות קטנות', 
    icon: Briefcase, 
    color: '#00A86B',
    keywords: [
      // תביעות
      'תביעה', 'תביעות', 'תביעה קטנה', 'לתבוע', 'תובע', 'נתagged',
      // צרכנות
      'צרכן', 'צרכנות', 'זכויות צרכן', 'הגנת הצרכן',
      // מוצרים
      'מוצר', 'מוצרים', 'מוצר פגום', 'פגום', 'שבור', 'לא עובד', 'תקלה',
      'קניה', 'קניתי', 'קנה', 'רכישה', 'רכשתי', 'קונה',
      'איכות', 'איכות ירודה', 'לא איכותי', 'נמוך', 'גרוע',
      // החזרים
      'החזר', 'החזר כספי', 'החזר כסף', 'להחזיר כסף', 'כסף בחזרה',
      'ביטול', 'ביטול עסקה', 'לבטל', 'מבטל',
      // שירותים
      'שירות', 'שירותים', 'שירות גרוע', 'שירות לקוי', 'לא טיפלו',
      // עסקאות
      'עסקה', 'עסקאות', 'חוזה', 'הסכם', 'התחייבות',
      'לקוח', 'קונה', 'קניות',
      // מסחר
      'חנות', 'חנויות', 'חנוני', 'מרכז מסחרי', 'קניון',
      'אינטרנט', 'אונליין', 'קניות אינטרנט', 'אתר', 'אי ביי', 'עליאקספרס',
      'משלוח', 'משלוחים', 'לא הגיע', 'לא לתי', 'איחור', 'אוחר',
      // בעיות
      'טעות', 'טעויות', 'שגיאה', 'טעו', 'טעיתי',
      'הונאה', 'רימוי', 'רימה אותי', 'הונה', 'נרמז',
      'רמאות', 'רמאי', 'לא הגון', 'הטעיה',
      // אחריות
      'אחריות', 'אחריות יצרן', 'תקופת אחריות', 'אחריות מורחבת', 'תיקון', 'תיקונים',
      // מוכרים
      'מוכר', 'מוכרים', 'ספק', 'קבלן', 'בעל עסק', 'חברה',
      // עבודות
      'עבודה', 'עבודות', 'שיפוץ', 'שיפוצים', 'קבלן', 'קבלנים', 'בניין', 'בנייה',
      'לא סיימו', 'לא הגיעו', 'באיכות נמוכה', 'עבודה לקויה',
      // כללי
      'כסף', 'שילמתי', 'תשלום', 'חיוב', 'חייבו אותי', 'מחיר'
    ]
  },
  { 
    id: 'labor', 
    title: 'דיני עבודה', 
    icon: Users, 
    color: '#FF6B35',
    keywords: [
      // עבודה כללי
      'עבודה', 'עובד', 'עובדת', 'עובדים', 'מעביד', 'מעסיק',
      'מקום עבודה', 'شركة', 'ארגון', 'עסק', 'בוס', 'מנהל', 'מנהלת',
      // פיטורים
      'פיטורים', 'פיטורין', 'פיטרו', 'פיטרו אותי', 'פיטר', 'פיטור',
      'פיצויי פיטורים', 'פיצויי פיטורי', 'פיצויים', 'פיצוי',
      'הודעה מוקדמת', 'הודעה', 'לא יבלתי הודעה',
      'פיטורים לא חוקיים', 'פיטורים שלא כדין', 'פיטור שווא',
      // התפטרות
      'התפטרות', 'התפטרתי', 'להתפטר', 'פורש', 'עזבתי',
      'התפטרות מעין פיטורים', 'אילצו אותי להתפטר',
      // שכר
      'שכר', 'משכורת', 'משכורות', 'תשלום', 'שילму', 'לא שילму',
      'תלוש שכר', 'תלושים', 'שכר מינימום', 'תשלום חלקי',
      'שעות נוספות', 'נוספות', 'שעות', 'עבדתי', 'לא שילму לי',
      // זכויות
      'זכויות', 'זכויות עובדים', 'זכויות סוציאליות', 'זכאות',
      'חופשה', 'חופש', 'ימי חופש', 'חל״ת', 'לא נתנו לי חופשה',
      'מחלה', 'ימי מחלה', 'חולה', 'חל״ד', 'דמי מחלה',
      'דמי הבראה', 'הבראה', 'לא קיבלתי הבראה',
      'פנסיה', 'קרן פנסיה', 'קופת גמל', 'פיצויים', 'קרן השתלמות',
      // חוזה
      'חוזה', 'חוזה עבודה', 'הסכם', 'הסכם עבודה',
      'הפרה', 'הפרת חוזה', 'הפרת הסכם', 'הפר',
      // תנאים
      'תנאי עבודה', 'תנאים', 'תנאים קשים', 'תנאי שכר',
      'שעות עבודה', 'משמרות', 'משמרת', 'עבדתי הרבה',
      // הטרדה ואפליה
      'הטרדה', 'הטרד', 'הטרדו', 'הטרדה מינית',
      'אפליה', 'מפלים', 'הפליה', 'גזענות', 'מפלה אותי',
      'הערות', 'השפלה', 'ביזוי', 'עלבון', 'פגיעה',
      // סוגי עובדים
      'שכיר', 'שכירה', 'עצמאי', 'קבלן', 'קבלן משנה',
      'מתמחה', 'התמחות', 'סטאז׳', 'סטאז׳ר',
      'פנסיונר', 'גמלאי', 'פורש',
      // כללי
      'עורך דין עבודה', 'עו״ד', 'בית דין', 'בית דין לעבודה',
      'תביעה', 'לתבוע', 'תובע', 'צריך עזרה', 'מגיע לי'
    ]
  },
  { 
    id: 'housing', 
    title: 'דיור ושכירות', 
    icon: Home, 
    color: '#9D4EDD',
    keywords: [
      // דירה ונדל״ן
      'דירה', 'דירות', 'בית', 'דיור', 'מגורים', 'דית מגורים',
      'נכס', 'נכסים', 'נדל״ן', 'דיירות',
      // שכירות
      'שכירות', 'שוכר', 'שוכרת', 'שכרתי', 'שכור', 'לשכור',
      'משכיר', 'משכירה', 'משכרתי', 'בעל הדירה', 'בעלים',
      'דייר', 'דיירים', 'דייר משנה',
      // חוזה
      'חוזה', 'חוזה שכירות', 'הסכם', 'הסכם שכירות',
      'הפרה', 'הפרת חוזה', 'הפר החוזה', 'לא מקיים',
      // כסף
      'שכירות', 'דמי שכירות', 'שכר דירה', 'תשלום', 'לא שילם',
      'ערבות', 'ערבון', 'פיקדון', 'פיקדון שכירות', 'לא החזיר',
      'דמי מפתח', 'תשלום נוסף', 'העלאת שכר דירה', 'העלו לי',
      'תשלום', 'לא משלם', 'חוב', 'חובות',
      // פינוי
      'פינוי', 'פינו', 'לפנות', 'פינו אותי', 'מפנים',
      'הודעת פינוי', 'צו פינוי', 'איום בפינוי',
      // בעיות בדירה
      'תיקון', 'תיקונים', 'שיפוץ', 'צריך תיקון', 'לא תיקן',
      'נזק', 'נזקים', 'نزילה', 'نزילות', 'מים', 'ביוב',
      'עובש', 'לחות', 'טחב', 'ריח',
      'חימום', 'דוד שמש', 'חשמל', 'מים חמים', 'מזגן', 'לא עובד',
      'מקרר', 'תנור', 'מכשיר', 'מכשירים', 'מוצרי חמל',
      // תחזוקה
      'תחזוקה', 'תיקון', 'שיפוצים', 'לא מטפל', 'לא מתקן',
      'ועד בית', 'ועד', 'ועד הבית', 'הוצאות', 'דמי ניהול',
      // בעיות עם שכנים
      'שכן', 'שכנים', 'שכנה', 'רעש', 'רועשים', 'מפריעים',
      'הפרעה', 'הפרעות', 'מטרד', 'מטרדים',
      'ריח', 'ריחות', 'עישון', 'מעשנים',
      // סיום שכירות
      'לעזוב', 'עזבתי', 'סיום חוזה', 'סיום שכירות',
      'הארכה', 'הארכת חוזה', 'לא רוצה להאריך',
      // כללי
      'זכויות', 'זכויות דיירים', 'הגנת הדייר',
      'משרד השיכון', 'דירה מוגנת', 'מחיר למשתכן',
      'תביעה', 'לתבוע', 'צריך עזרה', 'עורך דין', 'בית משפט'
    ]
  },
];

interface CategoriesPageProps {
  onSelectCategory: (categoryId: string) => void;
}

interface SearchResult {
  text: string;
  categoryId: string;
  categoryTitle: string;
  categoryIcon: LucideIcon;
  categoryColor: string;
  relevance: number;
}

export function CategoriesPage({ onSelectCategory }: CategoriesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Create search results from keywords
  const getSearchResults = (): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];
    
    categories.forEach(cat => {
      cat.keywords.forEach(keyword => {
        if (keyword.includes(query)) {
          // Calculate relevance: exact match = 100, starts with = 50, contains = 25
          let relevance = 25;
          if (keyword === query) relevance = 100;
          else if (keyword.startsWith(query)) relevance = 50;
          
          results.push({
            text: keyword,
            categoryId: cat.id,
            categoryTitle: cat.title,
            categoryIcon: cat.icon,
            categoryColor: cat.color,
            relevance
          });
        }
      });
    });
    
    // Sort by relevance and limit to 10 results
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);
  };

  const searchResults = getSearchResults();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 pt-12">
      <div className="max-w-3xl w-full mx-auto text-center space-y-12">
        {/* Logo/Title */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex justify-center mb-8">
            <Logo size="xl" />
          </div>
          <p className="text-lg text-gray-600">
            לא בטוחים אם יש לכם קייס? ספרו לנו מה קרה, וקבלו הערכה ראשונית המבוססת על נתונים: נתוני הצלחה בתביעות דומות, ממוצעי פיצוי וסקירה של החוקים המרכזיים הרלוונטיים לתחום.
          </p>
        </div>

        {/* Search Bar - Google Style */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="מה המקרה שתרצו לבדוק?"
              className="w-full px-6 py-5 pr-14 bg-white rounded-full border-2 border-gray-300 md:hover:border-gray-400 focus:border-[#3700D0] focus:outline-none transition-all text-lg"
              style={{ direction: 'rtl' }}
            />
            <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </div>

        {/* Category Tags / Search Results */}
        <div className="space-y-6">
          {searchQuery.trim() ? (
            // Show search results
            searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">לא נמצאו תוצאות עבור &quot;{searchQuery}&quot;</p>
                <p className="text-sm text-gray-400">נסה לחפש: דוח, תאונה, שכירות, עבודה, או תביעה</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  נמצאו {searchResults.length} תוצאות רלוונטיות:
                </p>
                <div className="flex flex-col gap-2 max-w-2xl mx-auto">
                  {searchResults.map((result, index) => {
                    const IconComponent = result.categoryIcon;
                    return (
                      <button
                        key={`${result.categoryId}-${index}`}
                        onClick={() => onSelectCategory(result.categoryId)}
                        className="group relative px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white md:hover:border-gray-300 transition-all duration-200 flex items-center gap-4 text-right active:opacity-80"
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${result.categoryColor}15` }}
                        >
                          <IconComponent 
                            className="w-5 h-5" 
                            style={{ 
                              color: result.categoryColor,
                              transform: result.categoryId === 'traffic' ? 'scaleX(-1)' : undefined
                            }} 
                          />
                        </div>
                        <div className="flex-1 flex flex-col items-start">
                          <span className="text-gray-900 text-lg">{result.text}</span>
                          <span className="text-sm text-gray-500">בקטגוריה: {result.categoryTitle}</span>
                        </div>
                        <span 
                          className="text-sm px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${result.categoryColor}15`,
                            color: result.categoryColor
                          }}
                        >
                          {result.categoryTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )
          ) : (
            // Show category buttons when no search
            <>
              <p className="text-sm text-gray-500">או בחר קטגוריה:</p>
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => onSelectCategory(category.id)}
                      className="group relative px-6 py-3 rounded-full border-2 border-gray-200 bg-white md:hover:border-gray-300 transition-all duration-300 flex items-center gap-2 active:opacity-80"
                    >
                      <IconComponent 
                        className="w-5 h-5" 
                        style={{ 
                          color: category.color,
                          transform: category.id === 'traffic' ? 'scaleX(-1)' : undefined
                        }} 
                      />
                      <span className="text-gray-800 md:group-hover:text-gray-900 transition-colors">
                        {category.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed text-center">
              <span className="font-semibold text-gray-900">שימו לב: </span>
              השירות אינו ייעוץ משפטי. ההערכות מבוססות על ניתוח מקרים דומים ועל מידע ציבורי, ואינן מהוות תחליף לעורך דין.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}