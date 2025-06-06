// utils/dimensions.ts
import { Dimensions, Platform, StatusBar, PixelRatio } from "react-native";

// Get initial dimensions
const screen = Dimensions.get("screen");
const window = Dimensions.get("window");

// System UI metrics
const statusBar = Platform.select({
  ios: window.height > window.width ? 44 : 0, // Better landscape handling
  android: StatusBar.currentHeight ?? 24,
});
const bottomNav = Math.max(0, screen.height - window.height - (statusBar || 0));

// Device classification
const isTablet = window.width >= 600;
const isSmall = window.width < 375;
const isMedium = window.width >= 375 && window.width < 414;
const isLarge = window.width >= 414;
const isPortrait = window.height >= window.width;

// Design reference (iPhone 11)
const DESIGN_WIDTH = 375;
const scaleFactor = window.width / DESIGN_WIDTH;

// Responsive scaling functions
const scaleSize = (size: number) => Math.round(size * scaleFactor);
const scaleFont = (size: number) => Math.round(size * scaleFactor);
const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scaleFactor));

// Spacing system (4px base)
const Spacing = {
  pico: scaleSize(1),
  nano: scaleSize(2),
  micro: scaleSize(4),
  tiny: scaleSize(8),
  small: scaleSize(12),
  medium: scaleSize(16),
  large: scaleSize(24),
  xlarge: scaleSize(32),
  xxlarge: scaleSize(48),
  mega: scaleSize(64),
  ultra: scaleSize(96),
};

// Border radius
const Radius = {
  none: 0,
  small: scaleSize(4),
  medium: scaleSize(8),
  large: scaleSize(12),
  xlarge: scaleSize(16),
  xxlarge: scaleSize(24),
  round: scaleSize(999),
};

// Standard dimensions
const Standard = {
  button: {
    height: scaleSize(48),
    smallHeight: scaleSize(36),
    borderWidth: scaleSize(1),
  },
  input: {
    height: scaleSize(48),
    borderWidth: scaleSize(1),
  },
  card: {
    padding: Spacing.medium,
  },
  header: {
    height: scaleSize(56),
  },
  icon: {
    small: scaleSize(16),
    medium: scaleSize(24),
    large: scaleSize(32),
  },
};

// Export everything in a clean structure
export const D = {
  // Dimensions
  sw: screen.width, // screen width
  sh: screen.height, // screen height
  ww: window.width, // window width
  wh: window.height, // window height

  // System metrics
  sb: statusBar, // status bar height
  bn: bottomNav, // bottom nav height
  safe: {
    top: statusBar,
    bottom: bottomNav,
    horizontal: Spacing.medium,
  },

  // Device info
  device: {
    tablet: isTablet,
    phone: !isTablet,
    small: isSmall,
    medium: isMedium,
    large: isLarge,
    portrait: isPortrait,
    landscape: !isPortrait,
  },

  // Platform
  platform: {
    ios: Platform.OS === "ios",
    android: Platform.OS === "android",
  },

  // Responsive helpers
  wp: (p: number) => window.width * (p / 100), // width percentage
  hp: (p: number) => window.height * (p / 100), // height percentage
  scaleSize,
  scaleFont,
  normalize,

  // Design system
  spacing: Spacing,
  radius: Radius,
  standard: Standard,
};

// Handle orientation changes
Dimensions.addEventListener(
  "change",
  ({ screen: newScreen, window: newWindow }) => {
    D.sw = newScreen.width;
    D.sh = newScreen.height;
    D.ww = newWindow.width;
    D.wh = newWindow.height;
    D.device.portrait = newWindow.height >= newWindow.width;
    D.device.landscape = !D.device.portrait;
  }
);
