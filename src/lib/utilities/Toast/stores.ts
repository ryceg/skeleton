// Toast Store Queue

import { writable } from 'svelte/store';

export interface ToastMessage {
	message: string;
	autohide?: boolean;
	timeout?: number;
	background?: string;
	button?: {
		label: string;
		action: any;
	};
}

export const toastDefaults: any = { message: 'Default Toast Message', autohide: true, timeout: 5000 };
let toastId: number = 0;

function toastService(): any {
	const { subscribe, set, update } = writable([]);
	return {
		subscribe,
		// Trigger - append to end of queue
		trigger: (toast: any) =>
			update((tStore: any) => {
				let tMerged: any = { id: toastId, ...toastDefaults, ...toast };
				handleToastTimeout(tMerged);
				tStore.push(tMerged);
				toastId += 1;
				return tStore;
			}),
		// Close - remove first item in queue
		close: (id: number) =>
			update((tStore) => {
				if (tStore.length > 0) {
					const index: number = tStore.findIndex((t: any) => t.id === id);
					tStore.splice(index, 1);
				}
				return tStore;
			}),
		// Clear - remove all items from queue
		clear: () => set([])
	};
}

export const toastStore: any = toastService();

// Timeout Handler
function handleToastTimeout(t: any): void {
	// If autohide false, persist until dismissed
	if (!t.autohide) return;
	// Close after Timeout
	setTimeout(() => {
		toastStore.close(t.id);
	}, t.timeout);
}
