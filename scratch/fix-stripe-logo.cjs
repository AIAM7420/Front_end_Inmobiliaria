const fs = require('fs');

const file = 'src/components/views/asesor/AsesorSubscription.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the bad SVG with a clean img tag
const targetRegex = /<svg viewBox="0 0 60 25"[\s\S]*?<\/svg>/;
const replacement = `<img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-[16px] w-auto opacity-50 contrast-0 dark:contrast-100 dark:invert" />`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(file, content);
