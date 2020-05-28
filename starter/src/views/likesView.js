import { elements } from './base';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('herf', `img/icons.svg${iconString}`);
}

export const toggleLikeMenu = numsLikes => {
    elements.likesMenu.style
}