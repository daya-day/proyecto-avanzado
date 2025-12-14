// src/App.tsx

import { useState } from 'react';
import './App.css';
import CardDetailsModal from './componentes/CardDetailsModal';
import CardDetail from './componentes/mazo';
import CardForm from './componentes/CardForm'; // 👈 Importamos el nuevo componente
import type { CardProps } from './componentes/Card';

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
    // 1. Estado principal de la colección de cartas
    const [cards, setCards] = useState<CardProps[]>(initialCards);
    // 2. Estado para el Modal de Detalle
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
    // 3. Estado para mostrar/ocultar el Formulario de Creación
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Manejador para mostrar el Modal de Detalle
    const handleCardClick = (card: CardProps) => {
        setSelectedCard(card);
    };

    // Manejador para cerrar el Modal de Detalle
    const handleCloseModal = () => {
        setSelectedCard(null);
    };
    
    // ⚡️ Lógica para crear una nueva carta
    const handleCreateCard = (newCardData: Omit<CardProps, 'id'>) => {
        // Generar un ID único simple (más robusto en producción)
        const newCard: CardProps = {
            ...newCardData,
            id: `c${Date.now()}`,
            numero: cards.length + 1, // Asignar el siguiente número de carta
        };

        // Agregar la nueva carta al estado
        setCards([...cards, newCard]);
        
        // Cerrar el formulario
        setShowCreateForm(false);
    };


    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Cartas de Stranger Things</h1>
                <p className="text-red-400">Colecciona y juega con tus personajes favoritos</p>
            </div>

            {/* Colección de Cartas (usamos el estado 'cards') */}
            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {cards.map(card => ( // 👈 Usamos 'cards' en lugar de 'initialCards'
                    <div key={card.id} className="transform hover:rotate-2 transition duration-300">
                        <CardDetail
                            {...card}
                            onCardClick={handleCardClick}
                        />
                    </div>
                ))}
            </div>

            <br />
            {/* Botones de Acción */}
            <div className='flex flex-wrap justify-center gap-8 max-w-7xl mx-auto'>
                <button 
                    onClick={() => setShowCreateForm(true)} // 👈 Muestra el formulario
                    className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                >
                    Crear Carta
                </button>
                <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200" disabled>
                    Eliminar
                </button>
                <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200" disabled>
                    Editar
                </button>
            </div>

            {/* Formulario de Creación (Modal) */}
            {showCreateForm && (
                <CardForm 
                    onCreate={handleCreateCard} 
                    onCancel={() => setShowCreateForm(false)} 
                />
            )}

            {/* Modal de Detalle */}
            <CardDetailsModal
                card={selectedCard}
                onClose={handleCloseModal}
            />
        </div>
    )
}

export default App