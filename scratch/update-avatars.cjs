const fs = require('fs');

// 1. Update AsesorProfileTemplate
let asesorFile = 'src/components/templates/AsesorProfileTemplate.tsx';
let asesorContent = fs.readFileSync(asesorFile, 'utf8');

asesorContent = asesorContent.replace(
  /<span className=\"text-3xl font-montserrat font-bold text-white\">RE<\/span>/g,
  `<User className="w-12 h-12 text-white/80" strokeWidth={1.5} />`
);

asesorContent = asesorContent.replace(
  /<span className=\"text-xl font-montserrat font-bold text-white\">RE<\/span>/g,
  `<User className="w-7 h-7 text-white/80" strokeWidth={2} />`
);

// Ensure User is imported if not already. (Lucide usually imports User)
if (!asesorContent.includes('User,') && !asesorContent.includes('User ')) {
    asesorContent = asesorContent.replace(/import \{ /, 'import { User, ');
}

fs.writeFileSync(asesorFile, asesorContent);

// 2. Update PublicProfileTemplate
let publicFile = 'src/components/templates/PublicProfileTemplate.tsx';
let publicContent = fs.readFileSync(publicFile, 'utf8');

publicContent = publicContent.replace(
  /<UserCircle2 className="w-16 h-16 text-inmo-accent\/50" strokeWidth={1} \/>/g,
  `<User className="w-12 h-12 text-inmo-accent/50" strokeWidth={1.5} />`
);
fs.writeFileSync(publicFile, publicContent);

// 3. Update NavHeader
let navFile = 'src/components/organisms/NavHeader.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');

navContent = navContent.replace(
  /\{userInitials\}/g,
  `<User className="w-5 h-5 text-inmo-accent" strokeWidth={2} />`
);

// We should also remove the userInitials prop from NavHeader to clean up if we want, but it's fine to leave it.
if (!navContent.includes('User,') && !navContent.includes('User ')) {
    navContent = navContent.replace(/import \{ /, 'import { User, ');
}

fs.writeFileSync(navFile, navContent);
