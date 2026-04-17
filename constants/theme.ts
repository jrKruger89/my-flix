/**
 * Theme Constants - Centralized design system for the application
 * Exports font families and color palette used throughout the app
 * Centralizing these values makes it easy to maintain consistent styling
 * and allows theme-wide changes from a single location
 */

/**
 * fonts - Font family configuration using K2D typeface from @expo-google-fonts
 * K2D is a geometric sans-serif font optimized for mobile interfaces
 * Three weights available: Regular (400), SemiBold (600), Bold (700)
 */
export const fonts = {
  // K2D-Regular: Standard font weight (400) for body text and default content
  // Used in: Most text elements, labels, descriptions
  regular: "K2D-Regular",

  // K2D-SemiBold: Medium-heavy font weight (600) for emphasis and subheadings
  // Used in: Secondary headings, emphasized text, tab labels
  semiBold: "K2D-SemiBold",

  // K2D-Bold: Heavy font weight (700) for important headings
  // Used in: Main titles, card headers, important CTAs
  bold: "K2D-Bold",
};

/**
 * colors - Color palette used throughout the application
 * Creates visual hierarchy and consistent brand experience
 * Dark theme optimized for mobile media consumption (AMOLED-friendly)
 */
export const colors = {
  // txtColor: Light text color for primary content
  // Used in: All text, labels, titles
  // Value: #F0F0F0 (Light gray - 94% brightness)
  // Provides high contrast on dark backgrounds for accessibility
  txtColor: "#F0F0F0",

  // bgColor: Primary background color
  // Used in: Screen backgrounds, containers, page backgrounds
  // Value: #202040 (Very dark blue - 12.5% brightness)
  // Low brightness reduces eye strain and improves battery life on OLED screens
  bgColor: "#202040",

  // accent1: Primary accent color for important interactive elements
  // Used in: Ratings, highlights, focus states, important metrics
  // Value: #B030B0 (Vibrant purple)
  // Stands out prominently against dark backgrounds for user attention
  accent1: "#B030B0",

  // accent2: Secondary accent color for additional visual hierarchy
  // Used in: Secondary highlights, decorative elements, alternative emphasis
  // Value: #602080 (Darker purple - complements accent1)
  // Provides variation while maintaining color harmony and theme cohesion
  accent2: "#602080",
};
