const fs = require('fs');

let asesorFile = 'src/components/templates/AsesorProfileTemplate.tsx';
let asesorContent = fs.readFileSync(asesorFile, 'utf8');

const targetProfile = `<div className="relative cursor-pointer group">
                  <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg">
                    <User className="w-12 h-12 text-inmo-accent" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-inmo-accent text-white flex items-center justify-center border-2 border-white dark:border-inmo-darkbg" title="Agente Verificado">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                </div>`;

const replacementProfile = `<div className="relative w-28 h-28 cursor-pointer group shrink-0">
                  <div className="w-full h-full rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-gray-50 dark:border-inmo-darkbg">
                    <User className="w-14 h-14 text-white dark:text-gray-400" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-inmo-accent text-white flex items-center justify-center border-[3px] border-gray-50 dark:border-inmo-darkbg shadow-sm z-10" title="Agente Verificado">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                </div>`;

asesorContent = asesorContent.replace(targetProfile, replacementProfile);

// Also fix the NavHeader and PublicProfile templates to match
let publicFile = 'src/components/templates/PublicProfileTemplate.tsx';
let publicContent = fs.readFileSync(publicFile, 'utf8');
publicContent = publicContent.replace(
  /<div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg shadow-sm">/g,
  `<div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-gray-50 dark:border-inmo-darkbg shadow-sm">`
);
publicContent = publicContent.replace(
  /<User className="w-12 h-12 text-inmo-accent" strokeWidth={1.5} \/>/g,
  `<User className="w-14 h-14 text-white dark:text-gray-400" strokeWidth={1.5} />`
);
fs.writeFileSync(publicFile, publicContent);

let navFile = 'src/components/organisms/NavHeader.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');
navContent = navContent.replace(
  /<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center text-inmo-accent font-bold">/g,
  `<div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center text-white dark:text-gray-400 font-bold">`
);
navContent = navContent.replace(
  /<User className="w-5 h-5 text-inmo-accent" strokeWidth={2} \/>/g,
  `<User className="w-6 h-6 text-white dark:text-gray-400" strokeWidth={1.5} />`
);
fs.writeFileSync(navFile, navContent);

// And the side menu in AsesorProfileTemplate
const sideMenuTarget = `<div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center shrink-0 border-2 border-white dark:border-inmo-darkbg">
                    <User className="w-7 h-7 text-inmo-accent" strokeWidth={2} />
                  </div>`;
const sideMenuReplacement = `<div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-inmo-darktertiary flex items-center justify-center shrink-0 border-2 border-gray-50 dark:border-inmo-darkbg">
                    <User className="w-8 h-8 text-white dark:text-gray-400" strokeWidth={1.5} />
                  </div>`;
asesorContent = asesorContent.replace(sideMenuTarget, sideMenuReplacement);

fs.writeFileSync(asesorFile, asesorContent);
