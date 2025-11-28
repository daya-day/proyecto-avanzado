import './componentes/mazo'
import './App.css'
import CardDetail from './componentes/mazo'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Cartas de Stranger Things</h1>
        <p className="text-red-400">Colecciona y juega con tus personajes favoritos</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">


        <div className="bg-gradient-to-b from-white to-gray-50 border-4 border-red-500 rounded-xl overflow-hidden transform hover:scale-105 hover:rotate-2 transition duration-300 shadow-2xl hover:shadow-red-500/20 w-80 h-[500px] flex flex-col">
          <CardDetail
            numero={1}
            nombre='Eleven'
            descripcion='Una niña con poderes psíquicos que puede mover objetos con la mente.'
            ataque={150}
            defensa={70}
            imagen='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCEoUSUTyrbtk1R7GyTN9NSl_Cw-CipjQrRA&s'
            tipo='Psíquico'
          />
        </div>


        <div className="bg-gradient-to-b from-white to-gray-50 border-4 border-purple-500 rounded-xl overflow-hidden transform hover:scale-105 hover:rotate-2 transition duration-300 shadow-2xl hover:shadow-purple-500/20 w-80 h-[500px] flex flex-col">
          <CardDetail
            ataque={200}
            nombre="Demogorgon"
            defensa={100}
            descripcion="Criatura del upside down que acecha en las sombras."
            imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgK_PhrvIxq6EYhWZHKEp_0QYAK2D5ktlZwA&s"
            numero={2}
            tipo="Carnívoro"
          />
        </div>
      </div>
      <br />
      <div className='flex flex-wrap justify-center gap-8 max-w-7xl mx-auto'>
        <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">Crear</button>
        <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">Eliminar</button>
        <button className="h-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200">Editar</button>
      </div>
    </div>

  )
}

export default App
