const fs = require('fs');
const file = 'src/components/views/admin/AdminPublicationsView.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const newTd = `                          <td className={\`p-4 align-middle text-center \${isOpen ? 'hidden' : ''}\`}>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <IconButton variant="ghost" size="sm" icon={<Mail className="w-4 h-4 text-inmo-secondary dark:text-gray-400" />} title="Enviar Correo" onClick={(e) => { e.stopPropagation(); }} />
                              <IconButton variant="ghost" size="sm" icon={<MessageSquare className="w-4 h-4 text-inmo-secondary dark:text-gray-400" />} title="Enviar Mensaje" onClick={(e) => { e.stopPropagation(); }} />
                            </div>
                          </td>`.split('\n');

lines.splice(622, 6, ...newTd);
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed TD');
