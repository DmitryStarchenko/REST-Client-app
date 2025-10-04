'use client';

import { useState, useEffect } from 'react';

import { languageMap } from '@/constants';
import { encodeBase64 } from '@/utils';

import { UseBodyBlockProps, UseBodyBlockReturn } from '../types';

export const useBodyBlock = ({ bodyText, setBodyText }: UseBodyBlockProps): UseBodyBlockReturn => {
  const [bodyType, setBodyType] = useState<keyof typeof languageMap>('JSON');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleCopyBase64 = (): void => {
    const encoded = encodeBase64(bodyText || '');
    navigator.clipboard?.writeText(encoded);
  };

  const handlePrettifyJson = (): void => {
    try {
      if (bodyText.trim()) {
        const parsedJson = JSON.parse(bodyText);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        setBodyText(formattedJson);
        setJsonError(null);
      }
    } catch (err) {
      setJsonError((err as Error).message);
    }
  };

  useEffect(() => {
    if (bodyType === 'JSON') {
      try {
        if (bodyText.trim()) {
          JSON.parse(bodyText);
        }
        setJsonError(null);
      } catch (err) {
        setJsonError((err as Error).message);
      }
    } else {
      setJsonError(null);
    }
  }, [bodyText, bodyType]);

  const isJson = bodyType === 'JSON';
  const canPrettify = isJson && bodyText.trim() && !jsonError;

  return {
    bodyType,
    jsonError,
    isJson,
    canPrettify,
    setBodyType,
    handleCopyBase64,
    handlePrettifyJson,
  };
};
