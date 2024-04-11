import axios from "axios";
import UsersModel from "./usersModel.ts";
import {API} from "../constants/main.ts";

const usersModel = new UsersModel(API.endPoint);

export default class ordersModel {
    collectionName: string;
    endPoint: string;
    url: string;

    constructor(endPoint: string) {
        this.collectionName = "orders";
        this.endPoint = endPoint;
        this.url = this.endPoint + this.collectionName;
    }

    async findAllOrders() {
        try {
            const res = await axios.get(this.url, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            })
            return res.data;
        } catch (e) {
            return e;
        }
    }

    async createOrder(data: object): Promise<Order | any> {
        try {
            console.log(JSON.parse(localStorage.getItem('user') as string).accessToken);
            const res = await axios.post(this.url, data, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
            return res.data;
        } catch (err) {
            await usersModel.auth();
            return err;
        }
    }

    async findOrdersByIdUser(id: string): Promise<Order | any> {
        try {
            const res = await axios.get(this.url + `?id-user="${id}"`, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
            return res.data;
        } catch (err) {
            await usersModel.auth();
            return err;
        }
    }

}
