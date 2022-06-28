import axios from 'axios';
const BASE_URL =
  'https://pixabay.com/api/?key=27997246-40e54eef6dce1c7e3691c0e20';
let PER_PAGE = 40,
  PAGE = 1;
let tempPage = '';
export default async function getImages(searchValue, isSubmited) {
  try {
    if (tempPage !== searchValue || isSubmited) {
      PAGE = 1;
    }
    const response = await axios.get(
      `${BASE_URL}&q=${searchValue}&image_type=photo&orientation=horizontal
      &safesearch=true&per_page=${PER_PAGE}&page=${PAGE}`
    );
    PAGE++;
    tempPage = searchValue;
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
