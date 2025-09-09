
import { getContext, setContext } from "svelte";

const CART_CTX = Symbol("CART");

class Cart {
    name = $state(null);
    date = $state()
    items = $state([])
}

export function setCartState() {
    // const cartState = $state({ recipes: [] })
    const cartState = new Cart()
    return setContext(CART_CTX, cartState)
}


export function getCartState() {
    return getContext(CART_CTX);
}
