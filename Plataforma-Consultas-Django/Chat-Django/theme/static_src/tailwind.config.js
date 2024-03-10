/**
 * This is a minimal config.
 *
 * If you need the full config, get it from here:
 * https://unpkg.com/browse/tailwindcss@latest/stubs/defaultConfig.stub.js
 */

module.exports = {
  content: [
    /**
     * HTML. Paths to Django template files that will contain Tailwind CSS classes.
     */

    /*  Templates within theme app (<tailwind_app_name>/templates), e.g. base.html. */
    "../templates/**/*.html",

    /*
     * Main templates directory of the project (BASE_DIR/templates).
     * Adjust the following line to match your project structure.
     */
    "../../templates/**/*.html",

    /*
     * Templates in other django apps (BASE_DIR/<any_app_name>/templates).
     * Adjust the following line to match your project structure.
     */
    "../../**/templates/**/*.html",

    /**
     * JS: If you use Tailwind CSS in JavaScript, uncomment the following lines and make sure
     * patterns match your project structure.
     */
    /* JS 1: Ignore any JavaScript in node_modules folder. */
    // '!../../**/node_modules',
    /* JS 2: Process all JavaScript files in the project. */
    // '../../**/*.js',

    /**
     * Python: If you use Tailwind CSS classes in Python, uncomment the following line
     * and make sure the pattern below matches your project structure.
     */
    // '../../**/*.py'
  ],
  theme: {
    extend: {
      colors: {
        space_cadet: {
          DEFAULT: "#2b2d42",
          100: "#08090d",
          200: "#11121a",
          300: "#191b27",
          400: "#222334",
          500: "#2b2d42",
          600: "#4a4d72",
          700: "#6d71a0",
          800: "#9da0bf",
          900: "#ced0df",
        },
        process_cyan: {
          DEFAULT: "#00b7f3",
          100: "#002531",
          200: "#004962",
          300: "#006e93",
          400: "#0093c4",
          500: "#00b7f3",
          600: "#2bcaff",
          700: "#60d7ff",
          800: "#95e4ff",
          900: "#caf2ff",
        },
        turquoise: {
          DEFAULT: "#02d6ae",
          100: "#002a23",
          200: "#015545",
          300: "#017f68",
          400: "#02aa8b",
          500: "#02d6ae",
          600: "#15fdd2",
          700: "#4ffddd",
          800: "#8afee9",
          900: "#c4fef4",
        },
        steel_pink: {
          DEFAULT: "#c25bc7",
          100: "#2a0f2b",
          200: "#541e57",
          300: "#7e2c82",
          400: "#a83bad",
          500: "#c25bc7",
          600: "#ce7cd2",
          700: "#da9ddd",
          800: "#e6bee9",
          900: "#f3def4",
        },
        "bright_pink_(crayola)": {
          DEFAULT: "#fe556a",
          100: "#430008",
          200: "#860110",
          300: "#c90118",
          400: "#fe0f2b",
          500: "#fe556a",
          600: "#fe7585",
          700: "#fe97a3",
          800: "#ffbac2",
          900: "#ffdce0",
        },
        amber: {
          DEFAULT: "#ffc108",
          100: "#352800",
          200: "#6a5000",
          300: "#9f7700",
          400: "#d49f00",
          500: "#ffc108",
          600: "#ffce3b",
          700: "#ffda6c",
          800: "#ffe79d",
          900: "#fff3ce",
        },
      },
      fontFamily: {
        onest: ["Onest", "sans-serif"],
      },
    },
  },
  plugins: [
    /**
     * '@tailwindcss/forms' is the forms plugin that provides a minimal styling
     * for forms. If you don't like it or have own styling for forms,
     * comment the line below to disable '@tailwindcss/forms'.
     */
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
