let movies = JSON.parse(sessionStorage.getItem('movies')) || [];

function saveToSession() {
  sessionStorage.setItem('movies', JSON.stringify(movies));
}

function createCard(movie) {
  const card = document.createElement('div');
  card.className = 'col-md-2 mb-4 col-10 mx-auto mx-md-0';

  card.innerHTML = `    
                <div class="card rounded-0 border-0 shadow-sm poster-card " style="background:#141414;">
                    <a href="#" target="_blank">
                        <img src="${movie.image}" class="card-img-top rounded-0 poster" alt="${movie.name}">
                    </a>
                    <div class="card-body text-white">
                        <h6 class="card-title">${movie.name}</h6>
                        <p class="card-text" style="font-size: 0.780rem">${movie.year} - ${movie.category}</p>
                    </div>
                    <div class="d-flex justify-content-around mb-2">
                      <button class="btn py-1 px-3" style="color: #5799EF" onclick="editMovie('${movie.id}')">Editar</button>
                      <button class="btn py-1 px-3" style="color: #5799EF" onclick="deleteMovie('${movie.id}')">Excluir</button>
                    </div>
                </div>
  `;

  return card;
}

function renderMovieList() {
  const movieListElement = document.getElementById('movieList');
  movieListElement.innerHTML = '';

  movies.forEach(movie => {
    const card = createCard(movie);
    movieListElement.appendChild(card);
  });
}

async function verifyAndAddMovie(name, category, year, image) {
  const apiKey = 'apikey 6Kt1sfLrUqNhe4W94HcKMW:7IpNljkbED6o5jnriHRt1r';
  const apiUrl = `https://api.collectapi.com/imdb/imdbSearchByName?query=${encodeURIComponent(name)}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'authorization': `apikey ${apiKey}`,
        'content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados no IMDb: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.result.length > 0) {
      const imdbMovie = data.result[0];

      const newMovie = {
        id: Date.now().toString(), // unique ID
        name: imdbMovie.Title || name,
        category: imdbMovie.Type || category,
        year: imdbMovie.Year || year,
        image: imdbMovie.Poster || image,
      };

      movies.push(newMovie);
      alert(`O filme "${imdbMovie.Title}" foi encontrado no IMDb e adicionado à base de dados!`);
    } else {
      alert(`O filme "${name}" não foi encontrado no IMDb.`);
    }

    saveToSession();
    renderMovieList();
  } catch (error) {
    console.error('Erro ao verificar no IMDb:', error);
    alert('Ocorreu um erro ao buscar os dados no IMDb. Tente novamente.');
  }
}

function editMovie(movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    document.getElementById('movieName').value = movie.name;
    document.getElementById('movieCategory').value = movie.category;
    document.getElementById('movieYear').value = movie.year;
    document.getElementById('movieImage').value = movie.image;

    movies = movies.filter(m => m.id !== movieId);
    saveToSession();
    renderMovieList();
  }
}

function deleteMovie(movieId) {
  movies = movies.filter(m => m.id !== movieId);
  saveToSession();
  renderMovieList();
}

document.getElementById('saveMovie').onclick = () => {
  const name = document.getElementById('movieName').value;
  const category = document.getElementById('movieCategory').value;
  const year = document.getElementById('movieYear').value;
  const image = document.getElementById('movieImage').value;

  if (name && category && year && image) {
    verifyAndAddMovie(name, category, year, image);
    document.getElementById('movieName').value = '';
    document.getElementById('movieCategory').value = '';
    document.getElementById('movieYear').value = '';
    document.getElementById('movieImage').value = '';
  } else {
    alert('Preencha todos os campos!');
  }
};

document.getElementById('searchQuery').oninput = () => {
  const query = document.getElementById('searchQuery').value.toLowerCase();
  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(query)
  );

  const movieListElement = document.getElementById('movieList');
  movieListElement.innerHTML = '';

  filteredMovies.forEach(movie => {
    const card = createCard(movie);
    movieListElement.appendChild(card);
  });
};

renderMovieList();
