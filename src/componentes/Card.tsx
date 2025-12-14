export interface CardProps {
    id: string; 
    numero: number;
    nombre: string;
    tipo?: string;
    ataque: number;
    defensa: number;
    descripcion: string;
    imagen: string;
}

// 👈 DEFINIMOS el tipo de datos que el formulario va a enviar.
// Omitimos 'id' porque lo genera App.tsx
// Omitimos 'numero' porque lo genera App.tsx
export type NewCardData = Omit<CardProps, 'id' | 'numero'>;