// src/componentes/CardDetailsModal.tsx

import React from 'react';
import type { CardProps } from './Card';


interface ModalProps {
    card: CardProps | null;
    
    onClose: () => void;
}

const StatBox = ({ title, value, color = 'bg-gray-700', large = false }: { title: string, value: string | number, color?: string, large?: boolean }) => (
    <div className={`p-4 rounded-lg shadow-inner ${color}`}>
        <p className="text-sm font-light text-gray-300">{title}</p>
        <p className={`font-extrabold ${large ? 'text-3xl' : 'text-xl'}`}>{value}</p>
    </div>
);

const CardDetailsModal: React.FC<ModalProps> = ({ card, onClose }) => {
    if (!card) return null;

    const getTipoColor = (tipo: string | undefined) => {
        switch (tipo) {
            case 'Psíquico': return 'bg-purple-900 border-purple-500';
            case 'Carnívoro': return 'bg-red-900 border-red-500';
            default: return 'bg-gray-800 border-gray-400';
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            
            <div 
                className={`w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl p-8 text-white ${getTipoColor(card.tipo)} border-8 overflow-y-auto relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-3xl font-bold text-white hover:text-gray-300 transition z-10"
                >
                    &times;
                </button>
                
                <h2 className="text-4xl font-extrabold mb-6 border-b pb-2 text-yellow-300 uppercase">{card.nombre}</h2>
                
                {/* ESTRUCTURA DE DOS COLUMNAS */}
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* COLUMNA IZQUIERDA: IMAGEN GRANDE */}
                    <div className="md:w-1/3 flex justify-center items-start">
                        <img 
                            src={card.imagen} 
                            alt={card.nombre} 
                            className="w-full h-auto object-cover rounded-lg border-4 border-white shadow-xl"
                        />
                    </div>
                    
                    {/* COLUMNA DERECHA: INFORMACIÓN VERTICAL */}
                    <div className="md:w-2/3 space-y-4">
                        
                        {/* Estadísticas Clave */}
                        <div className="grid grid-cols-2 gap-4 text-lg">
                            <StatBox title="Nº" value={`#${card.numero}`} />
                            <StatBox title="Tipo" value={card.tipo || 'N/A'} color={card.tipo === 'Psíquico' ? 'bg-purple-700' : 'bg-red-700'} />
                            <StatBox title="Ataque" value={card.ataque} color="bg-red-600" large />
                            <StatBox title="Defensa" value={card.defensa} color="bg-blue-600" large />
                        </div>

                        {/* Descripción Completa */}
                        <div>
                            <h3 className="text-2xl font-bold mt-6 mb-2 border-t pt-4 border-gray-600">
                                Descripción
                            </h3>
                            <p className="text-base leading-relaxed italic text-gray-200">
                                {card.descripcion}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetailsModal;