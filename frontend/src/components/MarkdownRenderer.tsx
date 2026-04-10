'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
// @ts-ignore -- isomorphic-dompurify types exist but exports resolution fails
import DOMPurify from 'isomorphic-dompurify';

/**
 * MarkdownRenderer Component
 * §4 XSS Protection: Sanitizes all user-submitted Markdown content
 * using DOMPurify before rendering to prevent stored XSS attacks.
 * Uses @tailwindcss/typography for styled prose output.
 */
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Sanitize Markdown input to strip any malicious HTML/scripts
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'ul', 'ol', 'li', 'blockquote',
      'code', 'pre', 'em', 'strong', 'del',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'br', 'hr',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target'],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <article className={`prose prose-slate max-w-3xl w-full mx-auto font-sans prose-code:font-mono p-4 md:p-8 ${className || ''}`}>
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{sanitizedContent}</ReactMarkdown>
    </article>
  );
}
