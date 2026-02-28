import { useState } from 'react';
import './App.css';
import CardDetailsModal from './componentes/CardDetailsModal';
import CardDetail from './componentes/mazo';
import CardForm from './componentes/CardForm'; 
import type { CardProps } from './componentes/Card';


const initialCards: CardProps[] = [
    {
        idCard: 'c1',
        number: 1,
        name: 'Eleven',
        description: 'Una niña con poderes psíquicos que puede mover objetos con la mente, contactar con otras dimensiones y es la clave para derrotar al Upside Down.',
        attack: 150,
        defense: 100,
        lifePoints: 100,
        pictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO7WUFGtnHlkz29L5vLQoCX48wCKHsJ8fzaQ&s',
        tipo: 'Psíquico',
    },
    {
        idCard: 'c2',
        attack: 200,
        name: 'Demogorgon',
        defense: 100,
        description: 'Criatura depredadora originaria del Upside Down, caracterizada por su apariencia humanoide sin rostro y su capacidad para viajar entre dimensiones.',
        pictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgK_PhrvIxq6EYhWZHKEp_0QYAK2D5ktlZwA&s',
        number: 2,
        lifePoints:200,
        tipo: 'Carnívoro',
    },
];

function App() {
    const [cards, setCards] = useState<CardProps[]>(initialCards);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCard, setEditingCard] = useState<CardProps | null>(null);

    const handleCardClick = (card: CardProps) => {
        setSelectedCard(card);
    };

    
    const handleCloseModal = () => {
        setSelectedCard(null);
        setEditingCard(null); 
        setShowCreateForm(false); 
    };
    
    const handleCreateCard = (newCardData: Omit<CardProps, 'id' | 'numero'>) => {
        const newCard: CardProps = {
            ...newCardData,
            idCard: `c${Date.now()}`,
            number: cards.length + 1, 
        };

        setCards([...cards, newCard]);
        setShowCreateForm(false);
    };
    const handleUpdateCard = (updatedData: CardProps) => {
        const updatedCards = cards.map(card => 
            card.idCard === updatedData.idCard ? updatedData : card
        );
        setCards(updatedCards);
        setEditingCard(null); 
    };

    const handleDeleteCard = (cardId: string) => {
        const updatedCards = cards.filter(card => card.idCard !== cardId);
        setCards(updatedCards);

        if (selectedCard && selectedCard.idCard === cardId) {
            setSelectedCard(null);
        }
    };

    const handleStartEdit = (card: CardProps) => {
        setEditingCard(card);    
        setSelectedCard(null); 
    };


    return (
        
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-6">
            
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Cartas de Stranger Things</h1>
                <p className="text-red-400">Colecciona y juega con tus personajes favoritos</p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {cards.map(card => (
                    <div key={card.idCard} className="transform hover:rotate-2 transition duration-300">
                        <CardDetail
                            {...card}
                            onCardClick={handleCardClick}
                        />
                    </div>
                ))}
            </div>

            <br />
            <div className='flex flex-wrap justify-center gap-8 max-w-7xl mx-auto'>
                <button 
                    onClick={() => setShowCreateForm(true)} 
                    className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                >
                    Crear Carta
                </button>
            
            </div>

            {showCreateForm && (
                <CardForm 
                    isEditing={false}
                    onCreate={handleCreateCard} 
                    onCancel={handleCloseModal} 
                />
            )}

            {editingCard && (
                <CardForm
                    isEditing={true}
                    initialData={editingCard}
                    onUpdate={handleUpdateCard}
                    onCancel={handleCloseModal}
                />
            )}

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
