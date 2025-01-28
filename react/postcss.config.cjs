module.exports = {
  plugins: [
    require("autoprefixer"), // Adds vendor prefixes for compatibility
    require("postcss-nested"), // Supports nested CSS rules
    require("cssnano")(),
    require("tailwindcss"), // Add vendor prefixes for better browser support
  ],
};
