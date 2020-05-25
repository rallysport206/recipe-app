import axios from axios;

async function getResults(query) {
    const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
}
getResults('pizza');
