// src/componentes/CardForm.tsx

import React, { useState, useEffect } from 'react';
import type { CardProps } from './Card'; 

// Tipos de datos para el formulario
type NewCardData = Omit<CardProps, 'id' | 'numero'>; // Para Creación
type EditCardData = CardProps; // Para Edición

// Interfaz de propiedades del componente
interface CardFormProps {
    onCancel: () => void;
    
    // Prop para controlar si estamos creando o editando
    isEditing: boolean; 
    
    // Propiedades específicas del modo Creación
    onCreate?: (card: NewCardData) => void;
    
    // Propiedades específicas del modo Edición
    onUpdate?: (card: EditCardData) => void;
    initialData?: CardProps; // Datos precargados en modo edición
}

const initialFormState: NewCardData = {
    nombre: '',
    tipo: 'Psíquico',
    ataque: 100,
    defensa: 100,
    descripcion: '',
    imagen: '',
    vida: 100,
};

const CardForm: React.FC<CardFormProps> = ({ 
    onCreate, 
    onUpdate, 
    onCancel, 
    isEditing, 
    initialData 
}) => {
    
    // El estado del formulario puede contener datos de CardProps o solo NewCardData
    const [formData, setFormData] = useState<Omit<CardProps, 'id' | 'numero'> & Partial<Pick<CardProps, 'id' | 'numero'>>>(
        isEditing && initialData 
            ? initialData 
            : initialFormState
    );
    
    // Sincroniza los datos iniciales cuando el componente cambia entre modos o recibe nuevos datos
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
            // Convierte valores a número si el tipo es 'number'
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.descripcion || !formData.imagen) {
            alert('Por favor, rellena todos los campos obligatorios (Nombre, Descripción, Imagen).');
            return;
        }

        if (isEditing && onUpdate) {
            // MODO EDICIÓN: Llama a onUpdate (necesita todos los campos, incluido el ID)
            onUpdate(formData as CardProps); 
        } else if (!isEditing && onCreate) {
            // MODO CREACIÓN: Llama a onCreate (excluye ID y número)
            onCreate(formData as NewCardData);
        }
    };

    const types = ['Psíquico', 'Carnívoro', 'Humano', 'Mágico', 'Otro'];

    return (
        // Modal Overlay 
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={onCancel}
        >
            {/* Contenido del Formulario */}
            <div 
                className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg text-white border-4 border-red-500 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold text-red-400 mb-6">
                    {isEditing ? `Editar Carta: ${initialData?.nombre}` : 'Crear Nueva Carta'} 
                </h2>
                
                <button 
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-3xl font-bold text-white hover:text-red-300 transition"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Número de Carta (Solo visible y deshabilitado en edición) */}
                    {isEditing && (
                        <label className="block">
                            <span className="text-gray-300 font-semibold">Número de Carta:</span>
                            <input
                                type="text"
                                value={`#${formData.numero}`}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                                disabled 
                            />
                        </label>
                    )}

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
                    
                    {/* Estadísticas (Ataque, Defensa, Vida) */}
                    <div className="flex gap-4">
                        <label className="block w-1/3">
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
                        <label className="block w-1/3">
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
                         <label className="block w-1/3">
                            <span className="text-green-300 font-semibold">Vida:</span>
                            <input
                                type="number"
                                name="vida"
                                value={formData.vida}
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
                            {isEditing ? 'Guardar Cambios' : 'Crear Carta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;