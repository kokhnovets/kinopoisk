document.addEventListener("DOMContentLoaded", function () {
  var myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  const addMoviesForm = document.querySelector(".add-movie"),
    addMoviesPosters = addMoviesForm.querySelector(".form-image"),
    addMoviesName = addMoviesForm.querySelector(".form-name"),
    addMoviesDate = addMoviesForm.querySelector(".form-date"),
    movieList = document.querySelector(".column-movies");
  let movieNameCheck;
  // Добавление нового фильма/редактирование
  addMoviesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (addMoviesForm.getAttribute("id") === "changeMovie") {
      let movie = JSON.parse(localStorage[movieNameCheck]);
      if (movie.movieName != addMoviesName.value) {
        localStorage.removeItem(movie.movieName);
        if (
          !checkFormsMovieChange(
            addMoviesPosters.value,
            addMoviesName.value,
            addMoviesDate.value
          )
        )
          return;
        movie.moviePosters = addMoviesPosters.value;
        movie.movieName = addMoviesName.value;
        movie.moviesDate = addMoviesDate.value;
        loadMovieInJSON(addMoviesName.value, movie);
      } else {
        movie.moviePosters = addMoviesPosters.value;
        movie.moviesDate = addMoviesDate.value;
        loadMovieInJSON(addMoviesName.value, movie);
      }
    } else if (addMoviesForm.getAttribute("id") === "addMovie") {
      const movies = {};
      if (
        !checkFormsMovieAdd(
          addMoviesPosters.value,
          addMoviesName.value,
          addMoviesDate.value
        )
      )
        return;
      movies.moviePosters = addMoviesPosters.value;
      movies.movieName = addMoviesName.value;
      movies.moviesDate = addMoviesDate.value;
      movies.inFavourite = false;
      loadMovieInJSON(addMoviesName.value, movies);
    }
    loadMovieList();
    myModal.hide();
    event.target.reset();
  });
  // Проверка заполнения формы при добавлении
  function checkFormsMovieAdd(linkMoviePosters, movieName, moviesDate) {
    if (/^(ftp|http|https):\/\/[^ "]+$/.test(linkMoviePosters)) {
      if (movieName && !localStorage.getItem(movieName)) {
        if (movieName.length > 2) {
          if (moviesDate) {
            return true;
          } else alert("Введите корерктную дату!");
        } else alert("Введите корректное название!");
      } else alert("Такой фильм уже существует! Выберите другое название.");
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
  // проверку на редактирование вынес в отдельную функцию, т.к. в функции добавления идет еще проверка существующих фильмов
  function checkFormsMovieChange(linkMoviePosters, movieName, moviesDate) {
    if (/^(ftp|http|https):\/\/[^ "]+$/.test(linkMoviePosters)) {
      if (movieName.length > 2) {
        if (moviesDate) {
          return true;
        } else alert("Введите корерктную дату!");
      } else alert("Введите корректное название!");
    } else alert("Ссылка невалидна!");
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
      div.classList.add("card", "mb-3");
      document.querySelector(".column-movies").append(div);
      let movie = JSON.parse(localStorage[key]);
      div.innerHTML = `<div class="row g-0 movies">
                                <div class="col-md-2">
                                    <img src="${movie.moviePosters}"
                                    class="img-fluid rounded-start w-100" alt="..." />
                                </div>
                                <div class="col-md-8 d-flex justify-content-between flex-fill">
                                    <div class="card-body">
                                        <h2 class="card-title fw-bold movie-name">${
                                          movie.movieName
                                        }</h2>
                                        <p class="card-text">
                                            Дата выхода: ${movie.moviesDate}
                                        </p>
                                    </div>
                                    <div class="btn-group me-3 d-flex align-items-center" role="group" aria-label="Basic checkbox toggle button group">
                                        <input type="checkbox" class="btn-check movie-favourite" id="btncheck${i}"  autocomplete="off" ${
        movie.inFavourite ? "checked" : ""
      } />
                                        <label class="btn btn-outline-primary" for="btncheck${i}">Избранное</label>
                                    </div>
                                    <div class="dropdown d-flex align-items-center me-3">
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
  // Редактирование фильма
  document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("change-movie")) return;
    let parent = event.target.closest(".movies");
    document.querySelector(".modal-title").textContent = "Редактировать фильм";
    document.querySelector(".btn-movie").value = "Редактировать фильм";
    let movie = JSON.parse(
      localStorage[parent.querySelector(".movie-name").textContent]
    );
    addMoviesPosters.value = movie.moviePosters;
    addMoviesName.value = movie.movieName;
    addMoviesDate.value = movie.moviesDate;
    movieNameCheck = movie.movieName;
    // При нажатии кнопки редактирования присваивается id = changeMovie
    addMoviesForm.setAttribute("id", "changeMovie");
    loadMovieList();
  });
  // Загрузка фильмов
  loadMovieList();
  // Проверка, есть ли добавленные фильмы на странице, если нет, то выводится сообщение о том, что фильмов нет
  checkMovies(movieList);
  // изменение текста в кнопке и в заголовке модального окна в обратное состояние и при добавлении присваивается id = addMovie
  document.querySelector(".btn-add-movie").addEventListener("click", () => {
    document.querySelector(".modal-title").textContent = "Добавить фильм";
    document.querySelector(".btn-movie").value = "Добавить фильм";
    addMoviesForm.setAttribute("id", "addMovie");
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
  // Очистка формы после отмены редактирования фильма (делегирование событий)
  document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("btn-movie-close")) return;
    event.target.closest(".add-movie").reset();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("btn-close")) return;
    event.target.parentElement.nextElementSibling.firstElementChild.reset();
  });
  // Сделать массив из фильмов (один объект LocalStorage для всех фильмов)
});
