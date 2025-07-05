```
   git clone https://github.com/devg1120/mxgraph-es6-vite-es2-ok
   cd mxgraph-es6-vite-es2-ok/
   yarn
   npm run build
   npm run dev

   open http://127.0.0.1:3000/
```

## Tailwind CSS +  daisyUI

```
Tailwind CSS +  daisyUI

# npm install tailwindcss @tailwindcss/vite

# vi vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})


# npm install daisyui

# vi tailwind.config.js
module.exports = {
  plugins: [
    require('daisyui'),
  ],
}
```

app.css
```
@import "tailwindcss";
@plugin "daisyui";
```
