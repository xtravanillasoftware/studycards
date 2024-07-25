export interface Flashcard {
  id: string;
  front: string;
  back: string;
  audio?: string; // Link to an audio file
  audioLabel?: string;
  graphic?: string; // Link to a photo
  graphicLabel?: string;
}

export interface Deck {
  id: string;
  title: string;
  cards: Flashcard[];
  count: number;
  new: number;
  learn: number;
  due: number;
}

// query by last inserted and final result is count
