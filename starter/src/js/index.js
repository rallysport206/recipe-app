import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/base';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id));
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

// like controller
const controller = () => {
    if (!state.likes) state.likes = new Likes ();
    const currentID = state.recipe.id;
    
    // User hasn't liked recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.like.addLike() {
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        };
        //toggle the like button
        likesView.toggleLikeBtn(true);
        // add like to UI List
        likesView.renderLike(newLike);
    // User HAS liked recipe
    } else {
        // remove like to the state
        state.likes.deleteLike(currentID);
        //toggle the like button
        likesView.toggleLikeBtn(false);
        // remove like to UI List
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumsLikes);
};

// Restore like recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumsLikes());
    
    // Render the existing likes
    state.likes.likes.forEach(like => likesViews.renderLike(like));
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
        // add ingredients to shopping list
        controlList();
    } else if (e.taret.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

window.l = new List();