
import { getContext, setContext } from "svelte";

const CART_CTX = Symbol("CART");

class Cart {
    name = $state(null);
    date = $state()
    items = $state([])

    add(item) {
        this.items.push(item)
    }

    remove(item) {
        this.items = this.items.filter(i => i.id !== item.id)
    }

    includes(item) {
        return this.items.map(i => i.id).includes(item.id)
    }
}

export function setCartState() {
    // const cartState = $state({ recipes: [] })
    const cartState = new Cart()
    return setContext(CART_CTX, cartState)
}


export function getCartState() {
    return getContext(CART_CTX);
}
