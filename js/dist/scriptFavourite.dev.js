"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  var addMoviesForm = document.querySelector(".needs-validation"),
      addMoviesPosters = addMoviesForm.querySelector(".form-image"),
      addMoviesName = addMoviesForm.querySelector(".form-name"),
      addMoviesDate = addMoviesForm.querySelector(".form-date"),
      movieList = document.querySelector(".column-movies"),
      movieListFavourite = document.querySelector(".column-movies-favourites"); // Проверка, есть ли избранные фильмы на страницe

  function checkMoviesFavourites(elem) {
    loadMovieListFavourite();

    if (elem.children.length == 0) {
      var messages = document.createElement("h3");
      messages.classList.add("d-flex", "align-items-center", "justify-content-center", "h3", "pt-5");
      messages.textContent = "На данный момент в избранных нет фильмов и сериалов:(";
      elem.append(messages);
    }
  } // Добавление нового фильма


  addMoviesForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (addMoviesForm.getAttribute("id") === "changeMovie") {
      var movie = JSON.parse(localStorage[movieNameCheck]);

      if (movie.movieName != addMoviesName.value) {
        localStorage.removeItem(movie.movieName);
        if (!checkFormsMovieChange(addMoviesPosters.value, addMoviesName.value, addMoviesDate.value)) return;
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
      var movies = {};
      if (!checkFormsMovieAdd(addMoviesPosters.value, addMoviesName.value, addMoviesDate.value)) return;
      movies.moviePosters = addMoviesPosters.value;
      movies.movieName = addMoviesName.value;
      movies.moviesDate = addMoviesDate.value;
      movies.inFavourite = true;
      loadMovieInJSON(addMoviesName.value, movies);
    }

    loadMovieListFavourite();
    myModal.hide();
    event.target.reset();
  }); // Проверка заполнения формы при добавлении

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
  } // Перевод объекта в формат JSON


  function loadMovieInJSON(key, movies) {
    localStorage.setItem(key, JSON.stringify(movies));
  } // Удаление фильма через делегирование событий


  document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("delete-movie")) return;
    var parent = event.target.closest(".movies");
    var quest = confirm("\u0412\u044B \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C ".concat(parent.querySelector(".movie-name").textContent, " \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430?"));
    if (quest) localStorage.removeItem(parent.querySelector(".movie-name").textContent);
    loadMovieListFavourite();
    checkMoviesFavourites(movieListFavourite);
  }); // проверку на редактирование вынес в отдельную функцию, т.к. в функции добавления идет еще проверка существующих фильмов

  function checkFormsMovieChange(linkMoviePosters, movieName, moviesDate) {
    if (/^(ftp|http|https):\/\/[^ "]+$/.test(linkMoviePosters)) {
      if (movieName.length > 2) {
        if (moviesDate) {
          return true;
        } else alert("Введите корерктную дату!");
      } else alert("Введите корректное название!");
    } else alert("Ссылка невалидна!");
  } // Изменение данных фильма через делегирование событий


  document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("change-movie")) return;
    var parent = event.target.closest(".movies");
    document.querySelector(".modal-title").textContent = "Редактировать фильм";
    document.querySelector(".btn-movie").value = "Редактировать фильм";
    var movie = JSON.parse(localStorage[parent.querySelector(".movie-name").textContent]);
    addMoviesPosters.value = movie.moviePosters;
    addMoviesName.value = movie.movieName;
    addMoviesDate.value = movie.moviesDate;
    movieNameCheck = movie.movieName; // При нажатии кнопки редактирования присваивается id = changeMovie

    addMoviesForm.setAttribute("id", "changeMovie");
    loadMovieListFavourite();
  }); // Проверка, есть ли добавленные избранные фильмы на странице, если нет, то выводится сообщение о том, что фильмов нет

  checkMoviesFavourites(movieListFavourite); // изменение текста в кнопке и в заголовке модального окна в обратное состояние и при добавлении присваивается id = addMovie

  document.querySelector(".btn-add-movie").addEventListener("click", function () {
    document.querySelector(".modal-title").textContent = "Добавить фильм";
    document.querySelector(".btn-movie").value = "Добавить фильм";
    addMoviesForm.setAttribute("id", "addMovie");
  }); //   Добавление в избранное/удаление из избранных

  document.addEventListener("change", function (event) {
    if (!event.target.classList.contains("movie-favourite")) return;
    var parent = event.target.closest(".movies");
    var movie = JSON.parse(localStorage[parent.querySelector(".movie-name").textContent]);
    movie.inFavourite = event.target.checked;
    loadMovieInJSON(movie.movieName, movie);
    checkMoviesFavourites(movieListFavourite);
  }); // изменение текста в кнопке и в заголовке модального окна в обратное состояние

  document.querySelector(".btn-add-movie").addEventListener("click", function () {
    document.querySelector(".modal-title").textContent = "Добавить фильм";
    document.querySelector(".btn-movie").value = "Добавить фильм";
  }); //   Добавление в избранное/удаление из избранных

  document.addEventListener("change", function (event) {
    if (!event.target.classList.contains("movie-favourite")) return;
    var parent = event.target.closest(".movies");
    var movie = JSON.parse(localStorage[parent.querySelector(".movie-name").textContent]);
    movie.inFavourite = event.target.checked;
    loadMovieInJSON(movie.movieName, movie);
  }); // Загрузка избранных фильмов

  function loadMovieListFavourite() {
    document.querySelector(".column-movies-favourites").innerHTML = "";
    var i = 0;

    for (var key in localStorage) {
      i++;

      if (!localStorage.hasOwnProperty(key)) {
        continue;
      }

      var movie = JSON.parse(localStorage[key]);

      if (movie.inFavourite) {
        var div = document.createElement("div");
        div.classList.add("card");
        div.classList.add("mb-3");
        document.querySelector(".column-movies-favourites").append(div);
        div.innerHTML = "<div class=\"row g-0 movies\">\n                                <div class=\"col-md-2\">\n                                    <img src=\"".concat(movie.moviePosters, "\"\n                                    class=\"img-fluid rounded-start w-100\" alt=\"...\" />\n                                </div>\n                                <div class=\"col-md-8 d-flex justify-content-between flex-fill\">\n                                    <div class=\"card-body\">\n                                        <h2 class=\"card-title fw-bold movie-name\">").concat(movie.movieName, "</h2>\n                                        <p class=\"card-text\">\n                                            \u0414\u0430\u0442\u0430 \u0432\u044B\u0445\u043E\u0434\u0430: ").concat(movie.moviesDate, "\n                                        </p>\n                                    </div>\n                                    <div class=\"btn-group me-3 d-flex align-items-center\" role=\"group\" aria-label=\"Basic checkbox toggle button group\">\n                                        <input type=\"checkbox\" class=\"btn-check movie-favourite\" id=\"btncheck").concat(i, "\"  autocomplete=\"off\" ").concat(movie.inFavourite ? "checked" : "", " />\n                                        <label class=\"btn btn-outline-primary\" for=\"btncheck").concat(i, "\">\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435</label>\n                                    </div>\n                                    <div class=\"dropdown d-flex align-items-center me-3\">\n                                        <button class=\"btn btn-secondary dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton1\"\n                                            data-bs-toggle=\"dropdown\" aria-expanded=\"false\">\n                                            \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435\n                                        </button>\n                                        <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton1\">\n                                            <li><a class=\"delete-movie dropdown-item\" href=\"#\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</a></li>\n                                            <li><a class=\"change-movie dropdown-item redac-movie\" data-bs-toggle=\"modal\" data-bs-target=\"#exampleModal\" href=\"#\">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</a></li>\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>");
      }
    }
  }

  loadMovieListFavourite();
  checkMoviesFavourites(movieListFavourite);
});