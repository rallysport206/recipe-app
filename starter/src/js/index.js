import Search from './models/Search';
import * as searchView from './views/base';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
- search object
- current recipe object
- shopping list object
- liked recipes
*/

const state {};

// Search controller

const controlSearch = async() => {
    // 1 - get query from view
    const query = searchView.getInput() //TODO
    console.log(query);

    if (query) {
        // 2 - New search object and add to state
        state.search = new Search(query);

        // 3 - prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        // 4 - search for recipes
        await state.search.getResults();
        // 5 - Render results on UI
        clearLoader();
        searchView.renderResult(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }
});