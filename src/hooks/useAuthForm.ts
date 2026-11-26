'use client';

import React, { ChangeEvent, useState } from 'react';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export type AuthField = 'email' | 'password' | 'confirmPassword';

type AuthValues = Record<AuthField, string>;
type AuthErrors = Record<AuthField, boolean>;

const emptyValues: AuthValues = {
  email: '',
  password: '',
  confirmPassword: '',
};
const emptyErrors: AuthErrors = {
  email: false,
  password: false,
  confirmPassword: false,
};

interface useAuthFormProps {
  fields: AuthField[];
  submit: (values: AuthValues) => Promise<void>;
  validate?: (values: AuthValues) => {
    fields: AuthField[];
    message: string;
  } | null;
}

const getMessageFields = (
  message: string,
  fields: AuthField[],
): AuthField[] => {
  if (message.includes('email')) return ['email'];
  if (message.includes('пароли')) return ['confirmPassword'];
  if (message.includes('пароль')) return ['password'];
  return fields;
};

export const useAuthForm = ({ fields, submit, validate }: useAuthFormProps) => {
  const [values, setValues] = useState<AuthValues>(emptyValues);
  const [errors, setErrors] = useState<AuthErrors>(emptyErrors);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const clearErrors = () => {
    setErrors(emptyErrors);
    setErrorMessage('');
  };

  const markErrors = (fieldsToMark: AuthField[]) => {
    const next = { ...emptyErrors };
    fieldsToMark.forEach((field) => {
      next[field] = true;
    });
    setErrors(next);
  };

  const onChange =
    (field: AuthField) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      clearErrors();
    };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (loading) return;

    clearErrors();

    const emptyFields = fields.filter((field) => !values[field].trim());
    if (emptyFields.length) {
      markErrors(emptyFields);
      setErrorMessage('Заполните все поля');
      return;
    }

    const validationError = validate?.(values);
    if (validationError) {
      markErrors(validationError.fields);
      setErrorMessage(validationError.message);
      return;
    }

    setLoading(true);

    submit(values)
      .catch((error) => {
        const message = getApiErrorMessage(error);
        setErrorMessage(message);
        markErrors(getMessageFields(message, fields));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { values, errors, errorMessage, loading, onChange, onSubmit };
};
