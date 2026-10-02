const fs = require('fs');

// --- AsesorProfileTemplate.tsx ---
let asesorFile = 'src/components/templates/AsesorProfileTemplate.tsx';
let asesorContent = fs.readFileSync(asesorFile, 'utf8');

// Fix 1: The background and icon color in AsesorProfileTemplate
asesorContent = asesorContent.replace(
  /<div className=\"w-28 h-28 rounded-full bg-inmo-secondary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg\">/g,
  `<div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg">`
);

asesorContent = asesorContent.replace(
  /<User className=\"w-12 h-12 text-white\/80\" strokeWidth=\{1\.5\} \/>/g,
  `<User className="w-12 h-12 text-inmo-accent" strokeWidth={1.5} />`
);

// Fix 2: The cut-off badge position
asesorContent = asesorContent.replace(
  /<div className=\"absolute -top-1 -right-1 w-7 h-7 rounded-full bg-inmo-accent/g,
  `<div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-inmo-accent`
);

// Fix 3: The side menu avatar in AsesorProfileTemplate
asesorContent = asesorContent.replace(
  /<div className=\"w-14 h-14 rounded-full bg-inmo-secondary flex items-center justify-center shrink-0 border-2 border-white dark:border-inmo-darkbg\">/g,
  `<div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center shrink-0 border-2 border-white dark:border-inmo-darkbg">`
);

asesorContent = asesorContent.replace(
  /<User className=\"w-7 h-7 text-white\/80\" strokeWidth=\{2\} \/>/g,
  `<User className="w-7 h-7 text-inmo-accent" strokeWidth={2} />`
);

fs.writeFileSync(asesorFile, asesorContent);

// --- PublicProfileTemplate.tsx ---
let publicFile = 'src/components/templates/PublicProfileTemplate.tsx';
let publicContent = fs.readFileSync(publicFile, 'utf8');

publicContent = publicContent.replace(
  /<div className=\"w-28 h-28 rounded-full bg-inmo-accent\/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg shadow-sm\">/g,
  `<div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center overflow-hidden border-4 border-white dark:border-inmo-darkbg shadow-sm">`
);

publicContent = publicContent.replace(
  /<User className=\"w-12 h-12 text-inmo-accent\/50\" strokeWidth=\{1\.5\} \/>/g,
  `<User className="w-12 h-12 text-inmo-accent" strokeWidth={1.5} />`
);

fs.writeFileSync(publicFile, publicContent);

// --- NavHeader.tsx ---
let navFile = 'src/components/organisms/NavHeader.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');

navContent = navContent.replace(
  /<div className=\"w-10 h-10 rounded-full bg-inmo-accent\/10 flex items-center justify-center text-inmo-accent font-bold\">/g,
  `<div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center text-inmo-accent font-bold">`
);

fs.writeFileSync(navFile, navContent);
