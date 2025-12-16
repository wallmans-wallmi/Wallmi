import { useState, useRef, useEffect } from 'react';
import { Upload, Send, Mic, Camera, Plus, X, File, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { LawyerRecommendation } from './LawyerRecommendation';

interface TrafficTicketChatProps {
  uploadMode: 'upload' | 'manual' | null;
  onBackToHome: () => void;
  onLogoClick: () => void;
  embedded?: boolean;
  currentStep?: number;
}

interface Message {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  suggestions?: string[];
  isThinking?: boolean;
  isFinalResponse?: boolean;
  statisticData?: {
    amount: string;
  };
  showCTA?: boolean;
}

const questions = [
  {
    id: 'date',
    question: 'מתי קרה האירוע שבגינו קיבלת את הדוח?',
    suggestions: ['לפני שבוע', 'לפני חודש', 'לפני 3 חודשים'],
    validate: (answer: string) => {
      if (!answer.trim()) return 'יש להזין תאריך';
      if (answer.trim().length < 3) return 'יש להזין תיאור תקין של התאריך';
      return null;
    }
  },
  {
    id: 'location',
    question: 'איפה זה קרה? (מיקום מדויק)',
    suggestions: ['בכביש 4', 'בעיר תל אביב', 'בצומת'],
    validate: (answer: string) => {
      if (!answer.trim()) return 'יש להזין מיקום';
      if (answer.trim().length < 2) return 'יש להזין מיקום תקין';
      return null;
    }
  },
  {
    id: 'violation',
    question: 'מה הדוח טוען? (למשל: חריגת מהירות, עצירה אסורה)',
    suggestions: ['חריגת מהירות', 'עצירה אסורה', 'חציית אור אדום'],
    validate: (answer: string) => {
      if (!answer.trim()) return 'יש לתאר את העבירה';
      if (answer.trim().length < 3) return 'יש להזין תיאור תקין';
      return null;
    }
  },
  {
    id: 'points',
    question: 'כמה נקודות רשום בדוח?',
    suggestions: ['2 נקודות', '4 נקודות', '6 נקודות'],
    validate: (answer: string) => {
      if (!answer.trim()) return 'יש להזין מספר נקודות';
      return null;
    }
  },
  {
    id: 'defense',
    question: 'מה ההגנה שלך? (תאר בקצרה למה אתה חושב שהדוח לא צודק)',
    suggestions: ['השלט לא היה גלוי', 'טעות במהירות', 'נסיבות חירום'],
    validate: (answer: string) => {
      if (!answer.trim()) return 'יש לתאר את ההגנה';
      if (answer.trim().length < 5) return 'יש להרחיב בתיאור ההגנה';
      return null;
    }
  }
];

export function TrafficTicketChat({ uploadMode, onBackToHome, onLogoClick, embedded, currentStep = 1 }: TrafficTicketChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showLawyerRecommendation, setShowLawyerRecommendation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const getStepStyle = (step: number) => {
    if (step < currentStep) {
      // Completed step
      return {
        circle: { 
          borderColor: '#3700D0', 
          backgroundColor: '#3700D0',
          color: 'white'
        },
        text: { color: '#2A2A2A' },
        line: { backgroundColor: '#3700D0' }
      };
    } else if (step === currentStep) {
      // Current step
      return {
        circle: { 
          borderColor: '#3700D0', 
          backgroundColor: 'white',
          color: '#3700D0'
        },
        text: { color: '#2A2A2A' },
        line: { backgroundColor: '#E5E7EB' }
      };
    } else {
      // Future step
      return {
        circle: { 
          borderColor: '#E5E7EB', 
          backgroundColor: 'white',
          color: '#9CA3AF'
        },
        text: { color: '#9CA3AF' },
        line: { backgroundColor: '#E5E7EB' }
      };
    }
  };

  useEffect(() => {
    // Initial message based on mode
    const initialMessage: Message = {
      id: '0',
      type: 'assistant',
      content: 'שלום! איך תרצה להתחיל?',
      suggestions: ['📤 העלה דוח', '📷 צלם דוח']
    };
    setMessages([initialMessage]);
  }, [uploadMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    // Validate current answer
    const currentQuestion = questions[currentQuestionIndex];
    const validationError = currentQuestion.validate(currentInput);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput
    };
    setMessages(prev => [...prev, userMessage]);

    // Save answer
    const newAnswers = { ...answers, [currentQuestion.id]: currentInput };
    setAnswers(newAnswers);
    setCurrentInput('');

    // Show thinking state
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'מנתח את התשובה...',
      isThinking: true
    };
    setMessages(prev => [...prev, thinkingMessage]);

    // Move to next question or finish
    setTimeout(() => {
      setMessages(prev => prev.filter(m => !m.isThinking));

      if (currentQuestionIndex < questions.length - 1) {
        const nextQuestion = questions[currentQuestionIndex + 1];
        const nextMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: nextQuestion.question,
          suggestions: nextQuestion.suggestions
        };
        setMessages(prev => [...prev, nextMessage]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Finished all questions - show final response with statistics
        const finalResponseMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: 'תודה על המידע המפורט. על בסיס הפרטים שמסרת, הנה מידע כללי רלוונטי:',
          isFinalResponse: true,
          statisticData: {
            amount: '12,500'
          },
          showCTA: true
        };
        setMessages(prev => [...prev, finalResponseMessage]);
      }
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Handle upload options
    if (suggestion === '📤 העלה דוח') {
      fileInputRef.current?.click();
      return;
    }
    
    if (suggestion === '📷 צלם דוח') {
      cameraInputRef.current?.click();
      return;
    }
    
    // Regular suggestions
    setCurrentInput(suggestion);
    setError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload and OCR processing
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `העלתי קובץ: ${file.name}`
      };
      setMessages(prev => [...prev, userMessage]);

      const thinkingMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'מעבד את התמונה ומזהה טקסט...',
        isThinking: true
      };
      setMessages(prev => [...prev, thinkingMessage]);

      setTimeout(() => {
        setMessages(prev => prev.filter(m => !m.isThinking));
        
        const analysisMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: 'מצוין! זיהיתי את פרטי הדוח. נראה שזה דוח חריגת מהירות, 4 נקדו, קנס של 1000 ש״ח.\n\nבואו נעמיק קצת בפרטים כדי לבדוק את סיכויי הערעור.'
        };
        setMessages(prev => [...prev, analysisMessage]);

        // Continue with first question
        setTimeout(() => {
          const firstQuestion: Message = {
            id: (Date.now() + 3).toString(),
            type: 'assistant',
            content: questions[0].question,
            suggestions: questions[0].suggestions
          };
          setMessages(prev => [...prev, firstQuestion]);
        }, 1000);
      }, 2500);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setCurrentInput('זה קרה בכביש 4 ליד תל אביב');
      }, 2000);
    }
  };

  return (
    <div className={embedded ? "h-full flex flex-col relative" : "min-h-screen flex flex-col bg-white relative"}>
      {/* Lawyer Recommendation Modal */}
      {showLawyerRecommendation && (
        <LawyerRecommendation
          onClose={() => setShowLawyerRecommendation(false)}
          caseType="ערעור על דוחות תנועה"
        />
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white px-4 py-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] md:max-w-[70%] px-4 py-3 ${
                    message.type === 'user' 
                      ? 'rounded-2xl rounded-br-md' 
                      : 'rounded-2xl rounded-bl-md'
                  }`}
                  style={{
                    backgroundColor: message.type === 'user' ? '#3700D0' : '#F5F5F5',
                    color: message.type === 'user' ? '#FFFFFF' : '#2A2A2A',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {message.isThinking ? (
                    <div className="flex items-center gap-2 py-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-line leading-relaxed">{message.content}</div>
                      
                      {/* Final Response: Statistics */}
                      {message.isFinalResponse && message.statisticData && (
                        <div className="mt-4 bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                          <p className="text-sm text-[#2A2A2A] mb-2">
                            <strong>במקרי תביעה דומים בתחום זה, הפיצוי הממוצע שניתן עמד על:</strong>
                          </p>
                          <p className="text-3xl text-[#3700D0] mb-1">
                            ₪{message.statisticData.amount}
                          </p>
                        </div>
                      )}
                      
                      {/* Final Response: Disclaimer */}
                      {message.isFinalResponse && (
                        <div className="mt-3 flex gap-2 items-start">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-600 leading-relaxed">
                            <strong>חשוב:</strong> מידע זה הוא סטטיסטי וכללי בלבד ואינו מהווה ייעוץ משפטי אישי. יש לפנות לעורך דין לבדיקה פרטנית.
                          </p>
                        </div>
                      )}
                      
                      {/* Final Response: CTA Button */}
                      {message.showCTA && (
                        <button
                          onClick={() => setShowLawyerRecommendation(true)}
                          className="mt-4 w-full py-3 px-4 rounded-xl text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: '#3700D0' }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            <span>מצא עורך דין רלוונטי</span>
                          </div>
                        </button>
                      )}
                      
                      {/* Timestamp */}
                      <div 
                        className={`text-[10px] mt-1 ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </>
                  )}
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2 max-w-[85%] md:max-w-[70%]">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-full transition-colors text-sm border border-gray-200 shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - ChatGPT Style - Fixed to Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 pb-8">
        {/* Security Notice */}
        <div className="max-w-3xl mx-auto mb-3">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>השיחה מוצפנת ומאובטחת. הפרטים שלך מוגנים ולא ישותפו עם צדדים שלישיים</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto flex justify-center">
          {error && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg whitespace-nowrap">
              <span>{error}</span>
            </div>
          )}

          {/* Input Container with Plus Button - Centered */}
          <div className="relative flex items-center gap-3 w-full max-w-2xl">
            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Plus Button - Gray Circle Background */}
            <div className="relative">
              <button
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className="p-3 rounded-full transition-colors flex-shrink-0 bg-gray-100 hover:bg-gray-200"
                title="הוסף קובץ"
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </button>

              {/* Upload Options Menu */}
              {showUploadOptions && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-10">
                  <button
                    onClick={() => {
                      cameraInputRef.current?.click();
                      setShowUploadOptions(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-right transition-colors"
                  >
                    <Camera className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">צלם דוח</span>
                  </button>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowUploadOptions(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-right transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">העלה תמונה</span>
                  </button>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowUploadOptions(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-right transition-colors"
                  >
                    <File className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">העלה קובץ</span>
                  </button>
                </div>
              )}
            </div>

            {/* Text Input Box with Mic/Send Inside */}
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              {/* Text Input */}
              <input
                type="text"
                value={currentInput}
                onChange={(e) => {
                  setCurrentInput(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="הקלד הודעה..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
              />

              {/* Mic or Send Button - Inside on the Left */}
              {!currentInput.trim() ? (
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                    isRecording ? 'bg-red-100' : 'hover:bg-gray-200'
                  }`}
                  title="הקלטה קולית"
                >
                  <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-gray-600'}`} />
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-full transition-all flex-shrink-0 hover:opacity-80"
                  style={{ backgroundColor: '#3700D0' }}
                  title="שלח"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}