// src/App.tsx

import { useState } from 'react';
import './App.css';
// Importamos la interfaz y los componentes necesarios
import CardDetailsModal from './componentes/CardDetailsModal';
import CardDetail from './componentes/mazo';
import type { CardProps } from './componentes/card';


// Datos iniciales de la colección
const initialCards: CardProps[] = [
  {
    id: 'c1',
    numero: 1,
    nombre: 'Eleven',
    descripcion: 'Una niña con poderes psíquicos que puede mover objetos con la mente, contactar con otras dimensiones y es la clave para derrotar al Upside Down.',
    ataque: 150,
    defensa: 70,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO7WUFGtnHlkz29L5vLQoCX48wCKHsJ8fzaQ&s',
    tipo: 'Psíquico',
  },
  {
    id: 'c2',
    ataque: 200,
    nombre: 'Demogorgon',
    defensa: 100,
    descripcion: 'Criatura depredadora originaria del Upside Down, caracterizada por su apariencia humanoide sin rostro y su capacidad para viajar entre dimensiones.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgK_PhrvIxq6EYhWZHKEp_0QYAK2D5ktlZwA&s',
    numero: 2,
    tipo: 'Carnívoro',
  },
];

function App() {
  // Estado para controlar la carta seleccionada para el modal
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);

  const handleCardClick = (card: CardProps) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Cartas de Stranger Things</h1>
        <p className="text-red-400">Colecciona y juega con tus personajes favoritos</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {initialCards.map(card => (
          // El tamaño de la carta ya está definido en CardDetail, solo necesitas el efecto hover
          <div key={card.id} className="transform hover:rotate-2 transition duration-300">
            <CardDetail
              {...card}
              onCardClick={handleCardClick}
            />
          </div>
        ))}
      </div>

      <br />
      <div className='flex flex-wrap justify-center gap-8 max-w-7xl mx-auto'>
        <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">Crear</button>
        <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">Eliminar</button>
        <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">Editar</button>
      </div>

      {/* Modal de Detalle (se muestra si selectedCard no es null) */}
      <CardDetailsModal
        card={selectedCard}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default App