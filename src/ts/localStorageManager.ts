/**
 * This is a class for accessing local storage.
 * The localStorage capacoty is 5MB,
 * and will not be erased unless it's intentionally erased.
 *
 * localStorage is an array, and new key is alaways set to index 0,
 * then the index of existing key is increased by one.
 *
 * Note that the data format is DOMstring,
 * therefore if you use jSON object, use JSON.stringfy or JSON.parse.
 *
 * Note that some browsers such as private browser cannot be used,
 * and also cannot used when the cookie setting is OFF.
 * (Checked if the localStorage is available in the constructor automatically)
 */
import toDoData from './toDoData';
import settingsData from './settingsData';




/**
 * "Read" and "Over-write" only.
 * For normal use.
 */
export default class LocalStorage {

    /* private variavles */
    private isAvailable: boolean = false;

    /**
     * consuructor: check if the localStorage is available
     */
    constructor() {
        this.isAvailable = localStorageAvailable();
    }

    /**
     * get value with common key
     * @param key key to identify data
     */
    public getValue(key: string): toDoData[] | settingsData {
        if (this.isAvailable)
            return JSON.parse(localStorage.getItem(key));
    }

    /**
     * set value with common key
     * @param key key to identify data (toDoData or settingsData)
     * @param value this is set with common key
     */
    public setValue(key: string, value: toDoData[] | settingsData): void {
        if (this.isAvailable)
            localStorage.setItem(key, JSON.stringify(value));
    }

}



/**
 * All action is obtained.
 * For general use.
 */
export class LocalStorage_All {

    /* private variables */
    private isAvailable: boolean = false;

    /**
     * consuructor: check if the localStorage is available
     */
    constructor() {
        this.isAvailable = localStorageAvailable();
    }

    /**
     * Remove key and value
     * @param key removed key name
     */
    public LS_Remove(key: string): boolean {
        if (this.isAvailable) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.log(e);
            }
        }
        return false;
    }

    /**
     * Clear local storage
     */
    public LS_Clear(): void {
        if (this.isAvailable)
            localStorage.clear();
    }

    /**
     * Get value associated with the key
     * @param key key of value
     */
    public LS_GetValue(key: string): string {
        if (this.isAvailable) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.log(e);
            }
        }
        return null;
    }

    /**
     * Set value with new key.
     * Note that this function can not be used for ovewrwriting.
     * @param key new key
     * @param value value
     */
    public LS_Write(key: string, value: string): boolean {
        if (this.isAvailable) {
            try {
                if (localStorage.getItem(key) == null)  /* 新規のキーなら書き込み */
                    localStorage.setItem(key, value);
                else
                    console.log("This function can not use with existing key.")
                return true;
            } catch (e) {
                console.log(e);
            }
        }
        return false;
    }

    /**
     * Set value with existing key
     * Note that this function can not be used for new writes.
     * @param key existing key
     * @param value value
     */
    public LS_Overwrite(key: string, value: string): boolean {
        if (this.isAvailable) {
            try {
                if (localStorage.getItem(key) != null)  /* 既存のキーなら書き込み */
                    localStorage.setItem(key, value);
                else
                    console.log("This function can not use with new key.")
                return true;
            } catch (e) {
                console.log(e);
            }
        }
        return false;
    }

    /**
     * output all localStorage keys and values to the console.
     */
    public ConsoleLog_localStorage_All(): void {
        var key_num = localStorage.length;
        if (key_num == 0) console.log("No data.");
        else
            for (let i: number = 0; i < key_num; ++i) {
                let temp_key: string = localStorage.key(i);
                let temp_value: string = localStorage.getItem(temp_key);
                let console_out: string = "index[" + String(i) + "] key = " + temp_key + " value = " + temp_value;
                console.log(console_out);
            }
    }

}



/* common functions */



/**
 * function to check if localStorage is available
 */
const localStorageAvailable = (): boolean => {
    if (storageAvailable()) {
        console.log("localStorage is available.");
        return true;
    }
    else {
        console.log("localStorage is unavailable.");
        return false;
    }
}



/**
 * function to check if localStorage is available
 */
const storageAvailable = (): boolean => {

    try {
        let x: string = '__localStorage_test__';
        localStorage.setItem(x, x);
        localStorage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            localStorage.length !== 0;
    }

}
