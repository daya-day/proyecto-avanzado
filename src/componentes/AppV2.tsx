
import CardForm from './CardForm'
import CardDetailsModal from './CardDetailsModal'
import CardDetail from './mazo'
import { useState } from 'react';
import type { CardProps } from './Card';

type Props = {
    cards: CardProps[];
    setCards: Function
}

function AppV2({ cards, setCards }: Props) {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCard, setEditingCard] = useState<CardProps | null>(null);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);

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

    const handleDeleteCard = async (cardId: string) => {

        let urlAPI = `https://educapi-v2.onrender.com/card/${cardId}`;

        const respuesta = await fetch(urlAPI, {
            method: 'DELETE',
            headers: {
                usersecretpasskey: 'Daya646842NA',
            },

        });

        if (respuesta.status === 200) {
            
            // En lugar de llamar al servidor, quitamos el ID eliminado del estado local
            setCards((prevCartas: any[]) => prevCartas.filter(carta => carta.id !== cardId));
        }

        //const updatedCards = cards.filter(card => card.idCard !== cardId);
        //setCards(updatedCards);

        //if (selectedCard && selectedCard.idCard === cardId) {
        //    setSelectedCard(null);
        //}
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
                            onCardClick={handleCardClick} />
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
                    onCancel={handleCloseModal} />
            )}

            {editingCard && (
                <CardForm
                    isEditing={true}
                    initialData={editingCard}
                    onUpdate={handleUpdateCard}
                    onCancel={handleCloseModal} />
            )}

            <CardDetailsModal
                card={selectedCard}
                onClose={handleCloseModal}
                onDelete={handleDeleteCard}
                onEdit={handleStartEdit} />
        </div>
    )
}

export default AppV2