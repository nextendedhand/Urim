import Common from './common';
import * as Store from 'electron-store';

/**
* This is a class for selectedData manager.
*/
export default class selectedDataManager {
    private store: Store;
    private common: Common;

    constructor() {
        this.store = new Store();
        this.common = new Common();
    }

    public getSelectedId(): string {
        try {
            console.log('Loading settings data by electron-store...');
            let selectedId = this.store.get(this.common.key.selectedId);
            return selectedId;
        }
        catch (e) {
            console.log(e);
            return "None";
        }
    }

    public setSelectedId(selectedId: string) {
        try {
            this.store.set(this.common.key.selectedId, selectedId);
        }
        catch (e) {
            console.log(e);
            return false;
        }

        return true;
    }
}
