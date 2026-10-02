const fs = require('fs');
let navFile = 'src/components/organisms/NavHeader.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');

navContent = navContent.replace(
  /<User className="w-5 h-5 text-inmo-accent" strokeWidth=\{2\} \/>/g,
  `<User className="w-6 h-6 text-white dark:text-gray-400" strokeWidth={1.5} />`
);

fs.writeFileSync(navFile, navContent);
