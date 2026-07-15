import React, { useState, useEffect, useRef } from 'react';
import type { CardProps } from './Card';
import CardDetail from './mazo';

interface SeleccionarCartaProps {
    cards: CardProps[];
    setCards: React.Dispatch<React.SetStateAction<CardProps[]>>;
    onCardClick: (card: CardProps) => void;
}

type BattleStage = 'SELECTION' | 'ARENA';
type RolCarta = 'Atacante' | 'Defensor' | 'Apoyo';
type AccionTurno = 'ATACAR' | 'DEFENDER' | 'SALTAR' | 'HABILIDAD_ESPECIAL' | null;

interface CardWithRol extends CardProps {
    rolAsignado?: RolCarta;
    mana: number; 
    maxLifePoints: number;
    enPosturaDefensiva?: boolean;
    estadoTurno?: 'NORMAL' | 'AGOTADO' | 'ATURDIDO'; 
    yaUsoUltimoAliento?: boolean;
}

interface DadosState {
    tipo: 'ATACANTE_ESPECIAL' | 'DEFENSOR_ESPINAS' | 'APOYO_SALVACION';
    atacante: CardWithRol;
    victima: CardWithRol;
    esHabilidad: boolean;
}

const SeleccionarCarta: React.FC<SeleccionarCartaProps> = ({ cards, setCards, onCardClick }) => {
    // --- ESTADOS DE SELECCIÓN ---
    const [team1Ids, setTeam1Ids] = useState<string[]>([]);
    const [team2Ids, setTeam2Ids] = useState<string[]>([]); 
    const [team1Roles, setTeam1Roles] = useState<Record<string, RolCarta>>({});
    const [team2Roles, setTeam2Roles] = useState<Record<string, RolCarta>>({});
    const [battleStage, setBattleStage] = useState<BattleStage>('SELECTION');
    const [modalConfig, setModalConfig] = useState<{ carta: CardProps; equipoDestino: 1 | 2 } | null>(null);

    // --- ESTADOS DE LA ARENA ---
    const [team1Cards, setTeam1Cards] = useState<CardWithRol[]>([]);
    const [team2Cards, setTeam2Cards] = useState<CardWithRol[]>([]);
    const [combatLog, setCombatLog] = useState<string[]>([]);
    
    // Control de Turnos Manual
    const [bandoActivo, setBandoActivo] = useState<1 | 2>(1);
    const [idCartaSeleccionada, setIdCartaSeleccionada] = useState<string | null>(null);
    const [accionSeleccionada, setAccionSeleccionada] = useState<AccionTurno>(null);

    // --- ESTADO DE LOS DADOS ---
    const [dadosConfig, setDadosConfig] = useState<DadosState | null>(null);
    const [dadoJugador, setDadoJugador] = useState<number | null>(null);
    const [dadoRival, setDadoRival] = useState<number | null>(null);
    const [dadosRodando, setDadosRodando] = useState<boolean>(false);
    const [resultadoDadosTexto, setResultadoDadosTexto] = useState<string>('');

    const logContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [combatLog]);

    // --- RECLUTAMIENTO ---
    const handleToggleSelect = (idCard: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const inTeam1 = team1Ids.includes(idCard);
        const inTeam2 = team2Ids.includes(idCard);

        if (inTeam1) {
            setTeam1Ids(prev => prev.filter(id => id !== idCard));
            setTeam1Roles(prev => { const c = { ...prev }; delete c[idCard]; return c; });
            return;
        }
        if (inTeam2) {
            setTeam2Ids(prev => prev.filter(id => id !== idCard));
            setTeam2Roles(prev => { const c = { ...prev }; delete c[idCard]; return c; });
            return;
        }
        if (team1Ids.length + team2Ids.length >= 6) return;

        let equipoDestino: 1 | 2 = 1;
        if (team1Ids.length <= team2Ids.length && team1Ids.length < 3) equipoDestino = 1;
        else if (team2Ids.length < 3) equipoDestino = 2;
        else if (team1Ids.length < 3) equipoDestino = 1;
        else return;

        const cartaEncontrada = cards.find(c => c.idCard === idCard);
        if (cartaEncontrada) setModalConfig({ carta: cartaEncontrada, equipoDestino });
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
        setModalConfig(null);
    };

    const handleStartBattleStage = () => {
        if (team1Ids.length !== 3 || team2Ids.length !== 3) return;

        const t1 = cards.filter(c => team1Ids.includes(c.idCard)).map(c => ({ 
            ...c, 
            rolAsignado: team1Roles[c.idCard], 
            mana: 100, 
            maxLifePoints: c.lifePoints, 
            enPosturaDefensiva: false,
            estadoTurno: 'NORMAL' as const
        }));
        const t2 = cards.filter(c => team2Ids.includes(c.idCard)).map(c => ({ 
            ...c, 
            rolAsignado: team2Roles[c.idCard], 
            mana: 100, 
            maxLifePoints: c.lifePoints, 
            enPosturaDefensiva: false,
            estadoTurno: 'NORMAL' as const
        }));

        setTeam1Cards(t1);
        setTeam2Cards(t2);
        setCombatLog(['🎲 ¡Bienvenidos al Hellfire Club! Turno de HAWKINS (Equipo 1). Elige una carta para empezar.']);
        setBattleStage('ARENA');
        setBandoActivo(1);
        resetearAccionesTurno();
    };

    const resetearAccionesTurno = () => {
        setIdCartaSeleccionada(null);
        setAccionSeleccionada(null);
    };

    const cambiarDeBando = () => {
        const siguienteBando = bandoActivo === 1 ? 2 : 1;
        
        const limpiarEstados = (cartas: CardWithRol[]) => cartas.map(c => {
            if (c.estadoTurno === 'AGOTADO' || c.estadoTurno === 'ATURDIDO') {
                return { ...c, estadoTurno: 'NORMAL' as const };
            }
            return c;
        });

        if (siguienteBando === 1) setTeam1Cards(prev => limpiarEstados(prev));
        else setTeam2Cards(prev => limpiarEstados(prev));

        setBandoActivo(siguienteBando);
        resetearAccionesTurno();
    };

    // --- CONTROL DE ACCIONES DEL PANEL ---
    const handleSeleccionarAccion = (accion: AccionTurno) => {
        if (!idCartaSeleccionada) return;
        
        const misCartas = bandoActivo === 1 ? team1Cards : team2Cards;
        const carta = misCartas.find(c => c.idCard === idCartaSeleccionada)!;

        if (carta.estadoTurno && carta.estadoTurno !== 'NORMAL') {
            setCombatLog(prev => [...prev, `🚫 ${carta.name} está ${carta.estadoTurno} y pierde el turno.`]);
            cambiarDeBando();
            return;
        }

        if (accion === 'SALTAR' || accion === 'DEFENDER') {
            const nuevoMana = Math.min(200, carta.mana + 40);
            const posturaDef = accion === 'DEFENDER';
            const msg = posturaDef 
                ? `🛡️ ${carta.name} entra en postura defensiva. (+40 MP)` 
                : `⏩ ${carta.name} descansa este turno. (+40 MP)`;
            
            setCombatLog(prev => [...prev, msg]);
            actualizarPropiedadCarta(bandoActivo, carta.idCard, { enPosturaDefensiva: posturaDef, mana: nuevoMana });
            cambiarDeBando();
        } 
        else if (accion === 'ATACAR') {
            setAccionSeleccionada('ATACAR');
            setCombatLog(prev => [...prev, `🎯 ${carta.name} busca un objetivo. ¡Haz clic en una carta enemiga!`]);
        } 
        else if (accion === 'HABILIDAD_ESPECIAL') {
            const coste = carta.rolAsignado === 'Atacante' ? 70 : carta.rolAsignado === 'Defensor' ? 60 : 90;
            if (carta.mana < coste) {
                setCombatLog(prev => [...prev, `❌ Maná insuficiente. Requiere ${coste} MP.`]);
                return;
            }

            if (carta.rolAsignado === 'Apoyo') {
                // CURACIÓN GLOBAL INMEDIATA
                setCombatLog(prev => [...prev, `🧪 ${carta.name} usa Habilidad de Apoyo: Curación en área de +30 PV.`]);
                const sanar = (list: CardWithRol[]) => list.map(c => c.lifePoints > 0 ? { ...c, lifePoints: Math.min(c.maxLifePoints, c.lifePoints + 30) } : c);
                if (bandoActivo === 1) setTeam1Cards(prev => sanar(prev));
                else setTeam2Cards(prev => sanar(prev));
                
                actualizarPropiedadCarta(bandoActivo, carta.idCard, { mana: carta.mana - 90 });
                cambiarDeBando();
            } 
            else if (carta.rolAsignado === 'Defensor') {
                // ESCUDO PROPIO INMEDIATO
                setCombatLog(prev => [...prev, `🛡️ ${carta.name} usa Habilidad de Defensor: Gana un escudo de +30 PV.`]);
                actualizarPropiedadCarta(bandoActivo, carta.idCard, { mana: carta.mana - 60, lifePoints: carta.lifePoints + 30, enPosturaDefensiva: true });
                cambiarDeBando();
            } 
            else if (carta.rolAsignado === 'Atacante') {
                // ATAQUE ESPECIAL NECESITA SELECCIONAR OBJETIVO
                setAccionSeleccionada('HABILIDAD_ESPECIAL');
                setCombatLog(prev => [...prev, `🔥 ${carta.name} prepara su Golpe Potenciado. ¡Selecciona una carta enemiga!`]);
            }
        }
    };

    // --- SELECCIÓN DIRECTA DE OBJETIVO ENEMIGO ---
    const handleSeleccionarObjetivoEnemigo = (victima: CardWithRol) => {
        if (!idCartaSeleccionada || !accionSeleccionada) return;

        const misCartas = bandoActivo === 1 ? team1Cards : team2Cards;
        const atacante = misCartas.find(c => c.idCard === idCartaSeleccionada)!;

        // Validar que no esté muerto el rival
        if (victima.lifePoints <= 0) return;

        // Limpiar estados de dados previos
        setDadoJugador(null);
        setDadoRival(null);
        setResultadoDadosTexto('');
        setDadosRodando(false);

        if (victima.rolAsignado === 'Defensor' && victima.enPosturaDefensiva) {
            // Si el rival es un defensor protegiéndose, obliga a tirar dados de Espinas
            setDadosConfig({ tipo: 'DEFENSOR_ESPINAS', atacante, victima, esHabilidad: accionSeleccionada === 'HABILIDAD_ESPECIAL' });
        } else if (accionSeleccionada === 'HABILIDAD_ESPECIAL') {
            // Si es habilidad de atacante, choque de dados obligatorio
            setDadosConfig({ tipo: 'ATACANTE_ESPECIAL', atacante, victima, esHabilidad: true });
        } else {
            // Ataque básico normal directo sin dados
            resolverImpactoBatalla(atacante, victima, false, false, 0, false);
        }
    };

    // --- SIMULADOR INTERACTIVO DE DADOS ---
    const lanzarDadosFisicos = () => {
        if (!dadosConfig || dadosRodando) return;

        setDadosRodando(true);
        setResultadoDadosTexto('¡Girando los dados en la mesa de juego! 🌀');

        let cuenta = 0;
        const interval = setInterval(() => {
            setDadoJugador(Math.floor(Math.random() * 20) + 1);
            setDadoRival(dadosConfig.tipo === 'APOYO_SALVACION' ? null : Math.floor(Math.random() * 20) + 1);
            cuenta++;

            if (cuenta > 10) {
                clearInterval(interval);
                
                const finalJugador = Math.floor(Math.random() * 20) + 1;
                const finalRival = Math.floor(Math.random() * 20) + 1;

                setDadoJugador(finalJugador);
                
                if (dadosConfig.tipo === 'APOYO_SALVACION') {
                    const exitoSalva = finalJugador >= 11;
                    setResultadoDadosTexto(exitoSalva ? `🎉 ¡SACASTE ${finalJugador}! ¡Salvación de muerte exitosa!` : `💀 Sacaste ${finalJugador}. El Upside Down te consume.`);
                } else {
                    setDadoRival(finalRival);
                    const ganaJugador = finalJugador >= finalRival;
                    
                    if (dadosConfig.tipo === 'ATACANTE_ESPECIAL') {
                        setResultadoDadosTexto(ganaJugador ? `🔥 ¡Éxito Crítico! (${finalJugador} vs ${finalRival})` : `💨 ¡Fallo! Ataque estándar y cansancio (${finalJugador} vs ${finalRival})`);
                    } else if (dadosConfig.tipo === 'DEFENSOR_ESPINAS') {
                        setResultadoDadosTexto(ganaJugador ? `🌵 ¡Espinas activadas! (${finalJugador} vs ${finalRival})` : `💥 ¡Guardia Rota! El defensor queda expuesto (${finalJugador} vs ${finalRival})`);
                    }
                }
                setDadosRodando(false);
            }
        }, 100);
    };

    // --- PROCESAR RESULTADO DEL MODAL DE DADOS ---
    const handleContinuarPostDados = () => {
        if (!dadosConfig || dadoJugador === null) return;
        
        const { atacante, victima, esHabilidad, tipo } = dadosConfig;
        const valJugador = dadoJugador;
        const valRival = dadoRival || 0;
        const ganoJugador = valJugador >= valRival;

        setDadosConfig(null); // Cerrar modal

        if (tipo === 'APOYO_SALVACION') {
            const exito = valJugador >= 11;
            procesarFinDeTurnoConSalvacion(victima, exito, valJugador);
            return;
        }

        if (tipo === 'DEFENSOR_ESPINAS') {
            if (ganoJugador) {
                // Gana el defensor: activa espinas y devuelve el 20% del daño reflejado
                let dmgOriginal = Math.max(15, atacante.attack - victima.defense);
                if (esHabilidad) dmgOriginal += 20;
                const reflejo = Math.floor(dmgOriginal * 0.20);
                
                setCombatLog(prev => [...prev, `🌵 Pasiva: El escudo de ${victima.name} devuelve ${reflejo} de daño.`]);
                resolverImpactoBatalla(atacante, victima, esHabilidad, false, reflejo, false);
            } else {
                // Pierde el defensor: Se le rompe la guardia y queda aturdido
                setCombatLog(prev => [...prev, `💥 ¡Guardia Rota! ${victima.name} queda ATURDIDO.`]);
                resolverImpactoBatalla(atacante, victima, esHabilidad, false, 0, true);
            }
        } 
        else if (tipo === 'ATACANTE_ESPECIAL') {
            // Choque de dados de ataque especial
            resolverImpactoBatalla(atacante, victima, true, ganoJugador, 0, false);
        }
    };

    // --- RESOLUCIÓN FINAL DE DAÑOS EN TABLERO ---
    const resolverImpactoBatalla = (
        atacante: CardWithRol, 
        victima: CardWithRol, 
        esHabilidad: boolean, 
        esCritico: boolean, 
        dañoDevuelto: number,
        rompeGuardia: boolean
    ) => {
        let misCartas = bandoActivo === 1 ? team1Cards.map(c => ({...c})) : team2Cards.map(c => ({...c}));
        let susCartas = bandoActivo === 1 ? team2Cards.map(c => ({...c})) : team1Cards.map(c => ({...c}));

        let dañoCalculado = Math.max(15, atacante.attack - victima.defense);
        
        if (esHabilidad) {
            dañoCalculado += 20;
            if (esCritico) dañoCalculado = Math.floor(dañoCalculado * 1.25);
        }

        if (victima.enPosturaDefensiva && !rompeGuardia) {
            dañoCalculado = Math.floor(dañoCalculado * 0.5);
        }

        const vidaFinalSus = Math.max(0, victima.lifePoints - dañoCalculado);
        const vidaFinalMis = Math.max(0, atacante.lifePoints - dañoDevuelto);

        let logs = [`⚔️ ${atacante.name} causa ${dañoCalculado} de daño a ${victima.name}.`];

        // Actualizar atacante (Maná y Estados)
        misCartas = misCartas.map(c => {
            if (c.idCard === atacante.idCard) {
                let m = c.mana;
                let estado = c.estadoTurno;
                if (esHabilidad) {
                    m -= 70;
                    estado = esCritico ? 'NORMAL' : 'AGOTADO';
                    if (!esCritico) logs.push(`💤 ${atacante.name} se fatigó por fallar el tiro dinámico.`);
                } else {
                    m = Math.min(200, m + 15);
                }
                return { ...c, mana: m, lifePoints: vidaFinalMis, estadoTurno: estado };
            }
            return c;
        });

        // Actualizar víctima
        susCartas = susCartas.map(c => {
            if (c.idCard === victima.idCard) {
                return { 
                    ...c, 
                    lifePoints: vidaFinalSus, 
                    enPosturaDefensiva: false,
                    estadoTurno: rompeGuardia ? 'ATURDIDO' : c.estadoTurno
                };
            }
            return c;
        });

        // REVISAR SI ACTIVAR ÚLTIMO ALIENTO DE APOYO
        if (vidaFinalSus === 0 && victima.rolAsignado === 'Apoyo' && !victima.yaUsoUltimoAliento) {
            // Congelar juego y abrir modal de salvación
            setCombatLog(prev => [...prev, ...logs, `😇 ¡Último Aliento! Tirada de salvación obligatoria para ${victima.name}.`]);
            
            // Forzar actualización parcial en memoria para que la tirada lea el estado real
            const victimaModificada = { ...victima, lifePoints: 0, yaUsoUltimoAliento: true };
            const atacanteModificado = misCartas.find(x => x.idCard === atacante.idCard)!;

            setDadoJugador(null); setDadoRival(null); setResultadoDadosTexto(''); setDadosRodando(false);
            setDadosConfig({
                tipo: 'APOYO_SALVACION',
                atacante: atacanteModificado,
                victima: victimaModificada,
                esHabilidad: false
            });
            
            // Guardamos el estado actual antes del dado fatídico
            if (bandoActivo === 1) { setTeam1Cards(misCartas); setTeam2Cards(susCartas); }
            else { setTeam2Cards(misCartas); setTeam1Cards(susCartas); }
            return;
        }

        if (vidaFinalSus === 0) logs.push(`💀 ${victima.name} ha sido eliminado.`);
        if (dañoDevuelto > 0 && vidaFinalMis === 0) logs.push(`💀 ${atacante.name} murió por el reflejo de espinas.`);

        finalizarEstructuraTurno(misCartas, susCartas, logs);
    };

    const procesarFinDeTurnoConSalvacion = (victima: CardWithRol, exito: boolean, valorDado: number) => {
        let susCartas = bandoActivo === 1 ? team2Cards.map(c => ({...c})) : team1Cards.map(c => ({...c}));
        let misCartas = bandoActivo === 1 ? team1Cards.map(c => ({...c})) : team2Cards.map(c => ({...c}));
        
        let logs = [`🎲 Salvación d20 de ${victima.name}: sacó un ${valorDado} (Dificultad: 11).`];

        susCartas = susCartas.map(c => {
            if (c.idCard === victima.idCard) {
                if (exito) {
                    const vidaResucitado = Math.floor(c.maxLifePoints * 0.20);
                    logs.push(`😇 ¡ÉXITO! ${c.name} revive con ${vidaResucitado} PV de forma milagrosa.`);
                    return { ...c, lifePoints: vidaResucitado, yaUsoUltimoAliento: true };
                } else {
                    logs.push(`💀 ¡FALLO! ${c.name} es arrastrado al Vacío.`);
                    return { ...c, lifePoints: 0, yaUsoUltimoAliento: true };
                }
            }
            return c;
        });

        finalizarEstructuraTurno(misCartas, susCartas, logs);
    };

    const finalizarEstructuraTurno = (mis: CardWithRol[], sus: CardWithRol[], logs: string[]) => {
        if (bandoActivo === 1) {
            setTeam1Cards(mis);
            setTeam2Cards(sus);
        } else {
            setTeam2Cards(mis);
            setTeam1Cards(sus);
        }

        // Sincronizar vidas globales con el mazo
        setCards(prev => prev.map(c => {
            const match = [...mis, ...sus].find(x => x.idCard === c.idCard);
            return match ? { ...c, lifePoints: match.lifePoints } : c;
        }));

        setCombatLog(prev => [...prev, ...logs]);
        cambiarDeBando();
    };

    const actualizarPropiedadCarta = (bando: 1 | 2, id: string, valores: Partial<CardWithRol>) => {
        const f = (list: CardWithRol[]) => list.map(c => c.idCard === id ? { ...c, ...valores } : c);
        if (bando === 1) setTeam1Cards(f); else setTeam2Cards(f);
    };

    const handleExitArena = () => {
        setBattleStage('SELECTION');
        setTeam1Ids([]); setTeam2Ids([]); setTeam1Roles({}); setTeam2Roles({});
        setTeam1Cards([]); setTeam2Cards([]); setCombatLog([]);
        resetearAccionesTurno();
    };

    if (battleStage === 'SELECTION') {
        const totalSeleccionadas = team1Ids.length + team2Ids.length;
        const rolesOcupados = modalConfig ? Object.values(modalConfig.equipoDestino === 1 ? team1Roles : team2Roles) : [];

        return (
            <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gray-950/60 backdrop-blur-md rounded-2xl border-2 border-red-600/30 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-900/80 p-5 rounded-xl mb-8 border border-gray-800">
                    <div>
                        <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">Estrategia D&D 3 VS 3</h2>
                        <p className="text-xs text-gray-400 mt-1">Reclutados: <span className="text-yellow-400 font-bold">{totalSeleccionadas} / 6</span> (1 de cada rol por bando)</p>
                    </div>
                    <div className="flex gap-2">
                        {totalSeleccionadas > 0 && (
                            <button onClick={() => { setTeam1Ids([]); setTeam2Ids([]); setTeam1Roles({}); setTeam2Roles({}); }} className="px-3 py-2 bg-gray-800 text-gray-300 rounded text-xs uppercase font-bold cursor-pointer">Limpiar</button>
                        )}
                        <button onClick={handleStartBattleStage} disabled={team1Ids.length !== 3 || team2Ids.length !== 3} className={`px-6 py-2 rounded font-black uppercase tracking-wider text-xs ${team1Ids.length === 3 && team2Ids.length === 3 ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>¡Iniciar Combate!</button>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {cards.map((card) => {
                        const isT1 = team1Ids.includes(card.idCard);
                        const isT2 = team2Ids.includes(card.idCard);
                        const estaMuerto = card.lifePoints <= 0;
                        const rolDeCarta = isT1 ? team1Roles[card.idCard] : isT2 ? team2Roles[card.idCard] : null;

                        return (
                            <div key={card.idCard} className="flex flex-col items-center">
                                <button onClick={(e) => handleToggleSelect(card.idCard, e)} disabled={estaMuerto || (!isT1 && !isT2 && totalSeleccionadas >= 6)} className={`w-full mb-3 py-1.5 px-4 rounded text-xs font-black uppercase tracking-wider border ${isT1 ? 'bg-red-600 text-white border-red-500' : isT2 ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-900 text-gray-400 border-gray-800'} ${estaMuerto ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    {isT1 ? `🔴 E1: ${rolDeCarta}` : isT2 ? `🔵 E2: ${rolDeCarta}` : '⚔️ Reclutar'}
                                </button>
                                <div className={`${isT1 ? 'ring-2 ring-red-500' : isT2 ? 'ring-2 ring-blue-500' : ''}`}>
                                    <CardDetail {...card} onCardClick={onCardClick} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {modalConfig && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 border-4 border-red-600 p-6 rounded-xl max-w-sm w-full text-center shadow-2xl">
                            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4">Elegir Rol para el Combate</h3>
                            <div className="flex flex-col gap-3">
                                <button disabled={rolesOcupados.includes('Atacante')} onClick={() => handleConfirmarRol('Atacante')} className={`w-full font-bold py-2 rounded uppercase border ${rolesOcupados.includes('Atacante') ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-40' : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'}`}>⚔️ Atacante (Ofensivo)</button>
                                <button disabled={rolesOcupados.includes('Defensor')} onClick={() => handleConfirmarRol('Defensor')} className={`w-full font-bold py-2 rounded uppercase border ${rolesOcupados.includes('Defensor') ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-40' : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'}`}>🛡️ Defensor (Tanque)</button>
                                <button disabled={rolesOcupados.includes('Apoyo')} onClick={() => handleConfirmarRol('Apoyo')} className={`w-full font-bold py-2 rounded uppercase border ${rolesOcupados.includes('Apoyo') ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-40' : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'}`}>🧪 Apoyo (Sustento)</button>
                            </div>
                            <button onClick={() => setModalConfig(null)} className="mt-5 text-xs text-gray-400 underline cursor-pointer">Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const cartaAtacanteActual = bandoActivo === 1 
        ? team1Cards.find(c => c.idCard === idCartaSeleccionada) 
        : team2Cards.find(c => c.idCard === idCartaSeleccionada);

    return (
        <div className="w-full max-w-7xl mx-auto mb-10 p-6 bg-gradient-to-br from-gray-950 via-purple-950 to-black rounded-3xl border-2 border-purple-600/50 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-purple-900/40 pb-4 mb-6">
                <div>
                    <span className="text-xs font-bold text-yellow-400 tracking-widest uppercase block">🎲 Mesa de Rol del Hellfire Club</span>
                    <h2 className="text-xl font-black uppercase text-white">Hawkins VS Upside Down</h2>
                </div>
                <button onClick={handleExitArena} className="px-4 py-1.5 bg-red-950 border border-red-700 text-white rounded text-xs font-bold uppercase cursor-pointer">🏳️ Salir</button>
            </div>

            <div className="grid grid-cols-12 gap-4 items-stretch min-h-[480px]">
                
                {/* FLANCO IZQUIERDO: EQUIPO 1 (HAWKINS) */}
                <div className="col-span-3 flex flex-col justify-start gap-4 p-3 bg-red-950/10 rounded-xl border border-red-500/20">
                    <span className="text-[11px] font-black text-red-400 uppercase text-center block tracking-widest">🔴 HAWKINS</span>
                    {team1Cards.map((card) => {
                        const muerto = card.lifePoints <= 0;
                        const esSeleccionada = idCartaSeleccionada === card.idCard && bandoActivo === 1;
                        const esObjetivoValido = (accionSeleccionada === 'ATACAR' || accionSeleccionada === 'HABILIDAD_ESPECIAL') && bandoActivo === 2 && !muerto;

                        return (
                            <div 
                                key={card.idCard}
                                onClick={() => {
                                    if (muerto) return;
                                    if (esObjetivoValido) handleSeleccionarObjetivoEnemigo(card);
                                    else if (bandoActivo === 1 && !accionSeleccionada) setIdCartaSeleccionada(card.idCard);
                                }}
                                className={`relative flex flex-col items-center p-2 rounded-xl border transition-all ${
                                    muerto ? 'opacity-25 grayscale pointer-events-none' : 'cursor-pointer'
                                } ${esSeleccionada ? 'bg-red-600/20 border-red-500 ring-2 ring-red-500' : 'bg-gray-900/40 border-transparent'} ${
                                    esObjetivoValido ? 'ring-2 ring-yellow-500 bg-yellow-950/20 border-yellow-500 animate-pulse' : 'hover:border-red-500/40'
                                }`}
                            >
                                <div className="absolute top-1 left-2 text-[9px] bg-red-950 px-1.5 py-0.5 rounded font-mono text-white font-bold">{card.rolAsignado}</div>
                                {card.enPosturaDefensiva && <div className="absolute top-1 right-2 text-[9px] bg-blue-600 px-1.5 py-0.5 rounded font-mono text-white">🛡️ GUARDIA</div>}
                                {card.estadoTurno && card.estadoTurno !== 'NORMAL' && (
                                    <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center font-bold text-yellow-500 text-xs uppercase">{card.estadoTurno}</div>
                                )}
                                <CardDetail {...card} onCardClick={() => {}} />
                                <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-red-500 h-full" style={{ width: `${(card.lifePoints / card.maxLifePoints) * 100}%` }}></div>
                                </div>
                                <div className="w-full flex justify-between text-[9px] font-mono text-gray-400 mt-1">
                                    <span>PV: {card.lifePoints}/{card.maxLifePoints}</span>
                                    <span className="text-purple-400 font-bold">⚡ {card.mana} MP</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CENTRO: CONTROLADORES */}
                <div className="col-span-6 flex flex-col justify-center items-center px-4 bg-gray-950/40 rounded-xl border border-gray-800/40">
                    <div className="text-center w-full max-w-sm bg-gray-900 p-6 rounded-2xl border border-purple-500/30 shadow-xl">
                        <h4 className={`text-sm font-black uppercase mb-4 ${bandoActivo === 1 ? 'text-red-400' : 'text-blue-400'}`}>
                            {bandoActivo === 1 ? '👉 Turno de Hawkins' : '👉 Turno de Upside Down'}
                        </h4>

                        {!idCartaSeleccionada && (
                            <p className="text-xs text-gray-400 animate-pulse">Selecciona una de tus cartas activas para ver qué puede hacer.</p>
                        )}

                        {idCartaSeleccionada && !accionSeleccionada && cartaAtacanteActual && (
                            <div>
                                <p className="text-xs text-gray-300 mb-4">Acciones para <span className="text-yellow-400 font-bold">{cartaAtacanteActual.name}</span>:</p>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => handleSeleccionarAccion('ATACAR')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 text-xs rounded uppercase cursor-pointer">⚔️ Ataque Básico (+15 MP)</button>
                                    <button onClick={() => handleSeleccionarAccion('HABILIDAD_ESPECIAL')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 text-xs rounded uppercase cursor-pointer">
                                        ✨ Especial ({cartaAtacanteActual.rolAsignado === 'Atacante' ? '70 MP' : cartaAtacanteActual.rolAsignado === 'Defensor' ? '60 MP' : '90 MP'})
                                    </button>
                                    <button onClick={() => handleSeleccionarAccion('DEFENDER')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 text-xs rounded uppercase cursor-pointer">🛡️ Entrar en Guardia (+40 MP)</button>
                                    <button onClick={() => handleSeleccionarAccion('SALTAR')} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 text-xs rounded uppercase cursor-pointer">⏩ Descansar (+40 MP)</button>
                                </div>
                            </div>
                        )}

                        {accionSeleccionada && cartaAtacanteActual && (
                            <div>
                                <p className="text-xs text-yellow-500 font-bold uppercase mb-1">¡Objetivo Requerido!</p>
                                <p className="text-[11px] text-gray-300">
                                    {accionSeleccionada === 'HABILIDAD_ESPECIAL' 
                                        ? 'Haz clic sobre el enemigo que sufrirá el ataque dinámico.' 
                                        : 'Haz clic sobre una carta del flanco enemigo para golpearla.'}
                                </p>
                                <button onClick={resetearAccionesTurno} className="mt-4 text-[10px] text-gray-400 hover:text-white underline cursor-pointer">Cambiar de acción</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* FLANCO DERECHO: EQUIPO 2 (UPSIDE DOWN) */}
                <div className="col-span-3 flex flex-col justify-start gap-4 p-3 bg-blue-950/10 rounded-xl border border-blue-500/20">
                    <span className="text-[11px] font-black text-blue-400 uppercase text-center block tracking-widest">🔵 UPSIDE DOWN</span>
                    {team2Cards.map((card) => {
                        const muerto = card.lifePoints <= 0;
                        const esSeleccionada = idCartaSeleccionada === card.idCard && bandoActivo === 2;
                        const esObjetivoValido = (accionSeleccionada === 'ATACAR' || accionSeleccionada === 'HABILIDAD_ESPECIAL') && bandoActivo === 1 && !muerto;

                        return (
                            <div 
                                key={card.idCard}
                                onClick={() => {
                                    if (muerto) return;
                                    if (esObjetivoValido) handleSeleccionarObjetivoEnemigo(card);
                                    else if (bandoActivo === 2 && !accionSeleccionada) setIdCartaSeleccionada(card.idCard);
                                }}
                                className={`relative flex flex-col items-center p-2 rounded-xl border transition-all ${
                                    muerto ? 'opacity-25 grayscale pointer-events-none' : 'cursor-pointer'
                                } ${esSeleccionada ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500' : 'bg-gray-900/40 border-transparent'} ${
                                    esObjetivoValido ? 'ring-2 ring-yellow-500 bg-yellow-950/20 border-yellow-500 animate-pulse' : 'hover:border-blue-500/40'
                                }`}
                            >
                                <div className="absolute top-1 left-2 text-[9px] bg-blue-950 px-1.5 py-0.5 rounded font-mono text-white font-bold">{card.rolAsignado}</div>
                                {card.enPosturaDefensiva && <div className="absolute top-1 right-2 text-[9px] bg-blue-600 px-1.5 py-0.5 rounded font-mono text-white">🛡️ GUARDIA</div>}
                                {card.estadoTurno && card.estadoTurno !== 'NORMAL' && (
                                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center font-bold text-yellow-500 text-xs uppercase">{card.estadoTurno}</div>
                                )}
                                <CardDetail {...card} onCardClick={() => {}} />
                                <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-blue-500 h-full" style={{ width: `${(card.lifePoints / card.maxLifePoints) * 100}%` }}></div>
                                </div>
                                <div className="w-full flex justify-between text-[9px] font-mono text-gray-400 mt-1">
                                    <span>PV: {card.lifePoints}/{card.maxLifePoints}</span>
                                    <span className="text-purple-400 font-bold">⚡ {card.mana} MP</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* POPUP DE DADOS REESTRUCTURADO */}
            {dadosConfig && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-950 border-4 border-purple-600 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
                        <span className="text-yellow-500 text-xs uppercase font-mono tracking-widest block mb-1">Mesa de Dados d20</span>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6">
                            {dadosConfig.tipo === 'APOYO_SALVACION' ? '🚨 SALVACIÓN DE MUERTE' : '⚔️ CHOQUE DE PUNTUACIONES'}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-500/30">
                                <span className="text-[10px] text-gray-400 block mb-2 uppercase font-bold">{dadosConfig.atacante.name}</span>
                                <div className={`text-4xl font-extrabold text-white font-mono ${dadosRodando ? 'animate-bounce text-yellow-400' : ''}`}>
                                    {dadoJugador !== null ? `🎲 ${dadoJugador}` : '🎲 --'}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
                                <span className="text-[10px] text-gray-400 block mb-2 uppercase font-bold">
                                    {dadosConfig.tipo === 'APOYO_SALVACION' ? 'CASA (MÍNIMO)' : dadosConfig.victima.name}
                                </span>
                                <div className={`text-4xl font-extrabold text-red-500 font-mono ${dadosRodando ? 'animate-bounce' : ''}`}>
                                    {dadosConfig.tipo === 'APOYO_SALVACION' ? '🎯 11' : dadoRival !== null ? `🎲 ${dadoRival}` : '🎲 --'}
                                </div>
                            </div>
                        </div>

                        {resultadoDadosTexto && (
                            <div className="bg-purple-950/20 border border-purple-900 p-3 rounded-xl mb-6">
                                <p className="text-xs font-bold text-yellow-400 font-mono">{resultadoDadosTexto}</p>
                            </div>
                        )}

                        {dadoJugador === null && !dadosRodando ? (
                            <button onClick={lanzarDadosFisicos} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs cursor-pointer">
                                🎲 LANZAR DADO D20
                            </button>
                        ) : dadosRodando ? (
                            <button disabled className="w-full bg-gray-800 text-gray-400 font-black py-4 rounded-xl uppercase tracking-widest text-xs cursor-not-allowed">
                                🌀 DETERMINANDO EL DESTINO...
                            </button>
                        ) : (
                            <button onClick={handleContinuarPostDados} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs cursor-pointer">
                                ⚔️ APLICAR RESULTADO Y SEGUIR
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Consola de Historial */}
            <div ref={logContainerRef} className="mt-6 bg-black rounded-xl p-4 border border-purple-900/40 font-mono text-[11px] max-h-[140px] overflow-y-auto">
                <p className="text-purple-400 font-bold mb-1 border-b border-purple-900/20 pb-1">📜 ACCIONES EN LA ARENA (LOG)</p>
                <div className="flex flex-col gap-1">
                    {combatLog.map((log, index) => <p key={index} className="text-gray-200">{log}</p>)}
                </div>
            </div>

        </div>
    );
};

export default SeleccionarCarta;