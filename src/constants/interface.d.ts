interface Category {
    _id: string;
    name: string;
    status: number;
}

interface Product {
    _id: string;
    id_category: string;
    name: string;
    image: string;
    designer: string;
    review: number;
    quantity: number;
    sale: number;
    color: string;
    properties:  {
        size: string;
        price: string
    }[];
    images: [];
    status: number
}

interface User {
    _id: string;
    name: string;
    password: string;
    email: string;
    address: string;
    phone: string;
    image: string;
    role: string;
    token: string;
    reset: string
}

interface Cart {
    _id: string;
    name: string;
    color: string;
    image: string;
    price: number;
    quantity: number;
    quantityProduct: number;
    size: string;
}

interface Voucher {
    _id: string;
    code: string;
    discount: number;
    min_amount: number;
    date_end: string;
    expired: boolean;
}

interface Delivery {
    _id: string;
    name: string;
    speed: string;
    price: number;
    status: number
}

interface Order {
    _id: string;
    id_delivery: string;
    id_user: string;
    id_voucher: string;
    email: string;
    phone: string;
    name: string;
    address: string;
    order_date: string;
    wrap: boolean;
    order_status: number;
    total: number;
    ship_fee: number;
    distance: number
}

interface Order_Detail {
    _id: string;
    id_product: string;
    id_order: string;
    price: number;
    quantity: number;
}