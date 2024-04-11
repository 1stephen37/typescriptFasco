import pageController from "../controllers/pageController.ts";
import accountController from "../controllers/accountController.ts";
import adminController from "../controllers/adminController.ts";

class core {
    controller : string = "page";
    method: string = "index";
    params : any = '';

    constructor() {
        const path: string = location.pathname;
        if(path.length > 1) [this.controller, this.method, ...this.params] = path.slice(1).split('/');
        if(this.method === '' || this.method === undefined || this.method === null) this.method = 'index';
        console.log(path);
        console.log("core is running");

        let ctrl : any;
        switch (this.controller) {
            case 'page': {
                ctrl = new pageController();
                break;
            }
            case 'account': {
                ctrl = new accountController();
                break;
            }
            case 'admin': {
                ctrl = new adminController();
                break;
            }
            default: {
                ctrl = new pageController();
                break;
            }
        }

        ctrl[this.method](...this.params);

    }

}

export default core
