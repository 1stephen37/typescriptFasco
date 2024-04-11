import axios from "axios";
import UsersModel from './usersModel.ts';
import {API} from "../constants/main.ts";

const usersModel = new UsersModel(API.endPoint);

export default class vouchersModel {
    endPoint: string;
    collectionName: string;
    url: string;

    constructor(endPoint: string) {
        this.collectionName = "vouchers";
        this.endPoint = endPoint;
        this.url = this.endPoint + this.collectionName;
    }

    async createVoucher(code: string, discount: number, min_amount: number, date_end: string, expired: boolean): Promise<Voucher> {
        const voucher: Voucher = {
            _id: '',
            code,
            discount,
            min_amount,
            date_end,
            expired
        }
        const res = await axios.post(this.url, voucher, {
            headers: {
                authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
            }
        });
        return res.data;
    }

    async getAllVouchersByPage(page: number, quantity: number) {
        const start = (page - 1) * quantity;
        const res = await axios.get(this.url + `?_start=${start}&_end=${quantity}`);
        return res.data;
    }

    async removeVoucherById(id: string) {
        try {
            const res = await axios.delete(this.url + '/' + id, {
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

    async editVoucherById(id: string, code: string, discount: number, min_amount: number, date_end: string, expired: boolean): Promise<Voucher> {
        const voucher: Voucher = {
            _id: id,
            code,
            discount,
            min_amount,
            date_end,
            expired
        }
        const res = await axios.put(this.url + '/' + id, voucher);
        return res.data;
    }

    async getVoucherByMinAmount(total: number): Promise<Voucher[]> {
        const res = await axios.get(this.url + `?total=${total}`);
        return res.data;
    }

}