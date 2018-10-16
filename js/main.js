const BASE_API = 'https://yts.am/api/v2/'

async function getData(url) {
  const response = await fetch(url)
  const data = await response.json()
  if (data.data.movie_count > 0) {
    return data
  }

  throw new Error('No se encontro ningun resultado')
}

const $mainContent = document.querySelector('#mainContent')
const $form = document.querySelector('#form')
const $featuringContainer = document.querySelector('#featuring')

function setAttributes ($element, attributes) {
  for (const attribute in attributes) {
    $element.setAttribute(attribute, attributes[attribute])
  }
}

function featuringTemplate(peli) {
  return (
    `
    <div class="featuring">
      <div class="featuring-image">
        <img src="${peli.medium_cover_image}" width="100" alt="">
      </div>
      <div class="featuring-content">
        <p class="featuring-title">Pelicula encontrada</p>
        <p class="featuring-album">${peli.title}</p>
      </div>
    </div>
    `
  )
}

$form.addEventListener('submit', async (event) => {
  event.preventDefault()
  $mainContent.classList.add('main-content--search-active')
  const $loader = document.createElement('img')
  setAttributes($loader, {
    src: 'image/loader.gif',
    height: 50,
    width: 50,
  })
  $featuringContainer.append($loader)

  const data = new FormData($form)
  try {
    const {
      data: {
        movies: pelis
      }
    } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)

    const HTMLString = featuringTemplate(pelis[0])
    $featuringContainer.innerHTML = HTMLString
  } catch(error) {
    alert(error.message)
    $loader.remove()
    $mainContent.classList.remove('main-content--search-active')
  }
})
