import { useEffect, useState } from 'react';
import './App.css';
import type { CardProps } from './componentes/Card';
import { Route, Routes } from "react-router";
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

    const getCartas = async () => {
        let urlAPI = 'https://educapi-v2.onrender.com/card';

        const respuesta = await fetch(urlAPI, {
            method: 'GET',
            headers: {
                usersecretpasskey: 'Daya646842NA',
            },
        });

        const objeto = await respuesta.json();
        setCards(objeto.data)

        console.log(objeto.data);
    };

    useEffect(() => {
        getCartas();
    }, []);



    return (
        <Routes>
            <Route path="/" element={<AppV2 cards={cards} setCards={setCards} />} />
            <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
                    <h1 className="text-9xl font-bold text-red-600">404</h1>
                    <p className="text-2xl mt-4">Has entrado al Upside Down...</p>
                    <p className="text-gray-400 mb-8">Esta página no existe en nuestra dimensión.</p>
                    <a href="/" className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition">
                        Volver a Hawkins
                    </a>
                </div>
            } />
        </Routes>
    )
}

export default App
