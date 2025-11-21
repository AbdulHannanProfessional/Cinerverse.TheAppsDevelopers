// JavaScript Example: Reading Entities
// Filterable fields: title, tmdb_id, runtime, synopsis, genres, cast, crew, release_date, poster_url, banner_url, tags, rating, rating_count, status, is_featured, editorial_tags, metadata_completeness
async function fetchMovieEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/691f73cbfb1c909e74c4628c/entities/Movie`, {
        headers: {
            'api_key': 'daf5fc78141c4d9aa25c50603a425791', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, tmdb_id, runtime, synopsis, genres, cast, crew, release_date, poster_url, banner_url, tags, rating, rating_count, status, is_featured, editorial_tags, metadata_completeness
async function updateMovieEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/691f73cbfb1c909e74c4628c/entities/Movie/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'daf5fc78141c4d9aa25c50603a425791', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}
export { fetchMovieEntities, updateMovieEntity };