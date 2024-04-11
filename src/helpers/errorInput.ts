

export const errorInput = (input : HTMLInputElement) => {
    input.style.color = 'red';
    input.style.borderBottom = '1px solid red';
}

export const normalInput = (input : HTMLInputElement) => {
    input.style.color = '#000';
    input.style.borderBottom = '1px solid #000';
}

export const errorInputAdmin = (input : HTMLInputElement) => {
    input.style.color = 'red';
    input.style.border = '1px solid red';
}

export const normalInputAdmin = (input : HTMLInputElement) => {
    input.style.color = '#000';
    input.style.border = '1px solid rgba(0, 0, 0, 0.4)';
}

