import { useState } from 'react';
import { Phone, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface EscalationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { phone: string; consent: boolean }) => Promise<void>;
  categoryColor: string;
}

export function EscalationModal({
  open,
  onClose,
  onSubmit,
  categoryColor,
}: EscalationModalProps) {
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phone: string) => {
    // Israeli phone format: 05X-XXXXXXX, +972-5X-XXXXXXX, or 0X-XXXX-XXXX
    const phoneRegex = /^(\+972|0)?[1-9]\d{8,9}$/;
    const cleaned = phone.replace(/[\s\-]/g, '');
    return phoneRegex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('מספר טלפון נדרש');
      return;
    }

    if (!validatePhone(phone)) {
      setError('מספר טלפון לא תקין. אנא הזן מספר ישראלי תקין');
      return;
    }

    if (!consent) {
      setError('יש לאשר את הסכמתך');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ phone: phone.trim(), consent });
      setPhone('');
      setConsent(false);
      onClose();
    } catch (error) {
      console.error('Escalation error:', error);
      setError('שגיאה בשליחת הפרטים. נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ direction: 'rtl' }}>
        <DialogHeader>
          <DialogTitle>אישור פרטים ליצירת קשר</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone size={16} />
              מספר טלפון *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05X-XXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: categoryColor }}
              required
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
              מאשר/ת שעורך הדין ייצור קשר
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: categoryColor }}
            >
              <Check size={16} />
              {isSubmitting ? 'שולח...' : 'שלח'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
