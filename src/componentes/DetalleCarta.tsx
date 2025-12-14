import React from 'react';
import type { CartaProps } from './mazo.tsx';

interface DetalleCartaProps {
  carta: CartaProps;
  onCerrar: () => void; // Función para cerrar la vista de detalle
}

const DetalleCarta: React.FC<DetalleCartaProps> = ({ carta, onCerrar }) => {
  return (
    // Contenedor principal del modal/vista de detalle
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      
      {/* Contenedor de la Tarjeta de Detalle */}
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl border-4 border-red-700 w-full max-w-4xl p-6 relative flex flex-col md:flex-row">
        
        {/* Botón de Cerrar */}
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-3xl font-bold transition duration-200"
          aria-label="Cerrar detalles"
        >
          &times;
        </button>

        {/* Bloque Izquierdo: Información Vertical */}
        <div className="md:w-1/2 md:pr-6 order-2 md:order-1 mt-4 md:mt-0">
          <h1 className="text-3xl font-extrabold text-yellow-300 border-b border-red-700 pb-2 mb-4">
            {carta.nombre}
          </h1>
          
          <p className="text-lg mb-4 italic text-gray-300">"{carta.descripcion}"</p>

          <div className="space-y-3">
            {/* Fila de Estadísticas */}
            <div className="flex justify-between items-center p-3 bg-red-800/50 rounded-lg">
              <span className="font-semibold uppercase tracking-wider text-sm">ID de Carta:</span>
              <span className="text-xl font-bold text-yellow-300">{carta.id}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-800/50 rounded-lg">
              <span className="font-semibold uppercase tracking-wider text-sm">Vida (HP):</span>
              <span className="text-2xl font-bold">{carta.vida}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-700/50 rounded-lg">
              <span className="font-semibold uppercase tracking-wider text-sm">Ataque:</span>
              <span className="text-2xl font-bold">{carta.ataque}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-700/50 rounded-lg">
              <span className="font-semibold uppercase tracking-wider text-sm">Defensa:</span>
              <span className="text-2xl font-bold">{carta.defensa}</span>
            </div>
          </div>
        </div>

        {/* Bloque Derecho: Imagen Grande */}
        <div className="md:w-1/2 order-1 md:order-2">
          <img
            src={carta.imagenUrl}
            alt={carta.nombre}
            className="w-full h-auto object-cover rounded-lg border-2 border-yellow-300"
          />
        </div>
      </div>
    </div>
  );
};

export default DetalleCarta;