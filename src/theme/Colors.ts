// src/theme/colors.ts

/**
 * COLOR SYSTEM v2.0
 * Optimized for:
 * - All types of color blindness (protanopia, deuteranopia, tritanopia, monochromacy)
 * - WCAG AAA compliance where possible (minimum AA)
 * - Functional categorization
 * - Theme scalability
 * - Semantic variable naming
 */

// ==================== BASE COLOR PALETTE ====================
export const BaseColors = {
  // Primary Colors (Blue family - universally distinguishable)
  blue: {
    "10": '#E6F2FF',
    "30": '#99C7FF',
    "50": '#4D9BFF', // Primary brand color
    '70': '#0052CC',
    "90": '#002966',
  },

  // Secondary Colors (Slate family - neutral but distinct)
  slate: {
    "10": '#F8FAFC',
    '30': '#E2E8F0',
    '50': '#94A3B8',
    "70": '#475569',
    '90': '#1E293B'
  },

  // Success Colors (Teal family - distinguishable from red/green)
  teal: {
    '10': '#E6FFFA',
    "30": '#81E6D9',
    "50": '#38B2AC',
    "70": '#2C7A7B',
    "90": '#234E52'
  },

  // Warning Colors (Amber family - universal caution color)
  amber: {
    "10": '#FFFBEB',
    '30': '#FCD34D',
    "50": '#F59E0B',
    '70': '#B45309',
    "90": '#78350F'
  },

  // Error Colors (Vermilion family - distinct from greens)
  vermilion: {
    '10': '#FFEDEA',
    "30": '#FF9C8E',
    '50': '#F44336',
    "70": '#C62828',
    "90": '#8E0000'
  },

  // Special Colors (Unique hues for maximum differentiation)
  special: {
    cyan: {
      "30": '#67E8F9', // Lighter than 50, better contrast
      "50": '#06B6D4',
      "70": '#0E7490'
    },
    magenta: {
      "30": '#F472B6', // Softer pink, good visibility
      "50": '#DB2777',
      "70": '#9D174D'
    },
    violet: {
      "30": '#C4B5FD', // Lavender-like, high contrast
      "50": '#7C3AED',
      "70": '#5B21B6'
    },
    lime: {
      "30": '#D9F99D', // Pale green, clearly visible
      "50": '#84CC16',
      "70": '#4D7C0F'
    },
    indigo: {
      "30": '#A5B4FC', // Soft indigo, distinguishable
      "50": '#6366F1',
      "70": '#4338CA'
    },
  },


  ocean: {
    "20": '#D1EEFC', // light
    "40": '#76C1F1',
    "60": '#1E88E5', // medium
    "80": '#155A8A',
    "100": '#0D3C61'  // dark
  },

  // Clay family - earthy neutral, great for backgrounds
  clay: {
    "20": '#F4EDE4',
    "40": '#D2BA9C',
    "60": '#A18165',
    "80": '#6B4F3D',
    "100": '#3F2E25'
  },

  // Moss family - soft green, calm and color-blind safe
  moss: {
    "20": '#E3FCEC',
    "40": '#A8E6B1',
    "60": '#4CAF50',
    "80": '#2E7D32',
    "100": '#1B5E20'
  },

  // Rosewood family - reddish brown, not too saturated
  rosewood: {
    "20": '#FDECEC',
    "40": '#F4A3A3',
    "60": '#CC4B4C',
    "80": '#8A2C2D',
    "100": '#5A191A'
  },

  // Sky family - soft blue-violet tone
  sky: {
    "20": '#EBF0FF',
    "40": '#B1C5FF',
    "60": '#5C85FF',
    "80": '#3252A3',
    "100": '#1E3266'
  },

  // Sunflower family - vibrant but not too harsh yellow-orange
  sunflower: {
    "20": '#FFF7DC',
    "40": '#FFE180',
    "50": '#FFCD60EE',
    "60": '#FEC20E',
    "80": '#B58900',
    "100": '#664C00'
  }

};

// ==================== SEMANTIC COLOR MAPPING ====================
export const Colors = {
  // ------------------ CORE THEME ------------------
  primary: BaseColors.blue["50"],
  secondary: BaseColors.slate["50"],
  background: BaseColors.slate["10"],
  surface: BaseColors.slate["10"],

  // ------------------ TEXT HIERARCHY ------------------
  text: {
    primary: BaseColors.slate["90"],
    secondary: BaseColors.slate["70"],
    tertiary: BaseColors.slate["70"],
    disabled: BaseColors.slate["30"],
    inverted: BaseColors.slate["10"],
    link: BaseColors.blue["50"],
    onPrimary: BaseColors.slate["10"],
    onDark: BaseColors.slate["10"],
    onLight: BaseColors.slate['90']
  },

  // ------------------ COMPLAINT TYPE SYSTEM ------------------
  complaints: {
    // Using shape + color combinations
    water: {
      main: BaseColors.special.cyan["50"],
      contrast: BaseColors.slate["90"],
      icon: '💧' // Water droplet
    },
    fire: {
      main: BaseColors.vermilion["50"],
      contrast: BaseColors.slate["10"],
      icon: '🔥' // Flame
    },
    electric: {
      main: BaseColors.amber["50"],
      contrast: BaseColors.slate["90"],
      icon: '⚡' // Lightning bolt
    },
    road: {
      main: BaseColors.slate["70"],
      contrast: BaseColors.slate["10"],
      icon: '🛣️' // Road
    },
    gas: {
      main: BaseColors.special.magenta["50"],
      contrast: BaseColors.slate["10"],
      icon: '⚠️' // Warning
    },
    medical: {
      main: BaseColors.special.violet["50"],
      contrast: BaseColors.slate["10"],
      icon: '➕' // Medical cross
    },
    structural: {
      main: BaseColors.special.lime["50"],
      contrast: BaseColors.slate["90"],
      icon: '🏗️' // Building
    }
  },

  // ------------------ STATUS SYSTEM ------------------
  status: {
    // Using both color and pattern differentiation
    active: {
      main: BaseColors.blue["50"],
      contrast: BaseColors.slate["10"],
      pattern: 'solid'
    },
    pending: {
      main: BaseColors.amber["50"],
      contrast: BaseColors.slate["90"],
      pattern: 'diagonal-stripe'
    },
    resolved: {
      main: BaseColors.teal[50],
      contrast: BaseColors.slate["90"],
      pattern: 'checkered'
    },
    cancelled: {
      main: BaseColors.slate["50"],
      contrast: BaseColors.slate["10"],
      pattern: 'cross-hatch'
    },
    critical: {
      main: BaseColors.vermilion["50"],
      contrast: BaseColors.slate["10"],
      pattern: 'zigzag'
    }
  },

  // ------------------ INTERACTIVE ELEMENTS ------------------
  buttons: {
    primary: {
      background: BaseColors.blue["50"],
      text: BaseColors.slate["10"],
      border: BaseColors.blue["50"],
      pressed: BaseColors.blue["70"]
    },
    secondary: {
      background: BaseColors.slate["30"],
      text: BaseColors.slate["90"],
      border: BaseColors.slate["30"],
      pressed: BaseColors.slate["50"]
    },
    danger: {
      background: BaseColors.vermilion["50"],
      text: BaseColors.slate["10"],
      border: BaseColors.vermilion["50"],
      pressed: BaseColors.vermilion["70"]
    },
    disabled: {
      background: BaseColors.slate["30"],
      text: BaseColors.slate["50"],
      border: BaseColors.slate["30"],
      pressed: BaseColors.slate["30"]
    }
  },

  // ------------------ FORM ELEMENTS ------------------
  forms: {
    input: {
      background: BaseColors.slate["10"],
      border: BaseColors.slate["30"],
      text: BaseColors.slate["90"],
      placeholder: BaseColors.slate["50"],
      focused: BaseColors.blue["50"],
      valid: BaseColors.teal["50"],
      invalid: BaseColors.vermilion["50"]
    },
    checkbox: {
      active: BaseColors.blue["50"],
      inactive: BaseColors.slate["30"],
      check: BaseColors.slate["10"]
    },
    switch: {
      active: BaseColors.blue["50"],
      inactive: BaseColors.slate["50"],
      thumb: BaseColors.slate["10"]
    }
  },

  // ------------------ FEEDBACK MESSAGING ------------------
  feedback: {
    success: {
      background: BaseColors.teal["10"],
      text: BaseColors.teal["90"],
      icon: BaseColors.teal["50"]
    },
    warning: {
      background: BaseColors.amber["10"],
      text: BaseColors.vermilion["90"],
      icon: BaseColors.amber["50"]
    },
    error: {
      background: BaseColors.vermilion["10"],
      text: BaseColors.vermilion["90"],
      icon: BaseColors.vermilion["50"]
    },
    info: {
      background: BaseColors.blue["10"],
      text: BaseColors.blue["90"],
      icon: BaseColors.blue["50"]
    }
  },

  // ------------------ NAVIGATION ------------------
  navigation: {
    tabActive: BaseColors.blue["50"],
    tabInactive: BaseColors.slate["30"],
    headerBackground: BaseColors.slate["10"],
    headerText: BaseColors.slate["90"],
    drawerBackground: BaseColors.slate["10"],
    drawerText: BaseColors.slate["90"]
  },
  statusbar: {
    barStyle: 'light-content' as const,
    backgroundColor: BaseColors.slate["90"]
  },

  rang: {
    violet: BaseColors.special.violet["70"],
    cyan: BaseColors.special.cyan['70'],
    magenta: BaseColors.special.magenta['70'],
    lime: BaseColors.special.lime['70'],

    indigo: BaseColors.special.indigo['70'],
    teal: BaseColors.teal["70"],
    ocean: BaseColors.ocean["80"],
    sky: BaseColors.sky["80"],
    moss: BaseColors.moss["80"],
    rosewood: BaseColors.rosewood["80"],
    sunflower: BaseColors.sunflower["80"],
    clay: BaseColors.clay["80"],
    deropDown: "#84BFD6",
    dropdownButton: BaseColors.slate['30'],
    blackWhite: "black",
    background: "#F3F2F2",
    themeAnimation: "orange",
    themeButton: BaseColors.sunflower["60"],
    boxBorder: "#D6D6D6", mediaContainer: "#D3E8FF",
    borderPlaceholder: "#ffffff"


  }
};

