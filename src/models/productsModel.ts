import axios from "axios";

export default class ProductsModel {
    endPoint : string;
    collectionName: string;
    url : string;

    constructor(endPoint : string) {
        this.collectionName = "products";
        this.endPoint = endPoint;
        this.url = this.endPoint + this.collectionName;
    }

    findAllProducts = async () => {
        let res = await axios.get(this.url);
        return res.data;
    }

    findProductsById = async (id : number | string) : Promise<Product> => {
        const response = await axios.get(this.url + `/${id}`);
        return response.data;
    }

    findProductsQuantityPage = async (page: number, quantity:  number) => {
        let newPage = (page - 1) * quantity;
        const response = await axios.get(this.url + `?_start=${newPage}&_end=${quantity}`);
        return response.data;
    }

    findProductsByIdCategories = async (id : string) => {
        const response = await axios.get(this.url + `?id_category=${id}`);
        return response.data;
    }

    findProductsByCategoryIdAndPage = async (id : string, page : number, quantity : number) => {
        let newPage = (page - 1) * quantity;
        const url = this.url + `?id_category=${id}&_start=${newPage}&_end=${quantity}` as string;
        const response = await axios.get(url);
        return response.data;
    }

    findProductsByCategoryIdPageAndSort = async (id: string, page: number, quantity: number, sort: string) => {
        let newPage = (page - 1) * quantity;
        const url = this.url + `?id_category=${id}&_start=${newPage}&_end=${quantity}&sort=${sort}` as string;
        const response = await axios.get(url);
        return response.data;
    }

    getQuantityProductByIdCategories = async (id : string) => {
        const response = await axios.get(this.url + `?id_category=${id}`);
        let data = response.data;
        return data.length;
    }

}
