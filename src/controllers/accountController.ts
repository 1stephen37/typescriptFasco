import CoreController from "./coreController.ts";
import {$, API, checkNumber, emailRegex} from "../constants/main.ts";
import usersModel from "../models/usersModel.ts";
import {validateAddress} from "../helpers/OpenStreetMapApi.ts";
import notification from "../form/notification.ts";
import confirm from "../form/confirm.ts";
import form from "../form/form.ts";
import {errorInput, normalInput} from "../helpers/errorInput.ts";

export default class accountController extends CoreController {
    constructor(name = "account") {
        super();
        this.loadLayouts(name);
        const linkStyle = $('link[data-style="style"]') as HTMLElement;
        if (linkStyle) linkStyle.remove();
        ($('head') as HTMLElement).innerHTML += `<link rel='stylesheet' href='./style/admin.css'>`;
    }

    loadCss(name: string) {
        ($('head') as HTMLElement).innerHTML += `<link rel='stylesheet' href='./style/page/${name}.css'>`;
    }

    index() {
        location.href = 'account/sign_in';
    }

    sign_in = () => {
        this.loadTitle('Sign In - Fasco Shop');
        this.loadCss('Sign_in');
        this.loadViewAccount('sign_in', () => {
            const form: HTMLFormElement = $('.container .content .formSignIn') as HTMLFormElement;
            const email = form.querySelector('.container .content .formSignIn input#SignInEmail') as HTMLInputElement;
            const password = form.querySelector('.container .content .formSignIn input#SignInPassword') as HTMLInputElement;
            let check = false;
            email.onblur = () => {
                if (email.value.length <= 0) {
                    errorInput(email);
                    (email.nextElementSibling as HTMLElement).textContent = 'Email address can\'t be null';
                    check = false;
                } else if (!emailRegex.test(email.value)) {
                    errorInput(email);
                    (email.nextElementSibling as HTMLElement).textContent = 'Email address must be in the correct format';
                    check = false;
                } else {
                    check = true;
                }
            }

            email.onfocus = () => {
                normalInput(email);
                (email.nextElementSibling as HTMLElement).textContent = '';
            }

            password.onblur = () => {
                if (password.value.length <= 0) {
                    errorInput(password);
                    (password.nextElementSibling as HTMLElement).textContent = 'Password can\'t be null';
                    check = false;
                } else if (password.value.length < 6) {
                    errorInput(password);
                    (password.nextElementSibling as HTMLElement).textContent = 'Password must be longer than 6 characters';
                    check = false;
                } else {
                    check = true;
                }
            }

            password.onfocus = () => {
                normalInput(password);
                (password.nextElementSibling as HTMLElement).textContent = '';
            }

            const messageError = form.querySelector('.container .content .formSignIn span.message_error') as HTMLSpanElement;
            form.addEventListener('submit', async (e: SubmitEvent) => {
                e.preventDefault();
                if (check) {
                    console.log(check);
                    const usersModel = this.loadModel('users') as usersModel;
                    const result = await usersModel.signIn(email.value, password.value);
                    if (result._id) {
                        localStorage.setItem('user', JSON.stringify(result));
                        if (result.role === '1') {
                            notification('you are administrator', () => {
                                window.location.href = '/admin/';
                            })
                        } else {
                            notification('login successfully !', () => {
                                window.location.href = '/';
                            })
                        }
                    } else {
                        messageError.style.display = 'block';
                        messageError.textContent = result.response.data.message;
                    }
                } else {
                    if (email.value.length <= 0) {
                        errorInput(email);
                        (email.nextElementSibling as HTMLElement).textContent = 'Email address can\'t be null';
                        check = false;
                    } else if (!emailRegex.test(email.value)) {
                        errorInput(email);
                        (email.nextElementSibling as HTMLElement).textContent = 'Email address must be in the correct format';
                        check = false;
                    } else {
                        normalInput(email);
                        (email.nextElementSibling as HTMLElement).textContent = '';
                        check = true;
                    }
                    if (password.value.length <= 0) {
                        console.log(312);
                        errorInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = 'Password can\'t be null';
                        check = false;
                    } else if (password.value.length < 6) {
                        errorInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = 'Password must be longer than 6 characters';
                        check = false;
                    } else {
                        normalInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = '';
                        check = true;
                    }

                }
            });

            ($('.container .content .formSignIn i#eye') as HTMLElement).addEventListener('click', (e: MouseEvent) => {
                if ((e.target as HTMLElement).classList.toggle('fa-eye')) {
                    (e.target as HTMLElement).setAttribute('class', 'fa-solid fa-eye');
                    ($('.container .content .formSignIn input#SignInPassword') as HTMLInputElement).type = 'text';
                } else {
                    (e.target as HTMLElement).setAttribute('class', 'fa-solid fa-eye-slash');
                    ($('.container .content .formSignIn input#SignInPassword') as HTMLInputElement).type = 'password';
                }
            })

        })
    }

    sign_up = () => {
        this.loadTitle('Sign Up - Fasco Shop');
        this.loadCss('Sign_up');
        const usersModel = this.loadModel('users') as usersModel;
        this.loadViewAccount('sign_up', () => {
            const formSinUp = $('.container .content .formSignUp') as HTMLFormElement;
            const fullName = formSinUp.querySelector('#SignUpName') as HTMLInputElement;
            const address = formSinUp.querySelector('#SignUpAddress') as HTMLInputElement;
            const email = formSinUp.querySelector('#SignUpEmail') as HTMLInputElement;
            const phone = formSinUp.querySelector('#SignUpPhone') as HTMLInputElement;
            const password = formSinUp.querySelector('#SignUpPassword') as HTMLInputElement;
            const confirmPassword = formSinUp.querySelector('#SignUpConfirm') as HTMLInputElement;
            let isValid: boolean = false;
            fullName.onblur = () => {
                if (fullName.value === '') {
                    errorInput(fullName);
                    (fullName.nextElementSibling as HTMLElement).textContent = 'Username can\'t be null';
                    isValid = false;
                } else if (fullName.value.length < 5) {
                    errorInput(fullName);
                    (fullName.nextElementSibling as HTMLElement).textContent = 'Username least 5 characters long';
                    isValid = false;
                }
            }
            fullName.onfocus = () => {
                normalInput(fullName);
                (fullName.nextElementSibling as HTMLElement).textContent = '';
            }

            address.onblur = async () => {
                if (address.value === '') {
                    (address.nextElementSibling as HTMLElement).textContent = 'Address can\'t be null';
                    isValid = false;
                    errorInput(address);
                } else if (address.value.length < 10) {
                    errorInput(address);
                    (address.nextElementSibling as HTMLElement).textContent = 'Address least 10 characters long';
                    isValid = false;
                } else {
                    if (await validateAddress(address.value)) {
                        normalInput(address);
                        isValid = true;
                    } else {
                        errorInput(address);
                        isValid = false;
                        (address.nextElementSibling as HTMLElement).textContent = 'Address is not valid';
                    }
                }
            }
            address.onfocus = () => {
                normalInput(address);
                (address.nextElementSibling as HTMLElement).textContent = '';
            }


            email.onblur = () => {
                if (email.value === '') {
                    errorInput(email);
                    (email.nextElementSibling as HTMLElement).textContent = 'Email address can\'t be null';
                    isValid = false;
                } else if (!emailRegex.test(email.value)) {
                    errorInput(email);
                    (email.nextElementSibling as HTMLElement).textContent = 'Email address isn\'t valid';
                    isValid = false;
                }
            }
            email.onfocus = () => {
                normalInput(email);
                (email.nextElementSibling as HTMLElement).textContent = '';
            }

            phone.onblur = () => {
                if (phone.value === '') {
                    errorInput(phone);
                    (phone.nextElementSibling as HTMLElement).textContent = 'Phone number can\'t be null';
                    isValid = false;
                } else if (phone.value.length > 10) {
                    errorInput(phone);
                    (phone.nextElementSibling as HTMLElement).textContent = 'Phone number should be 10 digits';
                    isValid = false;
                } else if (phone.value.length < 10) {
                    errorInput(phone);
                    (phone.nextElementSibling as HTMLElement).textContent = 'Phone number must have 10 digits';
                    isValid = false;
                }
            }
            phone.onfocus = () => {
                normalInput(phone);
                (phone.nextElementSibling as HTMLElement).textContent = '';
            }

            password.onblur = () => {
                if (password.value.length <= 0) {
                    errorInput(password);
                    (password.nextElementSibling as HTMLElement).textContent = 'password can\'t be empty';
                    isValid = false;
                } else if (password.value.length < 6) {
                    errorInput(password);
                    (password.nextElementSibling as HTMLElement).textContent = 'password must be at least 6 characters';
                    isValid = false;
                }
            }

            password.onfocus = () => {
                normalInput(password);
                (password.nextElementSibling as HTMLElement).textContent = '';
            }

            confirmPassword.onblur = () => {
                if (confirmPassword.value.length <= 0) {
                    errorInput(confirmPassword);
                    (confirmPassword.nextElementSibling as HTMLElement).textContent = 'confirm password can\'t be null';
                } else if (confirmPassword.value !== password.value) {
                    errorInput(confirmPassword);
                    (confirmPassword.nextElementSibling as HTMLElement).textContent = 'confirm password must be the same as password';
                }
            }

            confirmPassword.onfocus = () => {
                normalInput(confirmPassword);
                (confirmPassword.nextElementSibling as HTMLElement).textContent = '';
            }

            formSinUp.addEventListener('submit', async (e: Event) => {
                e.preventDefault();
                console.log(fullName.value, address.value, email.value, phone.value, password.value, confirmPassword.value)
                if (isValid) {
                    const result = await usersModel.signUp(fullName.value, address.value, email.value, phone.value, password.value);
                    console.log(result);
                    localStorage.setItem('user', JSON.stringify(result));
                    window.location.href = '/';
                } else {
                    if (fullName.value === '') {
                        errorInput(fullName);
                        (fullName.nextElementSibling as HTMLElement).textContent = 'Username can\'t be null';
                        isValid = false;
                    } else if (fullName.value.length < 5) {
                        errorInput(fullName);
                        (fullName.nextElementSibling as HTMLElement).textContent = 'Username least 5 characters long';
                        isValid = false;
                    } else {
                        normalInput(fullName);
                        (fullName.nextElementSibling as HTMLElement).textContent = '';
                        isValid = true;
                    }
                    if (address.value === '') {
                        (address.nextElementSibling as HTMLElement).textContent = 'Address can\'t be null';
                        isValid = false;
                        errorInput(address);
                    } else if (address.value.length < 10) {
                        errorInput(address);
                        (address.nextElementSibling as HTMLElement).textContent = 'Address least 10 characters long';
                        isValid = false;
                    } else if (await validateAddress(address.value)) {
                        normalInput(address);
                        isValid = true;
                    } else {
                        errorInput(address);
                        isValid = false;
                        (address.nextElementSibling as HTMLElement).textContent = 'Address is not valid';
                    }
                    if (email.value === '') {
                        errorInput(email);
                        (email.nextElementSibling as HTMLElement).textContent = 'Email address can\'t be null';
                        isValid = false;
                    } else if (!emailRegex.test(email.value)) {
                        errorInput(email);
                        (email.nextElementSibling as HTMLElement).textContent = 'Email address isn\'t valid';
                        isValid = false;
                    } else {
                        normalInput(email);
                        (email.nextElementSibling as HTMLElement).textContent = '';
                        isValid = true;
                    }
                    if (phone.value === '') {
                        errorInput(phone);
                        (phone.nextElementSibling as HTMLElement).textContent = 'Phone number can\'t be null';
                        isValid = false;
                    } else if (phone.value.length > 10) {
                        errorInput(phone);
                        (phone.nextElementSibling as HTMLElement).textContent = 'Phone number should be 10 digits';
                        isValid = false;
                    } else if (phone.value.length < 10) {
                        errorInput(phone);
                        (phone.nextElementSibling as HTMLElement).textContent = 'Phone number must have 10 digits';
                        isValid = false;
                    } else {
                        normalInput(phone);
                        (phone.nextElementSibling as HTMLElement).textContent = '';
                        isValid = true;
                    }
                    if (password.value.length <= 0) {
                        errorInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = 'password can\'t be empty';
                        isValid = false;
                    } else if (password.value.length < 6) {
                        errorInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = 'password must be at least 6 characters';
                        isValid = false;
                    } else {
                        normalInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = '';
                        isValid = true;
                    }

                    if (confirmPassword.value.length <= 0) {
                        errorInput(confirmPassword);
                        (confirmPassword.nextElementSibling as HTMLElement).textContent = 'confirm password can\'t be null';
                    } else if (confirmPassword.value !== password.value) {
                        errorInput(confirmPassword);
                        (confirmPassword.nextElementSibling as HTMLElement).textContent = 'confirm password must be the same as password';
                    } else {
                        normalInput(confirmPassword);
                        (confirmPassword.nextElementSibling as HTMLElement).textContent = '';
                        isValid = true;
                    }
                }

            })

        })
    }

    information = () => {
        this.loadTitle('User\'s Information');
        this.loadCss('information');
        this.loadViewAccount('information', () => {
            if (!JSON.parse(localStorage.getItem('user') as string)) {
                notification('You have to sign to web to see your account information', () => {
                    window.location.href = '/'
                });
                setTimeout(() => {
                    window.location.href = '/'
                }, 2000)
            }
            const user: User = JSON.parse(localStorage.getItem('user') as string);
            ($('.container .content .main-content div.flex div.name span') as HTMLElement).textContent = user.name;
            ($('.container .content .main-content div.flex div.email span') as HTMLElement).textContent = user.email;
            ($('.container .content .main-content div.flex div.address span') as HTMLElement).textContent = user.address;
            ($('.container .content .main-content div.flex div.phone span') as HTMLElement).textContent = user.phone;
            if (user.image) ($('.container .content .main-content .avatar img') as HTMLImageElement).src = `${API.endPoint}images/uploads/${user.image}`;
            ($('.container .content .main-content .logout') as HTMLElement).addEventListener('click', () => {
                confirm('logout', '1');
            });
            ($('.container .content .main-content .update') as HTMLElement).addEventListener('click', async () => {
                await form('editUsers/user', JSON.parse(localStorage.getItem('user') as string)._id);
            })
        })
    }

    forget_password = () => {
        this.loadTitle('Forget Password');
        this.loadCss('forget');
        this.loadViewAccount('forget', () => {
            const form = $('.formSignIn') as HTMLFormElement;
            const email = form.querySelector('#SignInEmail') as HTMLInputElement;
            const errorSpan = form.querySelector('.container .content .formSignIn span.message_error') as HTMLElement;
            email.onblur = () => {
                if (email.value.length <= 0) {
                    errorInput(email);
                    errorSpan.textContent = 'Please enter your email address !';
                } else if (!(emailRegex.test(email.value))) {
                    errorInput(email);
                    errorSpan.textContent = 'Email must be in correct format!';
                }
            }
            email.onfocus = () => {
                normalInput(email);
                errorSpan.textContent = '';
            }
            let check = false;
            let usersModel = this.loadModel('users') as usersModel;
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (check) {
                    let user = await usersModel.checkEmailOnSystem(email.value.trim());
                    if (user.length > 0) {
                        [user] = user;
                        localStorage.setItem('emailReset', JSON.stringify(user.email));
                        await usersModel.resetPassword(user._id, user.role, user.email);
                        notification('We are sending an email to your inbox with link to reset password', () => {
                            window.location.href = '/account/send_email'
                        })
                        window.location.href = '/account/send_email'
                    } else {
                        errorInput(email);
                        errorSpan.textContent = 'Your email does not exist on the system';
                    }
                } else {
                    if (email.value.length <= 0) {
                        errorInput(email);
                        errorSpan.textContent = 'Please enter your email address !';
                        check = false;
                    } else if (!(emailRegex.test(email.value))) {
                        errorInput(email);
                        errorSpan.textContent = 'Email must be in correct format!';
                        check = false;
                    } else {
                        normalInput(email);
                        errorSpan.textContent = '';
                        check = true;
                    }
                    // if(check) form.submit();
                }

            })
        })
    }

    send_email = () => {
        this.loadTitle('Send Email successfully');
        this.loadCss('send_email');
        let usersModel = this.loadModel('users') as usersModel;
        this.loadViewAccount('send_email', () => {
            ($('.container .content .main-content div.question a') as HTMLElement).addEventListener('click', async (e) => {
                e.preventDefault();
                let email = JSON.parse(localStorage.getItem('emailReset') as string);
                let user = await usersModel.checkEmailOnSystem(email);
                [user] = user;
                await usersModel.resetPassword(user._id, user.role, user.email);
                console.log('retry');
            })
        })
    }

    reset_pass() {
        this.loadTitle('Reset your password');
        this.loadCss('reset_pass');
        const usersModel = this.loadModel('users') as usersModel;
        this.loadViewAccount('reset_pass', () => {
            let urlParams = new URLSearchParams(window.location.search);
            let token = urlParams.get('token');
            if (!token) {
                notification('you don\'t have a token to reset your password', () => {
                    window.location.href = 'account/forget_password'
                });
            } else {
                const form = document.querySelector('.formSignIn') as HTMLFormElement;
                const password = form.querySelector('#password') as HTMLInputElement;
                const confirm_password = form.querySelector('#confirm_password') as HTMLInputElement;
                let check = false;

                password.onblur = () => {
                    if (password.value.length <= 0) {
                        errorInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = 'password reset can\'t null';
                    } else if (password.value.length < 7) {
                        errorInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = 'password reset must be at least 6 characters';
                    } else if (checkNumber.test(password.value)) {
                        errorInput(password);
                        (password.nextElementSibling as HTMLElement).textContent = 'password reset can\'t a number';
                    }
                }

                password.onfocus = () => {
                    normalInput(password);
                    (password.nextElementSibling as HTMLElement).textContent = '';
                }

                confirm_password.onblur = () => {
                    if (confirm_password.value.length <= 0) {
                        errorInput(confirm_password);
                        (confirm_password.nextElementSibling as HTMLElement).textContent = 'confirm password can\'t null';
                    } else if (confirm_password.value !== password.value) {
                        errorInput(confirm_password);
                        (confirm_password.nextElementSibling as HTMLElement).textContent = 'confirm password must be the same as password';
                    }
                }

                confirm_password.onfocus = () => {
                    normalInput(confirm_password);
                    (confirm_password.nextElementSibling as HTMLElement).textContent = '';
                }

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    if (check) {
                        let result = await usersModel.updatePassword(token as string, password.value);
                        if (result._id) {
                            notification('update your password successfully', () => {
                                window.location.href = '/account/sin_in';
                            })
                        } else {
                            notification('there was an error when updating your password', () => {
                                ($('#notification') as HTMLElement).remove();
                            })
                        }
                    } else {
                        if (password.value.length <= 0) {
                            errorInput(password);
                            (password.nextElementSibling as HTMLElement).textContent = 'password reset can\'t null';
                            check = false;
                        } else if (password.value.length < 7) {
                            errorInput(password);
                            (password.nextElementSibling as HTMLElement).textContent = 'password reset must be at least 6 characters';
                            check = false;
                        } else if (checkNumber.test(password.value)) {
                            errorInput(password);
                            (password.nextElementSibling as HTMLElement).textContent = 'password reset can\'t a number';
                            check = false;
                        } else {
                            normalInput(password);
                            (password.nextElementSibling as HTMLElement).textContent = '';
                            check = true;
                        }
                        if (confirm_password.value.length <= 0) {
                            errorInput(confirm_password);
                            (confirm_password.nextElementSibling as HTMLElement).textContent = 'confirm password can\'t null';
                            check = false;
                        } else if (confirm_password.value !== password.value) {
                            errorInput(confirm_password);
                            (confirm_password.nextElementSibling as HTMLElement).textContent = 'confirm password must be the same as password';
                            check = false;
                        } else {
                            normalInput(confirm_password);
                            (confirm_password.nextElementSibling as HTMLElement).textContent = '';
                            check = true;
                        }
                    }
                })
            }
        })
    }

}
