export interface IntakeQuestion {
  id: string;
  label: string;
}

export interface ChatTopic {
  id: string;
  title: string;
  intakeQuestions: IntakeQuestion[];
}

export const CHAT_TOPICS: ChatTopic[] = [
  {
    id: 'traffic',
    title: 'תעבורה',
    intakeQuestions: [
      {
        id: 'q1',
        label: 'מתי קרה האירוע שבגינו קיבלת את הדוח?'
      },
      {
        id: 'q2',
        label: 'איפה זה קרה? (מיקום מדויק)'
      },
      {
        id: 'q3',
        label: 'מה הדוח טוען? (למשל: חריגת מהירות, עצירה אסורה)'
      },
      {
        id: 'q4',
        label: 'כמה נקודות רשום בדוח?'
      }
    ]
  },
  {
    id: 'torts',
    title: 'נזיקין',
    intakeQuestions: [
      {
        id: 'q1',
        label: 'מתי קרה האירוע שגרם לנזק?'
      },
      {
        id: 'q2',
        label: 'איפה זה קרה? (מיקום מדויק)'
      },
      {
        id: 'q3',
        label: 'איזה סוג נזק נגרם לך? (פציעה, נזק לרכוש, וכו\')'
      },
      {
        id: 'q4',
        label: 'האם פנית לרופא או טיפלת בנזק? תאר בקצרה'
      }
    ]
  },
  {
    id: 'small-claims',
    title: 'תביעות קטנות',
    intakeQuestions: [
      {
        id: 'q1',
        label: 'מה קנית או איזה שירות קיבלת?'
      },
      {
        id: 'q2',
        label: 'מה הבעיה? תאר בקצרה מה לא תקין'
      },
      {
        id: 'q3',
        label: 'כמה שילמת? (סכום משוער)'
      },
      {
        id: 'q4',
        label: 'האם יש לך מסמכים שמעידים על הבעיה? (חשבונית, תמונות, התכתבות)'
      }
    ]
  },
  {
    id: 'labor',
    title: 'דיני עבודה',
    intakeQuestions: [
      {
        id: 'q1',
        label: 'כמה זמן עבדת במקום העבודה?'
      },
      {
        id: 'q2',
        label: 'מה היה תפקידך?'
      },
      {
        id: 'q3',
        label: 'מה קרה? (פיטורים, שכר שלא שולם, זכויות, וכו\')'
      },
      {
        id: 'q4',
        label: 'האם קיבלת מכתב פיטורים רשמי או מסמכים רלוונטיים?'
      }
    ]
  },
  {
    id: 'housing',
    title: 'דיור ושכירות',
    intakeQuestions: [
      {
        id: 'q1',
        label: 'האם אתה שוכר או משכיר?'
      },
      {
        id: 'q2',
        label: 'מה הבעיה? תאר בקצרה'
      },
      {
        id: 'q3',
        label: 'מתי זה התחיל?'
      },
      {
        id: 'q4',
        label: 'האם יש חוזה שכירות רשום? מה מצב הדירה כיום?'
      }
    ]
  }
];

