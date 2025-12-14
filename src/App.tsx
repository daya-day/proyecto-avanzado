import { useState } from 'react';
import './App.css';
import CardDetailsModal from './componentes/CardDetailsModal';
import CardDetail from './componentes/mazo';
import CardForm from './componentes/CardForm';
import type { CardProps } from './componentes/Card';


const initialCards: CardProps[] = [
    {
        id: 'c1',
        numero: 1,
        nombre: 'Eleven',
        descripcion: 'Una niña con poderes psíquicos que puede mover objetos con la mente, contactar con otras dimensiones y es la clave para derrotar al Upside Down.',
        ataque: 150,
        defensa: 100,
        vida: 100,
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
        vida:200,
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
    // 🆕 Estado de Edición: Almacena la carta que estamos editando
    const [editingCard, setEditingCard] = useState<CardProps | null>(null);


    // Manejador para mostrar el Modal de Detalle
    const handleCardClick = (card: CardProps) => {
        setSelectedCard(card);
    };

    // Manejador para cerrar el Modal de Detalle/Edición
    const handleCloseModal = () => {
        setSelectedCard(null);
        setEditingCard(null); // Borra el estado de edición
        setShowCreateForm(false); // Borra el estado de creación
    };
    
    // ⚡️ Lógica para crear una nueva carta
    const handleCreateCard = (newCardData: Omit<CardProps, 'id' | 'numero'>) => {
        const newCard: CardProps = {
            ...newCardData,
            id: `c${Date.now()}`,
            numero: cards.length + 1, // Asignar el siguiente número de carta
        };

        setCards([...cards, newCard]);
        setShowCreateForm(false);
    };

    // 🔄 Lógica para actualizar una carta existente
    const handleUpdateCard = (updatedData: CardProps) => {
        const updatedCards = cards.map(card => 
            card.id === updatedData.id ? updatedData : card
        );
        setCards(updatedCards);
        setEditingCard(null); // Cierra el formulario de edición
    };

    // 🗑️ Lógica para eliminar una carta
    const handleDeleteCard = (cardId: string) => {
        const updatedCards = cards.filter(card => card.id !== cardId);
        setCards(updatedCards);

        if (selectedCard && selectedCard.id === cardId) {
            setSelectedCard(null);
        }
    };

    // 📐 FUNCIÓN PARA INICIAR LA EDICIÓN desde el modal de detalle
    const handleStartEdit = (card: CardProps) => {
        setEditingCard(card);    // Carga los datos de la carta al estado de edición
        setSelectedCard(null); // Cierra el modal de detalle
    };


    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-6">
            
            {/* 🎯 TÍTULOS INICIALES */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Cartas de Stranger Things</h1>
                <p className="text-red-400">Colecciona y juega con tus personajes favoritos</p>
            </div>

            {/* Colección de Cartas */}
            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {cards.map(card => (
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
                    onClick={() => setShowCreateForm(true)} 
                    className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                >
                    Crear Carta
                </button>
            
            </div>

            {/* Formulario de Creación (Modal) */}
            {showCreateForm && (
                <CardForm 
                    isEditing={false}
                    onCreate={handleCreateCard} 
                    onCancel={handleCloseModal} 
                />
            )}

            {/* Formulario de Edición (Modal) */}
            {editingCard && (
                <CardForm
                    isEditing={true}
                    initialData={editingCard}
                    onUpdate={handleUpdateCard}
                    onCancel={handleCloseModal}
                />
            )}

            {/* Modal de Detalle */}
            <CardDetailsModal
                card={selectedCard}
                onClose={handleCloseModal}
                onDelete={handleDeleteCard}
                onEdit={handleStartEdit}
            />
        </div>
    )
}

export default App