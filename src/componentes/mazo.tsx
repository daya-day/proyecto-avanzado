// src/componentes/mazo.tsx

import React from 'react';
import type { CardProps } from './Card';

// La interfaz de la carta individual se extiende para incluir el manejador de clics
interface CardDetailProps extends CardProps {
    onCardClick: (card: CardProps) => void;
}

const CardDetail: React.FC<CardDetailProps> = (props) => {
    const { nombre, tipo, ataque, defensa, vida, imagen, numero, onCardClick, ...rest } = props;

    // Función que devuelve la clase de color base para el borde y el shadow según el tipo
    const getTipoColor = (cardTipo: string) => {
        switch (cardTipo) {
            case 'Psíquico': return 'border-purple-500 shadow-purple-900/50';
            case 'Carnívoro': return 'border-red-500 shadow-red-900/50';
            case 'Humano': return 'border-yellow-500 shadow-yellow-900/50';
            case 'Mágico': return 'border-blue-500 shadow-blue-900/50';
            default: return 'border-gray-500 shadow-gray-900/50';
        }
    };
    
    // Función para obtener el color de fondo sutil del área de encabezado según el tipo
    const getTipoBg = (cardTipo: string) => {
        switch (cardTipo) {
            case 'Psíquico': return 'bg-purple-800/20';
            case 'Carnívoro': return 'bg-red-800/20';
            case 'Humano': return 'bg-yellow-800/20';
            case 'Mágico': return 'bg-blue-800/20';
            default: return 'bg-gray-800/20';
        }
    };

    // Objeto completo de la carta para pasar al manejador de clics
    const cardData: CardProps = { nombre, tipo, ataque, defensa, vida, imagen, numero, ...rest };

    return (
        <div 
            // Estilos generales de la carta y el hover
            className={`w-40 md:w-56 h-auto bg-gray-900 text-white rounded-xl overflow-hidden cursor-pointer 
                        transform hover:scale-105 transition duration-300 ease-in-out 
                        border-4 ${getTipoColor(tipo)} shadow-2xl`}
            // Al hacer clic, se llama a la función para abrir el modal de detalles
            onClick={() => onCardClick(cardData)}
        >
            {/* Encabezado: Número y Tipo */}
            <div className={`p-2 text-center text-sm font-semibold ${getTipoBg(tipo)}`}>
                #{numero} - {tipo}
            </div>
            
            {/* Imagen de la Carta */}
            <div className="p-1">
                <img 
                    src={imagen} 
                    alt={nombre} 
                    className="w-full h-32 md:h-48 object-cover rounded-md border border-gray-700"
                />
            </div>

            <div className="p-3">
                {/* Nombre de la Carta */}
                <h3 className="text-lg md:text-xl font-extrabold truncate text-red-400 mb-2">
                    {nombre}
                </h3>
                
                {/* Estadísticas (Ataque, Defensa, Vida) */}
                <div className="flex justify-between text-xs md:text-sm font-medium">
                    <span className="text-red-300">A: {ataque}</span>
                    <span className="text-blue-300">D: {defensa}</span>
                    <span className="text-green-300">V: {vida}</span>
                </div>
            </div>
        </div>
    );
};

export default CardDetail;