import React, { useState, useEffect } from 'react';
import type { CardProps } from './Card';
import { useNavigate } from 'react-router';

type NewCardData = Omit<CardProps, 'id' | 'numero'>;

interface CardFormProps {
    onCancel: () => void;
    isEditing: boolean;
    onCreate?: (card: NewCardData) => void;
    onUpdate?: (card: CardProps) => void;
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

    const navigate = useNavigate()

    const [formData, setFormData] = useState<any>(initialFormState);

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData(initialData);
        } else {
            setFormData(initialFormState);
        }
    }, [isEditing, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev: any) => ({
            ...prev,

            [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.pictureUrl) {
            alert('Por favor, rellena los campos obligatorios.');
            return;
        }

        if (isEditing && onUpdate) {
            onUpdate(formData as CardProps);
        } else if (!isEditing && onCreate) {
            onCreate(formData as NewCardData);
        }

        if (isEditing) {

            let urlAPI = `https://educapi-v2.onrender.com/card/${initialData!.idCard}`;

            const respuesta = await fetch(urlAPI, {
                method: 'PATCH',
                headers: {
                    usersecretpasskey: 'Daya646842NA',
                    'content-type': 'application/json',
                },

                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    attack: formData.attack,
                    defense: formData.defense,
                    lifePoints: formData.lifePoints,
                    pictureUrl: formData.pictureUrl,
                    tipo: formData.tipo
                })

            });

            console.log(respuesta);

        }
        else {

            let urlAPI = 'https://educapi-v2.onrender.com/card';

            const respuesta = await fetch(urlAPI, {
                method: 'POST',
                headers: {
                    usersecretpasskey: 'Daya646842NA',
                    'content-type': 'application/json',
                },

                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    attack: formData.attack,
                    defense: formData.defense,
                    lifePoints: formData.lifePoints,
                    pictureUrl: formData.pictureUrl,
                    tipo: formData.tipo
                })

            });

            console.log(respuesta);
        }

        navigate('/');

    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg text-white border-4 border-red-500 relative" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-3xl font-bold text-red-400 mb-6">
                    {isEditing ? `Editar: ${initialData?.name}` : 'Crear Nueva Carta'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-gray-300 font-semibold">Nombre:</span>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-300 font-semibold">Imagen URL:</span>
                        <input
                            type="url"
                            name="pictureUrl"
                            value={formData.pictureUrl}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                        />
                    </label>

                    <div className="flex gap-4">
                        <label className="block w-1/3">
                            <span className="text-red-300 font-semibold">Ataque:</span>
                            <input
                                type="number"
                                name="attack"
                                value={formData.attack}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                            />
                        </label>
                        <label className="block w-1/3">
                            <span className="text-blue-300 font-semibold">Defensa:</span>
                            <input
                                type="number"
                                name="defense"
                                value={formData.defense}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                            />
                        </label>
                        <label className="block w-1/3">
                            <span className="text-green-300 font-semibold">Vida:</span>
                            <input
                                type="number"
                                name="lifePoints"
                                value={formData.lifePoints}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-gray-300 font-semibold">Descripción:</span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-2"
                        ></textarea>
                    </label>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                            {isEditing ? 'Guardar Cambios' : 'Crear Carta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;