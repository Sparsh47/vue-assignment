import {defineStore} from "pinia";

type FavouriteMovie = {
    id: number;
    title: string;
    imageUrl: string;
    rating: number;
}

export const useFavourites = defineStore('favourites', {
    state: () => ({
        favouriteMovies: [] as Array<FavouriteMovie>
    }),
    actions: {
        loadFavouriteMovies() {
            const raw = localStorage.getItem('favourites');
            if (raw) {
                this.favouriteMovies = JSON.parse(raw);
            }
        },
        saveFavouriteMovies() {
            localStorage.setItem('favourites', JSON.stringify(this.favouriteMovies));
        },
        addToFavouriteMovies(movie: FavouriteMovie) {
            if(!this.favouriteMovies.find((m)=>m.id === movie.id)) {
                this.favouriteMovies.push(movie);
                this.saveFavouriteMovies();
            }
        },
        removeFromFavouriteMovies(movieId: number) {
            this.favouriteMovies = this.favouriteMovies.filter(m => m.id !== movieId);
            this.saveFavouriteMovies();
        }
    }
})