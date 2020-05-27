import Search from './models/Search';
import Recipe from './models/Recipe';
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
        
        try{
            // 4 - search for recipes
            await state.search.getResults();
            // 5 - Render results on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (err) {
            alert ('Something wrong with the search...');
            clearLoader();
        }
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

// recipe controller
const controlRecipe = () => {
    // get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
        //prepare UI for changes

        //create new recipe object
        state.recipe = new Recipe(id);
        try {
            //get recipe data
            await recipe.getRecipe()
            // calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe 
            console.log(state.recipe);
        } catch (err) {
            alert('Error processing recipe!');
        }
        
    }
    
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
