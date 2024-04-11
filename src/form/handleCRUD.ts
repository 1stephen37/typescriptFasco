import UsersModel from "../models/usersModel.ts";
import {$, API, checkNumber, checkString, emailRegex, usernameRegex} from "../constants/main.ts";
import VoucherModel from "../models/vouchersModel.ts";
import DeliveriesModel from "../models/deliveriesModel.ts";
import confirm from "./confirm.ts";
import {errorInputAdmin, normalInputAdmin} from "../helpers/errorInput.ts";
import {validateAddress} from "../helpers/OpenStreetMapApi.ts";
import notification from "./notification.ts";
import OrderDetailsModel from "../models/orderDetailsModel.ts";
import ProductsModel from "../models/productsModel.ts";

const usersModel: UsersModel = new UsersModel(API.endPoint);
const deliveriesModel: DeliveriesModel = new DeliveriesModel(API.endPoint);
const orderDetailsModel: OrderDetailsModel = new OrderDetailsModel(API.endPoint);
const productsModel: ProductsModel = new ProductsModel(API.endPoint);

const getImageUrl = async (file: any) => {
    return new Promise<string>((resolve, reject) => {
        const reader: FileReader = new FileReader();
        reader.onload = function (event) {
            if (event.target) {
                const imageUrl = event.target.result as string;
                resolve(imageUrl);
            } else {
                reject(new Error("Event target is null."));
            }
        };
        reader.onerror = function (event) {
            reject(event.target?.error);
        };
        reader.readAsDataURL(file);
    });
};

export const handlePreview = async (): Promise<void> => {
    const form = document.getElementById('formAdd') as HTMLFormElement;
    const addImageUsers = form.querySelector('#addImageUsers') as HTMLInputElement;
    (form.querySelector('img') as HTMLImageElement).style.display = 'none';
    addImageUsers.addEventListener('change', async (e) => {
        (form.querySelector('img') as HTMLImageElement).style.display = 'block';
        const fileInput = e.target as HTMLInputElement;
        const selectedFile = fileInput.files?.[0] as File | undefined;
        if (selectedFile) {
            (form.querySelector('img') as HTMLImageElement).src = await getImageUrl(selectedFile);
        }
    })
}

export const handleAddUser = async (): Promise<void> => {
    const form = document.getElementById('formAdd') as HTMLFormElement;
    const addNameUsers = form.querySelector('#addNameUsers') as HTMLInputElement;
    const addEmailUsers = form.querySelector('#addEmailUsers') as HTMLInputElement;
    const addPasswordUsers = form.querySelector('#addPasswordUsers') as HTMLInputElement;
    const addAddressUsers = form.querySelector('#addAddressUsers') as HTMLInputElement;
    const addPhoneUsers = form.querySelector('#addPhoneUsers') as HTMLInputElement;
    const addImageUsers = form.querySelector('#addImageUsers') as HTMLInputElement;
    const addRoleUsers = form.querySelector('#addRoleUsers') as HTMLSelectElement;
    let imageURL: string = '';

    const validation = async () => {
        const errors = [];

        if (addNameUsers.value.length <= 0) {
            errorInputAdmin(addNameUsers);
            (addNameUsers.nextElementSibling as HTMLElement).textContent = 'username can\'t be null';
            errors.push(1);
        } else if (!usernameRegex.test(addNameUsers.value)) {
            errorInputAdmin(addNameUsers);
            (addNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be a string of characters';
            errors.push(1);
        } else if (addNameUsers.value.length < 7) {
            errorInputAdmin(addNameUsers);
            (addNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be at least 6 characters long';
            errors.push(1);
        } else {
            normalInputAdmin(addNameUsers);
            (addNameUsers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (addEmailUsers.value.length <= 0) {
            errorInputAdmin(addEmailUsers);
            errors.push(1);
            (addEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address can\'t be null';
        } else if (!emailRegex.test(addEmailUsers.value)) {
            errorInputAdmin(addEmailUsers);
            (addEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address must be in correct format';
            errors.push(1);
        } else {
            normalInputAdmin(addEmailUsers);
            (addEmailUsers.nextElementSibling as HTMLElement).textContent = '';
        }
        if (addPasswordUsers.value.length <= 0) {
            errorInputAdmin(addPasswordUsers);
            (addPasswordUsers.nextElementSibling as HTMLElement).textContent = 'password can\'t be null';
            errors.push(1);
        } else if (addPasswordUsers.value.length < 10) {
            errorInputAdmin(addPasswordUsers);
            (addPasswordUsers.nextElementSibling as HTMLElement).textContent = 'password must be at least 10 characters long';
            errors.push(1);
        } else {
            normalInputAdmin(addPasswordUsers);
            (addPasswordUsers.nextElementSibling as HTMLElement).textContent = '';
        }
        if (addAddressUsers.value.length <= 0) {
            errorInputAdmin(addAddressUsers);
            (addAddressUsers.nextElementSibling as HTMLElement).textContent = 'address can\'t be null';
            errors.push(1);
        } else if (addAddressUsers.value.length < 7) {
            errorInputAdmin(addAddressUsers);
            (addAddressUsers.nextElementSibling as HTMLElement).textContent = 'address must be at least 6 characters long';
            errors.push(1);
        } else if (!(await validateAddress(addAddressUsers.value))) {
            errorInputAdmin(addAddressUsers);
            (addAddressUsers.nextElementSibling as HTMLElement).textContent = 'address is invalid';
            errors.push(1);
        } else {
            normalInputAdmin(addAddressUsers);
            (addAddressUsers.nextElementSibling as HTMLElement).textContent = '';
        }
        if (addPhoneUsers.value.length <= 0) {
            errorInputAdmin(addPhoneUsers);
            (addPhoneUsers.nextElementSibling as HTMLElement).textContent = 'phone number can\'t be null';
            errors.push(1);
        } else if (addPhoneUsers.value.length < 10 || addPhoneUsers.value.length > 10) {
            errorInputAdmin(addPhoneUsers);
            (addPhoneUsers.nextElementSibling as HTMLElement).textContent = 'The phone number must have 10 digits';
            errors.push(1);
        } else {
            normalInputAdmin(addPhoneUsers);
            (addPhoneUsers.nextElementSibling as HTMLElement).textContent = '';
        }
        return errors.length === 0
    }

    if (await validation()) {
        let newUser;
        if (addImageUsers.files && addImageUsers.files.length > 0) {
            imageURL = await getImageUrl(addImageUsers.files[0]) as string;
            let newImage = await usersModel.uploadAvatar(addImageUsers.files[0]);
            newUser = await usersModel.create(addNameUsers.value, addEmailUsers.value, addPasswordUsers.value, newImage.filename,
                addAddressUsers.value, addPhoneUsers.value, addRoleUsers.value);
        } else {
            newUser = await usersModel.create(addNameUsers.value, addEmailUsers.value, addPasswordUsers.value, '',
                addAddressUsers.value, addPhoneUsers.value, addRoleUsers.value);
        }
        const role: Record<number, string> = {
            0: 'user',
            1: 'admin',
        };
        if (newUser && newUser._id) {
            notification('User successfully added', () => {
                ($('#notification') as HTMLElement).remove();
            })
            const blockContainer = $('#container .content .table .tbody') as HTMLElement;
            blockContainer.innerHTML += `
           <div id="row-user-${newUser._id}" class="row">
            <div>${newUser._id}</div>
            <div class="name-user-${newUser._id}">${addNameUsers.value}</div>
            <a class="img"><img class="img-user-${newUser._id}" data-img="${addImageUsers.files && addImageUsers.files.length > 0 ? addImageUsers.files[0].name : 'icon.png'}" src="${imageURL || 'images/logo/icon.png'}" alt="" /></a>
            <div class="email-user-${newUser._id}">${addEmailUsers.value}</div>
            <div class="address-user-${newUser._id}">${addAddressUsers.value}</div>
            <div class="phone-user-${newUser._id}">${addPhoneUsers.value}</div>
            <div class="role-user-${newUser._id}">${role[parseInt(addRoleUsers.value)]}</div>
            <div><a data-id-user="${newUser._id}" class="edit-user" href="admin/users">Edit</a> /
            <a data-id-user="${newUser._id}" class="remove-user" href="#">Remove</a></div>
           </div>
        `;
        }
        if (form && form.parentElement) form.parentElement.remove();
    } else {
        console.log('check is false');
    }

}

export const handleRemoveUser = async (id: string) => {
    await usersModel.removeUserByID(id);
    const row = $(`#row-user-${id}`) as HTMLElement;
    const image = (row.querySelector(`.img-user-${id}`) as HTMLElement).getAttribute('data-img');
    if (image) await usersModel.removeAvatarByFileName(image);
    row.remove();
    notification('remove user successfully', () => {
        ($('#notification') as HTMLElement).remove();
    })
}

export const handleEditUser = async (id: string) => {
    const role: Record<number, string> = {
        0: 'user',
        1: 'admin'
    }
    const form = document.getElementById('formEditUser') as HTMLFormElement;
    const editNameUsers = form.querySelector('#editNameUsers') as HTMLInputElement;
    const editEmailUsers = form.querySelector('#editEmailUsers') as HTMLInputElement;
    const editAddressUsers = form.querySelector('#editAddressUsers') as HTMLInputElement;
    const editPhoneUsers = form.querySelector('#editPhoneUsers') as HTMLInputElement;
    const editImageUsers = form.querySelector('#editImageUsers') as HTMLInputElement;
    const editRoleUsers = form.querySelector('#editRoleUsers') as HTMLInputElement;
    const row = document.getElementById(`row-user-${id}`) as HTMLElement;
    const oldImageName = ($(`#container .content .table .tbody .row .img img.img-user-${id}`) as HTMLImageElement).getAttribute('data-img') as string;
    let newUser: User;
    let newUserApi;

    const validation = async () => {
        const errors = [];
        if (editNameUsers.value.length <= 0) {
            errorInputAdmin(editNameUsers);
            (editNameUsers.nextElementSibling as HTMLElement).textContent = 'username can\'t be null';
            errors.push(1);
        } else if (!usernameRegex.test(editNameUsers.value)) {
            errorInputAdmin(editNameUsers);
            (editNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be a string of characters';
            errors.push(1);
        } else if (editNameUsers.value.length < 7) {
            errorInputAdmin(editNameUsers);
            (editNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be at least 6 characters long';
            errors.push(1);
        } else {
            normalInputAdmin(editNameUsers);
            (editNameUsers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (editEmailUsers.value.length <= 0) {
            errorInputAdmin(editEmailUsers);
            errors.push(1);
            (editEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address can\'t be null';
        } else if (!emailRegex.test(editEmailUsers.value)) {
            errorInputAdmin(editEmailUsers);
            (editEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address must be in correct format';
            errors.push(1);
        } else {
            normalInputAdmin(editEmailUsers);
            (editEmailUsers.nextElementSibling as HTMLElement).textContent = '';
        }
        if (editAddressUsers.value.length <= 0) {
            errorInputAdmin(editAddressUsers);
            (editAddressUsers.nextElementSibling as HTMLElement).textContent = 'address can\'t be null';
            errors.push(1);
        } else if (editAddressUsers.value.length < 10) {
            errorInputAdmin(editAddressUsers);
            (editAddressUsers.nextElementSibling as HTMLElement).textContent = 'address must be at least 10 characters long';
            errors.push(1);
        } else if (!(await validateAddress(editAddressUsers.value))) {
            errorInputAdmin(editAddressUsers);
            (editAddressUsers.nextElementSibling as HTMLElement).textContent = 'address is invalid';
            errors.push(1);
        } else {
            normalInputAdmin(editAddressUsers);
            (editAddressUsers.nextElementSibling as HTMLElement).textContent = '';
        }
        if (editPhoneUsers.value.length <= 0) {
            errorInputAdmin(editPhoneUsers);
            (editPhoneUsers.nextElementSibling as HTMLElement).textContent = 'phone number can\'t be null';
            errors.push(1);
        } else if (editPhoneUsers.value.length < 10 || editPhoneUsers.value.length > 10) {
            errorInputAdmin(editPhoneUsers);
            (editPhoneUsers.nextElementSibling as HTMLElement).textContent = 'The phone number must have 10 digits';
            errors.push(1);
        } else {
            normalInputAdmin(editPhoneUsers);
            (editPhoneUsers.nextElementSibling as HTMLElement).textContent = '';
        }
        return errors.length === 0
    }

    if (await validation()) {
        if (editImageUsers.files && editImageUsers.files.length > 0) {
            await usersModel.removeAvatarByFileName(oldImageName);
            let newImageName = await usersModel.uploadAvatar(editImageUsers.files[0]);
            newUser = {
                _id: id,
                name: editNameUsers.value,
                email: editEmailUsers.value,
                address: editAddressUsers.value,
                phone: editPhoneUsers.value,
                password: '',
                role: editRoleUsers.value,
                image: newImageName.filename,
                reset: '',
                token: ''
            }
            newUserApi = await usersModel.editUserById(id, newUser);
        } else {
            newUser = {
                _id: id,
                name: editNameUsers.value,
                email: editEmailUsers.value,
                address: editAddressUsers.value,
                phone: editPhoneUsers.value,
                password: '',
                role: editRoleUsers.value,
                image: oldImageName,
                reset: '',
                token: ''
            }
            newUserApi = await usersModel.editUserById(id, newUser);
        }
        (row.querySelector(`.name-user-${id}`) as HTMLElement).textContent = newUserApi.name;
        (row.querySelector(`.img-user-${id}`) as HTMLImageElement).src = newUserApi.image ? `${API.endPoint}images/uploads/${newUserApi.image}` : 'images/logo/icon.png';
        (row.querySelector(`.img-user-${id}`) as HTMLImageElement).setAttribute('data-img', newUserApi.image);
        (row.querySelector(`.email-user-${id}`) as HTMLElement).textContent = newUserApi.email;
        (row.querySelector(`.address-user-${id}`) as HTMLElement).textContent = newUserApi.address;
        (row.querySelector(`.phone-user-${id}`) as HTMLElement).textContent = newUserApi.phone;
        (row.querySelector(`.role-user-${id}`) as HTMLElement).textContent = role[newUserApi.role];
        ($('#formEditBackground') as HTMLElement).remove();
        notification('edit user successfully', () => {
            ($('#notification') as HTMLElement).remove();
        })
    }

}

export const handleEditValueUsers = (id: string) => {
    const form = document.getElementById('formEditUser') as HTMLFormElement;
    const editIdUsers = form.querySelector('#editIdUsers') as HTMLInputElement;
    const editNameUsers = form.querySelector('#editNameUsers') as HTMLInputElement;
    const editEmailUsers = form.querySelector('#editEmailUsers') as HTMLInputElement;
    const editAddressUsers = form.querySelector('#editAddressUsers') as HTMLInputElement;
    const editPhoneUsers = form.querySelector('#editPhoneUsers') as HTMLInputElement;
    const editImageUsers = form.querySelector('#editImageUsers') as HTMLInputElement;
    const editRoleUsers = form.querySelector('#editRoleUsers') as HTMLInputElement;
    const editPreview = form.querySelector('#editPreview') as HTMLImageElement;
    const row = $(`#row-user-${id}`) as HTMLElement;
    // const oldImage = row.querySelector(`.img-user-${id}`);
    // const oldNameImage = oldImage.getAttribute('data-img');

    editImageUsers.addEventListener('change', async () => {
        if (editImageUsers.files && editImageUsers.files.length > 0) {
            editPreview.src = await getImageUrl(editImageUsers.files[0]);
        }
    });

    const role: Record<string, number> = {
        user: 0,
        admin: 1
    }
    editIdUsers.value = id;
    const nameUser = row.querySelector(`.name-user-${id}`);
    const emailUser = row.querySelector(`.email-user-${id}`);
    const addressUser = row.querySelector(`.address-user-${id}`);
    const roleUser = row.querySelector(`.role-user-${id}`) as HTMLElement;
    const phoneUser = row.querySelector(`.phone-user-${id}`) as HTMLElement;
    const imgUser = row.querySelector(`.img-user-${id}`) as HTMLImageElement;
    editNameUsers.value = nameUser?.textContent ?? '';
    editEmailUsers.value = emailUser?.textContent ?? '';
    editAddressUsers.value = addressUser?.textContent ?? '';
    editPhoneUsers.value = phoneUser?.textContent ?? ''
    editRoleUsers.value = role[roleUser?.textContent as string].toString();
    editPreview.src = imgUser?.src ?? '';
}

export const handleEditValueUsers_user = async (id: string) => {
    const form = document.getElementById('formEdit') as HTMLFormElement;
    const editNameUsers = form.querySelector('#editNameUsers') as HTMLInputElement;
    const editEmailUsers = form.querySelector('#editEmailUsers') as HTMLInputElement;
    const editAddressUsers = form.querySelector('#editAddressUsers') as HTMLInputElement;
    const editPhoneUsers = form.querySelector('#editPhoneUsers') as HTMLInputElement;
    // const editImageUsers = form.querySelector('#editImageUsers') as HTMLInputElement;
    const editPreview = form.querySelector('#editPreview') as HTMLImageElement;
    // const oldImage = row.querySelector(`.img-user-${id}`);
    // const oldNameImage = oldImage.getAttribute('data-img');
    try {
        const user = await usersModel.findUserById(id);
        editNameUsers.value = user.name;
        editEmailUsers.value = user.email;
        editAddressUsers.value = user.address;
        editPhoneUsers.value = user.phone
        editPreview.src = `${API.endPoint}images/uploads/${user.image}`;
    } catch (error) {
        ($('#formEditBackground') as HTMLElement).remove();
        console.log(error);
    }
}

export const handleAddVoucher = async () => {
    const form = document.getElementById('formAddVoucher') as HTMLFormElement;
    const addCodeVouchers = form.querySelector('#addCodeVouchers') as HTMLInputElement;
    const addDiscountVouchers = form.querySelector('#addDiscountVouchers') as HTMLInputElement;
    const addMinAmountVouchers = form.querySelector('#addMinAmountVouchers') as HTMLInputElement;
    const addDateEndVouchers = form.querySelector('#addDateEndVouchers') as HTMLInputElement;
    const addExpiredVouchers = form.querySelector('#addExpiredVouchers') as HTMLSelectElement;

    const validation = async () => {
        let check = [];
        if (addCodeVouchers.value.length <= 0) {
            errorInputAdmin(addCodeVouchers);
            (addCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code can\'t be null';
            check.push(1);
        } else if (addCodeVouchers.value.length < 6) {
            errorInputAdmin(addCodeVouchers);
            (addCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code must be at least 6 characters long';
            check.push(1);
        } else if (checkNumber.test(addCodeVouchers.value)) {
            errorInputAdmin(addCodeVouchers);
            (addCodeVouchers.nextElementSibling as HTMLElement).textContent = 'Code can\'t begin with a number';
            check.push(1);
        } else {
            normalInputAdmin(addCodeVouchers);
            (addCodeVouchers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (addDiscountVouchers.value.length <= 0) {
            errorInputAdmin(addDiscountVouchers);
            (addDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'disscount can\'t be null';
        } else if (!checkString.test(addDiscountVouchers.value)) {
            errorInputAdmin(addDiscountVouchers);
            (addDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'discount must be a number';
        } else if (parseFloat(addDiscountVouchers.value) > 60) {
            errorInputAdmin(addDiscountVouchers);
            (addDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'Can\'t discount more than 60 percent';
        } else if (parseFloat(addDiscountVouchers.value) <= 0) {
            errorInputAdmin(addDiscountVouchers);
            (addDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'Can\'t discount less than 0 percent';
        } else {
            normalInputAdmin(addDiscountVouchers);
            (addDiscountVouchers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (addMinAmountVouchers.value.length <= 0) {
            errorInputAdmin(addMinAmountVouchers);
            (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount can\'t be null';
            check.push(1);
        } else if (!checkString.test(addMinAmountVouchers.value)) {
            errorInputAdmin(addMinAmountVouchers);
            (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount must be a number';
            check.push(1);
        } else if (parseFloat(addMinAmountVouchers.value) < 0) {
            errorInputAdmin(addMinAmountVouchers);
            (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount mus be at least above 0';
        } else {
            normalInputAdmin(addMinAmountVouchers);
            (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (addDateEndVouchers.value.length <= 0) {
            errorInputAdmin(addDateEndVouchers);
            (addDateEndVouchers.nextElementSibling as HTMLElement).textContent = 'date end can\'t be null';
            check.push(1);
        } else {
            normalInputAdmin(addDateEndVouchers);
            (addDateEndVouchers.nextElementSibling as HTMLElement).textContent = '';
        }
        return check.length === 0;
    }

    if (await validation()) {
        const voucherModel = new VoucherModel(API.endPoint);
        const voucher: Voucher = await voucherModel.createVoucher(addCodeVouchers.value, parseFloat(addDiscountVouchers.value), parseFloat(addMinAmountVouchers.value),
            addDateEndVouchers.value, JSON.parse(addExpiredVouchers.value as string));
        const container = $('#container .content .table .tbody') as HTMLElement;
        container.innerHTML += `
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
        ($(`#row-${voucher._id} .remove`) as HTMLElement).addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            const id = (e.target as HTMLElement).getAttribute('data-id') as string;
            confirm('removeVoucher', id);
        });
        ($('#formEditBackground') as HTMLElement).remove();
        notification('Add Voucher successfully !', () => {
            ($('#notification') as HTMLElement).remove();
        });
    }

    // console.log(addCodeVouchers.value, addDiscountVouchers.value, addMinAmountVouchers.value, addMinAmountVouchers.value, addDateEndVouchers.value, addExpiredVouchers.value)
}

export const handleValueVoucher = (id: string) => {
    const row = $(`#row-${id}`) as HTMLElement;
    const form = document.getElementById('formEditVoucher') as HTMLFormElement;
    const editIDVouchers = form.querySelector('#editIDVouchers') as HTMLInputElement;
    const editCodeVouchers = form.querySelector('#editCodeVouchers') as HTMLInputElement;
    const editDiscountVouchers = form.querySelector('#editDiscountVouchers') as HTMLInputElement;
    const editMinAmountVouchers = form.querySelector('#editMinAmountVouchers') as HTMLInputElement;
    const editDateEndVouchers = form.querySelector('#editDateEndVouchers') as HTMLInputElement;
    const editExpiredVouchers = form.querySelector('#editExpiredVouchers') as HTMLSelectElement;
    editIDVouchers.value = (row.querySelector(`.id-${id}`) as HTMLElement)?.textContent?.toString() as string;
    editCodeVouchers.value = (row.querySelector(`.code-${id}`) as HTMLElement)?.textContent?.toString() as string;
    editDiscountVouchers.value = parseFloat((row.querySelector(`.discount-${id}`) as HTMLElement)?.textContent?.toString() as string).toString();
    editMinAmountVouchers.value = parseFloat((row.querySelector(`.min_amount-${id}`) as HTMLElement)?.textContent?.toString() as string).toString();
    editDateEndVouchers.value = (row.querySelector(`.date_end-${id}`) as HTMLElement)?.textContent?.toString() as string;
    editExpiredVouchers.value = (row.querySelector(`.expired-${id}`) as HTMLElement)?.textContent?.toString() as string;
}

export const handleEditVoucher = async (id: string) => {
    const voucherModel = new VoucherModel(API.endPoint);
    const form = document.getElementById('formEditVoucher') as HTMLFormElement;
    const editCodeVouchers = form.querySelector('#editCodeVouchers') as HTMLInputElement;
    const editDiscountVouchers = form.querySelector('#editDiscountVouchers') as HTMLInputElement;
    const editMinAmountVouchers = form.querySelector('#editMinAmountVouchers') as HTMLInputElement;
    const editDateEndVouchers = form.querySelector('#editDateEndVouchers') as HTMLInputElement;
    const editExpiredVouchers = form.querySelector('#editExpiredVouchers') as HTMLSelectElement;

    const validation = async () => {
        let check = [];
        if (editCodeVouchers.value.length <= 0) {
            errorInputAdmin(editCodeVouchers);
            (editCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code can\'t be null';
            check.push(1);
        } else if (editCodeVouchers.value.length < 6) {
            errorInputAdmin(editCodeVouchers);
            (editCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code must be at least 6 characters long';
            check.push(1);
        } else if (checkNumber.test(editCodeVouchers.value)) {
            errorInputAdmin(editCodeVouchers);
            (editCodeVouchers.nextElementSibling as HTMLElement).textContent = 'Code can\'t begin with a number';
            check.push(1);
        } else {
            normalInputAdmin(editCodeVouchers);
            (editCodeVouchers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (editDiscountVouchers.value.length <= 0) {
            errorInputAdmin(editDiscountVouchers);
            (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'disscount can\'t be null';
            check.push(1);
        } else if (!checkString.test(editDiscountVouchers.value)) {
            errorInputAdmin(editDiscountVouchers);
            (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'discount must be a number';
            check.push(1);
        } else if (parseFloat(editDiscountVouchers.value) > 60) {
            errorInputAdmin(editDiscountVouchers);
            (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'Can\'t discount more than 60 percent';
            check.push(1);
        } else {
            normalInputAdmin(editDiscountVouchers);
            (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (editMinAmountVouchers.value.length <= 0) {
            errorInputAdmin(editMinAmountVouchers);
            (editMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount can\'t be null';
            check.push(1);
        } else if (!checkString.test(editMinAmountVouchers.value)) {
            errorInputAdmin(editMinAmountVouchers);
            (editMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount must be a number';
            check.push(1);
        } else {
            normalInputAdmin(editMinAmountVouchers);
            (editMinAmountVouchers.nextElementSibling as HTMLElement).textContent = '';
        }

        if (editDateEndVouchers.value.length <= 0) {
            errorInputAdmin(editDateEndVouchers);
            (editDateEndVouchers.nextElementSibling as HTMLElement).textContent = 'date end can\'t be null';
            check.push(1);
        } else {
            normalInputAdmin(editDateEndVouchers);
            (editDateEndVouchers.nextElementSibling as HTMLElement).textContent = '';
        }
        return check.length === 0;
    }

    if (await validation()) {
        const result: Voucher = await voucherModel.editVoucherById(id, editCodeVouchers.value, parseFloat(editDiscountVouchers.value), parseFloat(editMinAmountVouchers.value),
            editDateEndVouchers.value, JSON.parse(editExpiredVouchers.value));
        const row = $(`#row-${id}`) as HTMLElement;
        (row.querySelector(`.code-${id}`) as HTMLElement).textContent = result.code;
        (row.querySelector(`.discount-${id}`) as HTMLElement).textContent = result.discount.toString() + '%';
        (row.querySelector(`.min_amount-${id}`) as HTMLElement).textContent = result.min_amount.toString() + '$';
        (row.querySelector(`.date_end-${id}`) as HTMLElement).textContent = result.date_end;
        (row.querySelector(`.expired-${id}`) as HTMLElement).textContent = result.expired.toString();
        ($('#formEditBackground') as HTMLElement).remove();
        notification('Edit Voucher successfully !', () => {
            ($('#notification') as HTMLElement).remove();
        });
    }
}

export const handleRemoveVoucher = async (id: string) => {
    const voucherModel = new VoucherModel(API.endPoint);
    await voucherModel.removeVoucherById(id);
    ($(`#row-${id}`) as HTMLElement).remove();

}

export const handelAddDelivery = async () => {
    const form = document.getElementById('formAddDelivery') as HTMLFormElement;
    const name = form.querySelector('#addNameDelivery') as HTMLInputElement;
    const speed = form.querySelector('#addSpeedDelivery') as HTMLInputElement;
    const price = form.querySelector('#addPriceDelivery') as HTMLInputElement;
    const status = form.querySelector('#addStatusDelivery') as HTMLInputElement;

    console.log(name.value, speed.value, status.value, price.value);
    let result;
    if (name.value && speed.value && status.value && price.value) {
        const newDelivery: Delivery = {
            _id: '',
            name: name.value,
            price: parseFloat(price.value),
            speed: speed.value,
            status: parseInt(status.value)
        }
        result = await deliveriesModel.create(newDelivery);
    }

    if (result) {
        console.log(result);
    }

}

export const handleRemoveDelivery = async (id: string) => {
    await deliveriesModel.removeByID(id);
    const row = $(`#row-delivery-${id}`) as HTMLElement;
    row.remove();
}

export const handleDetailOrder = async (id : string) =>  {
    const orderDetailsList = await orderDetailsModel.findOrderDetailsByIdOrder(id);
    console.log(orderDetailsList);
    const container = $('#formEditBackground .main_form .table .tbody') as HTMLElement;
    let html = '';
    for(let orderDetail of orderDetailsList) {
        let product = await productsModel.findProductsById(orderDetail.id_product)
        html += `
            <div class="row grid"> 
                <div>${orderDetail._id}</div>
                <div>${product.name}</div>
                <div>
                    <img src="${API.endPoint}images/uploads/${product.image}" alt="${product.name}" />
                </div>
                <div>${orderDetail.price}$</div>
                <div>${orderDetail.quantity}</div>
                <div>${(orderDetail.quantity * orderDetail.price).toFixed(2)}$</div>
            </div>
        `;
    }

    container.innerHTML = html;

}