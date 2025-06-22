import { setActivePinia, createPinia } from 'pinia'
import {useFavourites} from "../../src/stores/favourites";

describe('favourites store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
    })

    it('initializes empty when no localStorage entry', () => {
        const store = useFavourites()
        store.loadFavouriteMovies()
        expect(store.favouriteMovies).toEqual([])
    })

    it('loads from localStorage if present', () => {
        const data = [{ id: 1, title: 'A', imageUrl: 'x', rating: 5 }]
        localStorage.setItem('favourites', JSON.stringify(data))
        const store = useFavourites()
        store.loadFavouriteMovies()
        expect(store.favouriteMovies).toEqual(data)
    })

    it('adds a movie and persists', () => {
        const store = useFavourites()
        const movie = { id: 2, title: 'B', imageUrl: 'y', rating: 6 }
        store.addToFavouriteMovies(movie)
        expect(store.favouriteMovies).toContainEqual(movie)
        const saved = JSON.parse(localStorage.getItem('favourites')!)
        expect(saved).toContainEqual(movie)
    })

    it('does not add duplicates', () => {
        const store = useFavourites()
        const movie = { id: 3, title: 'C', imageUrl: 'z', rating: 7 }
        store.addToFavouriteMovies(movie)
        store.addToFavouriteMovies(movie)
        expect(store.favouriteMovies.filter(m => m.id === 3)).toHaveLength(1)
    })

    it('removes a movie and persists', () => {
        const movie = { id: 4, title: 'D', imageUrl: 'w', rating: 8 }
        localStorage.setItem('favourites', JSON.stringify([movie]))
        const store = useFavourites()
        store.loadFavouriteMovies()
        store.removeFromFavouriteMovies(4)
        expect(store.favouriteMovies).toEqual([])
        const saved = JSON.parse(localStorage.getItem('favourites')!)
        expect(saved).toEqual([])
    })
})
