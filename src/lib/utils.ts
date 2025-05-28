import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { Theme } from './typeshare';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to display error messages in toast notifications
 *
 * @param error - The error to display
 * @param fallbackMessage - Optional fallback message when error is not an Error instance
 * @param toast - The toast instance
 * @returns {void}
 */
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

/**
 * Extracts the last segment from a string path.
 *
 * @param path - The path string to process
 * @param separator - The separator character (defaults to '/')
 * @returns {string} The last segment of the path
 *
 * @example
 * getLastPathSegment('/users/profiles/123') // returns '123'
 * getLastPathSegment('users/profiles/123') // returns '123'
 * getLastPathSegment('C:\\Users\\Documents', '\\') // returns 'Documents'
 * getLastPathSegment('/users/profiles/') // returns '' (empty string for trailing separator)
 */
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

/**
 * Determines whether dark mode is active, based on the given theme setting.
 *
 * - When `theme` is `Theme.Dark`, always returns `true`.
 * - When `theme` is `Theme.Light`, always returns `false`.
 * - When `theme` is `Theme.System`, queries the OS/browser preference
 *   (`prefers-color-scheme: dark`) and returns its current match.
 *
 * In a server-side or non-browser environment (where `window.matchMedia`
 * is unavailable), `Theme.System` will fall back to `false`.
 *
 * @param theme - The current application theme setting.
 * @returns `true` if dark mode should be applied, otherwise `false`.
 */
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
