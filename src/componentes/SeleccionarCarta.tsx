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
    const [team1Ids, setTeam1Ids] = useState<string[]>([]);
    const [team2Ids, setTeam2Ids] = useState<string[]>([]); 
    
    const [battleStage, setBattleStage] = useState<BattleStage>('SELECTION');
    const [combatLog, setCombatLog] = useState<string[]>([]);
    
    const [team1Cards, setTeam1Cards] = useState<CardProps[]>([]);
    const [team2Cards, setTeam2Cards] = useState<CardProps[]>([]);
    const [activeAttackerTeam, setActiveAttackerTeam] = useState<1 | 2>(1); // Define quién da el siguiente golpe

    const handleToggleSelect = (idCard: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const inTeam1 = team1Ids.includes(idCard);
        const inTeam2 = team2Ids.includes(idCard);

        if (inTeam1) {
            setTeam1Ids(prev => prev.filter(id => id !== idCard));
            return;
        }
        if (inTeam2) {
            setTeam2Ids(prev => prev.filter(id => id !== idCard));
            return;
        }

        if (team1Ids.length + team2Ids.length >= 6) return; // Límite absoluto de 6 cartas (3 vs 3)

        if (team1Ids.length <= team2Ids.length && team1Ids.length < 3) {
            setTeam1Ids(prev => [...prev, idCard]);
        } else if (team2Ids.length < 3) {
            setTeam2Ids(prev => [...prev, idCard]);
        }
    };

    const handleStartBattleStage = () => {
        if (team1Ids.length !== 3 || team2Ids.length !== 3) return;

        setTeam1Cards(cards.filter(c => team1Ids.includes(c.idCard)));
        setTeam2Cards(cards.filter(c => team2Ids.includes(c.idCard)));
        
        setCombatLog(['⚔️ ¡La Arena de Combate 3 VS 3 se ha abierto! El Equipo 1 inicia con la iniciativa.']);
        setBattleStage('ARENA');
        setActiveAttackerTeam(1);
    };

    const handleExecuteRound = () => {
        const vivosT1 = team1Cards.filter(c => c.lifePoints > 0);
        const vivosT2 = team2Cards.filter(c => c.lifePoints > 0);

        if (vivosT1.length === 0 || vivosT2.length === 0) return;

        let nuevosLogs: string[] = [];

        if (activeAttackerTeam === 1) {
            const atacante = vivosT1[0];
            const objetivo = vivosT2[0];

            const daño = Math.max(15, atacante.attack - objetivo.defense);
            
            setTeam2Cards(prev => prev.map(c => {
                if (c.idCard === objetivo.idCard) {
                    const nv = c.lifePoints - daño;
                    return { ...c, lifePoints: nv < 0 ? 0 : nv };
                }
                return c;
            }));

            setCards(prevGlobal => prevGlobal.map(c => {
                if (c.idCard === objetivo.idCard) {
                    const nv = c.lifePoints - daño;
                    return { ...c, lifePoints: nv < 0 ? 0 : nv };
                }
                return c;
            }));

            nuevosLogs.push(`🔴 [Equipo 1] ${atacante.name} atacó a ${objetivo.name} causando ${daño} de daño.`);
            setActiveAttackerTeam(2); 
        } else {
            const atacante = vivosT2[0];
            const objetivo = vivosT1[0];

            const daño = Math.max(15, atacante.attack - objetivo.defense);

            setTeam1Cards(prev => prev.map(c => {
                if (c.idCard === objetivo.idCard) {
                    const nv = c.lifePoints - daño;
                    return { ...c, lifePoints: nv < 0 ? 0 : nv };
                }
                return c;
            }));

            setCards(prevGlobal => prevGlobal.map(c => {
                if (c.idCard === objetivo.idCard) {
                    const nv = c.lifePoints - daño;
                    return { ...c, lifePoints: nv < 0 ? 0 : nv };
                }
                return c;
            }));

            nuevosLogs.push(`🔵 [Equipo 2] ${atacante.name} contraatacó a ${objetivo.name} causando ${daño} de daño.`);
            setActiveAttackerTeam(1); // Devuelve el turno
        }

        setCombatLog(prev => [...prev, ...nuevosLogs]);
    };

    const handleExitArena = () => {
        setBattleStage('SELECTION');
        setTeam1Ids([]);
        setTeam2Ids([]);
        setTeam1Cards([]);
        setTeam2Cards([]);
        setCombatLog([]);
    };

    const totalSeleccionadas = team1Ids.length + team2Ids.length;

    if (battleStage === 'SELECTION') {
        return (
            <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gray-950/60 backdrop-blur-md rounded-2xl border-2 border-red-600/30 shadow-2xl">
                
                {/* Cuadro de mando superior */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-900/80 p-5 rounded-xl mb-8 border border-gray-800">
                    <div>
                        <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">Estrategia 3 VS 3</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Las cartas se asignarán una a una a cada bando. Total listas: <span className="text-yellow-400 font-bold">{totalSeleccionadas} / 6</span>
                        </p>
                        <div className="flex gap-4 mt-2 text-[11px] font-mono">
                            <span className="text-red-400">🔴 Equipo 1: {team1Ids.length}/3</span>
                            <span className="text-blue-400">🔵 Equipo 2: {team2Ids.length}/3</span>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto justify-end">
                        {totalSeleccionadas > 0 && (
                            <button 
                                onClick={() => { setTeam1Ids([]); setTeam2Ids([]); }}
                                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition uppercase font-bold cursor-pointer"
                            >
                                Limpiar
                            </button>
                        )}
                        <button
                            onClick={handleStartBattleStage}
                            disabled={team1Ids.length !== 3 || team2Ids.length !== 3}
                            className={`px-6 py-2 rounded font-black uppercase tracking-wider text-xs transition-all ${
                                team1Ids.length === 3 && team2Ids.length === 3
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
                        const isT1 = team1Ids.includes(card.idCard);
                        const isT2 = team2Ids.includes(card.idCard);
                        const estaMuerto = card.lifePoints <= 0;

                        return (
                            <div key={card.idCard} className="flex flex-col items-center relative">
                                <button
                                    onClick={(e) => handleToggleSelect(card.idCard, e)}
                                    disabled={estaMuerto || (!isT1 && !isT2 && totalSeleccionadas >= 6)}
                                    className={`w-full mb-3 py-1.5 px-4 rounded text-xs font-black uppercase tracking-wider transition-all border ${
                                        isT1 ? 'bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' :
                                        isT2 ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]' :
                                        'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white'
                                    } ${estaMuerto ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {isT1 ? '🔴 Equipo 1' : isT2 ? '🔵 Equipo 2' : '⚔️ Reclutar'}
                                </button>

                                <div className={`transition duration-300 ${isT1 ? 'ring-2 ring-red-500 rounded-xl' : isT2 ? 'ring-2 ring-blue-500 rounded-xl' : ''} ${estaMuerto ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
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

    const t1Vivos = team1Cards.filter(c => c.lifePoints > 0).length;
    const t2Vivos = team2Cards.filter(c => c.lifePoints > 0).length;

    return (
        <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gradient-to-br from-gray-950 via-purple-950 to-black rounded-3xl border-2 border-red-700 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            
            <div className="flex justify-between items-center border-b border-red-900/40 pb-4 mb-8">
                <div>
                    <span className="text-xs font-bold text-yellow-500 tracking-widest uppercase block">Enfrentamiento de Facciones</span>
                    <h2 className="text-2xl font-black uppercase tracking-wider text-white">Guerra del Portal</h2>
                </div>
                <button 
                    onClick={handleExitArena}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                    🏳️ Terminar Batalla
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
                
                <div className="lg:col-span-5 flex flex-col items-center bg-red-950/10 p-4 rounded-2xl border border-red-500/20">
                    <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4">🔴 EQUIPO HAWKINS</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {team1Cards.map((card) => {
                            const muerto = card.lifePoints <= 0;
                            const pct = Math.max(0, (card.lifePoints / 150) * 100);
                            return (
                                <div key={card.idCard} className={`flex flex-col items-center scale-90 ${muerto ? 'opacity-25 grayscale' : ''}`}>
                                    <CardDetail {...card} onCardClick={() => {}} />
                                    <div className="w-28 bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                                        <div className="bg-red-500 h-1.5 rounded-full transition-all" style={{ width: `${muerto ? 0 : pct}%` }}></div>
                                    </div>
                                    <span className="text-[9px] font-mono mt-0.5 text-gray-400">PV: {card.lifePoints}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-4">
                    <span className="text-4xl font-black text-gray-600 italic mb-2">VS</span>
                    
                    {t1Vivos > 0 && t2Vivos > 0 ? (
                        <div className="w-full flex flex-col items-center gap-2">
                            <button
                                onClick={handleExecuteRound}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-4 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition transform active:scale-95 cursor-pointer"
                            >
                                ⚡ Ejecutar Turno
                            </button>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                                Ataca: <b className={activeAttackerTeam === 1 ? 'text-red-400' : 'text-blue-400'}>Equipo {activeAttackerTeam}</b>
                            </span>
                        </div>
                    ) : (
                        <div className="bg-green-600/20 border border-green-500 text-green-400 p-3 rounded-xl text-xs font-bold uppercase">
                            🏆 ¡Fin de la Pelea!
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 flex flex-col items-center bg-blue-950/10 p-4 rounded-2xl border border-blue-500/20">
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">🔵 EQUIPO UPSIDE DOWN</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {team2Cards.map((card) => {
                            const muerto = card.lifePoints <= 0;
                            const pct = Math.max(0, (card.lifePoints / 150) * 100);
                            return (
                                <div key={card.idCard} className={`flex flex-col items-center scale-90 ${muerto ? 'opacity-25 grayscale' : ''}`}>
                                    <CardDetail {...card} onCardClick={() => {}} />
                                    <div className="w-28 bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                                        <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${muerto ? 0 : pct}%` }}></div>
                                    </div>
                                    <span className="text-[9px] font-mono mt-0.5 text-gray-400">PV: {card.lifePoints}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className="bg-black/80 rounded-xl p-4 border border-purple-900/40 font-mono text-xs max-h-[140px] overflow-y-auto">
                <p className="text-purple-400 font-bold mb-1 border-b border-purple-900/20 pb-1">📜 REGISTROS DEL COMBATE:</p>
                <div className="flex flex-col gap-1">
                    {combatLog.map((log, index) => (
                        <p key={index} className="text-gray-300">{log}</p>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SeleccionarCarta;