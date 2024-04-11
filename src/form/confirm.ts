import {$} from "../constants/main.ts";
import {handleRemoveDelivery, handleRemoveUser, handleRemoveVoucher} from "./handleCRUD.ts";
import notification from "./notification.ts";

const confirm = (type: string, id: string, callback? : () => void) => {
    let isRunning: boolean = false;
    switch (type) {
        case 'removeDelivery': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="confirm">
                  <div class="main_form" id="formAdd">
                    <p>Are you sure you want to delete this delivery ?</p>
                    <button id="no" type="submit" class="submit">No, I'm not sure</button>
                    <button id="yes" type="submit" class="submit">Yes, I'm sure</button>
                  </div>
                </div>
            `);
            ($('#confirm .main_form button#yes') as HTMLElement).addEventListener('click', async () => {
                await handleRemoveDelivery(id);
                ($('#confirm') as HTMLElement).remove();
            });
            ($('#confirm .main_form button#no') as HTMLElement).addEventListener('click', () => {
                ($('#confirm') as HTMLElement).remove();
            })
            break;
        }
        case 'removeUser': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="confirm">
                  <div class="main_form" id="formAdd">
                    <p>Are you sure you want to delete this user ?</p>
                    <button id="no" type="submit" class="submit">No, I'm not sure</button>
                    <button id="yes" type="submit" class="submit">Yes, I'm sure</button>
                  </div>
                </div>
            `);
            ($('#confirm .main_form button#yes') as HTMLElement).addEventListener('click', async () => {
                await handleRemoveUser(id);
                ($('#confirm') as HTMLElement).remove();
            });
            ($('#confirm .main_form button#no') as HTMLElement).addEventListener('click', () => {
                ($('#confirm') as HTMLElement).remove();
            })
            break;
        }
        case 'removeVoucher': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="confirm">
                  <div class="main_form" id="formAdd">
                    <p>Are you sure you want to delete this voucher ?</p>
                    <button id="no" type="submit" class="submit">No, I'm not sure</button>
                    <button id="yes" type="submit" class="submit">Yes, I'm sure</button>
                  </div>
                </div>
            `);
            ($('#confirm .main_form button#yes') as HTMLElement).addEventListener('click', async () => {
                await handleRemoveVoucher(id);
                ($('#confirm') as HTMLElement).remove();
                notification('Remove Voucher successfully !', () => {
                    ($('#notification') as HTMLElement).remove();
                });
            });
            ($('#confirm .main_form button#no') as HTMLElement).addEventListener('click', () => {
                ($('#confirm') as HTMLElement).remove();
            })
            break;
        }
        case 'logout': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="confirm">
                  <div class="main_form" id="formAdd">
                    <p>Are you sure you want to logout ?</p>
                    <button id="no" type="submit" class="submit">No, I'm not sure</button>
                    <button id="yes" type="submit" class="submit">Yes, I'm sure</button>
                  </div>
                </div>
            `);
            ($('#confirm .main_form button#yes') as HTMLElement).addEventListener('click', async () => {
                localStorage.removeItem('user');
                ($('#confirm') as HTMLElement).remove();
                window.location.href = '/';
            });
            ($('#confirm .main_form button#no') as HTMLElement).addEventListener('click', () => {
                ($('#confirm') as HTMLElement).remove();
            })
            break;
        }
        case 'removeCartItem': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="confirm">
                  <div class="main_form" id="formAdd">
                    <p>Are you sure you want to remove this product from your cart ?</p>
                    <button id="no" type="submit" class="submit">No, I'm not sure</button>
                    <button id="yes" type="submit" class="submit">Yes, I'm sure</button>
                  </div>
                </div>
            `);
            ($('#confirm .main_form button#yes') as HTMLElement).addEventListener('click', async () => {
                ($('#confirm') as HTMLElement).remove();
                if(callback) callback();
            });
            ($('#confirm .main_form button#no') as HTMLElement).addEventListener('click', () => {
                ($('#confirm') as HTMLElement).remove();
            })
            break;
        }
        default: {
            break;
        }
    }
    if (isRunning) {
        const background = document.getElementById('confirm') as HTMLElement;
        background.addEventListener('click', (e) => {
            if (e.target === background) {
                background.remove();
            }
        });
        const form = background.querySelector('.main_form') as HTMLElement;
        form.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

export default confirm;
