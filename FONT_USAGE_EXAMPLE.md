# Font Usage Examples

This document shows how to use the included Hebrew fonts after installing the package.

## Automatic Usage (Recommended)

The easiest way is to simply import the component styles - the fonts will be automatically available:

```tsx
import Cal from 'react-vite-npm-heb-calendar';
import 'react-vite-npm-heb-calendar/styles';

function App() {
  return <Cal onSelectDate={(date) => console.log(date)} />;
}
```

## Manual Font Usage

If you need to use the Hebrew fonts in your own components:

### CSS Approach

```css
/* The fonts are already declared via @font-face in the package CSS */
.my-hebrew-component {
  font-family: 'Alef', Arial, sans-serif;
  direction: rtl; /* For Hebrew text direction */
}

.my-bold-hebrew {
  font-family: 'Alef bold', Arial, sans-serif;
}
```

### Direct Font File Access

If you need to reference the font files directly (for custom @font-face declarations):

```css
@font-face {
  font-family: 'MyCustomAlef';
  src: url('react-vite-npm-heb-calendar/dist/fonts/Alef/Alef-Regular.ttf') format('truetype');
  font-weight: normal;
}
```

## Build System Integration

### Vite
```js
// vite.config.js
export default {
  // Fonts should work automatically with Vite
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2']
}
```

### Webpack
```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      }
    ]
  }
}
```

## Font Files Included

- `Alef-Regular.ttf` - Regular weight Hebrew font
- `Alef-Bold.ttf` - Bold weight Hebrew font  
- `OFL.txt` - Open Font License

## Troubleshooting

If fonts don't load:

1. Ensure you've imported the package styles: `import 'react-vite-npm-heb-calendar/styles'`
2. Check that your bundler handles font assets correctly
3. Verify the font paths are resolved relative to the CSS file location
4. Check browser dev tools for 404 errors on font files

## License

The Alef fonts are licensed under the SIL Open Font License (OFL). See the included `OFL.txt` file for details.