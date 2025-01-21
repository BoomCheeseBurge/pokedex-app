import Header from './components/Header'
import SideNav from './components/SideNav'
import PokeCard from './components/PokeCard'
import { useState } from 'react';

function App() {

    const [selectedPokemon, setSelectedPokemon] = useState(0);
    const [showSideMenu, setShowSideMenu] = useState(false);

    function handleToggleSideMenu() {
        
        setShowSideMenu(!showSideMenu);
    }

    function handleCloseSideMenu() {
        
        setShowSideMenu(false);
    }

  return (
    <>
        <Header handleToggleSideMenu={handleToggleSideMenu} />
        <SideNav selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} handleCloseSideMenu={handleCloseSideMenu} showSideMenu={showSideMenu} />
        <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App
