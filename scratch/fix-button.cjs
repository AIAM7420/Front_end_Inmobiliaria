const fs = require('fs');
const file = 'src/components/templates/AsesorProfileTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">12/28</span></div><div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" /><div className="p-4 bg-gray-50 dark:bg-inmo-darkbg/50"><Button variant="secondary" onClick={handleStripePortal} className="w-full justify-center !text-sm">Actualizar mActodo de pago</Button></div></div>`;

const replacement = `<span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">12/28</span>
              </div>
              <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />
              <div className="p-4 bg-gray-50 dark:bg-inmo-darkbg/50 flex justify-start">
                <Button variant="secondary" onClick={handleStripePortal} className="w-full sm:w-1/3 justify-center !py-2 !px-4 !text-sm">
                  Agregar método de pago
                </Button>
              </div>
            </div>`;

// Fallback if mActodo was already replaced or something
const regexTarget = /<span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-inmo-darkbg px-3 py-1 rounded-lg">12\/28<\/span><\/div><div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" \/><div className="p-4 bg-gray-50 dark:bg-inmo-darkbg\/50"><Button variant="secondary" onClick=\{handleStripePortal\} className="w-full justify-center !text-sm">.*?<\/Button><\/div><\/div>/;

if (content.includes(target)) {
  content = content.replace(target, replacement);
} else {
  content = content.replace(regexTarget, replacement);
}

fs.writeFileSync(file, content);
