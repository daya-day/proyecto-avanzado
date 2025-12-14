import type { CardProps } from "./Card";

interface CardDetailProps extends CardProps {
    onCardClick: (card: CardProps) => void;
}

function CardDetail({
    ataque,
    defensa,
    vida,
    descripcion,
    imagen,
    nombre,
    numero,
    tipo,
    onCardClick,
    ...cardData
}: CardDetailProps) {

    const card: CardProps = { ataque, defensa, vida, descripcion, imagen, nombre, numero, tipo, ...cardData };
    const borderColor = tipo === 'Psíquico' ? 'border-purple-600' : 'border-red-600';
    const textColor = tipo === 'Psíquico' ? 'text-purple-700' : 'text-red-700';
    const statBgColor = tipo === 'Psíquico' ? 'bg-purple-100' : 'bg-red-100';

    return (
        <div
            
            className={`bg-white border-4 ${borderColor} rounded-xl overflow-hidden 
                        transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 
                        transition duration-300 w-64 h-[400px] flex flex-col cursor-pointer 
                        shadow-lg`}
            onClick={() => onCardClick(card)}
        >
            <img
                src={imagen}
                alt={nombre}
                className="w-full h-1/2 object-cover border-b-2 border-gray-200"
            />

            <div className="p-3 flex flex-col grow text-gray-900">
                <h3 className={`text-xl font-extrabold ${textColor} mb-1`}>
                    {nombre} <span className="text-sm font-light text-gray-500">(#{numero})</span>
                </h3>

                <p className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start 
                                ${tipo === 'Psíquico' ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'} 
                                mb-2 uppercase tracking-wider`}>
                    {tipo}
                </p>

                <p className="text-sm text-gray-600 mb-3 overflow-hidden line-clamp-2">
                    {descripcion}
                </p>

                <div className={`mt-auto pt-2 border-t border-gray-200`}>
                    <div className="flex justify-between text-sm font-bold">
                        <span className={`px-2 py-1 rounded ${statBgColor} text-gray-800`}>
                            ATAQUE: <span className="text-lg font-extrabold text-red-700">{ataque}</span>
                        </span>
                        <span className={`px-2 py-1 rounded ${statBgColor} text-gray-800`}>
                            DEFENSA: <span className="text-lg font-extrabold text-blue-700">{defensa}</span>
                        </span>
                        <span className={`px-2 py-1 rounded ${statBgColor} text-gray-800`}>
                            VIDA: <span className="text-lg font-extrabold text-blue-700">{defensa}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardDetail;
