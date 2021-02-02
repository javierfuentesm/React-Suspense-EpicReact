// Render as you fetch
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()

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
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource, setResource] = React.useState(null)
  // 🐨 add a useState here to keep track of the current pokemonResource

  React.useEffect(() => {
    if (!pokemonName) {
      setResource(null)
    } else {
      setResource(createResource(fetchPokemon(pokemonName)))
    }
  }, [pokemonName])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonResource ? (
          <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
            <PokemonErrorBoundary>
              <PokemonInfo pokemonResource={pokemonResource} />
            </PokemonErrorBoundary>
          </React.Suspense>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
