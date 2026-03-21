import { useState } from 'react';
import './App.css';
import type { CardProps } from './componentes/Card';
import { Route, Routes } from 'react-router';
import AppV2 from './componentes/AppV2';


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
        lifePoints: 200,
        tipo: 'Carnívoro',
    },
];

function App() {
    const [cards, setCards] = useState<CardProps[]>(initialCards);

    return (
        <Routes>
            <Route path="/" element={< AppV2 cards={cards} setCards={setCards} />} />

        </Routes>
    )
}

export default App
