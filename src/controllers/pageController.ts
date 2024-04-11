import coreController from "./coreController.ts";
import {$, $$, API, order_status} from "../constants/main.ts";
import CategoriesModel from "../models/categoriesModel.ts"
import ProductsModel from "../models/productsModel.ts";
import notification from "../form/notification.ts";
import deliveriesModel from "../models/deliveriesModel.ts";
import {calculateDistance} from "../helpers/OpenStreetMapApi.ts";
import vouchersModel from "../models/vouchersModel.ts";
import ordersModel from "../models/ordersModel.ts";
import orderDetailsModel from "../models/orderDetailsModel.ts";
import confirmUserSide from "../form/confirmUserSide.ts";
import UsersModel from "../models/usersModel.ts";


class pageController extends coreController {
    constructor() {
        super();
        this.loadLayouts('main');
    }

    loadCss(name: string) {
        ($('head') as HTMLElement).innerHTML += `<link rel='stylesheet' href='./style/page/${name}.css'>`;
    }

    index: () => void = async () => {
        try {
            this.loadCss('index');

            const categoriesModel = this.loadModel('categories') as CategoriesModel;
            const categoriesList: Category[] = await categoriesModel?.findLimitCategories(5);
            localStorage.setItem('id_categories', JSON.stringify(categoriesList[1]._id));
            const productsModel = this.loadModel('products') as ProductsModel;
            const id_categories: string | null = JSON.parse(localStorage.getItem('id_categories') as string);
            let id_selected: string;
            if (id_categories) id_selected = id_categories; else id_selected = categoriesList[1]._id;
            id_selected = id_selected.toString();
            const productsList = await productsModel?.findProductsByCategoryIdAndPage(id_selected, 1, 6);
            const handleCategories = (id: string | null): void => {
                localStorage.setItem('id_categories', JSON.stringify(id));
                renderCategories(categoriesList);
            }
            const handleId = (id: string) => localStorage.setItem('id', JSON.stringify(id));

            const renderCategories = (categories: Category[]) => {
                const blockCategories: HTMLElement | null = $('.container .content .section4 .section4_nav');
                const id_categories: string | null = JSON.parse(localStorage.getItem('id_categories') as string);
                let id_selected: string = '0';
                if (id_categories) id_selected = id_categories;
                id_selected = id_selected.toString();
                let html = '';
                categories.map((category: Category): void => {
                    html += `<a data-id="${category._id}" class="categories ${category._id.toString() === id_selected ? 'active' : ''}" 
                    href="#">${category.name}</a>`;
                });
                (blockCategories as HTMLElement).innerHTML = html;
                ($$('.container .content .section4 .section4_nav a.categories') as NodeListOf<HTMLElement>).forEach((cate: HTMLElement) => {
                    cate.addEventListener('click', async (e: MouseEvent) => {
                        e.preventDefault();
                        let id: string | null = (e.target as HTMLElement).getAttribute('data-id');
                        handleCategories((e.target as HTMLElement).getAttribute('data-id'))
                        const productsList = await productsModel.findProductsByCategoryIdAndPage(id as string, 1, 6);
                        renderBoxProduct(productsList);
                    })
                })
            }

            const renderBoxProduct = (products: Product[]) => {
                const blockProduct = $('.container .content .section4 .box-product');
                if (products.length > 0) {
                    let html = '';
                    for (const product of products) {
                        html += `
                      <div class="product">
                        <a href="page/detail/${product.name}" class="link" data-id="${product._id}">
                            <img src="http://localhost:3000/images/uploads/${product.image}" alt="">
                        </a>
                        <div class="flex top_content">
                            <a href="page/detail/${product.name}" class="name link" data-id="${product._id}">
                                ${product.name.length > 15 ? product.name.slice(0, 15) + '...' : product.name}
                            </a>
                            <div class="star">
                                <svg xmlns="http://www.w3.org/2000/svg" width="95" height="19" viewBox="0 0 95 19" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6646 7.12771L9.5 0L7.33536 7.12771H0L5.93479 11.742L3.73214 19L9.5 14.5146L15.2679 19L13.0652 11.742L19 7.12771H11.6646Z" fill="#FCA120"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M30.6646 7.12771L28.5 0L26.3354 7.12771H19L24.9348 11.742L22.7321 19L28.5 14.5146L34.2679 19L32.0652 11.742L38 7.12771H30.6646Z" fill="#FCA120"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M49.6646 7.12771L47.5 0L45.3354 7.12771H38L43.9348 11.742L41.7321 19L47.5 14.5146L53.2679 19L51.0652 11.742L57 7.12771H49.6646Z" fill="#FCA120"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M68.6646 7.12771L66.5 0L64.3354 7.12771H57L62.9348 11.742L60.7321 19L66.5 14.5146L72.2679 19L70.0652 11.742L76 7.12771H68.6646Z" fill="#FCA120"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M87.6646 7.12771L85.5 0L83.3354 7.12771H76L81.9348 11.742L79.7321 19L85.5 14.5146L91.2679 19L89.0652 11.742L95 7.12771H87.6646Z" fill="#FCA120"/>
                                </svg>
                            </div>
                        </div>
                        <div class="author">
                            ${product.designer}
                        </div>
                        <div class="view">
                            (${(product.review / 1000)}k) Customer Reviews
                        </div>
                        <div class="flex bottom_content">
                            <div class="price">
                                $${product.properties[0].price}
                            </div>
                            <div class="status">
                                Almost Sold Out
                            </div>
                        </div>
                    </div>
                `;
                    }
                    (blockProduct as HTMLElement).innerHTML = html;
                    $$('.link').forEach(link => {
                        link.addEventListener('click', () => {
                            let id = link.getAttribute('data-id');
                            if (id) handleId(id);
                        })
                    })
                } else {
                    (blockProduct as HTMLElement).innerHTML = `<h1 style="text-align: center;grid-column: span 3; grid-row: span 2; line-height: 80px">
                    The category you are selecting is not currently available
                    </h1>`
                }
            }

            this.loadViewPage('home', () => {
                renderCategories(categoriesList);
                renderBoxProduct(productsList);
                ($('.section1 .banner_mid .banner_middle .button') as HTMLElement).addEventListener('click', () => {
                    location.href = '/page/shop'
                })
            });
        } catch (e) {
            console.log(e);
        }
    }

    shop: () => void = async () => {
        this.loadTitle('Fashion Shop');
        this.loadCss('shop');
        const categoriesModel = this.loadModel('categories') as CategoriesModel;
        const categoriesList: Category[] = await categoriesModel?.findAllCategories();
        const productsModel = this.loadModel('products') as ProductsModel;
        localStorage.setItem('selectedCategory', JSON.stringify(categoriesList[0]._id));
        const productsList = await productsModel?.findProductsByCategoryIdAndPage(categoriesList[0]._id, 1, 6);

        const handlePage = async (id_category: string): Promise<void> => {
            const categoryLength = await productsModel.findProductsByIdCategories(id_category);
            if (categoryLength.length > 6) {
                let selectedPage: number = 1;
                if (JSON.parse(localStorage.getItem('page') as string) !== null) {
                    selectedPage = parseInt(JSON.parse(localStorage.getItem('page') as string));
                } else {
                    localStorage.setItem('page', JSON.stringify(1));
                }
                let page: number = Math.ceil(categoryLength.length / 6);
                let html: string = '';
                for (let i = 1; i <= page; i++) {
                    html += `
                        <a href="#" data-page="${i}" class="${i === selectedPage ? 'active' : ''}">${i}</a>
                    `;
                }
                html += `<a href="#" data-page="${JSON.parse(localStorage.getItem('page') as string) + 1}" data-style="no-active" class="">»</a>`;
                ($('.section1 .box_product .main_box_product .page') as HTMLElement).innerHTML = html;
                ($$('.section1 .box_product .main_box_product .page a') as NodeListOf<HTMLElement>).forEach((link: HTMLElement) => {
                    link.addEventListener('click', async (e: MouseEvent) => {
                        e.preventDefault();
                        let page: number = parseInt(link.getAttribute('data-page') as string);
                        let id_category: string = JSON.parse(localStorage.getItem('selectedCategory') as string);
                        const products = await productsModel.findProductsByCategoryIdAndPage(id_category, page, 6);
                        localStorage.setItem('page', JSON.stringify(page));
                        window.scroll({
                            top: 150,
                            behavior: 'smooth'
                        });
                        renderBoxProduct(products);
                        await handlePage(id_category);
                        ($$('.section1 .box_product .main_box_product .page a') as NodeListOf<HTMLElement>).forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('data-style') === 'no-active') {
                                return;
                            } else if (parseInt(link.getAttribute('data-page') as string) === page) {
                                link.classList.add('active');
                            }
                        })
                    })
                })
            } else {
                ($('.section1 .box_product .main_box_product .page') as HTMLElement).innerHTML = '';
            }
        }

        const handleId = (id: string) => {
            localStorage.setItem('id', JSON.stringify(id));
        };

        const renderBoxProduct = (products: Product[]) => {
            const container: HTMLElement | null = $('.section1 .box_product .main_box_product .main_content');
            if (products.length > 0) {
                let html = '';
                for (const product of products) {
                    html += `
                    <div class="product_box">
                        <a href="/page/detail/${product.name}" class="img link" data-id="${product._id}">
                            <img loading="lazy" class="full" src="${API.endPoint}images/uploads/${product.image}" alt="">
                        </a>
                        <h1 class="name flex link-${product._id}">
                            <a class="link" data-id="${product._id}" href="/page/detail/${product.name}">
                                ${product.name.length < 15 ? product.name : product.name.slice(0, 15) + '...'}
                            </a>
                            <span>${product.properties.map(p => p.size).join(' - ')}</span>
                        </h1>
                        <div class="price">
                            ${product.sale > 0 ? `
                                <span>Sale: ${product.sale * 100}%</span> -
                                $${(parseFloat(product.properties[0].price) * (1 - product.sale)).toFixed(2).toString()} -
                                <s>$${(parseFloat(product.properties[0].price as string).toFixed(2)).toString()}</s>
                            ` : `
                                $${(parseFloat(product.properties[0].price as string).toFixed(2)).toString()}
                            `}
                        </div>
                        <div class="tag flex">
                            <div style="background: ${product.color}" class=""></div>
                            <span>${product.designer}</span>
                        </div>
                    </div>
                `;
                }
                (container as HTMLElement).innerHTML = html;
                $$(`.link`).forEach(link => {
                    let id: string | null = link.getAttribute('data-id');
                    link.addEventListener('click', () => {
                        handleId(id as string);
                    });
                })
            } else {
                (container as HTMLElement).innerHTML = `<h1 style="text-align: center;grid-column: span 3; grid-row: span 3;width: 94.8rem; line-height: 80px">
                    The category you are selecting is not currently available
                    </h1>`
            }
        }

        this.loadViewPage('shop', async () => {
            let categoriesString = '';
            categoriesList.map((cate: Category) => {
                categoriesString += `
                    <option class="categories_link" data-id="${cate._id}">${cate.name}</option>
                `;
            })
            const select: HTMLElement | null = $('#categories_shop');
            (select as HTMLElement).innerHTML = categoriesString;
            (select as HTMLElement).addEventListener('change', async () => {
                localStorage.removeItem('page');
                const selectedOption = (select as HTMLSelectElement).options[(select as HTMLSelectElement).selectedIndex];
                let dataId: string | null | number = selectedOption.getAttribute('data-id');
                localStorage.setItem('selectedCategory', JSON.stringify(dataId));
                const products = await productsModel.findProductsByCategoryIdAndPage(dataId as string, 1, 6);
                renderBoxProduct(products);
                await handlePage(dataId as string);
                localStorage.setItem('page', JSON.stringify(1));
            })
            renderBoxProduct(productsList);
            await handlePage(categoriesList[0]._id);
            ($$('.section1 .box_product .main_box_product .top_content .icon a') as NodeListOf<HTMLElement>).forEach(link => {
                link.addEventListener('click', async (e: MouseEvent) => {
                    e.preventDefault();
                    let sort = link.getAttribute('data-sort') as string;
                    if (sort === 'up') {
                        const products = await productsModel.findProductsByCategoryIdPageAndSort(
                            JSON.parse(localStorage.getItem('selectedCategory') as string), parseInt(JSON.parse(localStorage.getItem('page') as string)),
                            6, 'up'
                        );
                        renderBoxProduct(products);
                    } else if (sort === 'down') {
                        const products = await productsModel.findProductsByCategoryIdPageAndSort(
                            JSON.parse(localStorage.getItem('selectedCategory') as string), parseInt(JSON.parse(localStorage.getItem('page') as string)),
                            6, 'down'
                        );
                        renderBoxProduct(products);
                    }
                })
            })

        })
    }

    detail: () => void = async () => {
        const id = JSON.parse(localStorage.getItem('id') as string);
        if (id === undefined || id === '') window.location.replace('/page/shop');
        this.loadCss('detail');
        const productsModel = this.loadModel('products') as ProductsModel;
        const product = await productsModel.findProductsById(id);

        const addToCart = (id: string, quantityProduct: number, priceNow: number, sizeNow: string) => {
            try {
                let cart = JSON.parse(localStorage.getItem('cart') as string) || [];
                let existingItem = cart.find((item: { _id: string }) => item._id === id);
                if (existingItem) {
                    if (existingItem.quantityProduct <= 9 && (existingItem.quantityProduct + quantityProduct < 11)) {
                        existingItem.quantityProduct += quantityProduct;
                    } else {
                        notification(`You cannot buy more than 10 pieces of the product !`, () => {
                            ($('#notification') as HTMLElement).remove();
                        })
                    }
                } else {
                    const cartItem = {
                        _id: product._id,
                        name: product.name,
                        price: priceNow,
                        image: product.image,
                        id_category: product.id_category,
                        quantity: product.quantity,
                        color: product.color,
                        quantityProduct: quantityProduct,
                        size: sizeNow
                    };
                    cart.push(cartItem);
                    (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                        <div id="addCart">
                            <div class="main">
                                <div class="heading flex">
                                    <h1>Shopping Cart</h1>
                                    <i class="fa-solid fa-xmark closeBtn"></i>
                                </div>
                                <p class="sub-heading">Buy <span class="price">$122.35</span> more and get <span class="delivery">free shipping</span></p>
                                <div class="table">
                                    <div class="row flex">
                                        <div class="img">
                                            <img src="${($('#main-img') as HTMLImageElement).src}" alt="product image">
                                        </div>
                                        <div class="content flex">
                                            <div class="name">${product.name}</div>
                                            <div class="color">Color : ${product.color}</div>
                                            <div class="price">$${priceNow.toFixed(2)}</div>
                                            <div class="quantity flex">
                                               <div class="downBtn">-</div>
                                               <p class="downBtn">${quantityProduct}</p>
                                                <div class="downBtn">+</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="checkWrap flex">
                                    <label for="check">
                                        <input type="checkbox" name="" id="check">
                                    </label>
                                    <p>For <span>$10.00</span> please wrap the product</p>
                                </div>
                                <div class="subtotal flex">
                                    <div class="">Subtotal</div>
                                    <div class="subtotal-number">$${(quantityProduct * priceNow).toFixed(2)}</div>
                                </div>
                                <a href="/page/checkout" class="checkout">Checkout</a>
                                <a href="/page/cart" class="viewCart">View Cart</a>
                            </div>
                        </div>
                    `);
                    notification('The product has been successfully added to the cart', () => {
                        ($('#notification') as HTMLElement).remove();
                    })
                }
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.log('An error occurred while adding the product to the cart:', error);
            }

            const background: HTMLElement = document.getElementById('addCart') as HTMLElement;
            background.addEventListener('click', (e) => {
                if (e.target === background) {
                    background.remove();
                }
            });
            const form: HTMLElement = background.querySelector('.main') as HTMLElement;
            form.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            const closetBtn: HTMLElement = background.querySelector('.closeBtn') as HTMLElement;
            closetBtn.addEventListener('click', () => {
                background.remove();
            });

            const cartLength: HTMLElement = document.querySelector('.container .header .icon .cartLength') as HTMLElement;
            cartLength.style.display = 'block';
            cartLength.textContent = ((JSON.parse(localStorage.getItem('cart') as string) as Array<object>)?.length).toString();
        };

        const renderDetail = async (product: Product) => {
            const mainImage: HTMLImageElement = $('.container .content .section1 .gallery .main_gallery img') as HTMLImageElement;
            ($('.container .content .section1 .information .name h1') as HTMLElement).textContent = product.name;
            ($('.container .content .section1 .information .price .price_now') as HTMLElement).textContent =
                (parseFloat(product.properties[0].price) * (1 - product.sale)).toFixed(2).toString() + '$';
            ($('.container .content .section1 .information .price .sale_price') as HTMLElement).textContent = '$' + product.properties[0].price.toString();
            ($('.container .content .section1 .information .price .percent_sale') as HTMLElement).textContent = (product.sale * 100).toString() + '%';
            ($('.content .section1 .information .count_end span') as HTMLElement).textContent = product.quantity.toString();
            let count: number;
            if (product.quantity > 150) {
                count = 15;
            } else {
                count = Math.floor(product.quantity / 10);
            }
            let countBar = '';
            for (let i = 0; i < count; i++) {
                countBar += `
                    <div class="count_bar"></div>
                `;
            }
            ($('.content .section1 .information .count_down_bar') as HTMLElement).innerHTML = countBar;
            let sizeString = '';
            const initialSize = 0;
            product.properties.forEach((p, index) => {
                sizeString += `
                    <a class="${index === initialSize ? 'active' : ''}" data-size=${p.size} data-index="${index}">${p.size}</a>
                `;
            });
            ($('.content .section1 .information .size .size_select') as HTMLElement).innerHTML = sizeString;
            const sizeLinks: NodeListOf<HTMLElement> = $$('.section1 .information .size .size_select a');
            const sizeContent = $('.section1 .information .size .heading a') as HTMLElement
            sizeContent.innerHTML = product.properties[initialSize].size.toString();
            sizeLinks.forEach((link: HTMLElement) => {
                if (link && link.getAttribute('data-size')) {
                    if (sizeContent.textContent === (link.getAttribute('data-size') as string).toUpperCase()) {
                        link.classList.add('active');
                    }
                }
                link.addEventListener('click', e => {
                    e.preventDefault();
                    sizeLinks.forEach(link => {
                        if (link.classList.toggle('active')) link.classList.remove('active');
                    });
                    (e.target as HTMLElement).classList.add('active');
                    const size = (e.target as HTMLElement).getAttribute('data-size') as string;
                    sizeContent.textContent = size.toUpperCase();
                    let index: string | number = (e.target as HTMLElement).getAttribute('data-index') as string;
                    index = parseInt(index);
                    ($('.container .content .section1 .information .price .price_now') as HTMLElement).textContent =
                        (parseFloat(product.properties[index].price) * (1 - product.sale)).toFixed(2).toString() + '$';
                    ($('.container .content .section1 .information .price .sale_price') as HTMLElement).textContent = '$' + product.properties[index].price.toString();
                });
            });
            const colorOptionsContainer = $('.section1 .information .color .color_option') as HTMLElement;
            ($('.section1 .information .color .heading a') as HTMLElement).innerHTML = product.color;
            colorOptionsContainer.innerHTML = `
                <div class="active" style="background: ${product.color}"></div>
            `;
            const boxImages = $('.container .content .section1 .gallery .gallery_bar') as HTMLDivElement;
            let imageStr = '';
            if (product.image !== '') {
                mainImage.src = `${API.endPoint}images/uploads/${product.image}`;
                imageStr += `
                 <div>
                    <img class="full" src="${API.endPoint}images/uploads/${product.image}" alt="">
                </div>
            `;
            }
            product.images?.map((image) => {
                imageStr += `
                  <div>
                    <img class="full" src="assets/images/uploads/${image}" alt="">
                  </div>
            `;
            });
            boxImages.innerHTML = imageStr;
            const images: NodeListOf<Element> = $$('.container .content .section1 .gallery .gallery_bar div img');
            images.forEach((img) => {
                img.addEventListener('click', (e) => {
                    (mainImage as HTMLElement).style.opacity = '0.5';
                    setTimeout(() => {
                        (mainImage as HTMLImageElement).src = (e.target as HTMLImageElement).src;
                        (mainImage as HTMLImageElement).style.opacity = '1';
                    }, 500);
                })
            });
            ($('.section1 .information .quantity .bottom a.btn_add') as HTMLElement).addEventListener('click', (e) => {
                e.preventDefault();
                let quantity: number = parseInt(($('.information .quantity .bottom .count_product div') as HTMLElement).textContent as string);
                let priceNow: number = parseFloat(($('.container .content .section1 .information .price .price_now') as HTMLElement).textContent as string);
                let sizeNow: string = ($('.section1 .information .size .heading a') as HTMLElement).textContent as string;
                addToCart(product._id, quantity, priceNow, sizeNow);
            })
        };

        const handleQuantity = () => {
            const countDown = $('.information .quantity .bottom .count_product .count_down') as HTMLElement;
            const countUp = $('.information .quantity .bottom .count_product .count_up') as HTMLElement;
            const number = $('.information .quantity .bottom .count_product div') as HTMLDivElement;
            countDown.addEventListener('click', (e) => {
                e.preventDefault();
                let newNumber = parseInt(number.textContent as string);
                if (newNumber > 1) newNumber -= 1;
                number.textContent = newNumber.toString();
            });
            countUp.addEventListener('click', (e) => {
                e.preventDefault();
                let newNumber = parseInt(number.textContent as string);
                if (newNumber < 10) newNumber += 1;
                number.textContent = newNumber.toString();
            })
        }

        this.loadViewPage('detail', () => {
            renderDetail(product);
            handleQuantity();
        })
    }

    about: () => void = async () => {
        this.loadTitle('About Fasco');
        this.loadCss('about');
        this.loadViewPage('about', () => {

        })
    }

    cart: () => void = async () => {
        this.loadTitle('Fashion Cart');
        this.loadCss('cart');
        let cart = JSON.parse(localStorage.getItem('cart') as string);
        if (JSON.parse(localStorage.getItem('cart') as string)?.length === 0) {
            localStorage.removeItem('cart');
        }

        const handleRemove = (index: number) => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            ($(`.cartItem-${index}`) as HTMLElement).remove();
            const cartLength = document.querySelector('.container .header .icon .cartLength') as HTMLElement;
            cartLength.classList.remove('close');
            JSON.parse(localStorage.getItem('cart') as string)?.length > 0 ? cartLength.textContent = JSON.parse(localStorage.getItem('cart') as string)?.length : cartLength.classList.add('close');
            renderCart(cart);
            handleTotal(cart);
        }

        const handleUp = (index: number) => {
            if (cart[index].quantityProduct < 10) {
                cart[index].quantityProduct += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                ($(`.main_cart .tbody .row .quantity_cart span.quantity-${index}`) as HTMLElement).textContent = parseInt(cart[index].quantityProduct).toString();
                ($(`.total-${index}`) as HTMLElement).textContent = (cart[index].quantityProduct * cart[index].price).toFixed(2).toString() + '$';
                handleTotal(cart);
            }
        };

        const handleDown = (index: number) => {
            if (cart[index].quantityProduct > 1) {
                cart[index].quantityProduct -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                ($(`.main_cart .tbody .row .quantity_cart span.quantity-${index}`) as HTMLElement).textContent = parseInt(cart[index].quantityProduct).toString();
                ($(`.total-${index}`) as HTMLElement).textContent = (cart[index].quantityProduct * cart[index].price).toFixed(2).toString() + '$';
                handleTotal(cart);
            } else if (cart[index].quantityProduct === 1) {
                confirmUserSide('Are you sure you want to remove this product ?');
                ($('#confirm .main_form button#yes') as HTMLElement).addEventListener('click', async () => {
                    ($('#confirm') as HTMLElement).remove();
                    handleRemove(index);
                });
                renderCart(cart);
            }
        }

        const handleTotal = (cart: Cart[]) => {
            let total: number = 0;
            cart.map((cartItem) => {
                total += (cartItem.quantityProduct * cartItem.price);
            });
            if (JSON.parse(localStorage.getItem('isWrap') as string) === true) {
                total += 10;
                ($('.content .section1 .checkbox input') as HTMLInputElement).checked = true;
            } else {
                ($('.content .section1 .checkbox input') as HTMLInputElement).checked = false;
            }
            ($('.content .section1 .subtotal div:last-child') as HTMLElement).textContent = total.toFixed(2).toString() + '$';
        }

        const renderCart = async (cart: Cart[]) => {
            if (cart?.length >= 1) {
                const table = $('.content .section1 .main_cart .tbody') as HTMLElement;
                let html = '';
                let i = 0;
                for (const item of cart) {
                    html += `
                     <div class="row cartItem-${i}">
                        <div class="product flex">
                          <img loading="lazy" src="${API.endPoint}images/uploads/${item.image}" alt="">
                          <div class="flex">
                            <div class="name">${item.name.length > 17 ? `${item.name.slice(0, 17)}...` : item.name}</div>
                            <div class="color">Color: ${item.color} ${item.size === 'No Size' ? '' : ` - Size:  ${item.size}`}</div>
                            <div class="quantity">quantity in stock: ${item.quantity}</div>
                            <a href="#" class="removeBtn" data-index="${i}">Remove</a>
                          </div>
                        </div>
                        <div class="price">$${item.price}</div>
                        <div class="quantity_cart flex">
                          <a href="/page/cart/#" class="downBtn" data-index="${i}">-</a>
                          <span class="quantity-${i}">${item.quantityProduct}</span>
                          <a href="/page/cart/#" class="upBtn" data-index="${i}">+</a>
                        </div>
                        <div class="total total-${i}">
                          ${(item.quantityProduct * item.price).toFixed(2).toString()}$
                        </div>
                     </div>
                `;
                    i += 1;
                }
                table.innerHTML = html;
                handleTotal(cart);
                const upButtons: NodeListOf<HTMLElement> = $$('.upBtn');
                upButtons.forEach((btn) => {
                    const index = btn.getAttribute('data-index') as string;
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleUp(parseInt(index));
                    });
                });

                const downButtons = $$('.downBtn');
                downButtons.forEach((btn) => {
                    const index = btn.getAttribute('data-index') as string;
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleDown(parseInt(index));
                    });
                });

                const removeButtons = $$('.removeBtn');
                removeButtons.forEach((btn) => {
                    const index = btn.getAttribute('data-index') as string;
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        confirmUserSide('Are you sure you want to remove this product ?');
                        ($('#confirm .main_form button#yes') as HTMLElement).addEventListener('click', async () => {
                            ($('#confirm') as HTMLElement).remove();
                            handleRemove(parseInt(index));
                        });
                        renderCart(cart);
                    })
                })

                const input = $('.content .section1 .checkbox input') as HTMLInputElement;
                input.addEventListener('click', () => {
                    if (JSON.parse(localStorage.getItem('isWrap') as string) === true) {
                        localStorage.removeItem('isWrap');
                        handleTotal(cart);
                    } else {
                        localStorage.setItem('isWrap', JSON.stringify(true));
                        handleTotal(cart);
                    }
                })

            }
        };
        this.loadViewPage('cart', () => {
            renderCart(cart);
        })
    }

    checkout: () => void = async () => {
        this.loadTitle('Checkout Fasco');
        this.loadCss('checkout');
        let cart: Cart[];
        if (JSON.parse(localStorage.getItem('cart') as string)?.length > 0) {
            cart = JSON.parse(localStorage.getItem('cart') as string);
        } else {
            notification('your cart is empty', () => {
                window.location.href = '/page/shop'
            });
            window.location.href = '/page/shop'
        }
        const vouchersModel = this.loadModel('vouchers') as vouchersModel;
        const deliveriesModel = this.loadModel('deliveries') as deliveriesModel;
        const ordersModel = this.loadModel('orders') as ordersModel;
        const orderDetailsModel = this.loadModel('orderDetails') as orderDetailsModel;
        const deliveriesList = await deliveriesModel.findAllDeliveries();

        const handleTotal = (carts: Cart[]) => {
            let total: number = 0;
            for (const item of carts) {
                total += parseFloat((item.quantityProduct * item.price).toFixed(2));
            }
            const idDelivery = JSON.parse(localStorage.getItem('idDelivery') as string);
            const deliveryFee = $(`.delivery-${idDelivery}`) as HTMLElement;
            let fee: number = 0;
            if (deliveryFee) {
                fee = parseFloat((deliveryFee.querySelector('span') as HTMLElement).textContent as string);
            }
            const idVoucher = JSON.parse(localStorage.getItem('idVoucher') as string);
            const voucherDiscount = $(`.voucher-${idVoucher}`) as HTMLElement;
            let discount: number = 0;
            if (voucherDiscount) {
                discount = parseFloat((voucherDiscount.querySelector('span') as HTMLElement).textContent as string);
            }
            if (JSON.parse(localStorage.getItem('isWrap') as string)) {
                (document.getElementById('subTotal') as HTMLElement).textContent = '$' + ((total + 10) * (1 - (discount / 100))).toFixed(2);
                (document.getElementById('total') as HTMLElement).textContent = '$' + (((total + 10) * (1 - (discount / 100))) + fee).toFixed(2).toString();
                (document.getElementById('total') as HTMLElement).setAttribute('total', (((total + 10) * (1 - (discount / 100))) + fee).toFixed(2).toString());
            } else {
                (document.getElementById('subTotal') as HTMLElement).textContent = '$' + (total * (1 - (discount / 100))).toFixed(2);
                (document.getElementById('total') as HTMLElement).textContent = '$' + ((total * (1 - (discount / 100))) + fee).toFixed(2).toString();
                (document.getElementById('total') as HTMLElement).setAttribute('total', ((total * (1 - (discount / 100))) + fee).toFixed(2).toString());
            }
        }

        const renderDelivery = (deliveriesList: Delivery[], km: number) => {
            let idDelivery = JSON.parse(localStorage.getItem('idDelivery') as string);
            let deliveryOptions: string = '';
            deliveriesList.map(delivery => {
                deliveryOptions += `
                <div data-id="${delivery._id}" class="delivery-${delivery._id} ${idDelivery === delivery._id ? 'active' : ''}" >
${delivery.name} - ${delivery.speed} : ${delivery.price}$ x ${km}km = <span>${(delivery.price * km).toFixed(2)}</span>$</div>
            `;
            });
            const deliveryPlace = $('#shipping #shippingOption') as HTMLElement;
            deliveryPlace.setAttribute('data-distance', km.toString());
            deliveryPlace.innerHTML = deliveryOptions;
            ($$('.section1 .main-checkout .right .total #shipping #shippingOption div') as NodeListOf<HTMLElement>).forEach(option => {
                option.addEventListener('click', () => {
                    const id = option.getAttribute('data-id') as string;
                    localStorage.setItem('idDelivery', JSON.stringify(id));
                    ($$('.section1 .main-checkout .right .total #shipping #shippingOption div') as NodeListOf<HTMLElement>).forEach(option => {
                        option.classList.remove('active');
                    })
                    option.classList.add('active');
                    handleTotal(cart);
                })
            })
        }

        const handleFindAndRenderVouchers = async (total: number): Promise<void> => {
            const result: Voucher[] = await vouchersModel.getVoucherByMinAmount(total);
            const placeVoucher = $('.section1 .main-checkout .right .rdiscountCode #voucherPlace') as HTMLElement;
            let html: string = '';
            if (result.length > 0) {
                result.map(voucher => {
                    html += `
                        <div class="voucher voucher-${voucher._id} ${voucher._id === JSON.parse(localStorage.getItem('idVoucher') as string) ? 'active' : ''}" 
                        data-id="${voucher._id}" data-discount="${voucher.discount}">Code : ${voucher.code} - Discount: <span>${voucher.discount}</span>% </div>
                    `;
                })
                placeVoucher.innerHTML = html;
                if (JSON.parse(localStorage.getItem('idVoucher') as string)) {
                    handleTotal(cart);
                }
                ($$('.section1 .main-checkout .right .rdiscountCode #voucherPlace div.voucher') as NodeListOf<HTMLElement>).forEach(voucher => {
                    voucher.addEventListener('click', () => {
                        if (!voucher.classList.toggle('active')) {
                            voucher.classList.remove('active');
                            (document.getElementById('subTotal') as HTMLElement).textContent = '$' + total.toFixed(2);
                            localStorage.removeItem('idVoucher');
                            handleTotal(cart);
                        } else {
                            const id = voucher.getAttribute('data-id') as string;
                            const discount = voucher.getAttribute('data-discount') as string;
                            localStorage.setItem('idVoucher', JSON.stringify(id));
                            ($$('.section1 .main-checkout .right .rdiscountCode #voucherPlace div.voucher') as NodeListOf<HTMLElement>).forEach(voucher => {
                                voucher.classList.remove('active');
                            })
                            voucher.classList.add('active');
                            (document.getElementById('subTotal') as HTMLElement).textContent = '$' + (total * (1 - (parseFloat(discount) / 100))).toFixed(2);
                            handleTotal(cart);
                        }

                    })
                })
            } else {
                html = `
                    <div>Your order is not eligible to apply our voucher</div>
                    <span>Our minimum voucher is $100 and you still have $${(100 - total).toFixed(2)} to use</span>
                `;
                placeVoucher.innerHTML = html;
            }

        }

        const renderCheckout = (carts: Cart[]): void => {
            const container: HTMLElement = $('.content .section1 .main-checkout .right .cart_preview') as HTMLElement;
            let html = '';
            let total = 0;
            if (carts.length > 0) {
                for (const item of carts) {
                    total += (item.quantityProduct * item.price);
                    html += `
                        <div class="cart_item flex">
                            <div class="img">
                                <img loading="lazy" src="${API.endPoint}images/uploads/${item.image}" alt="">
                            </div>
                            <div class="content_cart flex">
                                <h1 class="name">${item.name}</h1>
                                <div class="color">color: ${item.color}</div>
                                <div class="quantity">quantity: ${item.quantityProduct}</div>
                            </div>
                            <div class="subTotal">
                                $${(item.quantityProduct * item.price).toFixed(2)}
                            </div>
                        </div>
                    `;
                }
            }
            container.innerHTML = html;
            if (JSON.parse(localStorage.getItem('isWrap') as string)) {
                (document.getElementById('subTotal') as HTMLElement).textContent = '$' + (total + 10).toFixed(2).toString();
                handleFindAndRenderVouchers((parseFloat(total.toFixed(2)) + 10))
            } else {
                (document.getElementById('subTotal') as HTMLElement).textContent = '$' + total.toFixed(2).toString();
                handleFindAndRenderVouchers(parseFloat(total.toFixed(2)));
            }
        };
        this.loadViewPage('checkout', async () => {
            renderCheckout(cart);
            handleTotal(cart);
            setInterval(() => {
                const now = new Date();
                const options = {timeZone: 'America/New_York'};
                (document.getElementById('checkoutOrder') as HTMLInputElement).value = now.toLocaleString('en-US', options);
            }, 1000)

            const btnCheckout = $('.section1 .main-checkout .right .pay') as HTMLElement;
            if (!(JSON.parse(localStorage.getItem('user') as string))) {
                btnCheckout.classList.add('disabled');
                let notificationDisplayed = false;
                btnCheckout.addEventListener('click', (e) => {
                    e.preventDefault();
                    notification('You must be logged in to pay the order', () => {
                        window.location.href = '/account/sign_in';
                    });
                    notificationDisplayed = true;
                });
                setTimeout(() => {
                    if (!notificationDisplayed) {
                        notification('You must be logged in to pay the order!', () => {
                            window.location.href = '/account/sign_in';
                        });
                    }
                }, 3000);
            } else if (JSON.parse(localStorage.getItem('user') as string).role === '1') {
                btnCheckout.classList.add('disabled');
                btnCheckout.addEventListener('click', (e) => {
                    e.preventDefault();
                    notification('Admin cannot make payments !', () => {
                        window.location.href = '/';
                    })
                })
                setTimeout(() => {
                    notification('Admin cannot make payments !', () => {
                        window.location.href = '/';
                    })
                }, 3000);
            } else {
                btnCheckout.classList.remove('disabled');
                const form = $('.content .section1 .main-checkout') as HTMLFormElement;
                const email = form.querySelector('#emailCheckout') as HTMLInputElement;
                const checkoutName = form.querySelector('#checkoutName') as HTMLInputElement;
                const checkoutAddress = form.querySelector('#checkoutAddress') as HTMLInputElement;
                const checkoutPhone = form.querySelector('#checkoutPhone') as HTMLInputElement;
                const saveInfor = form.querySelector('#saveInfor') as HTMLInputElement;
                const user: User = JSON.parse(localStorage.getItem('user') as string);
                email.value = user.email;
                checkoutName.value = user.name;
                checkoutAddress.value = user.address;
                checkoutPhone.value = user.phone;
                checkoutAddress.onchange = async () => {
                    const distanceFormShop = await calculateDistance(checkoutAddress.value);
                    renderDelivery(deliveriesList, distanceFormShop as number);
                    handleTotal(cart);
                }
                const distanceFormShop = await calculateDistance(checkoutAddress.value);
                renderDelivery(deliveriesList, distanceFormShop as number);

                form.addEventListener('submit', async (e: SubmitEvent) => {
                    e.preventDefault();
                    if (saveInfor.checked) {
                        console.log('I will call api to save user information');
                        const usersModel = new UsersModel(API.endPoint);
                        await usersModel.editUserById(user._id, {
                            email: email.value,
                            name: checkoutName.value,
                            address: checkoutAddress.value,
                            phone: checkoutPhone.value
                        });
                    }
                    const order: Order = {
                        _id: '',
                        id_delivery: JSON.parse(localStorage.getItem('idDelivery') as string) || '',
                        id_user: user._id,
                        id_voucher: JSON.parse(localStorage.getItem('idVoucher') as string) || '',
                        name: checkoutName.value,
                        address: checkoutAddress.value,
                        email: email.value,
                        phone: checkoutPhone.value,
                        wrap: JSON.parse(localStorage.getItem('isWrap') as string) || false,
                        order_date: (document.getElementById('checkoutOrder') as HTMLInputElement).value,
                        order_status: 0,
                        distance: parseFloat(($('#shipping #shippingOption') as HTMLElement).getAttribute('data-distance') as string),
                        total: parseFloat((document.getElementById('total') as HTMLElement).getAttribute('total') as string),
                        ship_fee: parseFloat((($(`.delivery-${JSON.parse(localStorage.getItem('idDelivery') as string)}`) as HTMLElement).querySelector('span') as HTMLElement).textContent as string)
                    }
                    console.log(order);
                    const orderResult = await ordersModel.createOrder(order);
                    console.log(orderResult)
                    for (const item of cart) {
                        let order_detail: Order_Detail = {
                            _id: '',
                            id_order: orderResult._id,
                            id_product: item._id,
                            quantity: item.quantityProduct,
                            price: item.price
                        }
                        await orderDetailsModel.createOrderDetail(order_detail);
                    }
                    notification('Your order has been created successfully', () => {
                        ($('#notification') as HTMLElement).remove();
                    })
                    localStorage.removeItem('cart');
                })

            }

        });
    }

    contact: () => void = async () => {
        this.loadTitle('Contact Fasco');
    }

    history: () => void = async () => {
        this.loadTitle('History Order');
        this.loadCss('history');
        let id: string = '0';
        if (JSON.parse(localStorage.getItem('user') as string)) {
            id = JSON.parse(localStorage.getItem('user') as string)._id;
        } else {
            notification('you must be logged in to view your history order', () => {
                window.location.href = 'account/sign_in';
            })
        }
        const productsModel = this.loadModel('products') as ProductsModel;
        const orderDetailsModel = this.loadModel('orderDetails') as orderDetailsModel;
        const ordersModel = this.loadModel('orders') as ordersModel;
        const orderList = await ordersModel.findOrdersByIdUser(id);

        const renderHistory = async (histories: Order[]) => {
            const container = $('.content .section1 .main_cart .tbody') as HTMLElement;
            let html = '';
            for (let history of histories) {
                const orderDetails = await orderDetailsModel.findOrderDetailsByIdOrder(history._id);
                let productInformation = '';
                for(let orderDetail of orderDetails) {
                    let productName = await productsModel.findProductsById(orderDetail.id_product);
                    productInformation += `
                        <div>Name : ${productName.name}</div>
                    `;
                }
                html += `
                    <div class="row">
                        <div class="id">${history._id}</div>
                        <div>
                            <div>Name : ${history.name}</div>
                            <div>Address : ${history.address}</div>
                            <div>Email : ${history.email}</div>
                            <div>Phone number : ${history.phone}</div>
                            <div>Order date : ${history.order_date}</div>
                        </div>
                        <div>${order_status[history.order_status]}</div>
                        <div>${history.total}$</div>
                        <div class="action flex">
                            <div>Cancel</div> / <div>Detail</div>
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;

            if(histories.length <= 0) {
                container.innerHTML = `
                    <div style="text-align: center; font-weight: bold"> You have not purchased any orders yet </div>
                `
            }
        }

        this.loadViewPage('history', async () => {
            await renderHistory(orderList);
        })
    }
}

export default pageController;
