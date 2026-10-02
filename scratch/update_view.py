import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add state
state_search = "const [wizardStep, setWizardStep] = useState(0);"
state_replace = """const [wizardStep, setWizardStep] = useState(0);
  const [isWizardDirty, setIsWizardDirty] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);"""
content = content.replace(state_search, state_replace)

# Modify onClose of SplitViewLayout
onclose_search = """        onClose={() => {
          if (isCreating) {
            setSelectedId(null);
          }
          setViewMode('list');
        }}"""
onclose_replace = """        onClose={() => {
          if (isCreating && isWizardDirty) {
            setShowCancelModal(true);
          } else {
            if (isCreating) setSelectedId(null);
            setViewMode('list');
          }
        }}"""
content = content.replace(onclose_search, onclose_replace)

# Modify onCancel of PropertyCreatorWizard
oncancel_search = """          <PropertyCreatorWizard
            initialData={wizardDraft || undefined}
            onCancel={() => { setViewMode('list'); setSelectedId(null); }}"""
oncancel_replace = """          <PropertyCreatorWizard
            initialData={wizardDraft || undefined}
            onDirtyChange={setIsWizardDirty}
            onCancel={() => { 
              if (isWizardDirty) {
                setShowCancelModal(true);
              } else {
                setViewMode('list'); 
                setSelectedId(null); 
              }
            }}"""
content = content.replace(oncancel_search, oncancel_replace)

# Add ConfirmModal
render_search = """    </ModuleLayout>
  );
};"""
render_replace = """      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          setIsWizardDirty(false);
          setSelectedId(null);
          setViewMode('list');
        }}
        title="¿Descartar publicación?"
        description="Tienes información sin guardar en este formulario. Si sales ahora, perderás tu progreso."
        confirmText="Sí, salir"
        cancelText="Continuar editando"
        variant="danger"
      />
    </ModuleLayout>
  );
};"""
content = content.replace(render_search, render_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AsesorInventoryView.tsx")
