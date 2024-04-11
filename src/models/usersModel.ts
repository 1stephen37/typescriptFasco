import axios from "axios";
import notification from "../form/notification.ts";
import {$} from "../constants/main.ts";

export default class usersModel {
    endPoint: string;
    collectionName: string;
    url: string;

    constructor(endPoint: string) {
        this.collectionName = "users";
        this.endPoint = endPoint;
        this.url = this.endPoint + this.collectionName;
    }

    async findAllUsers() {
        let res = await axios.get(this.url);
        return res.data;
    }

    async checkEmailOnSystem(email: string) {
        let res = await axios.get(this.url + `?email=${email}`);
        return res.data;
    }

    async resetPassword(_id: string, role: string, email: string) {
        try {
            let res = await axios.post(this.url + `/reset-password`, {
                _id, role, email
            });
            return res.data;
        } catch (e) {
            return e;
        }
    }

    async updatePassword(token: string, password: string) {
        try {
            let res = await axios.post(this.url + '/update-password', {password}, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            return res.data;
        } catch (e) {
            return e;
        }
    }

    async findUserById(_id: string) {
        try {
            let res = await axios.get(this.url + `/${_id}`, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
            return res.data;
        } catch (err) {
            await this.auth();
            notification(`There was a small error, please try again`, () => {
                ($('#notification') as HTMLElement).remove();
            })
        }
    }

    async signIn(email: string, password: string) {
        try {
            const res = await axios.post(this.url + '/signIn', {email: email, password: password});
            return res.data;
        } catch (e) {
            return e;
        }
    }

    create = async (name: string, email: string, password: string, image: string,
                    address: string, phone: string, role: string) => {
        console.log(12);
        const user: User = {
            _id: '',
            name,
            email,
            password,
            image,
            address,
            phone,
            role,
            token: '',
            reset: '',
        };
        try {
            const res = await axios.post(this.url, user, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
            return res.data;
        } catch (e) {
            let newToken = await this.auth();
            let user = JSON.parse(localStorage.getItem('user') as string);
            user.accessToken = newToken;
            localStorage.setItem('user', JSON.stringify(user));
            return e;
        }
    }

    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('files', file);
        const res = await axios.post(this.url + '/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    }

    async removeAvatarByFileName(filename: string) {
        try {
            console.log(JSON.parse(localStorage.getItem('user') as string).accessToken);
            const res = await axios.delete(this.url + `/avatar/${filename}`, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
            return res.data;
        } catch (err) {
            await this.auth();
        }
    }

    async editUserById(id: string, data: {}) {
        try {
            const res = await axios.put(this.url + `/${id}`, data, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            })
            return res.data;
        } catch (err) {
            await this.auth();
            return err;
        }
    }

    async signUp(name: string, address: string, email: string, phone: string, password: string) {
        const res = await axios.post(this.url + '/signUp', {name, address, email, phone, password});
        console.log(res);
        return res.data;
    }

    removeUserByID = async (id: string) => {
        try {
            await axios.delete(this.url + '/' + id, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).accessToken}`
                }
            });
        } catch (err) {
            await this.auth();
            return err;
        }
    }

    async auth() {
        try {
            const res = await axios.post(this.url + '/refresh-token', {
                _id: `${JSON.parse(localStorage.getItem('user') as string)._id}`
            }, {
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('user') as string).refreshToken}`
                }
            });
            let user = JSON.parse(localStorage.getItem('user') as string);
            user.accessToken = res.data;
            localStorage.setItem('user', JSON.stringify(user));
        } catch (err) {
            notification('Login session has expired', () => {
                window.location.href = '/account/sign_in';
            })
            localStorage.removeItem('user');
            setTimeout(() => {
                if (3)
                    window.location.href = '/account/sign_in';
            }, 5000)
        }
    }

}
