const fs = require('fs');
let file = 'src/components/templates/AsesorProfileTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the badge from the main w-28 avatar
const mainBadgeRegex = /<div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-inmo-accent text-white flex items-center justify-center border-\[3px\] border-gray-50 dark:border-inmo-darkbg shadow-sm z-10" title="Agente Verificado">\s*<Shield className="w-4 h-4" \/>\s*<\/div>/g;
content = content.replace(mainBadgeRegex, '');

// Remove the badge from the w-14 side menu avatar
const sideBadgeRegex = /<div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-inmo-accent text-white flex items-center justify-center border-2 border-gray-50 dark:border-inmo-darkbg shadow-sm z-10" title="Verificado">\s*<Shield className="w-3 h-3" \/>\s*<\/div>/g;
content = content.replace(sideBadgeRegex, '');

fs.writeFileSync(file, content);
