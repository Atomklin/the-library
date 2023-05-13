import { writable } from "svelte/store";

import type { VisibleModal, Item } from "./types"

export const visibleModal = writable<VisibleModal | undefined>();
export const selected = writable<Item | undefined>();