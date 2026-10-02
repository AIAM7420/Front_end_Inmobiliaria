const fs = require('fs');

const file = 'src/components/views/asesor/AsesorSubscription.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace features array
content = content.replace(
  /features: \[\],/g,
  `features: ['Hasta 10 propiedades', 'Soporte estándar', 'Estadísticas básicas'],`
);

content = content.replace(
  /id: 'pro',[\s\S]*?features: \['Hasta 10 propiedades', 'Soporte estándar', 'Estadísticas básicas'\],/g,
  match => match.replace(
    /features: \['Hasta 10 propiedades', 'Soporte estándar', 'Estadísticas básicas'\],/,
    `features: ['Hasta 15 propiedades', 'Soporte prioritario', 'Estadísticas avanzadas', 'Destacar 3 propiedades'],`
  )
);

content = content.replace(
  /id: 'premium',[\s\S]*?features: \['Hasta 10 propiedades', 'Soporte estándar', 'Estadísticas básicas'\],/g,
  match => match.replace(
    /features: \['Hasta 10 propiedades', 'Soporte estándar', 'Estadísticas básicas'\],/,
    `features: ['Hasta 20 propiedades', 'Soporte 24/7', 'Estadísticas avanzadas', 'Destacar 10 propiedades', 'Herramientas IA exclusivas'],`
  )
);

content = content.replace(
  /id: 'basic',[\s\S]*?notIncluded: \[\],/g,
  match => match.replace(
    /notIncluded: \[\],/,
    `notIncluded: ['Destacar propiedades', 'Herramientas IA'],`
  )
);

content = content.replace(
  /id: 'pro',[\s\S]*?notIncluded: \[\],/g,
  match => match.replace(
    /notIncluded: \[\],/,
    `notIncluded: ['Herramientas IA'],`
  )
);

// Add rendering block
const renderFeatures = `                <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{plan.description}</p>
                
                {/* Features */}
                <div className="flex flex-col gap-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-inmo-accent shrink-0 mt-0.5" />
                      <span className="font-inter text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={'not-'+idx} className="flex items-start gap-2 opacity-50">
                      <X className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <span className="font-inter text-sm text-gray-500 dark:text-gray-400 line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}`;

content = content.replace(
  /<p className=\"font-inter text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed\">\{plan\.description\}<\/p>\s*\{\/\* CTA \*\/\}/g,
  renderFeatures
);

fs.writeFileSync(file, content);
