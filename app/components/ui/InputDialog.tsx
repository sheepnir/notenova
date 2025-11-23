'use client';

import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import Button from './Button';

interface InputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  label?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  validate?: (value: string) => string | null; // Returns error message or null
}

export default function InputDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  label,
  placeholder = '',
  initialValue = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  validate,
}: InputDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset when initialValue changes (dialog reopens with new value)
  useEffect(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const handleConfirm = () => {
    // Validate
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onConfirm(value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} showCloseButton={false}>
      <div className="space-y-4">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-white-primary)]">
            {label}
          </label>
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-[var(--color-space-dark)] border border-[rgba(196,181,253,0.2)] rounded-lg text-[var(--color-white-primary)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-primary)] transition-all"
        />

        {error && (
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        )}

        <div className="flex items-center gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
