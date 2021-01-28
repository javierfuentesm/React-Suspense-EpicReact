// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
// 🐨 you'll also need to get the fetchPokemon function from ../pokemon:
import {PokemonDataView, fetchPokemon} from '../pokemon'
let pokemon

const pokemonPromise = fetchPokemon('pikachu').then(
  response => (pokemon = response),
)

function PokemonInfo() {
  if (!pokemon) {
    throw pokemonPromise
  }

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <React.Suspense fallback={<h1>Loading...</h1>}>
          <PokemonInfo />
        </React.Suspense>
      </div>
    </div>
  )
}

export default App
