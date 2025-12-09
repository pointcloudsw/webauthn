import { createContext } from 'svelte';
import { type List } from '$lib/types/list';

export const [getListContext, setListContext] = createContext<List>();