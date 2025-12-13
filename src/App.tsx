import React, { useState } from 'react';
import type { CartaProps } from './componentes/mazo';
import Carta from './componentes/carta';
import DetalleCarta from './componentes/DetalleCarta';

// Ejemplo de datos (puedes tener un array más grande)
const cartasData: CartaProps[] = [
  {
    id: 1,
    nombre: "Once (Eleven)",
    descripcion: "Una chica con habilidades psicocinéticas y la clave para abrir y cerrar portales al Upside Down.",
    ataque: 95,
    defensa: 60,
    vida: 80,
    imagenUrl: "https://via.placeholder.com/400x500/A020F0/FFFFFF?text=Eleven" // Placeholder
  },
  {
    id: 2,
    nombre: "Demogorgon",
    descripcion: "Criatura depredadora y hostil del Upside Down, atraída por la sangre y la energía psíquica.",
    ataque: 85,
    defensa: 90,
    vida: 110,
    imagenUrl: "https://via.placeholder.com/400x500/8B0000/FFFFFF?text=Demogorgon" // Placeholder
  },
];

const App: React.FC = () => {
  // Estado para guardar la carta seleccionada o null si no hay ninguna
  const [cartaSeleccionada, setCartaSeleccionada] = useState<CartaProps | null>(null);

  // Función para manejar el clic en la carta
  const handleCardClick = (carta: CartaProps) => {
    setCartaSeleccionada(carta);
  };

  // Función para cerrar la vista de detalle
  const handleCloseDetail = () => {
    setCartaSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <h1 className="text-4xl text-center text-red-500 font-extrabold mb-8 uppercase tracking-widest">
        Cartas de Stranger Things
      </h1>

      {/* Grid de Cartas */}
      <div className="flex flex-wrap justify-center gap-6">
        {cartasData.map((carta) => (
          <Carta
            key={carta.id}
            {...carta}
            onClick={() => handleCardClick(carta)} // Pasamos la función de clic
          />
        ))}
      </div>

      {/* Vista de Detalle (Se muestra condicionalmente) */}
      {cartaSeleccionada && (
        <DetalleCarta
          carta={cartaSeleccionada}
          onCerrar={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default App;