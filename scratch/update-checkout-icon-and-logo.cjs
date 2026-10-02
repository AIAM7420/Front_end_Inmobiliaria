const fs = require('fs');

const file = 'src/components/views/asesor/AsesorSubscription.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the "shadow" box behind the plan icon
const target1 = `<div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center text-inmo-accent shrink-0">
                {selectedPlan.icon}
              </div>`;
const replacement1 = `<div className="text-inmo-accent shrink-0">
                {selectedPlan.icon}
              </div>`;
content = content.replace(target1, replacement1);

// 2. Add Stripe Logo
const target2 = `<span className="font-inter text-xs text-gray-500 font-medium tracking-wide">PAGOS SEGUROS POR STRIPE</span>`;
const replacement2 = `<span className="font-inter text-xs text-gray-500 font-medium tracking-wide">PAGOS SEGUROS POR</span>
            <svg viewBox="0 0 60 25" className="h-[14px] w-auto text-gray-400 dark:text-gray-500" fill="currentColor">
              <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.62-1.08-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12 0V5.5h3.96l.03 1.06c.58-.53 1.52-1.25 3.12-1.25 3.5 0 5.36 2.59 5.36 7.22 0 4.62-1.83 7.76-5.43 7.76zm-.4-11.43c-1.81 0-2.73 1.26-2.73 3.55 0 2.37 1.05 3.73 2.76 3.73 1.76 0 2.7-1.4 2.7-3.66 0-2.37-.87-3.62-2.73-3.62zM28.06 5.5h4.12v14.65h-4.12V5.5zm0-4.71h4.12V4h-4.12V.79zM19.34 7.68a2.53 2.53 0 0 1 2.2-.84v-3.7A5.94 5.94 0 0 0 18.2 4.41l-.04-3.62h-3.9v19.36h4.01V12.18c0-2.4 1.25-4.5 3.07-4.5zM7.5 4.89c-1.12-.44-2.13-.7-3.08-.7-1.46 0-2.03.44-2.03 1.08 0 .66.75.9 2.06 1.3 2.52.8 4.24 1.93 4.24 4.09 0 3.28-2.5 4.63-5.98 4.63-1.63 0-3.32-.34-4.71-1V10.8c1.3.57 2.74.88 3.93.88 1.5 0 2.11-.47 2.11-1.13 0-.6-.56-.9-2.01-1.32-2.36-.7-4.29-1.92-4.29-4.1 0-2.88 2.53-4.44 5.74-4.44 1.4 0 2.89.26 4.01.76v3.44z" />
            </svg>`;
content = content.replace(target2, replacement2);

fs.writeFileSync(file, content);
