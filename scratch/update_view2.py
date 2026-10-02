import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\views\asesor\AsesorInventoryView.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

render_search = """      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmVariant={confirmModal.confirmVariant}
        confirmText={confirmModal.confirmText}
        withDelay={confirmModal.withDelay}
        processingConfig={confirmModal.processingConfig}
      />
    </>
  );
};"""

render_replace = """      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmVariant={confirmModal.confirmVariant}
        confirmText={confirmModal.confirmText}
        withDelay={confirmModal.withDelay}
        processingConfig={confirmModal.processingConfig}
      />

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          setIsWizardDirty(false);
          setSelectedId(null);
          setViewMode('list');
        }}
        title="¿Descartar publicación?"
        message="Tienes información sin guardar en este formulario. Si sales ahora, perderás tu progreso."
        confirmText="Sí, salir"
        cancelText="Continuar editando"
        confirmVariant="danger"
      />
    </>
  );
};"""

content = content.replace(render_search, render_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Added ConfirmModal to AsesorInventoryView.tsx")
