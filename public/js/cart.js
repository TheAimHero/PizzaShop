const list = $('.list-group')[0];
const url = 'http://localhost:3000';
let totalItems = 0;
let totalPrice = 0;

function addListeners() {
  const btnItems = $('.btn-items');
  btnItems.on('click', e => {
    let target = e.target;
    console.log(e.target);
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
      updateQuantity(targetParent.dataset._id, itemAmt);
      updateCart(targetParent, itemAmt, itemPrice);
      console.log('Incrementing item count', itemAmt);
    } else if (target.classList.contains('btn-sub') && itemAmt > 1) {
      curItem.textContent = itemAmt - 1;
      itemAmt--;
      //prettier-ignore
      if (itemAmt == 1) targetParent.querySelector('.btn-sub').setAttribute('disabled', 'true');
      updateQuantity(targetParent.dataset._id, itemAmt);
      updateCart(targetParent, itemAmt, itemPrice);
      console.log('Decrementing item count', itemAmt);
    }
  });
}

function updateCart(target, quantity, price) {
  target.querySelector('.total-price').textContent = ` = Rs. ${
    price * quantity
  }`;
  target.querySelector('.item-quantity').textContent = quantity;
}

async function updateQuantity(id, quantity) {
  let { totalItems, totalPrice } = await jQuery.ajax(url + '/updatecart', {
    data: { _id: id, quantity: quantity },
  });
  let cartInfo = $('.cart-info')[0];
  cartInfo.innerHTML = '';
  list.insertAdjacentHTML(
    'afterend',
    `<div class="col-lg-4 text-center mt-3 fs-3 cart-info">
      <div>Total Items : ${totalItems}</div>
      <div>Rs. ${totalPrice}</div>
    </div>`
  );
  cartInfo.innerHTML = html;
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
