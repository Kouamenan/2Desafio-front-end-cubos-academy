// const { format } = require('date-fns')

const body = document.querySelector('body');
const btnTema = document.querySelector('.btn-theme');
const btnPrev = document.querySelector('.btn-prev');
const filmes = document.querySelector('.movies');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('input')
const valor = document.querySelector('.valor')
const video = document.querySelector('.highlight__video-link')
const destaque = document.querySelector('highlight')


const imagemModal = document.querySelector('.modal__img')
const modalTitle = document.querySelector('.modal__title')
const modalClose = document.querySelector('.modal__close')
const modalDescription = document.querySelector('.modal__description')
const modalGenreAverage= document.querySelector('.modal__genre-average')
const modalGenres = document.querySelector('.modal__genres')
const modalAverage = document.querySelector('.modal__average')
const modal = document.querySelector('.modal')
const modalImage = document.querySelector('.modal__img')


let listaDeFilmes = []
let filmeDoDia = {}

let inicio = 0
let final = 5

const persistedTheme = localStorage.getItem('theme')
let currentTheme = persistedTheme ? persistedTheme : 'light';

function displayDarkTheme (){
    currentTheme = 'dark';
        btnTema.src = './assets/dark-mode.svg'
        btnPrev.src = './assets/seta-esquerda-branca.svg'
        btnNext.src = './assets/seta-direita-branca.svg'
        
        body.style.setProperty ('--background-color', "#242424")
        body.style.setProperty ('--color', "#FFF")
        body.style.setProperty ('--input-background-color', "#FFF")
        body.style.setProperty ('--shadow-color', '0px 4px 8px rgba(0, 0, 0, 0.15)')
        body.style.setProperty ('--highlight-background', '#454545')
        body.style.setProperty ('--highlight-color', 'rgba(225, 225, 225, 0.7)')
        body.style.setProperty ('--highlight-description', '#FFF')
}

function displayLightTheme () {
    currentTheme = 'light';
    btnTema.src = './assets/light-mode.svg';
    btnPrev.src = './assets/seta-esquerda-preta.svg'
    btnNext.src = './assets/seta-direita-preta.svg'

    body.style.setProperty ('--background-color', "#FFF")
    body.style.setProperty ('--color', "#000")
    body.style.setProperty ('--input-background-color', "#979797")
    body.style.setProperty ('--highlight-background', '#FFF')
    body.style.setProperty ('--highlight-color', 'rgba(0, 0, 0, 0.7)')
    body.style.setProperty ('--highlight-description', '#000')
}

function toggleTheme () {
    if (currentTheme === 'light') {
        displayDarkTheme()
    }else {
       displayLightTheme()
    }
    localStorage.setItem('theme', currentTheme);
}

if (currentTheme === 'light') {
    displayLightTheme()
}else {
   displayDarkTheme()
}



btnTema.addEventListener('click', function () {
   toggleTheme();
})


function criarModal (movie, item) {
    movie.addEventListener('click', () =>{
        modal.classList.remove('hidden')

            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${item.id}?language=pt-BR`).then(promese =>{

                const resultadoDaPromese = promese.json();
        
                resultadoDaPromese.then(filme => {
                    
                imagemModal.src = filme.backdrop_path
                modalDescription.innerText = filme.overview
                modalImage.alt = filme.title
                modalTitle.innerText = filme.title
                modalAverage.innerText = filme.vote_average

                
                filme.genres.forEach(function (genre) {
                    const modalGenre = document.createElement('span');
                    modalGenre.textContent = genre.name;
                    modalGenre.classList.add('modal__genre')

                    modalGenres.append(modalGenre)
                })
        });
        })
    })
}


modalClose.addEventListener('click', (event) => {
    modal.classList.add('hidden')
    event.stopPropagation()
})

modal.addEventListener('click', (event) => {
    modal.classList.add('hidden')
    event.stopPropagation()
})


function renderizarFilmes () {
    listaDeFilmes.slice(inicio, final).forEach(filme => {
        const movie = document.createElement('div')
        movie.classList.add('movie')

        const movieInfo = document.createElement('div')
        movieInfo.classList.add('movie__info')

        const movieTitle = document.createElement('span')
        movieTitle.classList.add('movie__title')

        movieTitle.innerText = filme.title

        const movieRating = document.createElement('span')
        movieRating.classList.add('movie__rating')

        movieRating.innerText = filme.vote_average

        movie.style.backgroundImage = `url(${filme.poster_path})`

        filmes.append(movie)
        movie.append(movieInfo)
        movieInfo.append(movieTitle, movieRating)
        criarModal(movie, filme)
        
    });

}

function renderizarFilmeDoDia () {
        let categorias = ""
        
        for(let item of filmeDoDia.genres){
            categorias =  " " + categorias + item.name + ", "
        }

        const highlightVideo = document.querySelector('.highlight__video')
        highlightVideo.style.backgroundImage = `url('${filmeDoDia.backdrop_path}')`
        
        const highlightInfo = document.querySelector('.highlight__title')
        highlightInfo.innerText = filmeDoDia.title
        console.log(filmeDoDia)

        const highlightRating = document.querySelector('.highlight__rating')
        highlightRating.innerText = filmeDoDia.vote_average

        const highlightGenres = document.querySelector('.highlight__genres')
        highlightGenres.innerText = categorias

        const highlightLaunch = document.querySelector('.highlight__launch')
        highlightLaunch.innerText = filmeDoDia.release_date

        const highlightDescription = document.querySelector('.highlight__description')
        highlightDescription.innerText = filmeDoDia.overview

        fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR' ).then(promese => {
    
        const resultadoDaPromese = promese.json();
        
        resultadoDaPromese.then(objeto => {
            video.href = "https://www.youtube.com/watch?v=" + objeto.results[0].key
            
        });
    
    })  
}


function retornarFilme () {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(promese => {
    
        const resultadoDaPromese = promese.json();
        
        resultadoDaPromese.then(objeto => {
            listaDeFilmes = objeto.results
            renderizarFilmes()
            
        });
}) 
}

function retornarFilmeDoDia () {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR', ).then(promese => {
    
        const resultadoDaPromese = promese.json();
        
        resultadoDaPromese.then(objeto => {
            filmeDoDia = objeto
            renderizarFilmeDoDia()
            
        });
    
    })  

}

retornarFilmeDoDia ()
retornarFilme(inicio, final)

btnPrev.addEventListener('click', () => {
    inicio -= 5
    final -= 5
    filmes.innerHTML = ''
    if(final === 0){
        final = 20
        inicio = 15
    }
    renderizarFilmes()

})
btnNext.addEventListener('click', () => {
    inicio += 5
    final += 5
    filmes.innerHTML = ''
    if(final === 20){
        final = 5
        inicio = 0
    }
    renderizarFilmes()

})

input.addEventListener('keydown', function (event) {
   if(event.code !== 'Enter'){
       return
   }
   
    inicio = 0
   final = 5
   filmes.innerHTML = ''
    if(input.value === ''){
        return retornarFilme()
    }

    const promiseResposta = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=' + input.value);

    promiseResposta.then(function (resposta) {
        const promiseBody = resposta.json();

        promiseBody.then(function (body){
            
            listaDeFilmes = body.results
            renderizarFilmes();
        })
    })

})


