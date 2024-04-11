import axios from "axios";

export default class categoriesModel {
    collectionName: string;
    endPoint: string;
    url: string;

    constructor(endPoint : string) {
        this.collectionName = "categories";
        this.endPoint = endPoint;
        this.url = this.endPoint + this.collectionName;
    }

    findAllCategories = async () => {
        const res = await axios.get(this.url);
        return res.data;
    }

    findLimitCategories = async (limit : number | string) => {
        const res = await axios.get(this.url + `?_limit=${limit}`);
        return res.data;
    }
}
