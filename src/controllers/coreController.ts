import {$} from '../constants/main.ts';
import {API} from "../constants/main.ts";
import CategoriesModel from '../models/categoriesModel.ts';
import ProductsModel from "../models/productsModel.ts";
import UsersModel from "../models/usersModel.ts";
import VouchersModel from '../models/vouchersModel.ts';
import OrdersModel from "../models/ordersModel.ts";
import orderDetailsModel from "../models/orderDetailsModel.ts";
import notification from "../form/notification.ts";
import deliveriesModel from "../models/deliveriesModel.ts";
import confirm from "../form/confirm.ts";


class coreController {

    loadLayouts: (name: string) => void = (name: string = 'main') => {
        try {
            const viewURL = `./views/layouts/${name}.html`;
            fetch(viewURL)
                .then((res) => res.text())
                .then(html => ($('body') as HTMLElement).innerHTML = html)
        } catch (error) {
            console.error(error);
        }
    }

    loadViewPage: (name: string, callback: () => void) => void = (name: string = 'home', callback: () => void) => {
        try {
            const viewURL = `./views/page/${name}.html`;
            fetch(viewURL)
                .then(res => res.text())
                .then(html => ($('#mainContent') as HTMLElement).innerHTML = html)
                .then(() => {
                    const searchBtn = $('.container .header .icon a') as HTMLElement;
                    searchBtn.addEventListener('click', (e: MouseEvent) => {
                        e.preventDefault();
                        ($('body') as HTMLElement).innerHTML += `
                             <div id="formSearch">
                                 <div class="main_form" id="formAdd">
                                    <form action="">
                                        <label for="searchBox">
                                            <input id="searchBox" type="text">
                                            <input type="submit" value="search">
                                        </label>
                                    </form>
                                 </div>
                             </div>
                        `;
                    });
                    const cartLength = document.querySelector('.container .header .icon .cartLength') as HTMLElement;
                    if (localStorage.getItem('cart') !== null && JSON.parse(localStorage.getItem('cart') as string)?.length > 0) {
                        cartLength.classList.remove('close');
                        cartLength.textContent = JSON.parse(localStorage.getItem('cart') as string)?.length;
                    } else {
                        cartLength.classList.add('close');
                    }
                    if (localStorage.getItem('user') !== null) {
                        if ((JSON.parse(localStorage.getItem('user') as string)).role === '0') {
                            (document.getElementById('Sign_in') as HTMLAnchorElement).href = '/account/information';
                        } else {
                            (document.getElementById('Sign_in') as HTMLAnchorElement).href = '/admin';
                        }
                        ($('#history') as HTMLAnchorElement).href = '/page/history';
                    } else {
                        (document.getElementById('Sign_in') as HTMLAnchorElement).href = '/account/sign_in';
                        ($('#history') as HTMLElement).addEventListener('click', (e: MouseEvent) => {
                            e.preventDefault();
                            notification(`You must log in to view your purchase history !`, () => {
                                ($('#notification') as HTMLElement).remove();
                            })
                        });
                    }
                })
                .then(callback)
        } catch (error) {
            console.error(error);
        }
    }

    loadViewAccount(name: string, callback: () => void): void {
        try {
            const viewURL = `./views/account/${name}.html`;
            fetch(viewURL)
                .then(res => res.text())
                .then(html => ($('#mainContent') as HTMLElement).innerHTML = html)
                .then(() => {

                })
                .then(callback)
        } catch (error) {
            console.error(error);
        }
    }

    loadViewAdmin(name: string, callback: () => void): void {
        try {
            const viewURL = `./views/admin/${name}.html`;
            fetch(viewURL)
                .then(res => res.text())
                .then(html => ($('#container .content') as HTMLElement).innerHTML = html)
                .then(() => {
                    ($('#container .navbar .logout') as HTMLElement).addEventListener('click', () => {
                        confirm('logout', '1');
                    })
                    if ((JSON.parse(localStorage.getItem('user') as string) === null) ||
                        !(JSON.parse(localStorage.getItem('user') as string).role === '1')) {
                        notification('Only administrators are allowed to access the dashboard page', () => {
                            window.location.href = '/';
                        })
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 2000);
                    }
                    ($('.content .breadcrumb .right .sign_in span') as HTMLElement).textContent = JSON.parse(localStorage.getItem('user') as string).name;
                    ($('.content .breadcrumb .right .sign_in') as HTMLAnchorElement).href = '/account/information';
                })
                .then(callback)
        } catch (error) {
            console.error(error);
        }
    }

    loadTitle(title: string) {
        ($('head title') as HTMLElement).textContent = title;
    }

    loadModel(modelName: string) {
        switch (modelName) {
            case 'categories': {
                return new CategoriesModel(API.endPoint);
            }
            case 'products': {
                return new ProductsModel(API.endPoint);
            }
            case 'users': {
                return new UsersModel(API.endPoint);
            }
            case 'vouchers': {
                return new VouchersModel(API.endPoint);
            }
            case 'deliveries': {
                return new deliveriesModel(API.endPoint);
            }
            case 'orders': {
                return new OrdersModel(API.endPoint);
            }
            case 'orderDetails': {
                return new orderDetailsModel(API.endPoint);
            }
            default: {
                break;
            }
        }
    }

}

export default coreController;
