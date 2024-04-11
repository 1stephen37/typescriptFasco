import axios from "axios";
import UsersModel from "./usersModel.ts";
import {API} from "../constants/main.ts";

const usersModel = new UsersModel(API.endPoint);

export default class orderDetailsModel {
    collectionName: string;
    endPoint: string;
    url: string;

    constructor(endPoint: string) {
        this.collectionName = "order_details";
        this.endPoint = endPoint;
        this.url = this.endPoint + this.collectionName;
    }

    async createOrderDetail(data: object): Promise<Order_Detail | any> {
        try {
            const res = await axios.post(this.url, data, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
            return res.data;
        } catch (e) {
            await usersModel.auth();
            return e;
        }
    }

    async findOrderDetailsByIdOrder(id_order: string) : Promise<Order_Detail[] | any> {
        try {
            const res = await axios.get(this.url + `?id_order=${id_order}`, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
            return res.data;
        } catch (e) {
            await usersModel.auth();
            return e;
        }
    }

}
