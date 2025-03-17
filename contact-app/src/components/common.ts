import { toast } from "react-toastify";

// Ensure these constants are properly defined somewhere in your code
declare const ToastTimeOut: number;
declare const ToastFadeOut: number;
declare const ToastTheme: string;

/**
 * Displays a success toast notification.
 * @param msg The message to display.
 * @param isReload If true, reloads the page after the toast closes.
 * @param navigationUrl If provided, navigates to this URL after the toast closes.
 */
export const toastSuccessPopup = (
  msg: string,
  isReload: boolean = false,
  navigationUrl: string = ""
): void => {
  toast.success(msg, {
    autoClose: ToastTimeOut, // `timeOut` should be `autoClose` in react-toastify
    theme: ToastTheme as any, // Ensure ToastTheme is a valid react-toastify theme
    onClose: () => {
      if (isReload) window.location.reload();
      if (hasValue(navigationUrl)) window.location.href = navigationUrl;
    },
  });
};

/**
 * Checks if a value is not null, undefined, or an empty string.
 * @param value The value to check.
 * @returns True if the value is non-empty, false otherwise.
 */
export const hasValue = (value: unknown): boolean => {
  return !(
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
};

/**
 * Formats a date string into MM/DD/YY format.
 * @param dateString The input date string.
 * @returns Formatted date string in "MM/DD/YY".
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Handle invalid date case
  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return "Invalid Date";
  }

  // Get the month, day, and year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2); // Get last two digits of the year

  return `${month}/${day}/${year}`;
};
