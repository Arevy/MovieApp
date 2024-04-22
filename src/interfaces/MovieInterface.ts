// Interface for basic movie information
export interface MovieInterface {
  id: number; // Unique identifier for each movie
  title: string; // Title of the movie
  poster_path: string; // Path to the movie's poster image
  overview: string; // Brief summary of the movie
}

// Interface for detailed movie information
export interface MovieDetailsInterface {
  id: number; // Unique identifier for the movie
  title: string; // Title of the movie
  poster_path: string; // Path to the movie's poster image
  overview: string; // Detailed summary of the movie
  genres?: {id: number; name: string}[]; // List of genres associated with the movie
  runtime?: number; // Duration of the movie in minutes
  release_date?: string; // Release date of the movie
}
