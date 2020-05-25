import search from './models/Search';
import * as searchView from './views/base';
import { elements } from './views/base';

/* Global state of the app
- search object
- current recipe object
- shopping list object
- liked recipes
*/

const state {};

const controlSearch = async() => {
    // 1 - get query from view
    const query = searchView.getInput() //TODO

    if (query) {
        // 2 - New search object and add to state
        state.search = new Search(query);

        // 3 - prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        // 4 - search for recipes
        await state.search.getResults();
        // 5 - Render results on UI
        searchView.renderResult(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});