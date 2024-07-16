export type UserLoginRequest = {
    Username: string;
    Password: string;
}

export type UserRegistration = {
    Email: string;
    Birthday: string
} & UserLoginRequest

export type UserLoginResponse = {
    user: {
        Username: string;
        Password: string;
        Email: string;
        Birthday: string;
        FavoriteMovies?: string[]
    }
    token: string;
}

export type Movie = {
    Genre: Genre
    Director: Director
    Actors: any[]
    _id: string
    Title: string
    Description: string
    ImagePath: string
    Featured: boolean
}

export type Genre = {
    Name: string
    Description: string
}

export type Director = {
    Name: string
    Bio: string
    Birth: string
}