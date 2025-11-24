// components/Wizard

export const GridSelectionStep: React.FC<GridSelectionStepProps> = ({
  title, subtitle, options, selectedId, onSelect
}) => {
  return (
    <div className="animate-fade-in w-full">
      <div className="text-center mb-8">
        {/* Título Branco para contrastar com fundo #5EA8E5 */}
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-sm">{title}</h2>
        <p className="text-blue-50 font-medium opacity-90">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border-0 transition-all duration-200 h-44 group relative shadow-sm
                ${isSelected
                  ? 'bg-[#174DAD] text-white ring-4 ring-[#E8FE61]/50 shadow-xl scale-[1.02]' // Selecionado: Fundo Azul Escuro + Texto Branco
                  : 'bg-white text-[#174DAD] hover:bg-blue-50 hover:shadow-md' // Inativo: Fundo Branco + Texto Azul
                }
              `}
            >
              {/* Círculo do Ícone */}
              <div className={`
                mb-3 p-3 rounded-full transition-colors duration-300
                ${isSelected 
                  ? 'bg-white/20 text-[#E8FE61]' // Ícone no selecionado
                  : 'bg-[#5EA8E5]/10 text-[#3883CE]' // Ícone no inativo
                }
              `}>
                {option.icon}
              </div>
              
              <span className="font-bold text-lg mb-1">{option.label}</span>
              
              <span className={`text-sm font-normal opacity-80 ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                {option.description}
              </span>

              {/* Checkmark (Opcional) */}
              {isSelected && (
                <div className="absolute top-4 right-4 text-[#E8FE61]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};