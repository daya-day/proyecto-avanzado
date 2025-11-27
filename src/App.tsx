import './App.css'
import './componentes/mazo'
import CardDetail from './componentes/mazo'


function App(){

  return (
    <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
    <div className="min-h-screen bg-gray-100 p-6"></div>
    <h1 className="text-3xl font-bold text-center mb-8 text-red-600">Cartas de Stranger Things</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"></div>

    <div className="bg-gradient-to-b from-white to-gray-50 border-2 border-black rounded-lg overflow-hidden transform hover:scale-105 hover:rotate-1 transition duration-300 shadow-lg hover:shadow-2xl w-64 h-96 flex flex-col p-4">
     <CardDetail
      numero={1}
      nombre='Eleven'
      descripcion='Una niña con poderes psíquicos que puede mover objetos con la mente.'
      ataque={150}
      defensa={70}
      imagen='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCEoUSUTyrbtk1R7GyTN9NSl_Cw-CipjQrRA&s'
      tipo='psiquico'
      />
    </div>

      <div className="bg-gradient-to-b from-white to-gray-50 border-2 border-black rounded-lg overflow-hidden transform hover:scale-105 hover:rotate-1 transition duration-300 shadow-lg hover:shadow-2xl w-64 h-96 flex flex-col p-4">
      <CardDetail
        ataque={200}
        nombre="Demogorgon"
        defensa={100}
        descripcion="Criaturq del opside dawn."
        imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgK_PhrvIxq6EYhWZHKEp_0QYAK2D5ktlZwA&s"
        numero={2}
        tipo="Carnivoro"
      />
      </div>

    </div>
  )

}
export default App
