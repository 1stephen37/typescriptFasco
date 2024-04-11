import {
    handelAddDelivery,
    handleAddUser,
    handleAddVoucher,
    handleDetailOrder,
    handleEditUser,
    handleEditValueUsers,
    handleEditValueUsers_user,
    handleEditVoucher,
    handlePreview,
    handleValueVoucher
} from "./handleCRUD.ts";
import {$} from "../constants/main.ts";
import {validateUser, validateUserEdit, validateVoucher, validateVoucherEdit} from "./handleValidation.ts";

// const form = async (type : string, data : any = null, id : any = null)
const form = async (type: string, id: any = null) => {
    let isRunning: boolean = false;
    switch (type) {
        // case 'addProducts': {
        //     isRunning = true;
        //     document.querySelector('body').insertAdjacentHTML('beforeend', `
        //         <div id="formEditBackground">
        //           <div class="main_form" id="formAddProduct">
        //             <div>
        //               <label class="form-label" for="addIdUsers">ID Users</label>
        //               <input type="text" id="addIdProduct" value="1" disabled>
        //             </div>
        //             <div>
        //               <label class="form-label">Product's Name</label>
        //               <input type="text" id="addProductName" class="form-control">
        //               <span class="message"></span>
        //             </div>
        //             <div>
        //               <label class="form-label">Categories</label>
        //               <select id="addProductCategories">
        //
        //               </select>
        //             </div>
        //             <div>
        //               <label class="form-label">Designer</label>
        //               <input type="text" id="addProductDesigner" class="form-control">
        //             </div>
        //             <div>
        //               <label class="form-label">Color 1</label>
        //               <input type="text" id="addProductColor1" class="form-control">
        //             </div>
        //              <div>
        //               <label class="form-label">Color 2</label>
        //               <input type="text" id="addProductColor2" class="form-control">
        //             </div>
        //            <div>
        //               <label class="form-label">Price</label>
        //               <input type="number" id="addProductPrice" class="form-control">
        //            </div>
        //            <div>
        //               <label class="form-label">Quantity</label>
        //               <input type="number" id="addProductQuantity" class="form-control">
        //            </div>
        //            <div>
        //               <label class="form-label">Review</label>
        //               <input type="number" id="addProductReview" class="form-control">
        //            </div>
        //             <div>
        //               <label class="form-label">Image</label>
        //               <input type="file" id="addImageUsers">
        //             </div>
        //             <button id="addSubmit" class="submit">Submit</button>
        //           </div>
        //         </div>
        //     `);
        //     if(data !== null) handleIdProduct(data);
        //     $('#addSubmit').addEventListener('click', () => handleAddProduct());
        //     break;
        // }
        case 'detailOrder': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="formEditBackground">
                  <div class="main_form" id="formAddVoucher" enctype="multipart/form-data">
                       <section class="table">
                           <h1 class="heading">Order Detail</h1>
                           <div class="thead grid">
                            <h2>ID</h2>
                            <h2>Name</h2>
                            <h2>Image</h2>
                            <h2>Price</h2>
                            <h2>Quantity</h2>
                            <h2>total</h2>
                           </div>
                           <section class="tbody grid"></section>
                       </section>
                  </div>
                </div>
            `);
            if(id) await handleDetailOrder(id);
            ($('#formEditBackground .main_form') as HTMLElement).addEventListener('submit', async (e: SubmitEvent) => {
                e.preventDefault();
            })
            break;
        }
        case 'addVoucher': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="formEditBackground">
                  <form class="main_form" id="formAddVoucher" enctype="multipart/form-data">
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">Code</label>
                          <input type="text" id="addCodeVouchers" class="form-control">
                          <span class="message"></span>
                        </div>
                        <div class="line"></div>
                        <div>
                          <label class="form-label">Discount</label>
                          <input type="text" id="addDiscountVouchers" class="form-control">
                          <span class="message"></span>
                        </div>
                    </section>
                    <section class="flex id_name">
                         <div>
                          <label class="form-label">Min amount</label>
                          <input type="text" id="addMinAmountVouchers" class="form-control">
                          <span class="message"></span>
                         </div>
                         <div class="line"></div>
                         <div>
                            <label class="form-label">Date end</label>
                            <input type="date" id="addDateEndVouchers" class="form-control">
                            <span class="message"></span>
                         </div>
                    </section>
                    <section class="flex id_name">
                         <div>
                              <label class="form-label">Expired</label>
                              <select name="addRole" id="addExpiredVouchers">
                                <option value="false">False</option>
                                <option value="true">True</option>
                              </select>
                         </div>
                    </section>
                    <button id="addSubmit" type="submit" class="submit">Submit</button>
                  </form>
                </div>
            `);
            validateVoucher();
            ($('#formEditBackground .main_form') as HTMLElement).addEventListener('submit', async (e: SubmitEvent) => {
                e.preventDefault();
                await handleAddVoucher();
            })
            break;
        }
        case 'editVoucher': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="formEditBackground">
                  <form class="main_form" id="formEditVoucher" enctype="multipart/form-data">
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">ID</label>
                          <input disabled type="text" id="editIDVouchers" class="form-control">
                          <span class="message"></span>
                        </div>
                        <div class="line"></div>
                        <div>
                          <label class="form-label">Code</label>
                          <input type="text" id="editCodeVouchers" class="form-control">
                          <span class="message"></span>
                        </div>
                    </section>
                    <section class="flex id_name">
                         <div>
                          <label class="form-label">Discount</label>
                          <input type="number" id="editDiscountVouchers" class="form-control">
                          <span class="message"></span>
                         </div>
                         <div class="line"></div>
                         <div>
                          <label class="form-label">Min amount</label>
                          <input type="number" id="editMinAmountVouchers" class="form-control">
                          <span class="message"></span>
                         </div>
                    </section>
                    <section class="flex id_name">
                        <div>
                            <label class="form-label">Date end</label>
                            <input type="date" id="editDateEndVouchers" class="form-control">
                            <span class="message"></span>
                         </div>
                         <div class="line"></div>
                         <div>
                              <label class="form-label">Expired</label>
                              <select name="editRole" id="editExpiredVouchers">
                                <option value="false">False</option>
                                <option value="true">True</option>
                              </select>
                         </div>
                    </section>
                    <button id="editSubmit" type="submit" class="submit">Submit</button>
                  </form>
                </div>
            `);
            handleValueVoucher(id);
            validateVoucherEdit();
            ($('#formEditBackground .main_form') as HTMLElement).addEventListener('submit', async (e: SubmitEvent) => {
                e.preventDefault();
                await handleEditVoucher(id);
            })
            break;
        }
        case 'addUsers': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="formEditBackground">
                  <form class="main_form" id="formAdd" enctype="multipart/form-data">
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">Users's Name</label>
                          <input type="text" id="addNameUsers" class="form-control">
                          <span class="message"></span>
                        </div>
                        <div class="line"></div>
                        <div>
                          <label class="form-label">Email</label>
                          <input type="text" id="addEmailUsers" class="form-control">
                          <span class="message"></span>
                        </div>
                    </section>
                    <section class="flex id_name">
                         <div>
                          <label class="form-label">Password</label>
                          <input type="text" id="addPasswordUsers" class="form-control">
                          <span class="message"></span>
                         </div>
                         <div class="line"></div>
                         <div>
                            <label class="form-label">Address</label>
                            <input type="text" id="addAddressUsers" class="form-control">
                            <span class="message"></span>
                         </div>
                    </section>
                    <section class="flex id_name">
                         <div>
                              <label class="form-label">Name Jobs</label>
                              <select name="addRole" id="addRoleUsers">
                                <option value="0">User</option>
                                <option value="1">Admin</option>
                              </select>
                         </div>
                         <div class="line"></div>
                        <div>
                            <label class="form-label" for="addPhoneUsers">Phone Number</label>
                            <input type="number" id="addPhoneUsers" class="form-control">
                            <span class="message"></span>
                        </div>
                    </section>
                    <div>
                      <label class="form-label">Image</label>
                      <input type="file" id="addImageUsers">
                    </div>
                    <div>
                        <img id="preview" src="" alt="">
                    </div>
                    <button id="addSubmit" type="submit" class="submit">Submit</button>
                  </form>
                </div>
            `);
            validateUser();
            await handlePreview();
            ($('#formEditBackground .main_form') as HTMLElement).addEventListener('submit', async (e: SubmitEvent) => {
                e.preventDefault();
                await handleAddUser();
            })
            break;
        }
        case 'editUsers': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="formEditBackground">
                  <form class="main_form" id="formEditUser">
                    <section class="flex id_name">
                        <div>
                          <label class="form-label" for="addIdUsers">ID Users</label>
                          <input type="text" id="editIdUsers" value="1" disabled>
                        </div>
                        <div class="line"></div>
                        <div>
                          <label class="form-label">Users's Name</label>
                          <input type="text" id="editNameUsers" class="form-control">
                          <span class="message"></span>
                        </div>
                    </section>
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">Email</label>
                          <input type="text" id="editEmailUsers" class="form-control">
                          <span class="message"></span>
                        </div>
                        <div class="line"></div>
                         <div>
                            <label class="form-label">Address</label>
                            <input type="text" id="editAddressUsers" class="form-control">
                            <span class="message"></span>
                         </div>
                    </section>
                    <section class="flex id_name">
                         <div>
                              <label class="form-label">Name Jobs</label>
                              <select name="editRole" id="editRoleUsers">
                                <option value="0">User</option>
                                <option value="1">Admin</option>
                              </select>
                         </div>
                         <div class="line"></div>
                        <div>
                            <label class="form-label" for="editPhoneUsers">Phone Number</label>
                            <input type="text" id="editPhoneUsers" class="form-control">
                            <span class="message"></span>
                        </div>
                    </section>
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">Image</label>
                          <input type="file" id="editImageUsers">
                        </div>
                        <div class="line"></div>
                    </section>
                    <div>
                        <img id="editPreview" src="" alt="">
                    </div>
                    
                    <button id="editSubmit" type="submit" class="submit">Submit</button>
                  </form>
                </div>
            `);
            if (id) {
                validateUserEdit();
                handleEditValueUsers(id);
                ($('#formEditUser') as HTMLFormElement).addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await handleEditUser(id);
                })
            }
            break;
        }
        case 'editUsers/user': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="formEditBackground">
                  <form class="main_form" id="formEdit">
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">Users's Name</label>
                          <input type="text" id="editNameUsers" class="form-control">
                          <span class="message"></span>
                        </div>
                        <div class="line"></div>
                        <div>
                          <label class="form-label">Email</label>
                          <input type="text" id="editEmailUsers" class="form-control">
                        </div>
                    </section>
                    <section class="flex id_name">
                       <div>
                            <label class="form-label" for="editPhoneUsers">Phone Number</label>
                            <input type="text" id="editPhoneUsers" class="form-control">
                        </div>
                        <div class="line"></div>
                         <div>
                            <label class="form-label">Address</label>
                            <input type="text" id="editAddressUsers" class="form-control">
                         </div>
                    </section>
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">Image</label>
                          <input type="file" id="editImageUsers">
                        </div>
                    </section>
                    <div>
                        <img id="editPreview" src="" alt="">
                    </div>
                    <button id="editSubmit" type="submit" class="submit">Submit</button>
                  </form>
                </div>
            `);
            if (id) {
                await handleEditValueUsers_user(id);
            }
            break;
        }
        case 'addDelivery': {
            isRunning = true;
            (document.querySelector('body') as HTMLElement).insertAdjacentHTML('beforeend', `
                <div id="formEditBackground">
                  <form class="main_form" id="formAddDelivery" enctype="multipart/form-data">
                    <section class="flex id_name">
                        <div>
                          <label class="form-label">Name</label>
                          <input type="text" id="addNameDelivery" class="form-control">
                          <span class="message"></span>
                        </div>
                        <div class="line"></div>
                        <div>
                          <label class="form-label">Speed</label>
                          <select id="addSpeedDelivery">
                                <option value="slow">slow</option>
                                <option value="medium">medium</option>
                                <option value="fast">fast</option>
                          </select>
                        </div>
                    </section>
                    <section class="flex id_name">
                         <div>
                          <label class="form-label">Price</label>
                          <input type="number" step="0.01" id="addPriceDelivery" class="form-control">
                         </div>
                         <div class="line"></div>
                         <div>
                            <label class="form-label">Status</label>
                             <select id="addStatusDelivery">
                                <option value="1">active</option>
                                <option value="0">suspended</option>
                             </select>
                         </div>
                    </section>
                    <button id="addSubmit" type="submit" class="submit">Submit</button>
                  </form>
                </div>
            `);
            ($('#formEditBackground .main_form') as HTMLElement).addEventListener('submit', async (e: SubmitEvent) => {
                e.preventDefault();
                await handelAddDelivery();
                // ($('#formEditBackground') as HTMLElement).remove();
                // notification('Add Voucher successfully !', () => {
                //     ($('#notification') as HTMLElement).remove();
                // });
            })
            break;
        }
        default: {
            break;
        }
    }
    if (isRunning) {
        const background = document.getElementById('formEditBackground') as HTMLElement;
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

export default form;
