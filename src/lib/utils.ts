import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to display error messages in toast notifications
 * @param error - The error to display
 * @param fallbackMessage - Optional fallback message when error is not an Error instance
 * @param toast - The toast instance
 */
export const displayError = (
  error: unknown,
  fallbackMessage = 'An unknown error occurred'
) => {
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
 * @returns The last segment of the path
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
