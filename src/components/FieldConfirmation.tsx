import { useState } from 'react';
import { Check, Edit2 } from 'lucide-react';

export interface ExtractedFields {
  fine_type?: string;
  date_time?: string;
  location?: string;
  amount?: string;
  points?: string;
  law_section?: string;
  vehicle_plate?: string;
  issuing_authority?: string;
}

interface FieldConfirmationProps {
  fields: ExtractedFields;
  onConfirm: (fields: ExtractedFields) => Promise<void>;
  onEdit: (fields: ExtractedFields) => void;
  categoryColor: string;
}

export function FieldConfirmation({
  fields,
  onConfirm,
  onEdit,
  categoryColor,
}: FieldConfirmationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<ExtractedFields>(fields);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(editedFields);
    } finally {
      setIsConfirming(false);
    }
  };

  const fieldLabels: Record<keyof ExtractedFields, string> = {
    fine_type: 'סוג הדוח',
    date_time: 'תאריך ושעה',
    location: 'מיקום',
    amount: 'סכום',
    points: 'נקודות',
    law_section: 'סעיף חוק',
    vehicle_plate: 'מספר רכב',
    issuing_authority: 'גורם מוציא',
  };

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 bg-white rounded-lg border-2" style={{ borderColor: categoryColor + '40' }}>
        <h3 className="font-semibold text-lg mb-4">עריכת פרטים</h3>
        {Object.entries(fieldLabels).map(([key, label]) => (
          <div key={key} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              type="text"
              value={editedFields[key as keyof ExtractedFields] || ''}
              onChange={(e) =>
                setEditedFields({ ...editedFields, [key]: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: categoryColor }}
            />
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditedFields(fields);
            }}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            ביטול
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
            }}
            className="flex-1 py-2 px-4 rounded-lg text-white"
            style={{ backgroundColor: categoryColor }}
          >
            שמור שינויים
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border-2" style={{ borderColor: categoryColor + '40' }}>
      <h3 className="font-semibold text-lg mb-4">פרטים שחולצו מהקובץ</h3>
      <div className="space-y-3">
        {Object.entries(fieldLabels).map(([key, label]) => {
          const value = fields[key as keyof ExtractedFields];
          if (!value) return null;
          return (
            <div key={key} className="flex justify-between items-start py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">{label}:</span>
              <span className="text-sm text-gray-900 text-right flex-1 mr-3">{value}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <Edit2 size={16} />
          עריכה
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirming}
          className="flex-1 py-2 px-4 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: categoryColor }}
        >
          <Check size={16} />
          {isConfirming ? 'מאשר...' : 'מאשר/ת'}
        </button>
      </div>
    </div>
  );
}
