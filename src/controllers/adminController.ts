import CoreController from "./coreController.ts";
import {$, $$, API, order_status} from "../constants/main.ts";
import Chart from 'chart.js/auto'
import categoryModel from '../models/categoriesModel.ts';
import productsModel from '../models/productsModel.ts';
import UsersModel from '../models/usersModel.ts';
import form from "../form/form.ts";
import confirm from "../form/confirm.ts";
import ProductsModel from "../models/productsModel.ts";
import VouchersModel from '../models/vouchersModel.ts';
import DeliveriesModel from '../models/deliveriesModel.ts';
import notification from "../form/notification.ts";
import ordersModel from "../models/ordersModel.ts";

export default class adminController extends CoreController {
    constructor() {
        super();
        this.loadLayouts("admin");
        const linkStyle = $('link[data-style="style"]') as HTMLElement;
        if (linkStyle) linkStyle.remove();
        ($('head') as HTMLElement).innerHTML += `<link rel='stylesheet' href='./style/admin.css'>`;
    }

    loadCss(name: string) {
        ($('head') as HTMLElement).innerHTML += `<link rel='stylesheet' href='./style/admin/${name}.css'>`;
    }

    async index(): Promise<void> {
        this.loadCss('index');
        this.loadViewAdmin('home', () => {
            ($('#indexLink') as HTMLElement).classList.add('active');
            const line = (document.getElementById('lineChart') as HTMLCanvasElement).getContext('2d');
            if (line) new Chart(line, {
                type: 'bar', // Loại biểu đồ (ví dụ: bar, line, pie, ...)
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: 'My Dataset',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: '#4FD1C5',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, // Tự động thích ứng với kích thước của phần tử chứa (mặc định: true)
                    maintainAspectRatio: true, // Không giữ tỷ lệ khung nhìn (mặc định: true)
                }
            });
            const pie = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
            if (pie) new Chart(pie, {
                type: 'pie', // Loại biểu đồ (ví dụ: bar, line, pie, ...)
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: 'My Dataset',
                        data: [10, 2, 5, 3, 3, 3],
                        backgroundColor: '#4FD1C5',
                        borderColor: 'rgba(150, 100, 200, 0.5)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, // Tự động thích ứng với kích thước của phần tử chứa (mặc định: true)
                    maintainAspectRatio: true, // Không giữ tỷ lệ khung nhìn (mặc định: true)
                }
            });
        })
    }

    async categories(): Promise<void> {
        this.loadCss('categories');
        const categoriesModel = this.loadModel('categories') as categoryModel;
        const categories = await categoriesModel.findAllCategories();
        const productModel = this.loadModel('products') as productsModel;
        const renderCategories = async (categories: Category[]) => {
            const blockContainer = $('#container .content .table .tbody') as HTMLElement;
            const status: Record<number, string> = {
                0: 'hidden',
                1: 'show'
            }
            let html = '';
            for (const category of categories) {
                const quantity = await productModel.getQuantityProductByIdCategories(category._id);
                if (!category || Object.keys(category).length === 0) {
                    continue;
                }
                html += `
                   <div id="row-order-${category._id}" class="row">
                        <div>${category._id}</div>
                        <div>${category.name}</div>
                        <div>${quantity}</div>
                        <div class="status-${category._id}">${status[category.status]}</div>
                        <div>
                            <a href="#" class="update" data-id="${category._id}">Update</a>
                        </div>
                   </div>
            `;
            }
            blockContainer.innerHTML = html;
        }

        this.loadViewAdmin('categories', async () => {
            ($('#categoriesLink') as HTMLElement).classList.add('active');
            await renderCategories(categories);
            ($('#container .content .addBtn') as HTMLElement).addEventListener('click', () => {
                form('addCategory');
            })
        })
    }

    async products() {
        this.loadCss('products');
        this.loadTitle('Products - Dashboard');
        const productsModel = this.loadModel('products') as ProductsModel;
        const categoriesModel = this.loadModel('categories') as categoryModel;
        const [products, categories] = await Promise.all([
            productsModel.findProductsQuantityPage(1, 6),
            categoriesModel.findAllCategories()
        ]);
        let categoryName: Record<string, string> = {};
        (categories).forEach((category: Category) => {
            categoryName[category._id] = category.name;
        });
        const renderListProducts = (products: Product[]) => {
            const listBoxProduct: HTMLElement = $('#container .content .table .tbody') as HTMLElement;
            Promise.all(products.map(async product => {
                if (!product || Object.keys(product).length === 0) {
                    return;
                }
                return `
                    <div class="row">
                      <div>${product._id}</div>
                      <div>${product.name}</div>
                      <div class="img"><img loading="lazy" src="${API.endPoint}images/uploads/${product.image}" alt=""></div>
                      <div>${categoryName[product.id_category]}</div>
                      <div>${product.designer}</div>
                      <div>${product.properties[0].price}$</div>
                      <div>
                        <span style="background: ${product.color}"></span> 
                      </div>
                      <div><a data-id="${product._id}" class="detailProduct" href="#">Detail</a></div>
                    </div>
                `;
            })).then(htmlArray => {
                const html = htmlArray.join('');
                listBoxProduct.innerHTML += html;
            }).catch(error => {
                console.log(error);
            });

        };
        this.loadViewAdmin('products', () => {
            ($('#productsLink') as HTMLElement).classList.add('active');
            renderListProducts(products);
        })
    }

    async users(): Promise<void> {
        this.loadTitle('Users - Dashboard');
        this.loadCss('users');
        const usersModel = this.loadModel('users') as UsersModel;
        const users = await usersModel.findAllUsers();
        const renderUsers = async (users: User[]) => {
            const blockContainer = $('#container .content .table .tbody') as HTMLElement;
            const role: Record<number, string> = {
                0: 'user',
                1: 'admin',
            };
            let html = '';
            for (const user of users) {
                if (!user || Object.keys(user).length === 0) {
                    continue;
                }
                let image = '';
                if (user.image !== '') {
                    image = API.endPoint + 'images/uploads/' + user.image;
                } else {
                    image = './images/logo/icon.png';
                }
                html += `
                   <div id="row-user-${user._id}" class="row">
                    <div>${user._id}</div>
                    <div class="name-user-${user._id}">${user.name}</div>
                    <a class="img"><img class="img-user-${user._id}" data-img="${user.image}" src="${image}" alt="" /></a>
                    <div class="email-user-${user._id}">${user.email}</div>
                    <div class="address-user-${user._id}">${user.address}</div>
                    <div class="phone-user-${user._id}">${user.phone}</div>
                    <div class="role-user-${user._id}">${role[parseInt(user.role)]}</div>
                    <div><a data-id-user="${user._id}" class="edit-user" href="admin/users">Edit</a> / <a data-id-user="${user._id}" class="remove-user" href="#">Remove</a></div>
                    <div class="password-user-${user._id}" style="display: none">${user.password}</div>
                   </div>
            `;
            }
            blockContainer.innerHTML = html;

            const edit = $$('.edit-user') as NodeListOf<HTMLElement>;
            edit.forEach((btn) => {
                const id = btn.getAttribute('data-id-user') as string;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    form('editUsers', id);
                });
            });

            const remove = $$('.remove-user') as NodeListOf<HTMLElement>;
            remove.forEach((btn) => {
                const id = btn.getAttribute('data-id-user') as string;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (id === JSON.parse(localStorage.getItem('user') as string)._id) {
                        console.log('this is admin now');
                        notification('you cannot remove yourself from the system !', () => {
                            ($('#notification') as HTMLElement).remove();
                        })
                    } else {
                        confirm('removeUser', id);
                    }
                });
            })
        }

        this.loadViewAdmin('users', async () => {
            ($('#usersLink') as HTMLElement).classList.add('active');
            ($('.addBtn') as HTMLElement).addEventListener('click', () => form('addUsers'));
            await renderUsers(users);
        })
    }

    async orders() {
        this.loadCss('orders');
        this.loadTitle('Orders - Dashboard');
        const ordersModel = this.loadModel('orders') as ordersModel;
        const ordersList = await ordersModel.findAllOrders();

        const renderOrder = async (orders : Order[]) => {
            const container = ($('#container .content .table .tbody') as HTMLElement);
            let html = '';
            for(let order of orders) {
                html += `
                    <dv class="row">
                        <div>${order._id}</div>
                        <div>
                            <div>Wrap : ${order.wrap}</div>
                            <div>Name : ${order.name}</div>
                            <div>Ship Fee : ${order.ship_fee}$</div>
                            <div>Distance : ${order.distance}km</div>
                            <div>Adress : ${order.address}</div>
                            <div>Phone number : ${order.phone}</div>
                            <div>Email : ${order.email}</div>
                        </div>
                        <div>${order.order_date}</div>
                        <div>${order.total}$</div>
                        <div>${order_status[order.order_status]}</div>
                        <div>
                            <a class="detail" data-id="${order._id}" href="#">Detail</a> 
                                -
                             <a class="update" data-id="${order._id}" href="#">Update</a>
                        </div>
                    </dv>
                `;
            }
            container.innerHTML = html;
            ($$('#container .content .table .tbody .row a.detail') as NodeListOf<HTMLElement>).forEach(detail => {
                detail.addEventListener('click', (e) => {
                    e.preventDefault();
                    form('detailOrder', detail.getAttribute('data-id'));
                })
            });
            ($$('#container .content .table .tbody .row a.update') as NodeListOf<HTMLElement>).forEach(update => {
                update.addEventListener('click', (e) => {
                    e.preventDefault();
                    form('detailOrder', update.getAttribute('data-id'));
                })
            })
        }
        this.loadViewAdmin('orders', async () => {
            ($('#ordersLink') as HTMLElement).classList.add('active');
            await renderOrder(ordersList);
        })
    }

    async vouchers(): Promise<void> {
        this.loadCss('voucher');
        this.loadTitle('Vouchers- Dashboard');
        const voucherModel = this.loadModel('vouchers') as VouchersModel;
        const vouchersList = await voucherModel.getAllVouchersByPage(1, 10);

        const renderVoucher = (vouchers: Voucher[]): void => {
            const container = $('#container .content .table .tbody') as HTMLElement;
            let html: string = '';
            vouchers.map((voucher) => {
                html += `
                    <div class="row" id="row-${voucher._id}">
                        <div class="id-${voucher._id}">${voucher._id}</div>
                        <div class="code-${voucher._id}">${voucher.code}</div>
                        <div class="discount-${voucher._id}">${voucher.discount}%</div>
                        <div class="date_end-${voucher._id}">${voucher.date_end}</div>
                        <div class="min_amount-${voucher._id}">${voucher.min_amount}$</div>
                        <div class="expired-${voucher._id}">${voucher.expired}</div>
                        <div>
                            <a data-id="${voucher._id}" class="edit" href="#">Edit</a>
                            /
                            <a data-id="${voucher._id}" class="remove" href="#">Remove</a> 
                        </div>
                    </div>
                `;
            })
            container.innerHTML = html;
            ($$('.remove') as NodeListOf<HTMLElement>).forEach(remove => {
                remove.addEventListener('click', (e: MouseEvent) => {
                    e.preventDefault();
                    const id = (e.target as HTMLElement).getAttribute('data-id') as string;
                    confirm('removeVoucher', id);
                })
            });
            ($$('.edit') as NodeListOf<HTMLElement>).forEach(edit => {
                edit.addEventListener('click', (e: MouseEvent) => {
                    e.preventDefault();
                    const id = (e.target as HTMLElement).getAttribute('data-id') as string;
                    form('editVoucher', id);
                })
            })
        }

        this.loadViewAdmin('voucher', () => {
            ($('#vouchersLink') as HTMLElement).classList.add('active');
            ($('.addBtn') as HTMLElement).addEventListener('click', () => form('addVoucher'));
            renderVoucher(vouchersList);
        })
    }

    async delivery(): Promise<void> {
        this.loadCss('delivery');
        this.loadTitle('Delivery - Dashboard');
        const deliveriesModel = this.loadModel('deliveries') as DeliveriesModel;

        const renderDeliveries = (deliveries: Delivery[]) => {
            const container = $('#container .content .table .tbody') as HTMLElement;
            let convertStatus: Record<number, string> = {
                0: 'suspended',
                1: 'active'
            }
            let html = '';
            deliveries.map(delivery => {
                html += `
                    <div class="row ">
                        <div>${delivery._id}</div>
                        <div>${delivery.name}</div>
                        <div>${delivery.price}</div>
                        <div>${delivery.speed}</div>
                        <div>${convertStatus[delivery.status]}</div>
                        <div>
                            <a href="#" class="edit" data-id="${delivery._id}">edit</a> / <a href="#" class="remove" data-id="${delivery._id}">remove</a>
                        </div>
                    </div>
                `;
            })
            container.innerHTML = html;

            ($$('.edit') as NodeListOf<HTMLElement>).forEach(edit => {
                edit.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    console.log(12)
                })
            });
            ($$('.remove') as NodeListOf<HTMLElement>).forEach(remove => {
                remove.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    confirm('removeDelivery', remove.getAttribute('data-id') as string);
                })
            })
        }

        this.loadViewAdmin('delivery', async () => {
            ($('#deliveryLink') as HTMLElement).classList.add('active');
            ($('#container .content .addBtn') as HTMLElement).addEventListener('click', () => {
                form('addDelivery')
            });
            const deliveryList = await deliveriesModel.findDeliveriesByPage(1, 10);
            console.log(deliveryList)
            renderDeliveries(deliveryList);

        })
    }
}
