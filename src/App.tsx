import Carta from './componentes/carta';
import type { CartaProps } from './componentes/mazo';

const ejemploCarta: CartaProps = {
  id: 1,
  nombre: "Once",
  descripcion: "Una chica con habilidades psicocinéticas y la clave para abrir y cerrar portales al Upside Down.",
  ataque: 95,
  defensa: 60,
  vida: 80,
  imagenUrl: "URL_DE_LA_IMAGEN_DE_ONCE.jpg" // Reemplaza con una URL real
};

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <Carta {...ejemploCarta} />
    </div>
  );
};

export default App;