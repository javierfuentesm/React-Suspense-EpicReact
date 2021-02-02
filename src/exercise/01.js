// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
// 🐨 you'll also need to get the fetchPokemon function from ../pokemon:
import {
  PokemonDataView,
  fetchPokemon,
  PokemonErrorBoundary,
  PokemonInfoFallback,
} from '../pokemon'

function createResource(promise) {
  let status = 'pending'
  let result = promise.then(
    response => {
      status = 'resolved'
      result = response
    },
    error => {
      status = 'rejected'
      result = error
    },
  )

  return {
    read() {
      if (status === 'pending') {
        throw result
      }
      if (status === 'rejected') {
        throw result
      }
      if (status === 'resolved') {
        return result
      }
    },
  }
}

const resource = createResource(fetchPokemon('pikachu'))

function PokemonInfo() {
  const pokemon = resource.read()

  // if (pokemonError) {
  //   throw pokemonError
  // }
  // if (!pokemon) {
  //   throw pokemonPromise
  // }

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
        <React.Suspense fallback={<PokemonInfoFallback name={'Pikachu'} />}>
          <PokemonErrorBoundary>
            <PokemonInfo />
          </PokemonErrorBoundary>
        </React.Suspense>
      </div>
    </div>
  )
}

export default App
