import React from 'react';
import type { CartaProps } from './mazo.tsx';

// Añadimos una nueva prop: onClick
interface CartaComponentProps extends CartaProps {
    onClick: () => void;
}

// Usamos el nuevo tipo en el componente
const Carta: React.FC<CartaComponentProps> = ({ 
    nombre, 
    descripcion, 
    ataque, 
    defensa, 
    vida, 
    imagenUrl,
    onClick // Recibimos la función de click
}) => {
  return (
    // Hacemos que el div sea clickeable y tenga estilo de puntero
    <div 
      className="max-w-xs rounded-xl overflow-hidden shadow-2xl bg-gray-900 border border-red-700 transform hover:scale-105 transition duration-300 m-4 cursor-pointer"
      onClick={onClick} // Añadimos el manejador de clic
    >
      
      {/* ... (El resto del contenido de la carta sigue igual) ... */}
      
      {/* Encabezado e Imagen */}
      <div className="relative h-64">
        <img 
          className="w-full h-full object-cover" 
          src={imagenUrl} 
          alt={nombre} 
        />
        {/* Nombre de la Carta (con un estilo temático) */}
        <div className="absolute top-0 left-0 right-0 p-2 bg-red-800 bg-opacity-90 text-center">
          <h2 className="text-xl font-extrabold text-yellow-300 uppercase tracking-widest">{nombre}</h2>
        </div>
      </div>
      
      {/* Cuerpo de la Carta (Descripción y Stats) */}
      <div className="p-4 text-white">
        <p className="text-sm italic mb-3 h-12 overflow-hidden">{descripcion}</p>
        
        <div className="h-px bg-red-700 mb-3"></div> {/* Separador */}

        {/* Bloque de Estadísticas (Stats) */}
        <div className="flex justify-between text-center font-bold">
          {/* Vida */}
          <div className="flex flex-col items-center bg-green-700 p-2 rounded-lg w-1/3 mr-1">
            <span className="text-xs uppercase">Vida</span>
            <span className="text-2xl">{vida}</span>
          </div>
          {/* Ataque */}
          <div className="flex flex-col items-center bg-red-700 p-2 rounded-lg w-1/3 mx-0.5">
            <span className="text-xs uppercase">Ataque</span>
            <span className="text-2xl">{ataque}</span>
          </div>
          {/* Defensa */}
          <div className="flex flex-col items-center bg-blue-700 p-2 rounded-lg w-1/3 ml-1">
            <span className="text-xs uppercase">Defensa</span>
            <span className="text-2xl">{defensa}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carta;