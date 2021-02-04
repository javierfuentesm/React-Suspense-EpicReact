// Cache resources
// http://localhost:3000/isolated/exercise/04.js

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

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

const PokemonContext = React.createContext()
PokemonContext.displayName = 'PokemonContext'

function PokemonProvider({children}) {
  const [pokemonResourceCache, setState] = React.useState({})
  function getPokemonResource(pokemonName) {
    let resource = pokemonResourceCache[pokemonName]
    if (!resource) {
      resource = createPokemonResource(pokemonName)
      setState({...pokemonResourceCache, [pokemonName]: resource})
    }
    return resource
  }
  const value = {getPokemonResource}
  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  )
}

function useCacheResource() {
  const context = React.useContext(PokemonContext)
  if (context === undefined) {
    throw new Error(`useCacheResource must be used within a PokemonProvider`)
  }
  return context
}
//
// const pokemonResourceCache = {}
//
// function getPokemonResource(pokemonName) {
//   let resource = pokemonResourceCache[pokemonName]
//   if (!resource) {
//     resource = createPokemonResource(pokemonName)
//     pokemonResourceCache[pokemonName] = resource
//   }
//   return resource
// }

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)
  const {getPokemonResource} = useCacheResource()

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

function Wrapper() {
  return (
    <PokemonProvider>
      {' '}
      <App />
    </PokemonProvider>
  )
}

export default Wrapper
