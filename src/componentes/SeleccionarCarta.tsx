import React, { useState } from 'react';
import type { CardProps } from './Card';
import CardDetail from './mazo';

interface SeleccionarCartaProps {
    cards: CardProps[];
    setCards: React.Dispatch<React.SetStateAction<CardProps[]>>;
    onCardClick: (card: CardProps) => void;
}

type BattleStage = 'SELECTION' | 'ARENA';
type RolCarta = 'Atacante' | 'Defensor' | 'Apoyo';

interface CardWithRol extends CardProps {
    rolAsignado?: RolCarta;
    mana: number; 
}

const SeleccionarCarta: React.FC<SeleccionarCartaProps> = ({ cards, setCards, onCardClick }) => {
    const [team1Ids, setTeam1Ids] = useState<string[]>([]);
    const [team2Ids, setTeam2Ids] = useState<string[]>([]); 
    
    const [team1Roles, setTeam1Roles] = useState<Record<string, RolCarta>>({});
    const [team2Roles, setTeam2Roles] = useState<Record<string, RolCarta>>({});
    
    const [battleStage, setBattleStage] = useState<BattleStage>('SELECTION');
    const [combatLog, setCombatLog] = useState<string[]>([]);
    
    const [team1Cards, setTeam1Cards] = useState<CardWithRol[]>([]);
    const [team2Cards, setTeam2Cards] = useState<CardWithRol[]>([]);
    const [activeAttackerTeam, setActiveAttackerTeam] = useState<1 | 2>(1); // Define quién da el siguiente golpe

    const [modalConfig, setModalConfig] = useState<{ carta: CardProps; equipoDestino: 1 | 2 } | null>(null);

    const handleToggleSelect = (idCard: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const inTeam1 = team1Ids.includes(idCard);
        const inTeam2 = team2Ids.includes(idCard);

        if (inTeam1) {
            setTeam1Ids(prev => prev.filter(id => id !== idCard));
            setTeam1Roles(prev => {
                const copia = { ...prev };
                delete copia[idCard];
                return copia;
            });
            return;
        }
        if (inTeam2) {
            setTeam2Ids(prev => prev.filter(id => id !== idCard));
            setTeam2Roles(prev => {
                const copia = { ...prev };
                delete copia[idCard];
                return copia;
            });
            return;
        }

        if (team1Ids.length + team2Ids.length >= 6) return;

        let equipoDestino: 1 | 2 = 1;
        if (team1Ids.length <= team2Ids.length && team1Ids.length < 3) {
            equipoDestino = 1;
        } else if (team2Ids.length < 3) {
            equipoDestino = 2;
        } else if (team1Ids.length < 3) {
            equipoDestino = 1;
        } else {
            return;
        }

        const cartaEncontrada = cards.find(c => c.idCard === idCard);
        if (cartaEncontrada) {
            setModalConfig({ carta: cartaEncontrada, equipoDestino });
        }
    };

    const handleConfirmarRol = (rol: RolCarta) => {
        if (!modalConfig) return;

        const { carta, equipoDestino } = modalConfig;

        if (equipoDestino === 1) {
            setTeam1Ids(prev => [...prev, carta.idCard]);
            setTeam1Roles(prev => ({ ...prev, [carta.idCard]: rol }));
        } else {
            setTeam2Ids(prev => [...prev, carta.idCard]);
            setTeam2Roles(prev => ({ ...prev, [carta.idCard]: rol }));
        }

        // Cerramos el modal
        setModalConfig(null);
    };

    const handleStartBattleStage = () => {
        if (team1Ids.length !== 3 || team2Ids.length !== 3) return;

        const t1Completas: CardWithRol[] = cards
            .filter(c => team1Ids.includes(c.idCard))
            .map(c => ({ ...c, rolAsignado: team1Roles[c.idCard], mana: 300 }));

        const t2Completas: CardWithRol[] = cards
            .filter(c => team2Ids.includes(c.idCard))
            .map(c => ({ ...c, rolAsignado: team2Roles[c.idCard], mana: 300 }));

        setTeam1Cards(t1Completas);
        setTeam2Cards(t2Completas);
        
        setCombatLog(['⚔️ ¡La Arena de Combate se ha abierto! Cartas cargadas con 300 MP y pasivas listas.']);
        setBattleStage('ARENA');
        setActiveAttackerTeam(1);
    };

    const handleExecuteRound = () => {
        let escuadraAtacante = activeAttackerTeam === 1 ? [...team1Cards] : [...team2Cards];
        let escuadraDefensora = activeAttackerTeam === 1 ? [...team2Cards] : [...team1Cards];

        const vivosAtacantes = escuadraAtacante.filter(c => c.lifePoints > 0);
        const vivosDefensores = escuadraDefensora.filter(c => c.lifePoints > 0);

        if (vivosAtacantes.length === 0 || vivosDefensores.length === 0) return;

        let nuevosLogs: string[] = [];
        const atacante = vivosAtacantes[0];
        const objetivo = vivosDefensores[0];

        escuadraAtacante = escuadraAtacante.map(aliado => {
            if (aliado.idCard === atacante.idCard && aliado.rolAsignado === 'Apoyo' && aliado.mana >= 60) {
                aliado.mana -= 60;
                nuevosLogs.push(`🧪 [Pasiva] Apoyo ${aliado.name} usó Cura Grupal (-60 MP).`);
                
                escuadraAtacante.forEach(a => {
                    if (a.lifePoints > 0) {
                        a.lifePoints = Math.min(150, a.lifePoints + 25);
                    }
                });
            }
            return aliado;
        });

        const atacanteActualizado = escuadraAtacante.find(c => c.idCard === atacante.idCard)!;

        let dañoFinal = Math.max(15, atacanteActualizado.attack - objetivo.defense);

        
        if (atacanteActualizado.rolAsignado === 'Atacante' && atacanteActualizado.mana >= 50) {
            atacanteActualizado.mana -= 50;
            dañoFinal = dañoFinal * 2;
            nuevosLogs.push(`⚔️ [Pasiva] ¡Atacante ${atacanteActualizado.name} desató un Golpe Crítico x2! (-50 MP).`);
        }

       
        escuadraDefensora = escuadraDefensora.map(defensor => {
            if (defensor.idCard === objetivo.idCard) {
                if (defensor.rolAsignado === 'Defensor' && defensor.mana >= 40) {
                    defensor.mana -= 40;
                    dañoFinal = Math.floor(dañoFinal * 0.5);
                    nuevosLogs.push(`🛡️ [Pasiva] Defensor ${defensor.name} activó Escudo y absorbió 50% del daño (-40 MP).`);
                }
              
                const nuevaVida = defensor.lifePoints - dañoFinal;
                defensor.lifePoints = nuevaVida < 0 ? 0 : nuevaVida;
            }
            return defensor;
        });

     
        const colorBando = activeAttackerTeam === 1 ? '🔴 [Equipo 1]' : '🔵 [Equipo 2]';
        nuevosLogs.push(`${colorBando} ${atacanteActualizado.name} causó ${dañoFinal} de daño final a ${objetivo.name}.`);

        if (activeAttackerTeam === 1) {
            setTeam1Cards(escuadraAtacante);
            setTeam2Cards(escuadraDefensora);
            setActiveAttackerTeam(2); 
        } else {
            setTeam2Cards(escuadraAtacante);
            setTeam1Cards(escuadraDefensora);
            setActiveAttackerTeam(1); 
        }

        
        setCards(prevGlobal => prevGlobal.map(globalCard => {
            const dañoEncontrado = escuadraDefensora.find(d => d.idCard === globalCard.idCard);
            if (dañoEncontrado) return { ...globalCard, lifePoints: dañoEncontrado.lifePoints };
            const curaEncontrada = escuadraAtacante.find(a => a.idCard === globalCard.idCard);
            if (curaEncontrada) return { ...globalCard, lifePoints: curaEncontrada.lifePoints };
            return globalCard;
        }));

        setCombatLog(prev => [...prev, ...nuevosLogs]);
    };

    const handleExitArena = () => {
        setBattleStage('SELECTION');
        setTeam1Ids([]);
        setTeam2Ids([]);
        setTeam1Roles({});
        setTeam2Roles({});
        setTeam1Cards([]);
        setTeam2Cards([]);
        setCombatLog([]);
    };

    const totalSeleccionadas = team1Ids.length + team2Ids.length;

   
    const rolesOcupados = modalConfig 
        ? Object.values(modalConfig.equipoDestino === 1 ? team1Roles : team2Roles)
        : [];

    
    if (battleStage === 'SELECTION') {
        return (
            <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gray-950/60 backdrop-blur-md rounded-2xl border-2 border-red-600/30 shadow-2xl">
                
                {}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-900/80 p-5 rounded-xl mb-8 border border-gray-800">
                    <div>
                        <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">Estrategia 3 VS 3</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            ¡Cada bando debe tener roles únicos! Total listas: <span className="text-yellow-400 font-bold">{totalSeleccionadas} / 6</span>
                        </p>
                        <div className="flex gap-4 mt-2 text-[11px] font-mono">
                            <span className="text-red-400">🔴 Equipo 1: {team1Ids.length}/3</span>
                            <span className="text-blue-400">🔵 Equipo 2: {team2Ids.length}/3</span>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto justify-end">
                        {totalSeleccionadas > 0 && (
                            <button 
                                onClick={() => { setTeam1Ids([]); setTeam2Ids([]); setTeam1Roles({}); setTeam2Roles({}); }}
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

                {}
                <div className="flex flex-wrap justify-center gap-8">
                    {cards.map((card) => {
                        const isT1 = team1Ids.includes(card.idCard);
                        const isT2 = team2Ids.includes(card.idCard);
                        const estaMuerto = card.lifePoints <= 0;
                        const rolDeCarta = isT1 ? team1Roles[card.idCard] : isT2 ? team2Roles[card.idCard] : null;

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
                                    {isT1 ? `🔴 E1: ${rolDeCarta}` : isT2 ? `🔵 E2: ${rolDeCarta}` : '⚔️ Reclutar'}
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

                {}
                {modalConfig && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 border-4 border-yellow-500 p-6 rounded-xl max-w-sm w-full text-center shadow-2xl">
                            <h3 className="text-xl font-black text-yellow-400 uppercase tracking-wider mb-1">
                                Asignar Rol
                            </h3>
                            <span className="text-[10px] font-mono uppercase bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
                                {modalConfig.equipoDestino === 1 ? '🔴 Para Equipo 1' : '🔵 Para Equipo 2'}
                            </span>
                            <p className="text-sm text-gray-300 my-4">
                                Elige el rol de <span className="text-white font-bold">{modalConfig.carta.name}</span>. No se pueden repetir roles en el equipo.
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    type="button"
                                    disabled={rolesOcupados.includes('Atacante')}
                                    onClick={() => handleConfirmarRol('Atacante')}
                                    className={`w-full font-bold py-2 rounded transition uppercase tracking-wide border ${
                                        rolesOcupados.includes('Atacante')
                                            ? 'bg-gray-850 text-gray-600 border-gray-800 opacity-40 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white border-red-500 cursor-pointer'
                                    }`}
                                >
                                    {rolesOcupados.includes('Atacante') ? '🚫 Atacante (Ocupado)' : '⚔️ Atacante'}
                                </button>
                                
                                <button 
                                    type="button"
                                    disabled={rolesOcupados.includes('Defensor')}
                                    onClick={() => handleConfirmarRol('Defensor')}
                                    className={`w-full font-bold py-2 rounded transition uppercase tracking-wide border ${
                                        rolesOcupados.includes('Defensor')
                                            ? 'bg-gray-850 text-gray-600 border-gray-800 opacity-40 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 cursor-pointer'
                                    }`}
                                >
                                    {rolesOcupados.includes('Defensor') ? '🚫 Defensor (Ocupado)' : '🛡️ Defensor'}
                                </button>
                                
                                <button 
                                    type="button"
                                    disabled={rolesOcupados.includes('Apoyo')}
                                    onClick={() => handleConfirmarRol('Apoyo')}
                                    className={`w-full font-bold py-2 rounded transition uppercase tracking-wide border ${
                                        rolesOcupados.includes('Apoyo')
                                            ? 'bg-gray-850 text-gray-600 border-gray-800 opacity-40 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white border-green-500 cursor-pointer'
                                    }`}
                                >
                                    {rolesOcupados.includes('Apoyo') ? '🚫 Apoyo (Ocupado)' : '🧪 Apoyo'}
                                </button>
                            </div>

                            <button 
                                type="button"
                                onClick={() => setModalConfig(null)}
                                className="mt-5 text-xs text-gray-400 hover:text-white underline cursor-pointer"
                            >
                                Cancelar Reclutamiento
                            </button>
                        </div>
                    </div>
                )}

            </div>
        );
    }

  
    const t1Vivos = team1Cards.filter(c => c.lifePoints > 0).length;
    const t2Vivos = team2Cards.filter(c => c.lifePoints > 0).length;

    return (
        <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gradient-to-br from-gray-950 via-purple-950 to-black rounded-3xl border-2 border-red-700 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            
            {}
            <div className="flex justify-between items-center border-b border-red-900/40 pb-4 mb-8">
                <div>
                    <span className="text-xs font-bold text-yellow-500 tracking-widest uppercase block">Enfrentamiento de Facciones</span>
                    <h2 className="text-2xl font-black uppercase tracking-wider text-white">Guerra del Portal (Sistema MP)</h2>
                </div>
                <button 
                    onClick={handleExitArena}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                    🏳️ Terminar Batalla
                </button>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
                
                {}
                <div className="lg:col-span-5 flex flex-col items-center bg-red-950/10 p-4 rounded-2xl border border-red-500/20">
                    <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4">🔴 EQUIPO HAWKINS</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {team1Cards.map((card) => {
                            const muerto = card.lifePoints <= 0;
                            const pctVida = Math.max(0, (card.lifePoints / 150) * 100);
                            const pctMana = Math.max(0, (card.mana / 300) * 100);
                            return (
                                <div key={card.idCard} className={`flex flex-col items-center scale-90 ${muerto ? 'opacity-25 grayscale' : ''}`}>
                                    <div className="text-[10px] bg-red-900/50 text-red-300 font-bold px-2 py-0.5 rounded border border-red-700/40 mb-1 uppercase tracking-wider">
                                        {card.rolAsignado}
                                    </div>
                                    <CardDetail {...card} onCardClick={() => {}} />
                                    
                                    {}
                                    <div className="w-28 bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                                        <div className="bg-red-500 h-1.5 rounded-full transition-all" style={{ width: `${muerto ? 0 : pctVida}%` }}></div>
                                    </div>
                                    <span className="text-[9px] font-mono text-gray-400">PV: {card.lifePoints}</span>

                                    {}
                                    <div className="w-28 bg-gray-850 rounded-full h-1.5 mt-1 overflow-hidden border border-gray-800">
                                        <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${muerto ? 0 : pctMana}%` }}></div>
                                    </div>
                                    <span className="text-[9px] font-mono text-purple-400 font-bold">MP: {card.mana}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {}
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

                {}
                <div className="lg:col-span-5 flex flex-col items-center bg-blue-950/10 p-4 rounded-2xl border border-blue-500/20">
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">🔵 EQUIPO UPSIDE DOWN</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {team2Cards.map((card) => {
                            const muerto = card.lifePoints <= 0;
                            const pctVida = Math.max(0, (card.lifePoints / 150) * 100);
                            const pctMana = Math.max(0, (card.mana / 300) * 100);
                            return (
                                <div key={card.idCard} className={`flex flex-col items-center scale-90 ${muerto ? 'opacity-25 grayscale' : ''}`}>
                                    <div className="text-[10px] bg-blue-900/50 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-700/40 mb-1 uppercase tracking-wider">
                                        {card.rolAsignado}
                                    </div>
                                    <CardDetail {...card} onCardClick={() => {}} />
                                    
                                    {}
                                    <div className="w-28 bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                                        <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${muerto ? 0 : pctVida}%` }}></div>
                                    </div>
                                    <span className="text-[9px] font-mono text-gray-400">PV: {card.lifePoints}</span>

                                    {}
                                    <div className="w-28 bg-gray-850 rounded-full h-1.5 mt-1 overflow-hidden border border-gray-800">
                                        <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${muerto ? 0 : pctMana}%` }}></div>
                                    </div>
                                    <span className="text-[9px] font-mono text-purple-400 font-bold">MP: {card.mana}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {}
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