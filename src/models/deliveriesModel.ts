import axios from "axios";

export default class deliveriesModel {
    collectionName: string;
    endPoint: string;
    url: string;

    constructor(endPoint: string) {
        this.collectionName = "deliveries";
        this.endPoint = endPoint;
        this.url = this.endPoint + this.collectionName;
    }

    async findAllDeliveries(): Promise<Delivery[]> {
        const res = await axios.get(this.url);
        return res.data;
    }

    async findDeliveriesByPage(page: number, quantity: number): Promise<Delivery[]> {
        let newPage = (page - 1) * quantity;
        const res = await axios.get(this.url + `?_start=${newPage}&_end=${quantity}`);
        return res.data;
    }

    async create(data: Delivery) {
        const res = await axios.post(this.url, data);
        return res.data;
    }

    async updateById(id: string, data: Delivery) {
        const res = await axios.post(this.url + `/${id}`, data);
        return res.data;
    }

    async removeByID(id: string) {
        const res = await axios.delete(this.url + `/${id}`);
        return res.data;
    }

}
