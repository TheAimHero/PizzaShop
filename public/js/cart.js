const list = $('.list-group')[0];
const url = 'http://localhost:3000';
let totalItems = 0;
let totalPrice = 0;

function addListeners() {
  const btnItems = $('.btn-items');
  btnItems.on('click', e => {
    let target = e.target;
    let targetParent = e.target.closest('.cart-item');
    let curItem = targetParent.querySelector('.btn-cur');
    let itemAmt = Number(curItem.textContent);
    let itemPrice = Number(
      targetParent.querySelector('.item-price').textContent
    );
    if (target.classList.contains('btn-add')) {
      curItem.textContent = itemAmt + 1;
      itemAmt++;
      targetParent.querySelector('.btn-sub').removeAttribute('disabled');
      updateCart(targetParent.dataset._id, itemAmt);
      updateItem(targetParent, itemAmt, itemPrice);
    } else if (target.classList.contains('btn-sub') && itemAmt > 1) {
      curItem.textContent = itemAmt - 1;
      itemAmt--;
      //prettier-ignore
      if (itemAmt == 1) targetParent.querySelector('.btn-sub').setAttribute('disabled', 'true');
      updateCart(targetParent.dataset._id, itemAmt);
      updateItem(targetParent, itemAmt, itemPrice);
    } else if (target.classList.contains('btn-del')) {
      updateCart(targetParent.dataset._id, 0);
      targetParent.remove();
    }
  });
}

function updateItem(target, quantity, price) {
  target.querySelector('.total-price').textContent = ` = Rs. ${
    price * quantity
  }`;
  target.querySelector('.item-quantity').textContent = quantity;
}

async function updateCart(id, quantity) {
  let { totalItems, totalPrice } = await jQuery.ajax(url + '/cart', {
    method: 'PUT',
    data: { _id: id, quantity: quantity },
  });
  let cartInfo = $('.cart-info')[0];
  cartInfo.outerHTML = '';
  list.insertAdjacentHTML(
    'afterend',
    `<div class="col-lg-4 text-center mt-3 fs-3 cart-info">
      <div>Total Items : ${totalItems}</div>
      <div>Rs. ${totalPrice}</div>
    </div>`
  );
}

function renderCart() {
  list.innerHTML = '';
  cartItems.forEach(ele => {
    totalPrice += ele.pizza.price * ele.quantity;
    totalItems += ele.quantity;
    //prettier-ignore
    let html = `
      <div class="list-group-item cart-item list-group-item-action list-group-item-dark" data-_id='${ ele._id }'>
        <div class="row me-auto">
          <div class="col-md-4">
            <img src="${
              ele.pizza.img
            }" class="img-fluid rounded-2 m-2 preview_img" alt="...">
          </div>
          <div class="col-md-5">
            <div class="card-body">
              <h4 class="card-title">${ele.pizza.name}</h5>
              <p class="card-text"><small class="text-body-secondary">${
                ele.pizza.restaurent
              }</small></p>
              <div class="d-flex justify-content-center">
                <button type="button" class="btn bg-dark btn-items btn-del float-end btn-secondary btn-circle btn-circle-sm m-2">
                <i class="fa-solid fa-trash-can text-center text-light btn-del fa-lg"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-body">
              <div>
              <h4 class="card-text d-inline item-quantity mt-4 m-3">${ele.quantity}</h4> * 
              <h4 class="card-text item-price d-inline m-3">${ele.pizza.price}</h4>  
              </div>
              <h4 class="card-text total-price m-3"> = Rs. ${
                ele.pizza.price * ele.quantity
              }</h4>
              <div class="btn-group pagination-btn w-25 " role="group"
                aria-label="Basic example">
                <button type="button" class="btn btn-items ms-3 btn-sub btn-dark" ${
                  ele.quantity > 1 ? '' : 'disabled'
                }>-</button>
                <button type="button" class="btn btn-items btn-cur btn-dark">
                  ${ele.quantity}
                </button>
                <button type="button" class="btn me-3 btn-items btn-add btn-dark">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
`;
    list.insertAdjacentHTML('afterbegin', html);
  });
  addListeners();
  list.insertAdjacentHTML(
    'afterend',
    `<div class="col-lg-4 mt-3 fs-3 text-center cart-info">
      <div>Total Items : ${totalItems}</div>
      <div>Rs. ${totalPrice}</div>
    </div>`
  );
}

renderCart();
