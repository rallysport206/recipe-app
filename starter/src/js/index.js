import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/base';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
- search object
- current recipe object
- shopping list object
- liked recipes
*/

const state {};
window.state = state;
// Search controller

const controlSearch = async() => {
    // 1 - get query from view
    const query = searchView.getInput() //TODO

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

    if(id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight id
        if (state.search) searchView.highlightedSelected(id);
        //create new recipe object
        state.recipe = new Recipe(id);
        try {
            //get recipe data and parse ingredients
            await recipe.getRecipe();
            state.recipe.parseIngredeients();
            // calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert('Error processing recipe!');
        }
        
    }
    
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller
const controlList = () => {
    // Create a new list IF there isn't none yet
    if(!state.list) state.list = new List();

    // add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item =state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handel delete
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count--value') {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    })
});

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrrease button is clicked 
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
});

window.l = new List();