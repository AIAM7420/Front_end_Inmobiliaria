const fs = require('fs');
const file = 'src/components/templates/AsesorProfileTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useToast')) {
  content = content.replace(
    /import \{ useNavigate, useLocation \} from 'react-router-dom';/,
    "import { useNavigate, useLocation } from 'react-router-dom';\nimport { useToast } from '../../context/ToastContext';"
  );
}

if (!content.includes('const { addToast } = useToast();')) {
  content = content.replace(
    /const \{ logout \} = useAppContext\(\);/,
    "const { logout } = useAppContext();\n  const { addToast } = useToast();\n\n  const handleStripePortal = () => {\n    addToast('info', 'Portal Seguro', 'Redirigiendo a Stripe para gestionar tus pagos y facturas...');\n  };"
  );
}

content = content.replace(
  /<div className=\"flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors group\">\s*<div className=\"flex items-center gap-3\">\s*<FileText/g,
  '<div onClick={handleStripePortal} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors group"><div className="flex items-center gap-3"><FileText'
);

content = content.replace(
  /<span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">12\/28<\/span>\s*<\/div>\s*<\/div>/,
  '<span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">12/28</span></div><div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="p-4 bg-gray-50 dark:bg-inmo-darkbg/50"><Button variant="secondary" onClick={handleStripePortal} className="w-full justify-center !text-sm">Actualizar método de pago</Button></div></div>'
);

fs.writeFileSync(file, content);
