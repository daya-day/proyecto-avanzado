import React from 'react';
import type { CardProps } from './Card';

interface ModalProps {
    card: CardProps | null;
    onClose: () => void;
    onDelete: (cardId: string) => void;
    onEdit: (card: CardProps) => void;
}

const StatBox = ({ title, value, color = 'bg-gray-700', large = false }: { title: string, value: string | number, color?: string, large?: boolean }) => (
    <div className={`p-4 rounded-lg shadow-inner ${color}`}>
        <p className="text-sm font-light text-gray-300">{title}</p>
        <p className={`font-extrabold ${large ? 'text-3xl' : 'text-xl'}`}>{value}</p>
    </div>
);

const CardDetailsModal: React.FC<ModalProps> = ({ card, onClose, onDelete, onEdit }) => {
    if (!card) return null;

    const getTipoColor = (tipo: string | undefined) => {
        switch (tipo) {
            case 'Psíquico': return 'bg-purple-900 border-purple-500';
            case 'Carnívoro': return 'bg-red-900 border-red-500';
            default: return 'bg-gray-800 border-gray-400';
        }
    }

    const handleDeleteClick = () => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la carta "${card.nombre}"?`)) {
            onDelete(card.id); 
            onClose(); 
        }
    }

    const handleEditClick = () => {
        onEdit(card); 
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

                <div className="flex flex-col md:flex-row gap-8">

                    <div className="md:w-1/3 flex justify-center items-start">
                        <img
                            src={card.imagen}
                            alt={card.nombre}
                            className="w-full h-auto object-cover rounded-lg border-4 border-white shadow-xl"
                        />
                    </div>

                    <div className="md:w-2/3 space-y-4">

                        <div className="grid grid-cols-3 gap-4 text-lg">
                            <StatBox title="Nº" value={`#${card.numero}`} />
                            <StatBox title="Tipo" value={card.tipo || 'N/A'} color={card.tipo === 'Psíquico' ? 'bg-purple-700' : 'bg-red-700'} />
                            <StatBox title="Vida" value={card.vida} color="bg-green-600" />
                            <StatBox title="Ataque" value={card.ataque} color="bg-red-600" large />
                            <StatBox title="Defensa" value={card.defensa} color="bg-blue-600" large />
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mt-6 mb-2 border-t pt-4 border-gray-600">
                                Descripción
                            </h3>
                            <p className="text-base leading-relaxed italic text-gray-200">
                                {card.descripcion}
                            </p>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button
                                onClick={handleEditClick}
                                className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded text-lg font-bold hover:bg-blue-700 transition duration-200 shadow-md"
                            >
                                ✏️ Editar Carta
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="w-1/2 bg-red-600 text-white px-4 py-2 rounded text-lg font-bold hover:bg-red-700 transition duration-200 shadow-md"
                            >
                                🗑️ Eliminar Carta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetailsModal;