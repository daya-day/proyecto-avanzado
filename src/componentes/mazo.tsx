 import React from 'react';
import type { CardProps } from './Card'; 

interface CardDetailProps extends CardProps {
    onCardClick: (card: CardProps) => void;
}

const CardDetail: React.FC<CardDetailProps> = (props) => {
    const { name, tipo, attack, defense, lifePoints, pictureUrl, number, onCardClick, ...rest } = props;
    console.log(props);
    

    const getTipoColor = (cardTipo: string) => {
        switch (cardTipo) {
            case 'Psíquico': return 'border-purple-500 shadow-purple-900/50';
            case 'Carnívoro': return 'border-red-500 shadow-red-900/50';
            case 'Humano': return 'border-yellow-500 shadow-yellow-900/50';
            case 'Mágico': return 'border-blue-500 shadow-blue-900/50';
            default: return 'border-gray-500 shadow-gray-900/50';
        }
    };
    
    const getTipoBg = (cardTipo: string) => {
        switch (cardTipo) {
            case 'Psíquico': return 'bg-purple-800/20';
            case 'Carnívoro': return 'bg-red-800/20';
            case 'Humano': return 'bg-yellow-800/20';
            case 'Mágico': return 'bg-blue-800/20';
            default: return 'bg-gray-800/20';
        }
    };

    const cardData: CardProps = { name, tipo, attack, defense, lifePoints, pictureUrl, number, ...rest };

    return (
        <div 
            className={`w-40 md:w-56 h-auto bg-gray-900 text-white rounded-xl overflow-hidden cursor-pointer 
                        transform hover:scale-105 transition duration-300 ease-in-out 
                        border-4 ${getTipoColor(tipo)} shadow-2xl`}
            onClick={() => onCardClick(cardData)}
        >
           
            <div className={`p-2 text-center text-sm font-semibold ${getTipoBg(tipo)}`}>
                #{number} - {tipo}
            </div>
            
            
            <div className="p-1">
                <img 
                    src={pictureUrl} 
                    alt={name} 
                    className="w-full h-32 md:h-48 object-cover rounded-md border border-gray-700"
                />
            </div>

            <div className="p-3">
                
                <h3 className="text-lg md:text-xl font-extrabold truncate text-red-400 mb-2">
                    {name}
                </h3>
            
                <div className="flex justify-between text-xs md:text-sm font-medium">
                    <span className="text-red-300">A: {attack}</span>
                    <span className="text-blue-300">D: {defense}</span>
                    <span className="text-green-300">V: {lifePoints}</span>
                </div>
            </div>
        </div>
    );
};

export default CardDetail;

