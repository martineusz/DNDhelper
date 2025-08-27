import React from 'react';
import { cn } from "../../lib/utils";

/**
 * A modal dialog that overlays the content.
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {function} props.onOpenChange - Callback function for when the open state changes.
 * @param {React.ReactNode} props.children - The content to be rendered inside the dialog.
 * @param {string} [props.className] - Optional class names to apply to the dialog overlay.
 */
function Dialog({ open, onOpenChange, children, className }) {
  if (!open) return null;

  return (
    <div
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50", className)}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
}

/**
 * The content area of the dialog.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered.
 * @param {string} [props.className] - Optional class names for styling.
 */
function DialogContent({ children, className, ...props }) {
  return (
    <div
      data-slot="dialog-content"
      className={cn("bg-background text-foreground rounded-lg p-6 shadow-lg", className)}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * The header section of the dialog.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered.
 * @param {string} [props.className] - Optional class names for styling.
 */
function DialogHeader({ children, className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * The title of the dialog.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered.
 * @param {string} [props.className] - Optional class names for styling.
 */
function DialogTitle({ children, className, ...props }) {
  return (
    <h3
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export { Dialog, DialogContent, DialogHeader, DialogTitle };