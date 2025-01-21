import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

function PokeCard(props) {

    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(false);

    /**
     * If data is null, then destructure out of the empty object instead, otherwise, destructuring a null value will cause an error
     */
    const { name, height, abilities, stats, types, moves, sprites } = data || {};

    const imgList = Object.keys(sprites || {}).filter(val => {

        /**
         * Access the 'sprites' object and check whether the specified key exist within the object
         */
        if (!sprites[val]) return false;

        // Exclude these properties from the 'imgList'
        if (['versions', 'other'].includes(val)) return false;
        
        return true;
    });

    async function fetchMoveData(move, moveUrl) {

        // Defensive/Guard Clauses to prevent the code from breaking
        /**
         * Prevents code from breaking when:
         * - Data is being fetched
         * - Local storage is inaccessible or empty
         * - Move URL is not provided
         */
        if (loadingSkill || !localStorage || !moveUrl) return;

        // Check cache for move
        let cache = {};

        if (localStorage.getItem('pokemon-moves')) {
            cache = JSON.parse(localStorage.getItem('pokemon-moves'));
        }

        if (move in cache) {
            setSkill(cache[move]);
            // console.log('Found move in cache!');
            return;
        }

        // Move needs to be fetched from the API
        try {
            setLoadingSkill(true);

            const res = await fetch(moveUrl);
            const moveData = await res.json();

            // console.log('Fetched move from API', moveData);

            const description = moveData?.flavor_text_entries.filter(val => val.version_group.name === 'firered-leafgreen')[0]?.flavor_text;

            const skillData = {
                name: move,
                description
            }

            // Assign the skill data and show the modal
            setSkill(skillData);

            // Cache the move data
            cache[move] = skillData;
            localStorage.setItem('pokemon-moves', JSON.stringify(cache));
            
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingSkill(false);
        }
    }

    useEffect(() => {
        
        /**
         * Check loading state (in other words, data is being fetched), if true then return
         * OR
         * check if the local storage is empty
         */
        if (loading || !localStorage) return;

        // Define the cache variable
        let cache = {};
        
        // Check if data exist in local storage, then retrieve selected pokemon from there
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
        }

        /**
         * Check if the selected pokemon data is in the cache data
         * If true, load the data to the stateful variable and return
         * Else, the selected pokemon data has NOT been cached
         */
        if (selectedPokemon in cache) {
            setData(cache.selectedPokemon);
            // console.log('Found pokemon in cache!');
            return;
        }

        // Otherwise, the selected pokemon data is NOT found in the cache which requires an API fetch
        async function fetchPokemonData() {

            // Show loading state
            setLoading(true);
            
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/';
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
                const finalUrl = baseUrl + suffix;
                const res = await fetch(finalUrl);
                const pokemonData = await res.json();

                // Assign the data to the state variable
                setData(pokemonData);

                console.log('Fetched pokemon data!');

                // Cache the data to the local storage
                cache.selectedPokemon = pokemonData;
                localStorage.setItem('pokedex', JSON.stringify(cache));
            
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }

        // Call the async API function
        fetchPokemonData();

        return () => {
            
        };
    }, [selectedPokemon]);

    // Show loading state on user screen if loading state is true or data state is empty
    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        );
    }
    
    return (
        <div className="poke-card">

            {skill && (
            <Modal handleCloseModal={() => { setSkill(null) }}>
                <div>
                    <h6>Name</h6>
                    <h2 className="skill-name">{skill.name.replaceAll('-', ' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>
            )}

            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>

            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    );
                })}
            </div>

            <img className="default-img" src={'/pokemon_sprites/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-image`} />

            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {

                    const imgUrl = sprites[spriteUrl];

                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    );
                })}
            </div>

            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj, statIndex) => {

                    const { stat, base_stat } = statObj;

                    return (
                        <div key={statIndex} className="stat-item">
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    );
                })}
            </div>

            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj, moveIndex) => {

                    return (
                        <button key={moveIndex} className="button-card pokemon-move" onClick={() => {

                            fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default PokeCard;