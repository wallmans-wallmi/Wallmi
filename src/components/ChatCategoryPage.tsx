import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Image as ImageIcon } from 'lucide-react';
import { LawyerRecommendation } from './LawyerRecommendation';
import { CHAT_TOPICS, ChatTopic } from '../lib/chatTopics';
import { FileUpload } from './FileUpload';
import { FieldConfirmation, ExtractedFields } from './FieldConfirmation';
import { IdentityForm } from './IdentityForm';
import { EscalationModal } from './EscalationModal';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  isTyping?: boolean;
  highlightWord?: string;
  highlightColor?: string;
  isFinalAnswer?: boolean;
  showCTA?: boolean;
}

interface ChatCategoryPageProps {
  categoryId: string;
  categoryTitle: string;
  categoryColor: string;
  onNavigateHome: () => void;
}

const welcomeMessages: { [key: string]: string[] } = {
  traffic: [
    'ברוכים הבאים ל-Wallmans AI – תעבורה',
    'כדי שאוכל להבין את המקרה שלכם, אצטרך לשאול אתכם מספר שאלות קצרות. בואו נתחיל'
  ],
  torts: [
    'ברוכים הבאים ל-Wallmans AI – נזיקין',
    'כדי שאוכל להבין את המקרה שלכם, אצטרך לשאול אתכם 4 שאלות קצרות. בואו נתחיל:'
  ],
  'small-claims': [
    'ברוכים הבאים ל-Wallmans AI – תביעות קטנות',
    'כדי שאוכל להבין את המקרה שלכם, אצטרך לשאול אתכם 4 שאלות קצרות. בואו נתחיל:'
  ],
  labor: [
    'ברוכים הבאים ל-Wallmans AI – דיני עבודה',
    'כדי שאוכל להבין את המקרה שלכם, אצטרך לשאול אתכם 4 שאלות קצרות. בואו נתחיל:'
  ],
  housing: [
    'ברוכים הבאים ל-Wallmans AI – דיור ושכירות',
    'כדי שאוכל להבין את המקרה שלכם, אצטרך לשאול אתכם 4 שאלות קצרות. בואו נתחיל:'
  ]
};

export function ChatCategoryPage({ categoryId, categoryTitle, categoryColor, onNavigateHome }: ChatCategoryPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string>>({});
  const [showLawyerRecommendation, setShowLawyerRecommendation] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [intakeComplete, setIntakeComplete] = useState(false);
  
  // New state for lead capture flow (traffic category)
  const [caseId, setCaseId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentCaseId');
    }
    return null;
  });
  const [flowType, setFlowType] = useState<'upload' | 'manual' | null>(null);
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);
  const [showFieldConfirmation, setShowFieldConfirmation] = useState(false);
  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [identityCollected, setIdentityCollected] = useState(false);
  const [manualQuestions, setManualQuestions] = useState([
    { id: 'm1', label: 'סוג הדוח', answer: '' },
    { id: 'm2', label: 'מתי ואיפה זה קרה? (תאריך, שעה, מיקום)', answer: '' },
    { id: 'm3', label: 'מה נרשם בדוח? (סכום ונקודות אם ידוע)', answer: '' },
    { id: 'm4', label: 'איך נמסר הדוח?', answer: '' },
    { id: 'm5', label: 'מה קרה בפועל לפי הגרסה שלכם?', answer: '' },
  ]);
  const [currentManualQuestion, setCurrentManualQuestion] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get topic config
  const topic: ChatTopic | undefined = CHAT_TOPICS.find(t => t.id === categoryId);
  const intakeQuestions = topic?.intakeQuestions || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-send welcome messages and first question
  useEffect(() => {
    const sendWelcomeMessages = async () => {
      const welcomeTexts = welcomeMessages[categoryId] || welcomeMessages.traffic;
      
      // Enable input after welcome messages
      setTimeout(() => {
        setWelcomeComplete(true);
      }, 1000);
      
      for (let i = 0; i < welcomeTexts.length; i++) {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
        
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `welcome-${i}`,
          text: welcomeTexts[i],
          sender: 'bot',
          timestamp: new Date(),
          highlightWord: i === 0 ? categoryTitle : undefined,
          highlightColor: i === 0 ? categoryColor : undefined
        }]);
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // For traffic category, show choice between upload and manual
      if (categoryId === 'traffic') {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsTyping(false);
        
        setMessages(prev => [...prev, {
          id: `choice-question`,
          text: 'איך תרצו להמשיך?',
          sender: 'bot',
          timestamp: new Date()
        }]);
        
        // Create case
        try {
          const response = await fetch('/api/cases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await response.json();
          if (data.ok && data.caseId) {
            setCaseId(data.caseId);
            if (typeof window !== 'undefined') {
              localStorage.setItem('currentCaseId', data.caseId);
            }
          }
        } catch (error) {
          console.error('Failed to create case:', error);
        }
      } else if (intakeQuestions.length > 0) {
        // For other categories, ask first question as before
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsTyping(false);
        
        setMessages(prev => [...prev, {
          id: `question-0`,
          text: intakeQuestions[0].label,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    };

    sendWelcomeMessages();
  }, [categoryId, categoryTitle, categoryColor, intakeQuestions]);

  // Helper function to call AI with current conversation
  const callAI = async (updatedIntakeAnswers: Record<string, string>, updatedMessages: Message[]) => {
    setIsWaitingForAI(true);
    setIsTyping(true);
    
    // Show "thinking..." message
    const thinkingMessage: Message = {
      id: `thinking-${Date.now()}`,
      text: 'מנתח את התשובות שלך...',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // Build messages array from conversation history
      // Include: user messages, AI responses (assistant), but exclude: typing indicators, intake questions, welcome messages
      const conversationMessages = updatedMessages
        .filter(m => {
          if (m.isTyping) return false;
          if (m.sender === 'user') return true;
          if (m.sender === 'bot') {
            // Include bot messages that are AI responses (not intake questions or welcome)
            return !m.id.startsWith('question-') && 
                   !m.id.startsWith('welcome-') && 
                   (m.isFinalAnswer !== undefined || m.text.length > 50); // AI responses are either marked or substantial
          }
          return false;
        })
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text
        }));

      // If this is the first AI call after intake, add a summary message
      // Otherwise, just use the conversation history
      let messagesToSend: Array<{ role: 'user' | 'assistant'; content: string }>;
      
      if (!intakeComplete && Object.keys(updatedIntakeAnswers).length === intakeQuestions.length) {
        // First AI call - add intake summary
        const intakeSummary = Object.entries(updatedIntakeAnswers)
          .map(([questionId, answer]) => {
            const question = intakeQuestions.find(q => q.id === questionId);
            return question ? `${question.label}: ${answer}` : `${questionId}: ${answer}`;
          })
          .join('\n');

        messagesToSend = [
          ...conversationMessages,
          {
            role: 'user' as 'user',
            content: `על בסיס התשובות לשאלות הקבלה, אנא ספק הערכה ראשונית:\n\n${intakeSummary}`
          }
        ];
      } else {
        // Follow-up call - use conversation as-is
        messagesToSend = conversationMessages;
      }

      // Call backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          topicId: categoryId,
          intakeAnswers: updatedIntakeAnswers
        }),
      });

      const data = await response.json();

      // Remove thinking message
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));
      setIsTyping(false);

      if (data.ok && data.content) {
        // Check if the AI response looks like a follow-up question or a final answer
        // If it ends with a question mark or contains question words, treat it as a follow-up
        const aiResponse = data.content.trim();
        const isQuestion = aiResponse.endsWith('?') || 
                          /^(מה|איפה|מתי|איך|למה|האם|כמה)/i.test(aiResponse) ||
                          aiResponse.length < 200; // Short responses are likely questions
        
        // Show AI response
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: data.content,
          sender: 'bot',
          timestamp: new Date(),
          isFinalAnswer: !isQuestion, // Only mark as final if it's not a question
          showCTA: !isQuestion // Only show CTA for final answers
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Show error message in Hebrew
        const errorText = data.errorMessage || 'לא הצלחתי להתחבר ל-AI כרגע, נסו שוב מאוחר יותר';
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          text: errorText,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      
      // Remove thinking message
      setMessages(prev => prev.filter(m => m.id !== thinkingMessage.id));
      setIsTyping(false);

      // Show error in Hebrew
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'לא הצלחתי להתחבר ל-AI כרגע, נסו שוב מאוחר יותר',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsWaitingForAI(false);
    }
  };

  // Handler for traffic category flow choice
  const handleFlowChoice = async (choice: 'upload' | 'manual') => {
    setFlowType(choice);
    
    if (choice === 'upload') {
      setMessages(prev => [...prev, {
        id: `user-choice-${Date.now()}`,
        text: 'להעלות את הדוח',
        sender: 'user',
        timestamp: new Date()
      }]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `upload-instruction`,
          text: 'אנא העלה את קובץ הדוח (PDF או תמונה)',
          sender: 'bot',
          timestamp: new Date()
        }]);
      }, 500);
    } else {
      setMessages(prev => [...prev, {
        id: `user-choice-${Date.now()}`,
        text: 'למלא ידנית',
        sender: 'user',
        timestamp: new Date()
      }]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `manual-question-0`,
          text: manualQuestions[0].label,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }, 500);
    }
  };

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    if (!caseId) return;
    
    setIsTyping(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`/api/cases/${caseId}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.ok && data.extractedFields) {
        setExtractedFields(data.extractedFields);
        setShowFieldConfirmation(true);
        setMessages(prev => [...prev, {
          id: `file-uploaded-${Date.now()}`,
          text: `קובץ הועלה בהצלחה: ${file.name}`,
          sender: 'user',
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.errorMessage || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('שגיאה בהעלאת הקובץ. נסה שוב.');
    } finally {
      setIsTyping(false);
    }
  };

  // Handler for field confirmation
  const handleFieldConfirm = async (fields: ExtractedFields) => {
    if (!caseId) return;
    
    try {
      const response = await fetch(`/api/cases/${caseId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setShowFieldConfirmation(false);
        setShowIdentityForm(true);
        setMessages(prev => [...prev, {
          id: `fields-confirmed-${Date.now()}`,
          text: 'פרטים אושרו',
          sender: 'user',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Confirm error:', error);
      alert('שגיאה באישור הפרטים. נסה שוב.');
    }
  };

  // Handler for identity submission
  const handleIdentitySubmit = async (data: { fullName: string; email: string }) => {
    if (!caseId) return;
    
    try {
      const response = await fetch(`/api/cases/${caseId}/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        setShowIdentityForm(false);
        setIdentityCollected(true);
        setIntakeComplete(true);
        
        // Now call AI with the case data
        const caseData = extractedFields || {};
        await callAI(caseData as Record<string, string>, messages);
      }
    } catch (error) {
      console.error('Identity error:', error);
      alert('שגיאה בשמירת הפרטים. נסה שוב.');
    }
  };

  // Handler for escalation
  const handleEscalation = async (data: { phone: string; consent: boolean }) => {
    if (!caseId) return;
    
    try {
      const response = await fetch(`/api/cases/${caseId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        setShowEscalationModal(false);
        alert('הפרטים נשלחו בהצלחה!');
      }
    } catch (error) {
      console.error('Escalation error:', error);
      alert('שגיאה בשליחת הפרטים. נסה שוב.');
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !welcomeComplete || isWaitingForAI) return;

    const trimmedInput = inputValue.trim();
    setInputValue('');

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const updatedMessages = [...messages, userMessage];

    // Handle traffic category flow
    if (categoryId === 'traffic' && !flowType) {
      if (trimmedInput.includes('העלה') || trimmedInput.includes('קובץ') || trimmedInput.includes('דוח')) {
        await handleFlowChoice('upload');
        return;
      } else if (trimmedInput.includes('ידנית') || trimmedInput.includes('מלא')) {
        await handleFlowChoice('manual');
        return;
      }
    }

    // Handle manual questions for traffic
    if (categoryId === 'traffic' && flowType === 'manual' && !identityCollected) {
      const updatedQuestions = [...manualQuestions];
      updatedQuestions[currentManualQuestion].answer = trimmedInput;
      setManualQuestions(updatedQuestions);
      
      if (currentManualQuestion < manualQuestions.length - 1) {
        const nextIndex = currentManualQuestion + 1;
        setCurrentManualQuestion(nextIndex);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: `manual-question-${nextIndex}`,
            text: manualQuestions[nextIndex].label,
            sender: 'bot',
            timestamp: new Date()
          }]);
        }, 800);
      } else {
        // All manual questions answered, show identity form
        setShowIdentityForm(true);
      }
      return;
    }

    // Check if we're still in intake phase (for non-traffic categories)
    const currentQuestion = intakeQuestions[currentQuestionIndex];
    if (currentQuestion && !intakeComplete && categoryId !== 'traffic') {
      // Still in intake - save answer and move to next question or call AI
      const newAnswers = { ...intakeAnswers, [currentQuestion.id]: trimmedInput };
      setIntakeAnswers(newAnswers);

      // Check if we've answered all 4 questions
      if (currentQuestionIndex < intakeQuestions.length - 1) {
        // Move to next question
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          
          setMessages(prev => [...prev, {
            id: `question-${nextIndex}`,
            text: intakeQuestions[nextIndex].label,
            sender: 'bot',
            timestamp: new Date()
          }]);
        }, 800);
      } else {
        // All 4 questions answered - mark intake as complete and call AI
        setIntakeComplete(true);
        await callAI(newAnswers, updatedMessages);
      }
    } else {
      // Intake is complete - this is a follow-up answer, call AI again
      await callAI(intakeAnswers, updatedMessages);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-gray-50" style={{ direction: 'rtl', height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div 
        className="px-4 py-3 border-b bg-white shadow-sm flex-shrink-0"
        style={{ borderBottomColor: categoryColor + '20' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{categoryTitle}</h2>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
              <span className="whitespace-nowrap">מה קרה?</span>
              <span style={{ color: categoryColor }}>←</span>
              <span className="whitespace-nowrap">הערכת סיכויים</span>
              <span style={{ color: categoryColor }}>←</span>
              <span className="whitespace-nowrap">פיצוי משוער</span>
              <span style={{ color: categoryColor }}>←</span>
              <span className="whitespace-nowrap font-medium" style={{ color: categoryColor }}>ויצאנו לדרך</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            // Process text to highlight specific word if needed
            let displayContent;
            if (message.highlightWord && message.text.includes(message.highlightWord)) {
              const parts = message.text.split(message.highlightWord);
              displayContent = (
                <>
                  {parts[0]}
                  <span className="font-bold" style={{ color: message.highlightColor }}>
                    {message.highlightWord}
                  </span>
                  {parts[1]}
                </>
              );
            } else {
              displayContent = message.text;
            }

            return (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.isFinalAnswer ? (
                  // Special styling for final answer
                  <div className="w-full max-w-[85%] md:max-w-[75%] bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-5 shadow-lg">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-purple-200">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: categoryColor + '20' }}>
                        <span className="text-lg">✓</span>
                      </div>
                      <h3 className="text-base text-gray-900">
                        בשורה טובה! הנה הנתונים ממקרים דומים
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {/* AI Response Content */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {displayContent}
                        </p>
                      </div>

                      {/* Disclaimer */}
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-300">
                        <div className="text-xs text-gray-700">
                          <strong className="text-gray-900">⚠️ שקיפות:</strong>
                          {' '}
                          חשוב! הנתונים הם סטטיסטיים בלבד ומתייחסים לעבר. זה אינו ייעוץ משפטי אישי. יש לפנות לעו״ד לבדיקה פרטנית.
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3 border border-purple-300">
                        <div className="text-sm text-gray-900">
                          <strong style={{ color: categoryColor }}>השורה התחתונה:</strong>
                          {' '}
                          שווה לבדוק לעומק. עו״ד מומחה יכול לתת לך תוכנית פעולה.
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    {message.showCTA && (
                      <button
                        onClick={() => {
                          if (categoryId === 'traffic') {
                            setShowEscalationModal(true);
                          } else {
                            setShowLawyerRecommendation(true);
                          }
                        }}
                        className="mt-4 w-full py-3 px-5 rounded-xl text-white transition-all hover:opacity-90 shadow-lg text-sm"
                        style={{ backgroundColor: categoryColor }}
                      >
                        <span>בדקו לי את התיק עם עו״ד מומחה</span>
                        <span className="mr-2">›</span>
                      </button>
                    )}
                    
                    <p className="text-xs mt-3 text-gray-400 text-center">
                      {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ) : (
                  // Regular message styling
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.sender === 'user'
                        ? 'text-white border-2'
                        : 'bg-white border-2 border-gray-100 text-gray-900'
                    }`}
                    style={{
                      backgroundColor: message.sender === 'user' ? categoryColor : undefined,
                      borderColor: message.sender === 'user' ? categoryColor : undefined
                    }}
                  >
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{displayContent}</p>
                    <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/80' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-4 py-3 bg-white border-2 border-gray-100 shadow-sm"
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: categoryColor, animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: categoryColor, animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: categoryColor, animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Choice buttons for traffic category */}
      {categoryId === 'traffic' && !flowType && welcomeComplete && (
        <div className="px-4 py-4 border-t bg-white">
          <div className="max-w-4xl mx-auto space-y-3">
            <button
              onClick={() => handleFlowChoice('upload')}
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: categoryColor }}
            >
              להעלות את הדוח
            </button>
            <button
              onClick={() => handleFlowChoice('manual')}
              className="w-full py-3 px-4 rounded-lg border-2 font-medium transition-all hover:bg-gray-50"
              style={{ borderColor: categoryColor, color: categoryColor }}
            >
              למלא ידנית
            </button>
          </div>
        </div>
      )}

      {/* File upload component */}
      {categoryId === 'traffic' && flowType === 'upload' && !showFieldConfirmation && !identityCollected && (
        <div className="px-4 py-4 border-t bg-white">
          <div className="max-w-4xl mx-auto">
            <FileUpload
              onUpload={handleFileUpload}
              categoryColor={categoryColor}
              disabled={isWaitingForAI}
            />
          </div>
        </div>
      )}

      {/* Field confirmation component */}
      {showFieldConfirmation && extractedFields && (
        <div className="px-4 py-4 border-t bg-white">
          <div className="max-w-4xl mx-auto">
            <FieldConfirmation
              fields={extractedFields}
              onConfirm={handleFieldConfirm}
              onEdit={(fields) => setExtractedFields(fields)}
              categoryColor={categoryColor}
            />
          </div>
        </div>
      )}

      {/* Identity form */}
      {showIdentityForm && (
        <div className="px-4 py-4 border-t bg-white">
          <div className="max-w-4xl mx-auto">
            <IdentityForm
              onSubmit={handleIdentitySubmit}
              categoryColor={categoryColor}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      {!showFieldConfirmation && !showIdentityForm && (categoryId !== 'traffic' || flowType !== 'upload' || identityCollected) && (
        <div className="border-t bg-white px-4 py-4 pb-20 md:pb-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {!welcomeComplete && (
              <div className="text-center text-sm text-gray-500 mb-3">
                רק שנייה...
              </div>
            )}
            
            <div className="flex items-end gap-2">
            {/* Voice Recording Button */}
            <button
              disabled={!welcomeComplete || isWaitingForAI}
              className="p-3 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: welcomeComplete && !isWaitingForAI ? categoryColor + '40' : undefined,
                color: welcomeComplete && !isWaitingForAI ? categoryColor : undefined
              }}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Image Upload Button */}
            <button
              disabled={!welcomeComplete || isWaitingForAI}
              className="p-3 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: welcomeComplete && !isWaitingForAI ? categoryColor + '40' : undefined,
                color: welcomeComplete && !isWaitingForAI ? categoryColor : undefined
              }}
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!welcomeComplete || isWaitingForAI}
                placeholder={welcomeComplete ? (isWaitingForAI ? "ממתין לתשובה..." : "הקלד תשובה...") : "ממתין..."}
                className="w-full px-4 py-3 pr-4 pl-12 rounded-full border-2 border-gray-300 focus:outline-none focus:border-opacity-60 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  borderColor: welcomeComplete && !isWaitingForAI ? categoryColor + '40' : undefined,
                  focusBorderColor: welcomeComplete && !isWaitingForAI ? categoryColor : undefined
                }}
              />
              
              {/* Send Button Inside Input */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || !welcomeComplete || isWaitingForAI}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: welcomeComplete && inputValue.trim() && !isWaitingForAI ? categoryColor : '#E5E7EB',
                  color: 'white'
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">
              השיחה מוצפנת ומאובטחת | אנחנו לא עורכי דין, אבל מספקים מידע ונתונים משפטיים רלוונטיים.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Lawyer Recommendation Modal */}
      {showLawyerRecommendation && (
        <LawyerRecommendation
          onClose={() => setShowLawyerRecommendation(false)}
          caseType={categoryTitle}
          onNavigateHome={onNavigateHome}
        />
      )}

      {/* Escalation Modal */}
      {categoryId === 'traffic' && (
        <EscalationModal
          open={showEscalationModal}
          onClose={() => setShowEscalationModal(false)}
          onSubmit={handleEscalation}
          categoryColor={categoryColor}
        />
      )}
    </div>
  );
}
