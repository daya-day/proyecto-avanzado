import './App.css'
import './componentes/mazo'
import CardDetail from './componentes/mazo'


function App(){

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
        
      <button className='bg-indigo-400 hover:bg-amber-200 '>ola</button>
    
    </div>
  )

}
export default App
