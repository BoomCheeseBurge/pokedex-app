import { useState } from 'react';
import { first151Pokemon, getFullPokedexNumber } from '../utils'

function SideNav(props) {

    const { selectedPokemon, setSelectedPokemon, handleCloseSideMenu, showSideMenu } = props;

    const [searchInput, setSearchInput] = useState('');

    const filteredPokemon = first151Pokemon.filter((val, valIndex) => {

        // Check if the pokedex number matches the search input value
        if (getFullPokedexNumber(valIndex).includes(searchInput)) {
            return true;
        }

        // Check if the pokemon name matches the search input value
        if (val.toLowerCase().includes(searchInput.toLowerCase())) return true;

        // Else, this pokemon is excluded from the list
        return false;
    });
    
    return (
        <nav className={showSideMenu ? 'open' : ''}>
            <div className={'header ' + (showSideMenu ? 'open' : '')}>
                <button className="open-nav-button" onClick={handleCloseSideMenu}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>

                <h1 className="text-gradient">Pokėdex</h1>
            </div>

            <input placeholder='E.g. 001 or Bulba...' type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>

            {
                filteredPokemon.map((pokemon, pokeIndex) => {

                    const pokedexNumber = first151Pokemon.indexOf(pokemon);

                    return (
                        <button key={pokeIndex} className={'nav-card ' + (pokeIndex === selectedPokemon ? 'nav-card-selected' : '')} type="button" onClick={() => {
                            
                            setSelectedPokemon(pokedexNumber);
                            handleCloseSideMenu();
                        }}>
                            <p>{getFullPokedexNumber(pokedexNumber)}</p>
                            <p>{pokemon}</p>
                        </button>
                    );
                })
            }
        </nav>
    );
}

export default SideNav;