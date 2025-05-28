import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { Theme } from './typeshare';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const displayError = (
  error: unknown,
  fallbackMessage = 'An unknown error occurred'
): void => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else if (typeof error === 'string') {
    toast.error(error);
  } else {
    toast.error(fallbackMessage);
  }
};

export const formatFilenameDate = (
  filename: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
): string => parseFilenameToDate(filename).toLocaleDateString('en-US', options);

export const getDateFilename = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}-${day}-${year}.md`;
};

export const getLastPathSegment = (
  path: string,
  separator: string = '/'
): string => {
  const trimmedPath = path.endsWith(separator) ? path.slice(0, -1) : path;

  if (trimmedPath.length === 0) {
    return '';
  }

  const lastSeparatorIndex = trimmedPath.lastIndexOf(separator);

  if (lastSeparatorIndex === -1) {
    return trimmedPath;
  }

  return trimmedPath.substring(lastSeparatorIndex + 1);
};

export const getTodayFilename = (): string => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const year = today.getFullYear().toString().slice(-2);
  return `${month}-${day}-${year}.md`;
};

export function isDarkMode(theme: Theme): boolean {
  switch (theme) {
    case Theme.Dark:
      return true;
    case Theme.Light:
      return false;
    case Theme.System:
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    default:
      return false;
  }
}

export const isToday = (filename: string): boolean =>
  filename === getTodayFilename();

export const parseFilenameToDate = (filename: string): Date => {
  const dateStr = filename.replace('.md', '');
  const [month, day, year] = dateStr.split('-');
  const fullYear = 2000 + parseInt(year);
  return new Date(fullYear, parseInt(month) - 1, parseInt(day));
};
