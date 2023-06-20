import { writable } from "svelte/store";

import type { ModalType, Result } from "./types"

export const selected = writable<Result | undefined>();