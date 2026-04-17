/**
 * Mock Media Data - Sample movie data for development and testing
 * Replaces database/API calls during development
 * Structured as an object with movie IDs as keys for easy lookup by ID
 * Each movie contains all information needed for display in grid and detail views
 */

/**
 * mockMediaEntries - Object containing sample movies
 * Key-value pairs: key is movie identifier, value is complete movie object
 * Can be converted to array using Object.values() for use in FlatList
 */
export const mockMediaEntries = {
  // movie1: First mock movie object
  movie1: {
    // id: Unique identifier used for routing (/details/1)
    // Must match the URL parameter in dynamic routes
    id: "1",

    // title: Full movie name displayed in UI
    // Shown as heading in detail view, truncated in grid cards
    title: "The Shawshank Redemption",

    // poster: URL to movie poster image
    // Using placeholder service for demo - replace with real image URLs in production
    // Image dimensions: approximately 300x450px (vertical orientation)
    poster: "https://via.placeholder.com/300x450?text=Shawshank",

    // rating: Numerical rating out of 10
    // Displayed with star emoji in card and detail views
    rating: 9.3,

    // releaseYear: Year movie was released
    // Displayed as metadata in detail view
    releaseYear: 1994,

    // playTime: Duration of movie in human-readable format
    // Displayed as "Duration:" label in detail view
    playTime: "142 minutes",

    // director: Array of director names
    // Allows multiple directors, joined with commas in display
    // Displayed as "Director:" line in detail view
    director: ["Frank Darabont"],

    // cast: Array of actor names
    // Main actors/stars in the movie
    // Joined with commas and displayed as "Cast:" line in detail view
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],

    // description: Array of description paragraphs
    // Allows for multi-paragraph synopses or plot summaries
    // Paragraphs are joined with blank lines ("\n\n") for readability
    // Displayed in large font in detail view with extra line height
    description: [
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    ],
  },

  // movie2: Second mock movie object
  movie2: {
    // id: Unique identifier (must be unique across all movies)
    // Used for dynamic routing: /details/2
    id: "2",

    // title: Another famous movie title
    title: "Inception",

    // poster: Placeholder image - replace with actual poster URLs
    poster: "https://via.placeholder.com/300x450?text=Inception",

    // rating: High-rated movie for variety in mock data
    rating: 8.8,

    // releaseYear: More recent movie than first example
    releaseYear: 2010,

    // playTime: Slightly longer movie
    playTime: "148 minutes",

    // director: Single director in array format
    // Array format allows future movies to have multiple directors
    director: ["Christopher Nolan"],

    // cast: Multiple actors from famous film
    // Multiple cast members demonstrate array joining in detail view
    cast: [
      "Leonardo DiCaprio", // Lead actor
      "Marion Cotillard", // Supporting actor
      "Ellen Page", // Supporting actor
      "Joseph Gordon-Levitt", // Supporting actor
    ],

    // description: Plot summary
    // Array format allows for multi-paragraph descriptions if needed
    // Currently single paragraph, but structure supports longer synopses
    description: [
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    ],
  },
};
