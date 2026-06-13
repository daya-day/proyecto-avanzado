import React, { useState } from 'react';
import type { CardProps } from './Card';
import CardDetail from './mazo';

interface SeleccionarCartaProps {
    cards: CardProps[];
    setCards: React.Dispatch<React.SetStateAction<CardProps[]>>;
    onCardClick: (card: CardProps) => void;
}

const SeleccionarCarta: React.FC<SeleccionarCartaProps> = ({ cards, setCards, onCardClick }) => {
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
    const [battleReport, setBattleReport] = useState<string>("");

    const handleToggleSelect = (idCard: string, e: React.MouseEvent) => {
        e.stopPropagation(); 
        setSelectedCardIds((prev) => {
            if (prev.includes(idCard)) {
                return prev.filter(id => id !== idCard);
            } else {
                return [...prev, idCard];
            }
        });
    };

    const handleStartBattle = () => {
        if (selectedCardIds.length < 2) return;

        const combatientes = cards.filter(card => selectedCardIds.includes(card.idCard));
        const atacante = combatientes[0];
        
        let reporte = `⚔️ ¡Batalla Iniciada! ${atacante.name} lidera el ataque contra el grupo. \n`;

        const mazoActualizado = cards.map(card => {
            if (selectedCardIds.includes(card.idCard) && card.idCard !== atacante.idCard) {
                const dañoCalculado = atacante.attack - card.defense;
                const dañoReal = dañoCalculado > 0 ? dañoCalculado : 15; 
                const nuevaVida = card.lifePoints - dañoReal;

                reporte += `💥 ${atacante.name} golpea a ${card.name} reduciendo ${dañoReal} PV. \n`;

                return {
                    ...card,
                    lifePoints: nuevaVida < 0 ? 0 : nuevaVida
                };
            }
            return card;
        });

        setCards(mazoActualizado);
        setBattleReport(reporte);
        setSelectedCardIds([]); 
    };

    return (
        <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gray-950/60 backdrop-blur-md rounded-2xl border-2 border-red-600/30 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/80 p-4 rounded-xl mb-8 border border-gray-800">
                <div>
                    <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">Preparación de Combate</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Has seleccionado <span className="text-yellow-400 font-bold">{selectedCardIds.length}</span> {selectedCardIds.length === 1 ? 'carta' : 'cartas'} para pelear.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    {selectedCardIds.length > 0 && (
                        <button 
                            onClick={() => { setSelectedCardIds([]); setBattleReport(""); }}
                            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition uppercase font-bold"
                        >
                            Limpiar
                        </button>
                    )}
                    <button
                        onClick={handleStartBattle}
                        disabled={selectedCardIds.length < 2}
                        className={`px-6 py-2 rounded font-black uppercase tracking-wider text-xs transition-all ${
                            selectedCardIds.length >= 2
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                        }`}
                    >
                        ¡Iniciar Batalla!
                    </button>
                </div>
            </div>

            {battleReport && (
                <div className="mb-8 p-4 bg-black/80 border-l-4 border-red-600 rounded text-gray-300 font-mono text-xs whitespace-pre-line leading-relaxed">
                    {battleReport}
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-8">
                {cards.map((card) => {
                    const isSelected = selectedCardIds.includes(card.idCard);
                    const estaMuerto = card.lifePoints <= 0;

                    return (
                        <div key={card.idCard} className="flex flex-col items-center group relative">
                            
                            <button
                                onClick={(e) => handleToggleSelect(card.idCard, e)}
                                disabled={estaMuerto}
                                className={`w-full mb-3 py-1.5 px-4 rounded text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                                    isSelected
                                        ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                                        : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white'
                                } ${estaMuerto ? 'opacity-20 cursor-not-allowed' : ''}`}
                            >
                                {isSelected ? '✅ Seleccionada' : '⚔️ Seleccionar'}
                            </button>

                            <div className={`transition duration-300 relative ${isSelected ? 'scale-102 ring-2 ring-yellow-500 rounded-xl shadow-2xl' : ''} ${estaMuerto ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                                <CardDetail {...card} onCardClick={onCardClick} />
                            </div>

                            {estaMuerto && (
                                <span className="absolute bottom-12 bg-black text-red-500 border border-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded shadow-md">
                                    Derrotado
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SeleccionarCarta;