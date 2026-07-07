import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/battambang/400.css';
import '@fontsource/battambang/700.css';
import '@fontsource/moul/400.css';
import '@fontsource/kantumruy-pro/300.css';
import '@fontsource/kantumruy-pro/400.css';
import '@fontsource/kantumruy-pro/500.css';
import '@fontsource/kantumruy-pro/600.css';
import '@fontsource/kantumruy-pro/700.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import * as lucide from 'lucide';
import { initRouter, setAdminRouteHandler } from './router.js?v=54';
import { renderAdminShell } from './shell.js';

// Exposed globally so shared components (toast.js, modal.js, etc.) and page
// modules can call lucide.createIcons() after injecting markup. lucide 0.469
// dropped the auto-registered icon set, so createIcons() now needs `icons`
// passed explicitly -- wrap it here once instead of touching every call site.
window.lucide = {
  ...lucide,
  createIcons: (opts) => lucide.createIcons({ icons: lucide.icons, ...opts }),
};

setAdminRouteHandler(renderAdminShell);
initRouter();
