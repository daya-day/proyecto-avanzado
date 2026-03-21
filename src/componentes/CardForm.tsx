import React, { useState, useEffect } from 'react';
import type { CardProps } from './Card'; 

type NewCardData = Omit<CardProps, 'id' | 'numero'>; 
type EditCardData = CardProps; 

interface CardFormProps {
    onCancel: () => void;
    
    isEditing: boolean; 
    
    onCreate?: (card: NewCardData) => void;
    
    onUpdate?: (card: EditCardData) => void;
    initialData?: CardProps; 
}

const initialFormState: NewCardData = {
    name: '',
    tipo: 'Psíquico',
    attack: 100,
    defense: 100,
    description: '',
    pictureUrl: '',
    lifePoints: 100,
    number: 0,
    idCard: ''
};

const CardForm: React.FC<CardFormProps> = ({ 
    onCreate, 
    onUpdate, 
    onCancel, 
    isEditing, 
    initialData 
}) => {
    
    const [formData, setFormData] = useState<Omit<CardProps, 'id' | 'numero'> & Partial<Pick<CardProps, 'idCard' | 'number'>>>(
        isEditing && initialData 
            ? initialData 
            : initialFormState
    );
    
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData(initialData);
        } else if (!isEditing) {
            setFormData(initialFormState);
        }
    }, [isEditing, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.description || !formData.pictureUrl) {
            alert('Por favor, rellena todos los campos obligatorios (Nombre, Descripción, Imagen).');
            return;
        }

        if (isEditing && onUpdate) {
            onUpdate(formData as CardProps); 
        } else if (!isEditing && onCreate) {
            onCreate(formData as NewCardData);
        }
    };

    const types = ['Psíquico', 'Carnívoro', 'Humano', 'Mágico', 'Otro'];

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={onCancel}
        >
            <div 
                className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg text-white border-4 border-red-500 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold text-red-400 mb-6">
                    {isEditing ? `Editar Carta: ${initialData?.name}` : 'Crear Nueva Carta'} 
                </h2>
                
                <button 
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-3xl font-bold text-white hover:text-red-300 transition"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {isEditing && (
                        <label className="block">
                            <span className="text-gray-300 font-semibold">Número de Carta:</span>
                            <input
                                type="text"
                                value={`#${formData.number}`}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                                disabled 
                            />
                        </label>
                    )}

                    <label className="block">
                        <span className="text-gray-300 font-semibold">Nombre:</span>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-300 font-semibold">Imagen URL:</span>
                        <input
                            type="url"
                            name="imagen"
                            value={formData.pictureUrl}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                            placeholder="Ej: https://via.placeholder.com/300"
                            required
                        />
                    </label>
                    
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
                    
                    <div className="flex gap-4">
                        <label className="block w-1/3">
                            <span className="text-red-300 font-semibold">Ataque:</span>
                            <input
                                type="number"
                                name="ataque"
                                value={formData.attack}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                                min="0"
                                max="999"
                            />
                        </label>
                        <label className="block w-1/3">
                            <span className="text-blue-300 font-semibold">Defensa:</span>
                            <input
                                type="number"
                                name="defensa"
                                value={formData.defense}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                                min="0"
                                max="999"
                            />
                        </label>
                         <label className="block w-1/3">
                            <span className="text-green-300 font-semibold">Vida:</span>
                            <input
                                type="number"
                                name="vida"
                                value={formData.lifePoints}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2 focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                                min="0"
                                max="999"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-gray-300 font-semibold">Descripción:</span>
                        <textarea
                            name="descripcion"
                            value={formData.description}
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
                            {isEditing ? 'Guardar Cambios' : 'Crear Carta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;
