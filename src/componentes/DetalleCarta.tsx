import React from 'react';
import type { CardProps } from './Card'; 

interface DetalleCartaProps {
  carta: CardProps; 
  onCerrar: () => void;
}

const DetalleCarta: React.FC<DetalleCartaProps> = ({ carta, onCerrar }) => {
  return (
    <div className="fixed inset-0 bg-st-black bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl border-4 border-st-red 
                      shadow-[0_0_20px_10px_rgba(229,9,20,0.6)] w-full max-w-5xl p-6 relative 
                      flex flex-col md:flex-row animate-fadeIn">
        
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 text-st-red hover:text-red-400 text-4xl font-light 
                     transition duration-200 leading-none"
          aria-label="Cerrar detalles"
        >
          &times;
        </button>

        <div className="md:w-1/2 md:pr-8 order-2 md:order-1 mt-4 md:mt-0 border-r border-st-red/50">
          <h1 className="text-5xl font-extrabold text-st-yellow font-retro uppercase tracking-widest 
                         pb-3 mb-5 border-b-4 border-st-red text-shadow-red">
            {carta.name}
          </h1>
          
          <p className="text-lg mb-6 italic text-gray-300 border-l-4 border-yellow-300 pl-3">
            "{carta.description}"
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-st-red/20 rounded-lg border border-st-red/50">
              <span className="font-semibold uppercase tracking-wider text-sm">ID de Carta:</span>
              <span className="text-xl font-bold text-st-yellow">{carta.idCard}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-900/50 rounded-lg">
              <span className="font-semibold uppercase tracking-wider text-sm text-green-400">Vida (HP):</span>
              <span className="text-3xl font-extrabold text-green-300">{carta.lifePoints}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-st-red/50 rounded-lg">
              <span className="font-semibold uppercase tracking-wider text-sm text-st-red">Ataque:</span>
              <span className="text-3xl font-extrabold text-red-300">{carta.attack}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-900/50 rounded-lg">
              <span className="font-semibold uppercase tracking-wider text-sm text-blue-400">Defensa:</span>
              <span className="text-3xl font-extrabold text-blue-300">{carta.defense}</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 order-1 md:order-2 flex justify-center items-center p-2">
          <img
            src={carta.pictureUrl}
            alt={carta.name}
            className="w-full h-auto object-cover rounded-lg border-4 border-st-yellow 
                       shadow-xl shadow-st-red/50 transition duration-500 hover:shadow-st-red"
          />
        </div>
      </div>
    </div>
  );
};

export default DetalleCarta;