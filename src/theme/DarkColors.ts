// src/theme/darkColors.ts

import { BaseColors } from "./Colors";



const DarkColors = {
    // ------------------ CORE THEME ------------------
    primary: BaseColors.blue["30"], // Lighter blue for better visibility on dark
    secondary: BaseColors.slate["30"],
    background: BaseColors.slate["90"],
    surface: BaseColors.slate["70"],

    // ------------------ TEXT HIERARCHY ------------------
    text: {
        primary: BaseColors.slate["10"],
        secondary: BaseColors.slate["30"],
        tertiary: BaseColors.slate["90"],
        disabled: BaseColors.slate["70"],
        inverted: BaseColors.slate["90"],
        link: BaseColors.blue["30"],
        onPrimary: BaseColors.slate["90"],
        onDark: BaseColors.slate["10"],
        onLight: BaseColors.slate["90"]
    },

    // ------------------ COMPLAINT TYPE SYSTEM ------------------
    complaints: {
        water: {
            main: BaseColors.special.cyan["30"],
            contrast: BaseColors.slate[90],
            icon: '💧'
        },
        fire: {
            main: BaseColors.vermilion["30"],
            contrast: BaseColors.slate["10"],
            icon: '🔥'
        },
        electric: {
            main: BaseColors.amber["30"],
            contrast: BaseColors.slate["90"],
            icon: '⚡'
        },
        road: {
            main: BaseColors.slate['50'],
            contrast: BaseColors.slate["10"],
            icon: '🛣️'
        },
        gas: {
            main: BaseColors.special.magenta["30"],
            contrast: BaseColors.slate[10],
            icon: '⚠️'
        },
        medical: {
            main: BaseColors.special.violet["30"],
            contrast: BaseColors.slate["10"],
            icon: '➕'
        },
        structural: {
            main: BaseColors.special.lime["30"],
            contrast: BaseColors.slate["90"],
            icon: '🏗️'
        }
    },

    // ------------------ STATUS SYSTEM ------------------
    status: {
        active: {
            main: BaseColors.blue["30"],
            contrast: BaseColors.slate["90"],
            pattern: 'solid'
        },
        pending: {
            main: BaseColors.amber["30"],
            contrast: BaseColors.slate["90"],
            pattern: 'diagonal-stripe'
        },
        resolved: {
            main: BaseColors.teal['30'],
            contrast: BaseColors.slate["90"],
            pattern: 'checkered'
        },
        cancelled: {
            main: BaseColors.slate["50"],
            contrast: BaseColors.slate["10"],
            pattern: 'cross-hatch'
        },
        critical: {
            main: BaseColors.vermilion["30"],
            contrast: BaseColors.slate["10"],
            pattern: 'zigzag'
        }
    },

    // ------------------ INTERACTIVE ELEMENTS ------------------
    buttons: {
        primary: {
            background: BaseColors.blue["30"],
            text: BaseColors.slate["90"],
            border: BaseColors.blue["30"],
            pressed: BaseColors.blue['50']
        },
        secondary: {
            background: BaseColors.slate['70'],
            text: BaseColors.slate['10'],
            border: BaseColors.slate['70'],
            pressed: BaseColors.slate["50"]
        },
        danger: {
            background: BaseColors.vermilion["30"],
            text: BaseColors.slate["90"],
            border: BaseColors.vermilion["30"],
            pressed: BaseColors.vermilion["50"]
        },
        disabled: {
            background: BaseColors.slate["70"],
            text: BaseColors.slate["50"],
            border: BaseColors.slate["70"],
            pressed: BaseColors.slate["70"]
        }
    },

    // ------------------ FORM ELEMENTS ------------------
    forms: {
        input: {
            background: BaseColors.slate["70"],
            border: BaseColors.slate["50"],
            text: BaseColors.slate["10"],
            placeholder: BaseColors.slate["30"],
            focused: BaseColors.blue["30"],
            valid: BaseColors.teal["30"],
            invalid: BaseColors.vermilion["30"]
        },
        checkbox: {
            active: BaseColors.blue["30"],
            inactive: BaseColors.slate["50"],
            check: BaseColors.slate["90"]
        },
        switch: {
            active: BaseColors.blue["30"],
            inactive: BaseColors.slate["50"],
            thumb: BaseColors.slate["10"]
        }
    },

    // ------------------ FEEDBACK MESSAGING ------------------
    feedback: {
        success: {
            background: BaseColors.teal["90"],
            text: BaseColors.teal["10"],
            icon: BaseColors.teal["30"]
        },
        warning: {
            background: BaseColors.amber["90"],
            text: BaseColors.vermilion["90"],
            icon: BaseColors.amber["30"]
        },
        error: {
            background: BaseColors.vermilion["90"],
            text: BaseColors.vermilion["10"],
            icon: BaseColors.vermilion["30"]
        },
        info: {
            background: BaseColors.blue["90"],
            text: BaseColors.blue["10"],
            icon: BaseColors.blue["30"]
        }
    },

    // ------------------ NAVIGATION ------------------
    navigation: {
        tabActive: BaseColors.blue["30"],
        tabInactive: BaseColors.slate["50"],
        headerBackground: BaseColors.slate["90"],
        headerText: BaseColors.slate["10"],
        drawerBackground: BaseColors.slate["90"],
        drawerText: BaseColors.slate["10"]
    },

    // ------------------ STATUSBAR ------------------
    statusbar: {
        barStyle: 'dark-content' as const,
        backgroundColor: BaseColors.slate["90"]
    }


    ,
    rang: {



        violet: BaseColors.special.violet["30"],
        cyan: BaseColors.special.cyan["30"],
        magenta: BaseColors.special.magenta["30"],

        lime: BaseColors.special.lime["30"],
        indigo: BaseColors.special.indigo["30"],
        teal: BaseColors.teal["30"],
        ocean: BaseColors.ocean["40"],
        sky: BaseColors.sky["40"],
        moss: BaseColors.moss["40"],
        rosewood: BaseColors.rosewood["40"],
        sunflower: BaseColors.sunflower["40"],
        clay: BaseColors.clay["40"],
        deropDown: "#84A5B3",
        dropdownButton: BaseColors.slate['30'],
        blackWhite: "white",
        background: "#0D1B2A",
        themeAnimation: "white",
        themeButton: BaseColors.sunflower["50"],

        boxBorder: "#A3A3A3",
        mediaContainer: "#192230",
        borderPlaceholder: "#7F8791"


    }
};

export default DarkColors;