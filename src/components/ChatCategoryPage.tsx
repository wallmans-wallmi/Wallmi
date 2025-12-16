import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Image as ImageIcon } from 'lucide-react';
import { LawyerRecommendation } from './LawyerRecommendation';
import { CHAT_TOPICS, ChatTopic } from '../lib/chatTopics';

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
    'כדי שאוכל להבין את המקרה שלכם, אצטרך לשאול אתכם 4 שאלות קצרות. בואו נתחיל:'
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

      // After welcome, ask first question
      if (intakeQuestions.length > 0) {
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

    // Check if we're still in intake phase
    const currentQuestion = intakeQuestions[currentQuestionIndex];
    if (currentQuestion && !intakeComplete) {
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
                        onClick={() => setShowLawyerRecommendation(true)}
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

      {/* Input Area */}
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

      {/* Lawyer Recommendation Modal */}
      {showLawyerRecommendation && (
        <LawyerRecommendation
          onClose={() => setShowLawyerRecommendation(false)}
          caseType={categoryTitle}
          onNavigateHome={onNavigateHome}
        />
      )}
    </div>
  );
}
