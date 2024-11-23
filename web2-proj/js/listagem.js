const movies = JSON.parse(sessionStorage.getItem('movies')) || [];

function createCard(movie) {
  return `
            <div class="col-md-2 col-10 mx-md-0 mx-auto mb-4">
                <div class="card rounded-0 border-0 shadow-sm poster-card " style="background:#141414;">
                    <a href="#" target="_blank">
                        <img src="${movie.image}" class="card-img-top rounded-0 poster" alt="${movie.name}">
                    </a>
                    <div class="card-body text-white">
                        <h6 class="card-title">${movie.name}</h6>
                        <p class="card-text" style="font-size: 0.780rem">${movie.year} - ${movie.category}</p>
                    </div>
                </div>
            </div>
  `;
}

function renderMovieList(filteredMovies = movies) {
  const movieListElement = document.getElementById('movieList');
  movieListElement.innerHTML = '';

  if (filteredMovies.length > 0) {
    filteredMovies.forEach(movie => {
      movieListElement.innerHTML += createCard(movie);
    });
  } else {
    movieListElement.innerHTML = '<p class="text-gray-500">Nenhum Titulo encontrado.</p>';
  }
}

renderMovieList();

document.getElementById('searchQuery').oninput = () => {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
        movie.name.toLowerCase().includes(query)
    );

    renderMovieList(filteredMovies);
}