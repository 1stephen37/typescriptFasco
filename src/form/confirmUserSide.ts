import {$} from "../constants/main.ts";

const confirmUserSide = (message: string) : void => {
        ($('body') as HTMLElement).innerHTML += `
            <div id="confirm">
              <div class="main_form" id="formAdd">
                <p>${message}</p>
                <button id="no" type="submit" class="submit">No, I'm not sure</button>
                <button id="yes" type="submit" class="submit">Yes, I'm sure</button>
              </div>
            </div>
        `;
        ($('#confirm .main_form button#no') as HTMLElement).addEventListener('click', () => {
            ($('#confirm') as HTMLElement).remove();
            return false;
        });
        const background = document.getElementById('confirm') as HTMLElement;
        background.addEventListener('click', (e) => {
            if (e.target === background) background.remove();
        });
        const form = background.querySelector('.main_form') as HTMLElement;
        form.addEventListener('click', (e) => {
            e.stopPropagation();
        });
}

export default confirmUserSide;
