export interface MovieInterface {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export interface MovieDetailsInterface {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  genres?: {id: number; name: string}[]; // Exemplu pentru alte detalii
  runtime?: number;
  release_date?: string;
  // Adaugă orice alte câmpuri specifice detalilor filmului
}
