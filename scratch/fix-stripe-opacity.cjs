const fs = require('fs');

const file = 'src/components/views/asesor/AsesorSubscription.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update the container opacity
const target1 = `<div className="flex items-center gap-2 opacity-50 order-2 sm:order-1 self-start sm:self-center">`;
const replacement1 = `<div className="flex items-center gap-2 opacity-70 order-2 sm:order-1 self-start sm:self-center">`;
content = content.replace(target1, replacement1);

// Update the image classes for better contrast and rendering
const target2 = `className="h-[16px] w-auto opacity-50 contrast-0 dark:contrast-100 dark:invert"`;
const replacement2 = `className="h-[18px] w-auto grayscale dark:grayscale-0 dark:invert ml-1"`;
content = content.replace(target2, replacement2);

fs.writeFileSync(file, content);
