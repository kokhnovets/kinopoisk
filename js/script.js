document.addEventListener("DOMContentLoaded", function () {
  const addMoviesForm = document.querySelector(".needs-validation"),
    addMoviesPosters = addMoviesForm.querySelector(".form-image"),
    addMoviesName = addMoviesForm.querySelector(".form-name"),
    addMoviesDate = addMoviesForm.querySelector(".form-date"),
    movieList = document.querySelector(".column-movies");
  // Добавление нового фильма
  addMoviesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const linkMoviePosters = addMoviesPosters.value,
      movieName = addMoviesName.value,
      moviesDate = addMoviesDate.value,
      movies = {};
    checkFormsMovie(
      linkMoviePosters,
      movieName,
      moviesDate,
      (InFavourite = false),
      movies
    );
  });
  // Проверка заполнения формы при добавлении/редактировании
  function checkFormsMovie(
    linkMoviePosters,
    movieName,
    moviesDate,
    inFavourite,
    movies
  ) {
    if (/^(ftp|http|https):\/\/[^ "]+$/.test(linkMoviePosters)) {
      if (isNaN(movieName) && movieName.length > 2) {
        if (moviesDate && !isNaN(moviesDate)) {
          movies.moviePosters = linkMoviePosters;
          movies.movieName = movieName;
          movies.moviesDate = moviesDate;
          movies.inFavourite = inFavourite;
          loadMovieInJSON(movieName, movies);
          loadMovieList();
          event.target.reset();
        } else alert("Введите корерктную дату!");
      } else alert("Введите корректное название!");
    } else alert("Ссылка невалидна!");
  }
  // Проверка, есть ли фильмы на странице
  function checkMovies(elem) {
    loadMovieList();
    if (elem.children.length == 0) {
      let messages = document.createElement("h3");
      messages.classList.add(
        "d-flex",
        "align-items-center",
        "justify-content-center",
        "h3",
        "pt-5"
      );
      messages.textContent =
        "На данный момент нет фильмов :( Добавьте в список!";
      elem.append(messages);
    }
  }

  // Перевод объекта в формат JSON
  function loadMovieInJSON(key, movies) {
    localStorage.setItem(key, JSON.stringify(movies));
  }
  // Загрузка фильмов на страницу
  function loadMovieList() {
    document.querySelector(".column-movies").innerHTML = "";
    let i = 0;
    for (let key in localStorage) {
      i++;
      if (!localStorage.hasOwnProperty(key)) {
        continue;
      }
      let div = document.createElement("div");
      div.classList.add("card");
      div.classList.add("mb-3");
      document.querySelector(".column-movies").append(div);
      let movie = JSON.parse(localStorage[key]);
      div.innerHTML = `<div class="row g-0 movies">
                                <div class="col-md-2">
                                    <img src="${movie.moviePosters}"
                                    class="img-fluid rounded-start" alt="..." />
                                </div>
                                <div class="col-md-8 d-flex justify-content-between align-items-start">
                                    <div class="card-body">
                                        <h2 class="card-title fw-bold movie-name">${
                                          movie.movieName
                                        }</h2>
                                        <p class="card-text">
                                            Дата выхода: ${movie.moviesDate}
                                        </p>
                                    </div>
                                    <div class="btn-group mt-4" role="group" aria-label="Basic checkbox toggle button group">
                                        <input type="checkbox" class="btn-check movie-favourite" id="btncheck${i}"  autocomplete="off" ${
        movie.inFavourite ? "checked" : ""
      } />
                                        <label class="btn btn-outline-primary" for="btncheck${i}">Избранное</label>
                                    </div>
                                    <div class="dropdown mt-4 ml-2">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                            Действие
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li><a class="delete-movie dropdown-item" href="#">Удалить</a></li>
                                            <li><a class="change-movie dropdown-item redac-movie" data-bs-toggle="modal" data-bs-target="#exampleModal" href="#">Редактировать</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>`;
    }
  }
  // Удаление фильма через делегирование событий
  document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("delete-movie")) return;
    let parent = event.target.closest(".movies");
    let quest = confirm(
      `Вы действительно хотите удалить ${
        parent.querySelector(".movie-name").textContent
      } из списка?`
    );
    if (quest)
      localStorage.removeItem(parent.querySelector(".movie-name").textContent);
    loadMovieList();
    checkMovies(movieList);
  });
  // Изменение данных фильма через делегирование событий
  document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("change-movie")) return;
    let parent = event.target.closest(".movies");
    document.querySelector(".modal-title").textContent = "Редактировать фильм";
    document.querySelector(".btn-movie").value = "Редактировать фильм";
    let movie = JSON.parse(
      localStorage[parent.querySelector(".movie-name").textContent]
    );
    const movieNameCheck = movie.movieName;
    addMoviesPosters.value = movie.moviePosters;
    addMoviesName.value = movie.movieName;
    addMoviesDate.value = movie.moviesDate;
    // Проверка на изменение названия фильма
    addMoviesName.addEventListener("change", function () {
      if (movieNameCheck != addMoviesName.value) {
        localStorage.removeItem(movieNameCheck);
      }
    });
    checkFormsMovie(
      addMoviesPosters.value,
      addMoviesName.value,
      addMoviesDate.value,
      movie
    );
    loadMovieList();
  });
  // Загрузка фильмов
  loadMovieList();
  // Проверка, есть ли добавленные фильмы на странице, если нет, то выводится сообщение о том, что фильмов нет
  checkMovies(movieList);
  // изменение текста в кнопке и в заголовке модального окна в обратное состояние
  document.querySelector(".btn-add-movie").addEventListener("click", () => {
    document.querySelector(".modal-title").textContent = "Добавить фильм";
    document.querySelector(".btn-movie").value = "Добавить фильм";
  });

  //   Добавление в избранное/удаление из избранных
  document.addEventListener("change", (event) => {
    if (!event.target.classList.contains("movie-favourite")) return;
    let parent = event.target.closest(".movies");
    let movie = JSON.parse(
      localStorage[parent.querySelector(".movie-name").textContent]
    );
    movie.inFavourite = event.target.checked;
    loadMovieInJSON(movie.movieName, movie);
  });
  // Проблема с закрытием модального окна после добавления/редактирования
});