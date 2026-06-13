import CardForm from './CardForm'
import CardDetailsModal from './CardDetailsModal'
import SeleccionarCarta from './SeleccionarCarta' // <- Importamos tu nuevo componente
import { useState } from 'react';
import type { CardProps } from './Card';

type Props = {
    cards: CardProps[];
    setCards: React.Dispatch<React.SetStateAction<CardProps[]>>;
}

function AppV2({ cards, setCards }: Props) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCard, setEditingCard] = useState<CardProps | null>(null);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCardClick = (card: CardProps) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setEditingCard(null);
        setShowCreateForm(false);
    };

    const handleCreateCard = async (newCardData: Omit<CardProps, 'idCard' | 'number'>) => {
        setLoading(true);
        try {
            let urlAPI = 'https://educapi-v2.onrender.com/card';
            const respuesta = await fetch(urlAPI, {
                method: 'POST',
                headers: {
                    usersecretpasskey: 'Daya646842NA',
                    'content-type': 'application/json',
                },
                body: JSON.stringify(newCardData)
            });

            if (respuesta.ok) {
                const resultado = await respuesta.json();
                const newCard: CardProps = {
                    ...newCardData,
                    idCard: resultado.data?.idCard || `c${Date.now()}`,
                    number: cards.length + 1,
                };
                setCards([...cards, newCard]);
            }
        } catch (error) {
            console.error("Error creando carta:", error);
        } finally {
            setLoading(false);
            setShowCreateForm(false);
        }
    };

    const handleUpdateCard = async (updatedData: CardProps) => {
        setLoading(true);
        try {
            let urlAPI = `https://educapi-v2.onrender.com/card/${updatedData.idCard}`;
            const respuesta = await fetch(urlAPI, {
                method: 'PATCH',
                headers: {
                    usersecretpasskey: 'Daya646842NA',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    name: updatedData.name,
                    description: updatedData.description,
                    attack: updatedData.attack,
                    defense: updatedData.defense,
                    lifePoints: updatedData.lifePoints,
                    pictureUrl: updatedData.pictureUrl,
                    tipo: updatedData.tipo
                })
            });

            if (respuesta.ok) {
                const updatedCards = cards.map(card =>
                    card.idCard === updatedData.idCard ? updatedData : card
                );
                setCards(updatedCards);
            }
        } catch (error) {
            console.error("Error actualizando carta:", error);
        } finally {
            setLoading(false);
            setEditingCard(null);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        let urlAPI = `https://educapi-v2.onrender.com/card/${cardId}`;
        try {
            const respuesta = await fetch(urlAPI, {
                method: 'DELETE',
                headers: {
                    usersecretpasskey: 'Daya646842NA',
                },
            });

            if (respuesta.status === 200 || respuesta.ok) {
                setCards((prevCartas) => prevCartas.filter(carta => carta.idCard !== cardId));
            }
        } catch (error) {
            console.error("Error eliminando carta:", error);
        }
    };

    const handleStartEdit = (card: CardProps) => {
        setEditingCard(card);
        setSelectedCard(null);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-6 text-white">

            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wider uppercase drop-shadow-md">
                    Cartas de Stranger Things
                </h1>
                <p className="text-red-500 font-semibold">Selecciona cartas estratégicamente e inicia la batalla</p>
            </div>

            {loading && (
                <p className="text-center text-yellow-500 animate-pulse text-sm mb-4">
                    Sincronizando datos con el Upside Down...
                </p>
            )}

            <SeleccionarCarta 
                cards={cards} 
                setCards={setCards} 
                onCardClick={handleCardClick} 
            />

            <div className='flex justify-center mt-6 mb-12'>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="h-11 bg-red-600 text-white font-bold uppercase tracking-wider px-6 rounded-md hover:bg-red-700 transition duration-200 border border-red-500 shadow-md"
                >
                    Crear Carta Nueva
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

export default AppV2;