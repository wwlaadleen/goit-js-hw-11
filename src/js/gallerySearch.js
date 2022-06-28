import Notiflix from 'notiflix';
import getImages from './service/fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchFormEl: document.querySelector('.search__form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

let searchValue = '';
let isSubmited = false;

refs.searchFormEl.addEventListener('submit', onSearchSubmit);

refs.loadMoreBtnEl.addEventListener('click', onLoadMore);

var lightbox = new SimpleLightbox('.gallery a');

function onLoadMore() {
  renderGalleryImages(searchValue);
}

function onSearchSubmit(e) {
  e.preventDefault();
  refs.loadMoreBtnEl.classList.add('visually-hidden');
  refs.galleryEl.innerHTML = '';
  searchValue = e.currentTarget.elements[0].value;
  isSubmited = true;
  renderGalleryImages(searchValue, isSubmited);
}

async function renderGalleryImages(searchValue) {
  const imagesData = await getImages(searchValue, isSubmited);
  isSubmited = false;
  const totalHits = imagesData.hits.length;
  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  refs.galleryEl.insertAdjacentHTML('beforeend', renderImages(imagesData.hits));
  lightbox.refresh();
  refs.loadMoreBtnEl.classList.remove('visually-hidden');
}

function renderImages(fetchData) {
  return fetchData
    .map(
      e => `
            <div class="photo-card">
            <a href="${e.largeImageURL}">
        <img class = "photo-card__img" src="${e.webformatURL}" alt='${e.tags}' loading="lazy" /></a>
        <div class="info">
              <div class="info-item">
                <b class='info-item__title'>Likes</b>
                <p class='info-item__stats'>${e.likes}</p>
              </div>
                <div class="info-item">
                    <b class='info-item__title'>Views</b>
                    <p class='info-item__stats'>${e.views}</p>
                </div>
                <div class="info-item">
                    <b class='info-item__title'>Comments</b>
                    <p class='info-item__stats'>${e.comments}</p>
                </div>
                <div class="info-item">
                    <b class='info-item__title'>Downloads</b>
                    <p class='info-item__stats'>${e.downloads}</p>
                </div>
        </div>
      </div>
      `
    )
    .join('');
}
