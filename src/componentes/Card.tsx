export interface CardProps {
    idCard: string; 
    number: number;
    name: string;
    tipo: string;
    attack: number;
    defense: number;
    lifePoints: number;
    mana?: number;
    description: string;
    pictureUrl: string;
}