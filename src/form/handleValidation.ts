import {errorInputAdmin, normalInputAdmin} from "../helpers/errorInput.ts";
import {emailRegex, usernameRegex, checkNumber, checkString} from "../constants/main.ts";
import {validateAddress} from "../helpers/OpenStreetMapApi.ts";

export const validateUser = () => {
    const form = document.getElementById('formAdd') as HTMLFormElement;
    const addNameUsers = form.querySelector('#addNameUsers') as HTMLInputElement;
    const addEmailUsers = form.querySelector('#addEmailUsers') as HTMLInputElement;
    const addPasswordUsers = form.querySelector('#addPasswordUsers') as HTMLInputElement;
    const addAddressUsers = form.querySelector('#addAddressUsers') as HTMLInputElement;
    const addPhoneUsers = form.querySelector('#addPhoneUsers') as HTMLInputElement;

    addNameUsers.onblur = () => {
        if (addNameUsers.value.length <= 0) {
            errorInputAdmin(addNameUsers);
            (addNameUsers.nextElementSibling as HTMLElement).textContent = 'username can\'t be null';
        } else if (!usernameRegex.test(addNameUsers.value)) {
            errorInputAdmin(addNameUsers);
            (addNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be a string of characters';
        } else if (addNameUsers.value.length < 7) {
            errorInputAdmin(addNameUsers);
            (addNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be at least 6 characters long';
        }
    }

    addNameUsers.onfocus = () => {
        normalInputAdmin(addNameUsers);
        (addNameUsers.nextElementSibling as HTMLElement).textContent = ''
    }

    addEmailUsers.onblur = () => {
        if (addEmailUsers.value.length <= 0) {
            errorInputAdmin(addEmailUsers);
            (addEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address can\'t be null';
        } else if (!emailRegex.test(addEmailUsers.value)) {
            errorInputAdmin(addEmailUsers);
            (addEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address must be in correct format';
        }
    }

    addEmailUsers.onfocus = () => {
        normalInputAdmin(addEmailUsers);
        (addEmailUsers.nextElementSibling as HTMLElement).textContent = ''
    }

    addPasswordUsers.onblur = () => {
        if (addPasswordUsers.value.length <= 0) {
            errorInputAdmin(addPasswordUsers);
            (addPasswordUsers.nextElementSibling as HTMLElement).textContent = 'password can\'t be null';
        } else if (addPasswordUsers.value.length < 7) {
            errorInputAdmin(addPasswordUsers);
            (addPasswordUsers.nextElementSibling as HTMLElement).textContent = 'password must be at least 6 characters long';
        }
    }

    addPasswordUsers.onfocus = () => {
        normalInputAdmin(addPasswordUsers);
        (addPasswordUsers.nextElementSibling as HTMLElement).textContent = ''
    }

    addAddressUsers.onblur = async () => {
        if (addAddressUsers.value.length <= 0) {
            errorInputAdmin(addAddressUsers);
            (addAddressUsers.nextElementSibling as HTMLElement).textContent = 'address can\'t be null';
        } else if (addAddressUsers.value.length < 7) {
            errorInputAdmin(addAddressUsers);
            (addAddressUsers.nextElementSibling as HTMLElement).textContent = 'address must be at least 6 characters long';
        } else if (!(await validateAddress(addAddressUsers.value))) {
            errorInputAdmin(addAddressUsers);
            (addAddressUsers.nextElementSibling as HTMLElement).textContent = 'address is invalid';
        }
    }

    addAddressUsers.onfocus = () => {
        normalInputAdmin(addAddressUsers);
        (addAddressUsers.nextElementSibling as HTMLElement).textContent = ''
    }

    addPhoneUsers.onblur = () => {
        if (addPhoneUsers.value.length <= 0) {
            errorInputAdmin(addPhoneUsers);
            (addPhoneUsers.nextElementSibling as HTMLElement).textContent = 'phone number can\'t be null';
        } else if (addPhoneUsers.value.length < 10 || addPhoneUsers.value.length > 10) {
            errorInputAdmin(addPhoneUsers);
            (addPhoneUsers.nextElementSibling as HTMLElement).textContent = 'The phone number must have 10 digits';
        }
    }

    addPhoneUsers.onfocus = () => {
        normalInputAdmin(addPhoneUsers);
        (addPhoneUsers.nextElementSibling as HTMLElement).textContent = ''
    }

}

export const validateUserEdit = () => {
    const form = document.getElementById('formEditUser') as HTMLFormElement;
    const editNameUsers = form.querySelector('#editNameUsers') as HTMLInputElement;
    const editEmailUsers = form.querySelector('#editEmailUsers') as HTMLInputElement;
    const editAddressUsers = form.querySelector('#editAddressUsers') as HTMLInputElement;
    const editPhoneUsers = form.querySelector('#editPhoneUsers') as HTMLInputElement;

    editNameUsers.onblur = () => {
        if (editNameUsers.value.length <= 0) {
            errorInputAdmin(editNameUsers);
            (editNameUsers.nextElementSibling as HTMLElement).textContent = 'username can\'t be null';
        } else if (!usernameRegex.test(editNameUsers.value)) {
            errorInputAdmin(editNameUsers);
            (editNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be a string of characters';
        } else if (editNameUsers.value.length < 7) {
            errorInputAdmin(editNameUsers);
            (editNameUsers.nextElementSibling as HTMLElement).textContent = 'username must be at least 6 characters long';
        }
    }

    editNameUsers.onfocus = () => {
        normalInputAdmin(editNameUsers);
        (editNameUsers.nextElementSibling as HTMLElement).textContent = ''
    }

    editEmailUsers.onblur = () => {
        if (editEmailUsers.value.length <= 0) {
            errorInputAdmin(editEmailUsers);
            (editEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address can\'t be null';
        } else if (!emailRegex.test(editEmailUsers.value)) {
            errorInputAdmin(editEmailUsers);
            (editEmailUsers.nextElementSibling as HTMLElement).textContent = 'email address must be in correct format';
        }
    }

    editEmailUsers.onfocus = () => {
        normalInputAdmin(editEmailUsers);
        (editEmailUsers.nextElementSibling as HTMLElement).textContent = ''
    }

    editAddressUsers.onblur = async () => {
        if (editAddressUsers.value.length <= 0) {
            errorInputAdmin(editAddressUsers);
            (editAddressUsers.nextElementSibling as HTMLElement).textContent = 'address can\'t be null';
        } else if (editAddressUsers.value.length < 10) {
            errorInputAdmin(editAddressUsers);
            (editAddressUsers.nextElementSibling as HTMLElement).textContent = 'address must be at least 10 characters long';
        } else if (!(await validateAddress(editAddressUsers.value))) {
            errorInputAdmin(editAddressUsers);
            (editAddressUsers.nextElementSibling as HTMLElement).textContent = 'address is invalid';
        }
    }

    editAddressUsers.onfocus = () => {
        normalInputAdmin(editAddressUsers);
        (editAddressUsers.nextElementSibling as HTMLElement).textContent = ''
    }

    editPhoneUsers.onblur = () => {
        if (editPhoneUsers.value.length <= 0) {
            errorInputAdmin(editPhoneUsers);
            (editPhoneUsers.nextElementSibling as HTMLElement).textContent = 'phone number can\'t be null';
        } else if (editPhoneUsers.value.length < 10 || editPhoneUsers.value.length > 10) {
            errorInputAdmin(editPhoneUsers);
            (editPhoneUsers.nextElementSibling as HTMLElement).textContent = 'The phone number must have 10 digits';
        }
    }

    editPhoneUsers.onfocus = () => {
        normalInputAdmin(editPhoneUsers);
        (editPhoneUsers.nextElementSibling as HTMLElement).textContent = ''
    }

}

export const validateVoucher = () => {
    const form = document.getElementById('formAddVoucher') as HTMLFormElement;
    const addCodeVouchers = form.querySelector('#addCodeVouchers') as HTMLInputElement;
    const addDiscountVouchers = form.querySelector('#addDiscountVouchers') as HTMLInputElement;
    const addMinAmountVouchers = form.querySelector('#addMinAmountVouchers') as HTMLInputElement;
    const addDateEndVouchers = form.querySelector('#addDateEndVouchers') as HTMLInputElement;

    addCodeVouchers.onblur = () => {
        if (addCodeVouchers.value.length <= 0) {
            errorInputAdmin(addCodeVouchers);
            (addCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code can\'t be null';
        } else if (addCodeVouchers.value.length < 6) {
            errorInputAdmin(addCodeVouchers);
            (addCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code must be at least 6 characters long';
        } else if (checkNumber.test(addCodeVouchers.value)) {
            errorInputAdmin(addCodeVouchers);
            (addCodeVouchers.nextElementSibling as HTMLElement).textContent = 'Code can\'t begin with a number';
        }
    }

    addCodeVouchers.onfocus = () => {
        normalInputAdmin(addCodeVouchers);
        (addCodeVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

    addDiscountVouchers.onblur = () => {
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
        }
    }

    addDiscountVouchers.onfocus = () => {
        normalInputAdmin(addDiscountVouchers);
        (addDiscountVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

    addMinAmountVouchers.onblur = () => {
        if (addMinAmountVouchers.value.length <= 0) {
            errorInputAdmin(addMinAmountVouchers);
            (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount can\'t be null';
        } else if (!checkString.test(addMinAmountVouchers.value)) {
            errorInputAdmin(addMinAmountVouchers);
            (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount must be a number';
        } else if (parseFloat(addMinAmountVouchers.value) < 0) {
            errorInputAdmin(addMinAmountVouchers);
            (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount mus be at least above 0';
        }
    }

    addMinAmountVouchers.onfocus = () => {
        normalInputAdmin(addMinAmountVouchers);
        (addMinAmountVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

    addDateEndVouchers.onblur = () => {
        if (addDateEndVouchers.value.length <= 0) {
            errorInputAdmin(addDateEndVouchers);
            (addDateEndVouchers.nextElementSibling as HTMLElement).textContent = 'date end can\'t be null';
        }
    }

    addDateEndVouchers.onfocus = () => {
        normalInputAdmin(addDateEndVouchers);
        (addDateEndVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

}

export const validateVoucherEdit = () => {
    const form = document.getElementById('formEditVoucher') as HTMLFormElement;
    const editCodeVouchers = form.querySelector('#editCodeVouchers') as HTMLInputElement;
    const editDiscountVouchers = form.querySelector('#editDiscountVouchers') as HTMLInputElement;
    const editMinAmountVouchers = form.querySelector('#editMinAmountVouchers') as HTMLInputElement;
    const editDateEndVouchers = form.querySelector('#editDateEndVouchers') as HTMLInputElement;

    editCodeVouchers.onblur = () => {
        if (editCodeVouchers.value.length <= 0) {
            errorInputAdmin(editCodeVouchers);
            (editCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code can\'t be null';
        } else if (editCodeVouchers.value.length < 6) {
            errorInputAdmin(editCodeVouchers);
            (editCodeVouchers.nextElementSibling as HTMLElement).textContent = 'code must be at least 6 characters long';
        } else if (checkNumber.test(editCodeVouchers.value)) {
            errorInputAdmin(editCodeVouchers);
            (editCodeVouchers.nextElementSibling as HTMLElement).textContent = 'Code can\'t begin with a number';
        }
    }

    editCodeVouchers.onfocus = () => {
        normalInputAdmin(editCodeVouchers);
        (editCodeVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

    editDiscountVouchers.onblur = () => {
        if (editDiscountVouchers.value.length <= 0) {
            errorInputAdmin(editDiscountVouchers);
            (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'disscount can\'t be null';
        } else if (!checkString.test(editDiscountVouchers.value)) {
            errorInputAdmin(editDiscountVouchers);
            (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'discount must be a number';
        } else if (parseFloat(editDiscountVouchers.value) > 60) {
            errorInputAdmin(editDiscountVouchers);
            (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = 'Can\'t discount more than 60 percent';
        }
    }

    editDiscountVouchers.onfocus = () => {
        normalInputAdmin(editDiscountVouchers);
        (editDiscountVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

    editMinAmountVouchers.onblur = () => {
        if (editMinAmountVouchers.value.length <= 0) {
            errorInputAdmin(editMinAmountVouchers);
            (editMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount can\'t be null';
        } else if (!checkString.test(editMinAmountVouchers.value)) {
            errorInputAdmin(editMinAmountVouchers);
            (editMinAmountVouchers.nextElementSibling as HTMLElement).textContent = 'min amount must be a number';
        }
    }

    editMinAmountVouchers.onfocus = () => {
        normalInputAdmin(editMinAmountVouchers);
        (editMinAmountVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

    editDateEndVouchers.onblur = () => {
        if (editDateEndVouchers.value.length <= 0) {
            errorInputAdmin(editDateEndVouchers);
            (editDateEndVouchers.nextElementSibling as HTMLElement).textContent = 'date end can\'t be null';
        }
    }

    editDateEndVouchers.onfocus = () => {
        normalInputAdmin(editDateEndVouchers);
        (editDateEndVouchers.nextElementSibling as HTMLElement).textContent = '';
    }

}
