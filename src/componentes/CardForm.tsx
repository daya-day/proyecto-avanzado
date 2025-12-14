// src/componentes/CardForm.tsx

import React, { useState } from 'react';
import type { CardProps } from './Card'; // Asegúrate de que la ruta sea correcta

// Definimos el tipo de datos que se enviarán, omitiendo 'id' y 'numero' ya que se generan en App.tsx
type NewCardData = Omit<CardProps, number>;

interface CardFormProps {
    onCreate: (card: NewCardData) => void;
    onCancel: () => void;
}

const initialFormState: NewCardData = {
    nombre: '',
    tipo: 'Psíquico', // Valor por defecto
    ataque: 100,
    defensa: 100,
    descripcion: '',
    imagen: '',
    vida: 100,
    id: '',
    numero: 0
};

const CardForm: React.FC<CardFormProps> = ({ onCreate, onCancel }) => {
    const [formData, setFormData] = useState<NewCardData>(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value, // Convertir a número si es necesario
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Pequeña validación básica
        if (!formData.nombre || !formData.descripcion || !formData.imagen) {
            alert('Por favor, rellena todos los campos obligatorios (Nombre, Descripción, Imagen).');
            return;
        }

        onCreate(formData); // Llama a la función de creación de App.tsx
    };

    // Opciones para el tipo de carta
    const types = ['Psíquico', 'Carnívoro', 'Humano', 'Mágico', 'Otro'];

    return (
        // Modal Overlay
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={onCancel} // Cierra si hace clic en el fondo
        >
            {/* Contenido del Formulario */}
            <div 
                className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg text-white border-4 border-red-500 relative"
                onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
            >
                <h2 className="text-3xl font-bold text-red-400 mb-6">Crear Nueva Carta</h2>
                
                <button 
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-3xl font-bold text-white hover:text-red-300 transition"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Nombre */}
                    <label className="block">
                        <span className="text-gray-300 font-semibold">Nombre:</span>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                            required
                        />
                    </label>

                    {/* Imagen URL */}
                    <label className="block">
                        <span className="text-gray-300 font-semibold">Imagen URL:</span>
                        <input
                            type="url"
                            name="imagen"
                            value={formData.imagen}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                            placeholder="Ej: https://via.placeholder.com/300"
                            required
                        />
                    </label>

                    {/* Tipo (Select) */}
                    <label className="block">
                        <span className="text-gray-300 font-semibold">Tipo de Carta:</span>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                        >
                            {types.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </label>

                    {/* Estadísticas (Ataque y Defensa) */}
                    <div className="flex gap-4">
                        <label className="block w-1/2">
                            <span className="text-red-300 font-semibold">Ataque:</span>
                            <input
                                type="number"
                                name="ataque"
                                value={formData.ataque}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                                min="0"
                                max="999"
                            />
                        </label>
                        <label className="block w-1/2">
                            <span className="text-blue-300 font-semibold">Defensa:</span>
                            <input
                                type="number"
                                name="defensa"
                                value={formData.defensa}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                                min="0"
                                max="999"
                            />
                        </label>
                    </div>

                    {/* Descripción */}
                    <label className="block">
                        <span className="text-gray-300 font-semibold">Descripción:</span>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                            required
                        ></textarea>
                    </label>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                        >
                            Crear Carta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;