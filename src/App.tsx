import './App.css'
import './componentes/mazo'
import CardDetail from './componentes/mazo'

type Persona = {
  nombre: string;
  apellido: string;
  edad: number;
  cedula: string;
  telefonos?: string[];
}

function App() {
  
  let persona1 : Persona = {
    nombre: 'Pepe',
    apellido: 'El Payaso',
    edad: 20,
    cedula: '123123123'
  }

  let persona2 : Persona = {
    nombre: 'Jaimito',
    apellido: ':p',
    edad: 5,
    cedula: 'XXXXXX'
  }

  let persona3 : Persona = {
    nombre: 'Carlos',
    apellido: 'Rodriguez',
    edad: 45,
    cedula: '2000124'
  }

  let familia: Persona[] = [persona1];
  
  familia.push(persona2);

  familia.push(persona3);

  console.log(familia);

  return (
    <div>
      <CardDetail
        ataque={122}
        nombre="electivire"
        defensa={80}
        descripcion="electivire, el pokemon rayo."
        imagen="https://static.mana.wiki/pokemongo/electivire-main.png?aspect_ratio=1.91:1&height=440"
        numero={373}
        tipo="electrico"
      />
      <CardDetail
        ataque={200}
        nombre="Pikachu"
        defensa={50}
        descripcion="Pikachu, pika pika."
        imagen="https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-blue-version/8/89/Pikachu.jpg"
        numero={1}
        tipo="electrico"
      />
    </div>
  )
}

export default App
