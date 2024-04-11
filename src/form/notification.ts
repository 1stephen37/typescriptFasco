import { $ } from '../constants/main.ts';

const notification = (message : string, callback : () => void) : void => {
    if(message) {
        (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
            <div id="notification">
                <div class="container">
                    <h2>${message}</h2>
                    <button id="confirmNotification">Confirm</button>
                </div>  
            </div>
        `);
        ($('#confirmNotification') as HTMLElement).addEventListener('click', callback);
        const background = document.getElementById('notification') as HTMLElement;
        background.addEventListener('click', (e) => {
            if (e.target === background) {
                background.remove();
            }
        });
        const form = background.querySelector('.container') as HTMLElement;
        form.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}


export default notification;