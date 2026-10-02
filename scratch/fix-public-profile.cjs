const fs = require('fs');
let file = 'src/components/templates/PublicProfileTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<UserCircle2 .*?\/>/, '<User className="w-12 h-12 text-inmo-accent" strokeWidth={1.5} />');
fs.writeFileSync(file, content);
