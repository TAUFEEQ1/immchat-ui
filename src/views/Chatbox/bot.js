import axios from "axios";
class Bot {
    constructor() {
        this.exit_handler = null;
        this.application = new Map();
        this.applicationTypes = ["visa", "permit"];
        this.categories = ['ordinary', 'multiple-entry', 'diplomatic and official', 'transit', 'east africa tourist visa'];
        this.subcategories = {
            ordinary: ['single entry'],
            'diplomatic and official': ['single entry'],
            transit: ['single entry'],
            'multiple-entry': ['6 months', '12 months', '24 months'],
            'east africa tourist visa': ['single entry']
        };
        this.host = null;
    }
    setExit(hdl) {
        this.exit_handler = hdl;
    }
    setHost(host){
        this.host = host;
    }
    run(input) {

        // Check for exit command
        if (input.trim().toLowerCase() === 'exit') {
            this.exit_handler();
        }
        if (!this.application.has("type")) {
            input = input.replace(/(vis[a-z]*)/i, 'visa');
            input = input.replace(/(perm[a-z]*)/i, 'permit');
            if (this.applicationTypes.includes(input)) {
                this.application.set("type", input);
                return "Please enter your category (ordinary, multiple-entry, diplomatic and official, transit, or east africa tourist visa):";
            } else {
                return "Please enter your application type (visa or permit):";
            }
        }
        if (!this.application.has("category")) {
            input = input.replace(/ord(i|a)n(a|i)ry|ordnairy|ordinary/i, 'ordinary');
            input = input.replace(/mult(i|y)(p|b)l(e|y)-entry|multipul-entry|multiple-entry/i, 'multiple-entry');
            input = input.replace(/dipolm(a|o)tic(k)?\s+and\s+offi(c|s)ial|diplomatic and official/i, 'diplomatic and official');
            input = input.replace(/tran(s|z)(e|i)t(t)?|transit/i, 'transit');
            input = input.replace(/(east africa[a-z]* visa)/i, 'east africa tourist visa');
            if (this.categories.includes(input)) {
                this.application.set("category", input);
                const subcategoryOptions = this.subcategories[input.toLowerCase()];
                return `Please enter your subcategory (${subcategoryOptions.join(', ')}):`
            } else {
                return "Please enter your category (ordinary, multiple-entry, diplomatic and official, transit, or east africa tourist visa):";
            }
        }

        if (!this.application.has("subcategory")) {
            input = input.replace(/single\s*entry/i, 'single entry');
            input = input.replace(/6\s*months/i, '6 months');
            input = input.replace(/12\s*months/i, "12 months");
            input = input.replace(/24\s*months/i, "24 months");
            console.log(input);
            if (this.subcategories[this.application.get("category").toLowerCase()].includes(input.toLowerCase())) {
                this.application.set("subcategory", input);
                return "Please type your email address:";
            } else {
                const subcategoryOptions = this.subcategories[this.application.get("category").toLowerCase()];
                return `Please enter your subcategory (${subcategoryOptions.join(', ')}):`;
            }
        }

        this.application.set("email_address", input);
        return axios.post(this.host + "/applications", Object.fromEntries(this.application));

    }
    reset() {
        this.application = new Map();
        this.exit_handler = null;
    }
}
const bot = new Bot();
export default bot;