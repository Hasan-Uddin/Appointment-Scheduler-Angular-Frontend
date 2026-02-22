export type InputType =
    | 'text' // Single-line text input
    | 'email' // Email address input
    | 'password' // Password input (masked characters)
    | 'tel' // Telephone number input
    | 'number' // Numeric input
    | 'url' // URL input
    | 'search' // Search input (special styling in some browsers)
    | 'date' // Date input
    | 'datetime-local' // Date and time input (local time zone)
    | 'month' // Month input
    | 'week' // Week input
    | 'time' // Time input
    | 'color' // Color picker
    | 'file' // File upload input
    | 'range' // Range slider
    | 'checkbox' // Checkbox input (checked/unchecked)
    | 'radio' // Radio button (grouped options)
    | 'submit' // Submit button
    | 'reset' // Reset button
    | 'button' // Generic button
    | 'hidden' // Hidden input (not visible)
    | 'image' // Image input (clickable image to submit a form)
    | 'datetime' // Full date and time input (deprecated in favor of datetime-local)
    | 'file' // File upload input
    | 'month' // Month picker
    | 'week' // Week picker
    | 'range' // Range (slider) input
    | 'search' // Search field input (search form field)
    | 'color' // Color picker input
    | 'image' // Image as button input
    | 'hidden' // Hidden input field
