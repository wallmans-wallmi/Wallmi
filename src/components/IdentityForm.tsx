import { useState } from 'react';
import { Mail, User } from 'lucide-react';

interface IdentityFormProps {
  onSubmit: (data: { fullName: string; email: string }) => Promise<void>;
  categoryColor: string;
  initialName?: string;
  initialEmail?: string;
}

export function IdentityForm({
  onSubmit,
  categoryColor,
  initialName = '',
  initialEmail = '',
}: IdentityFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; email?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'שם מלא נדרש';
    }

    if (email && !validateEmail(email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ fullName: fullName.trim(), email: email.trim() });
    } catch (error) {
      console.error('Identity form error:', error);
      alert('שגיאה בשמירת הפרטים. נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border-2" style={{ borderColor: categoryColor + '40' }}>
      <h3 className="font-semibold text-lg mb-4">לפני שנמשיך, נצטרך כמה פרטים</h3>
      
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <User size={16} />
          שם מלא *
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ focusRingColor: categoryColor }}
          required
        />
        {errors.fullName && (
          <p className="text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mail size={16} />
          כתובת אימייל
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ focusRingColor: categoryColor }}
          placeholder="אופציונלי"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50"
        style={{ backgroundColor: categoryColor }}
      >
        {isSubmitting ? 'שומר...' : 'המשך'}
      </button>
    </form>
  );
}
