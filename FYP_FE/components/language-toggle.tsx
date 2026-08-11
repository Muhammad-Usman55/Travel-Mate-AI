'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 ${className}`}
      title={lang === 'en' ? 'Switch to Urdu' : 'انگریزی میں تبدیل کریں'}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4v2m0 4v2m5-10l4 4-4 4m-4-8H3" />
      </svg>
      {lang === 'en' ? 'اردو' : 'English'}
    </button>
  );
}
