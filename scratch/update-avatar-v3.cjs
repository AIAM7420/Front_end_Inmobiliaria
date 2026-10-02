const fs = require('fs');

// --- NavHeader.tsx ---
let navFile = 'src/components/organisms/NavHeader.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');

navContent = navContent.replace(
  /<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center text-inmo-accent font-bold">\s*<User className="w-5 h-5 text-inmo-accent" strokeWidth=\{2\} \/>\s*<\/div>/g,
  `<div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center">
                  <User className="w-6 h-6 text-white dark:text-gray-400" strokeWidth={1.5} />
                </div>`
);
fs.writeFileSync(navFile, navContent);

// --- AsesorProfileTemplate.tsx ---
let asesorFile = 'src/components/templates/AsesorProfileTemplate.tsx';
let asesorContent = fs.readFileSync(asesorFile, 'utf8');

const regexW28 = /<div className="relative cursor-pointer group">\s*<div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg">\s*<User className="w-12 h-12 text-inmo-accent" strokeWidth=\{1\.5\} \/>\s*<\/div>\s*<div className="absolute inset-0 bg-black\/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">\s*<Camera className="w-7 h-7 text-white" \/>\s*<\/div>\s*<div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-inmo-accent text-white flex items-center justify-center border-2 border-white dark:border-inmo-darkbg" title="Agente Verificado">\s*<Shield className="w-3\.5 h-3\.5" \/>\s*<\/div>\s*<\/div>/g;

const replacementW28 = `<div className="relative w-28 h-28 cursor-pointer group shrink-0">
                  <div className="w-full h-full rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-gray-50 dark:border-inmo-darkbg">
                    <User className="w-14 h-14 text-white dark:text-gray-400" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-inmo-accent text-white flex items-center justify-center border-[3px] border-gray-50 dark:border-inmo-darkbg shadow-sm z-10" title="Agente Verificado">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>`;

asesorContent = asesorContent.replace(regexW28, replacementW28);

const regexW14 = /<div className="relative w-14 h-14 rounded-full bg-inmo-secondary flex items-center justify-center border-2 border-white dark:border-inmo-darkbg overflow-hidden shrink-0">\s*<User className="w-7 h-7 text-inmo-accent" strokeWidth=\{2\} \/>\s*<div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-inmo-accent text-white flex items-center justify-center border border-white" title="Verificado">\s*<Shield className="w-2\.5 h-2\.5" \/>\s*<\/div>\s*<\/div>/g;

const replacementW14 = `<div className="relative w-14 h-14 shrink-0">
                  <div className="w-full h-full rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center border-2 border-gray-50 dark:border-inmo-darkbg overflow-hidden">
                    <User className="w-7 h-7 text-white dark:text-gray-400" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-inmo-accent text-white flex items-center justify-center border-2 border-gray-50 dark:border-inmo-darkbg shadow-sm z-10" title="Verificado">
                    <Shield className="w-3 h-3" />
                  </div>
                </div>`;

asesorContent = asesorContent.replace(regexW14, replacementW14);
fs.writeFileSync(asesorFile, asesorContent);

// --- PublicProfileTemplate.tsx ---
let publicFile = 'src/components/templates/PublicProfileTemplate.tsx';
let publicContent = fs.readFileSync(publicFile, 'utf8');

const regexPublic = /<div className="relative cursor-pointer group">\s*<div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg shadow-sm">\s*<User className="w-12 h-12 text-inmo-accent" strokeWidth=\{1\.5\} \/>\s*<\/div>\s*<div className="absolute inset-0 bg-black\/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">\s*<Camera className="w-7 h-7 text-white" \/>\s*<\/div>\s*<\/div>/g;

const replacementPublic = `<div className="relative w-28 h-28 cursor-pointer group shrink-0">
                  <div className="w-full h-full rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-gray-50 dark:border-inmo-darkbg shadow-sm">
                    <User className="w-14 h-14 text-white dark:text-gray-400" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>`;

publicContent = publicContent.replace(regexPublic, replacementPublic);
fs.writeFileSync(publicFile, publicContent);
