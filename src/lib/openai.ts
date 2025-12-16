import OpenAI from 'openai';

// Create OpenAI client - server-side only
let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      const error = new Error('OPENAI_API_KEY is not set in environment variables') as Error & { code?: string };
      error.code = 'OPENAI_NOT_CONFIGURED';
      throw error;
    }
    
    client = new OpenAI({
      apiKey: apiKey
    });
  }
  
  return client;
}

export type OpenAIChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface AskOpenAIOptions {
  messages: OpenAIChatMessage[];
  topicId?: string;
  intakeAnswers?: Record<string, string>;
}

/**
 * Ask OpenAI a question with structured context
 * Returns the AI's response in Hebrew
 * 
 * @throws Error with code 'OPENAI_NOT_CONFIGURED' if API key is missing
 * @throws Error with code 'OPENAI_REQUEST_FAILED' if the request to OpenAI fails
 */
export async function askOpenAI(options: AskOpenAIOptions): Promise<string> {
  try {
    const openai = getClient();
    
    // Build system prompt based on topic and intake answers
    let systemPrompt = `אתה עוזר משפטי מקצועי בישראל. תפקידך לספק מידע כללי וסטטיסטי על מקרים משפטיים, מבלי לתת ייעוץ משפטי אישי.

חשוב:
- תמיד ציין שהמידע הוא כללי וסטטיסטי בלבד
- תמיד הזכר שזה לא מהווה ייעוץ משפטי אישי
- תמיד המליץ לפנות לעורך דין מומחה לבדיקה פרטנית
- השתמש בעברית בלבד
- היה מקצועי, ברור וסבלני`;

    if (options.topicId && options.intakeAnswers) {
      const topicNames: Record<string, string> = {
        'traffic': 'תעבורה',
        'torts': 'נזיקין',
        'small-claims': 'תביעות קטנות',
        'labor': 'דיני עבודה',
        'housing': 'דיור ושכירות'
      };
      
      const topicName = topicNames[options.topicId] || options.topicId;
      
      systemPrompt += `\n\nהנושא הוא: ${topicName}`;
      systemPrompt += `\n\nתשובות המשתמש לשאלות הקבלה:`;
      
      Object.entries(options.intakeAnswers).forEach(([questionId, answer]) => {
        systemPrompt += `\n- ${questionId}: ${answer}`;
      });
      
      systemPrompt += `\n\n=== הוראות חשובות להתנהגות ===

אתה עובד בשני שלבים:

שלב 1 - בדיקת שלמות המידע:
קודם כל, בדוק האם יש לך מספיק מידע כדי לתת תשובה מועילה ואחראית. שקול:
- האם כל הפרטים החיוניים קיימים? (למשל: זמן מדויק, מיקום, סוג העבירה, מספר נקודות, האם יש צילום/ראיות, וכו')
- האם יש פרטים חסרים שעלולים להשפיע משמעותית על ההערכה?

אם חסר מידע קריטי:
- אל תתן תשובה סופית בשלב זה
- שאל שאלת הבהרה אחת קצרה וברורה בעברית
- התמקד רק במה שבאמת חסר (למשל: "מה השעה המדויקת שבה קיבלת את הדוח?" או "האם יש לך צילום מהמקום?")
- אל תשאל שאלות כלליות - רק מה שבאמת חסר
- לאחר שהמשתמש יענה, תוכל לתת את התשובה הסופית

אם יש לך מספיק מידע:
- המשך לשלב 2

שלב 2 - מתן תשובה סופית:
אם יש לך מספיק מידע, ספק תשובה סופית מובנית בעברית הכוללת:
1. סיכום קצר של המצב
2. הסבר על הגורמים העיקריים שמשפיעים על סיכויי הערעור/הצלחה
3. הערכה איכותית גסה (למשל: נמוכה / בינונית / גבוהה - אם זה רלוונטי)
4. הצעה מה לעשות הלאה (למשל: האם לשקול לערער, לשלם, לפנות לעו״ד)
5. תזכורת עדינה שזה מידע כללי בלבד ולא ייעוץ משפטי רשמי

חשוב: תמיד הדגש שזה מידע כללי וסטטיסטי בלבד.`;
    }

    // Build messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...options.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      const error = new Error('No response from OpenAI') as Error & { code?: string };
      error.code = 'OPENAI_REQUEST_FAILED';
      throw error;
    }
    
    return response;
  } catch (error) {
    // If it's already an error with a code, re-throw it
    if (error instanceof Error && (error as Error & { code?: string }).code) {
      throw error;
    }
    
    // Handle missing API key
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      const err = new Error('OpenAI API key is missing. Please set OPENAI_API_KEY in .env.local') as Error & { code?: string };
      err.code = 'OPENAI_NOT_CONFIGURED';
      throw err;
    }
    
    // Handle OpenAI API errors
    if (error instanceof Error) {
      const err = new Error(`OpenAI request failed: ${error.message}`) as Error & { code?: string };
      err.code = 'OPENAI_REQUEST_FAILED';
      throw err;
    }
    
    // Unknown error
    const err = new Error('Unknown error occurred while calling OpenAI') as Error & { code?: string };
    err.code = 'OPENAI_REQUEST_FAILED';
    throw err;
  }
}

