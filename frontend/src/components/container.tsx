// components/ProfileWizard.tsx

export const ProfileWizard: React.FC = () => {
  // ... (Hooks e estados mantidos iguais)

  const progressPercentage = (step / 5) * 100;

  return (
    // Fundo da Página: #174DAD (Azul Profundo)
    <div className="min-h-screen bg-[#174DAD] flex flex-col items-center py-8 px-4 font-sans transition-colors duration-500">
      
      {/* Header (Lado de fora do card) */}
      <div className="w-full max-w-2xl mb-6 text-white">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-lg opacity-90">Olá, Amanda! 👋</h1>
            <p className="font-semibold text-xl">Vamos personalizar seu treino</p>
          </div>
          <span className="font-mono text-lg text-[#E8FE61] font-bold">{step}/5</span>
        </div>
        
        {/* Barra de Progresso */}
        <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-[#E8FE61] shadow-[0_0_15px_#E8FE61] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* --- MUDANÇA AQUI: Card Interno agora é #5EA8E5 --- */}
      <div className="w-full max-w-4xl bg-[#5EA8E5] rounded-[2.5rem] shadow-2xl p-6 md:p-12 flex flex-col min-h-[600px] border border-white/10 relative overflow-hidden">
        
        {/* Efeito decorativo de fundo (opcional, para dar textura) */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* Área de Conteúdo */}
        <div className="flex-1 flex flex-col justify-center z-10">
           {step === 1 && (
             <GridSelectionStep
               title="Qual é o seu objetivo?"
               subtitle="Escolha o que melhor descreve sua meta principal"
               options={OBJECTIVE_OPTIONS}
               selectedId={formData.objective}
               onSelect={(id) => setFormData({ ...formData, objective: id as any })}
             />
           )}
           {/* Outros steps... */}
           {step === 5 && (
            <LimitationStep 
              value={formData.limitations}
              onChange={(v) => setFormData({ ...formData, limitations: v })}
            />
           )}
        </div>

        {/* Footer / Botão de Ação */}
        <div className="mt-12 pt-6 border-t border-white/20 z-10">
          <button
            onClick={handleNext}
            disabled={/* lógica de disabled */}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
              ${
                // Botão: Fundo Azul Escuro (#174DAD) para contrastar com o card Azul Claro
                // Texto: Branco ou Lima (#E8FE61)
                'bg-[#174DAD] hover:bg-[#133a85] text-white hover:text-[#E8FE61]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {step === 5 ? 'Finalizar' : 'Próximo'} 
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};