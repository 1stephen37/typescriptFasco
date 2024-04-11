export const $ = document.querySelector.bind(document);

export const $$ = document.querySelectorAll.bind(document);

export const API : {
    endPoint : string
} = {
    endPoint: "http://localhost:3000/"
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const usernameRegex = /^(?![0-9]).*$/;

export const checkNumber = /^[0-9].*/;

export const checkString = /^[0-9]+$/;

export const order_status : Record<number, string> = {
    0 : 'wait for confirmation',
    1 : 'confirmed',
    2 : 'being transported',
    4 : 'delivered successfully',
    5 : 'cancel order'
}