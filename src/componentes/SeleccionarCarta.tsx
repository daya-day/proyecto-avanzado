import React, { useState } from 'react';
import type { CardProps } from './Card';
import CardDetail from './mazo';

interface SeleccionarCartaProps {
    cards: CardProps[];
    setCards: React.Dispatch<React.SetStateAction<CardProps[]>>;
    onCardClick: (card: CardProps) => void;
}

type BattleStage = 'SELECTION' | 'ARENA';

const SeleccionarCarta: React.FC<SeleccionarCartaProps> = ({ cards, setCards, onCardClick }) => {
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
    const [battleStage, setBattleStage] = useState<BattleStage>('SELECTION');
    const [combatLog, setCombatLog] = useState<string[]>([]);
    
    const [attacker, setAttacker] = useState<CardProps | null>(null);
    const [defenders, setDefenders] = useState<CardProps[]>([]);
    const [isAttackingAnimation, setIsAttackingAnimation] = useState(false);

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

    const handleGoToArena = () => {
        if (selectedCardIds.length < 2) return;

        const combatientes = cards.filter(card => selectedCardIds.includes(card.idCard));
        setAttacker(combatientes[0]);
        setDefenders(combatientes.slice(1));
        
        setCombatLog([`⚔️ Los combatientes han entrado al Portal. ${combatientes[0].name} se prepara para el asalto.`]);
        setBattleStage('ARENA');
    };

    const handleExecuteRound = () => {
        if (!attacker || defenders.length === 0) return;

        setIsAttackingAnimation(true);
        setTimeout(() => setIsAttackingAnimation(false), 500);

        let nuevosLogs: string[] = [];

        const mazoActualizado = cards.map(card => {
            const esDefensorObjetivo = defenders.some(d => d.idCard === card.idCard && d.lifePoints > 0);
            
            if (esDefensorObjetivo) {
                const dañoCalculado = attacker.attack - card.defense;
                const dañoReal = dañoCalculado > 0 ? dañoCalculado : 15;
                const nuevaVida = card.lifePoints - dañoReal;

                nuevosLogs.push(`💥 ${attacker.name} arremete contra ${card.name} infligiendo ${dañoReal} de daño.`);

                return {
                    ...card,
                    lifePoints: nuevaVida < 0 ? 0 : nuevaVida
                };
            }
            return card;
        });

        setDefenders(prev => prev.map(d => {
            const dañoCalculado = attacker.attack - d.defense;
            const dañoReal = dañoCalculado > 0 ? dañoCalculado : 15;
            const nuevaVida = d.lifePoints - dañoReal;
            return { ...d, lifePoints: nuevaVida < 0 ? 0 : nuevaVida };
        }));

        setCards(mazoActualizado);
        setCombatLog(prev => [...prev, ...nuevosLogs]);
    };

    const handleExitArena = () => {
        setBattleStage('SELECTION');
        setSelectedCardIds([]);
        setAttacker(null);
        setDefenders([]);
        setCombatLog([]);
    };


    if (battleStage === 'SELECTION') {
        return (
            <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gray-950/60 backdrop-blur-md rounded-2xl border-2 border-red-600/30 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/80 p-4 rounded-xl mb-8 border border-gray-800">
                    <div>
                        <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">Preparación de Combate</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Has marcado <span className="text-yellow-400 font-bold">{selectedCardIds.length}</span> {selectedCardIds.length === 1 ? 'carta' : 'cartas'} para enviar al combate.
                        </p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        {selectedCardIds.length > 0 && (
                            <button 
                                onClick={() => setSelectedCardIds([])}
                                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition uppercase font-bold"
                            >
                                Limpiar
                            </button>
                        )}
                        <button
                            onClick={handleGoToArena}
                            disabled={selectedCardIds.length < 2}
                            className={`px-6 py-2 rounded font-black uppercase tracking-wider text-xs transition-all ${
                                selectedCardIds.length >= 2
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                            }`}
                        >
                            ¡Iniciar Combate!
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {cards.map((card) => {
                        const isSelected = selectedCardIds.includes(card.idCard);
                        const estaMuerto = card.lifePoints <= 0;

                        return (
                            <div key={card.idCard} className="flex flex-col items-center relative">
                                <button
                                    onClick={(e) => handleToggleSelect(card.idCard, e)}
                                    disabled={estaMuerto}
                                    className={`w-full mb-3 py-1.5 px-4 rounded text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                                        isSelected
                                            ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                                            : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white'
                                    } ${estaMuerto ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {isSelected ? '✅ Seleccionada' : '⚔️ Seleccionar'}
                                </button>

                                <div className={`transition duration-300 ${isSelected ? 'scale-102 ring-2 ring-yellow-500 rounded-xl' : ''} ${estaMuerto ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                                    <CardDetail {...card} onCardClick={onCardClick} />
                                </div>

                                {estaMuerto && (
                                    <span className="absolute bottom-12 bg-black text-red-500 border border-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded">
                                        Derrotado
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gradient-to-br from-gray-900 via-purple-950 to-black rounded-3xl border-2 border-red-700 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            
            <div className="flex justify-between items-center border-b border-red-900/40 pb-4 mb-8">
                <div>
                    <span className="text-xs font-bold text-red-500 tracking-widest uppercase block">Fase Activa</span>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(220,38,38,0.5)]">
                        ¡El Upside Down Colisiona!
                    </h2>
                </div>
                <button 
                    onClick={handleExitArena}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                    🏳️ Retirarse / Volver
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
                
                <div className="lg:col-span-4 flex flex-col items-center bg-red-950/20 p-6 rounded-2xl border border-red-500/20">
                    <h3 className="text-sm font-black text-red-400 uppercase tracking-widest mb-4">Líder del Ataque</h3>
                    {attacker && (
                        <div className={`transform transition-transform duration-150 ${isAttackingAnimation ? 'translate-x-12 scale-110 z-10' : ''}`}>
                            <CardDetail {...attacker} onCardClick={() => {}} />
                            <div className="mt-4 w-full bg-gray-800 rounded-full h-2.5 overflow-hidden border border-gray-700">
                                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-center text-[11px] font-bold text-gray-400 mt-1">Vida intacta en Arena</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4 text-center">
                    <span className="text-6xl font-black text-red-600 tracking-tighter italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] animate-pulse">
                        VS
                    </span>
                    
                    {defenders.some(d => d.lifePoints > 0) ? (
                        <button
                            onClick={handleExecuteRound}
                            className="w-full max-w-[200px] bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_0_25px_rgba(220,38,38,0.6)] active:scale-95 transition-all cursor-pointer"
                        >
                            ⚡ ¡ATACAR!
                        </button>
                    ) : (
                        <div className="bg-yellow-600/20 border border-yellow-500 text-yellow-400 p-3 rounded-xl text-xs font-bold uppercase tracking-wide">
                            🏆 ¡Victoria Absoluta!
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col items-center bg-blue-950/20 p-6 rounded-2xl border border-blue-500/20">
                    <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-4">Línea Defensiva</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {defenders.map((defender) => {
                            const estaMuertoEnArena = defender.lifePoints <= 0;
                            const porcentajeVida = Math.max(0, (defender.lifePoints / 150) * 100); 

                            return (
                                <div key={defender.idCard} className={`flex flex-col items-center transition-all ${estaMuertoEnArena ? 'opacity-30 grayscale' : ''}`}>
                                    <div className="scale-90 pointer-events-none">
                                        <CardDetail {...defender} onCardClick={() => {}} />
                                    </div>
                                    
                                    <div className="w-32 bg-gray-800 rounded-full h-2 mt-2 overflow-hidden border border-gray-700">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${porcentajeVida > 40 ? 'bg-red-500' : 'bg-orange-600'}`} 
                                            style={{ width: `${estaMuertoEnArena ? 0 : porcentajeVida}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 mt-1">PV: {defender.lifePoints}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className="bg-black/80 rounded-xl p-4 border border-purple-900/40 font-mono text-xs max-h-[160px] overflow-y-auto shadow-inner">
                <p className="text-purple-400 font-bold mb-2 border-b border-purple-900/30 pb-1">📜 BITÁCORA DEL PORTAL:</p>
                <div className="flex flex-col gap-1.5">
                    {combatLog.map((log, index) => (
                        <p key={index} className="text-gray-300">
                            {log}
                        </p>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SeleccionarCarta;