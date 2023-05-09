const curBtn = $('.btn-cur')[0];
const nextBtn = $('.btn-next')[0];
const prevBtn = $('.btn-prev')[0];
const preview = $('.preview')[0];

function chunk(array, size, guard) {
  if (guard ? isIterateeCall(array, size, guard) : size === undefined) {
    size = 1;
  } else {
    size = Math.max(Number(size), 0);
  }
  var length = array == null ? 0 : array.length;

  if (!length || size < 1) {
    return [];
  }
  var index = 0,
    resIndex = 0,
    result = Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}

let pizzas_chunk = chunk(pizzas, 20);
let maxPages = pizzas_chunk.length - 1;
let pageNumber = 0;

function addListners(btn) {
  btn.on('click', async e => {
    let data = e.target.closest('button').dataset._id;
    jQuery.ajax('http://localhost:3000/cart', {
      method: 'POST',
      data: { _id: data },
    });
  });
}

function renderList(pageNumber) {
  preview.innerHTML = '';
  pizzas_chunk[pageNumber].forEach(pizza => {
    let html = `
            <div class="col">
              <div class="card text-bg-dark h-100 ">
                <img src="${pizza.img}" class="card-img-top mx-auto my-2 img-fluid preview_img img-thumbnail" alt="...">
                <div class="card-body">
                  <h4 class="card-title m-2">
                  ${pizza.name}
                  </h4>
                  <h5 class="card-text m-2 d-inline">
                    ${pizza.restaurent}
                  </h5>
                  <button type="button" data-_id=${pizza._id} class="btn addto-cart float-end d-inline btn-secondary btn-circle btn-circle-sm m-2">
                    <i class="fa-solid fa-cart-shopping text-light fa-lg"></i>
                  </button>
                  <h6 class="card-text m-2">
                    Rs.${pizza.price}
                  </h6>
                </div>
              </div>
            </div>
  `;
    preview.insertAdjacentHTML('afterbegin', html);
  });
  let btn = $('.addto-cart');
  addListners(btn);
}

if (pageNumber == 0) {
  prevBtn.setAttribute('disabled', 'true');
  renderList(0);
}

function pagination(e) {
  let classList = e.target.classList;
  if (classList.contains('btn-next') && pageNumber < maxPages) {
    pageNumber++;
    if (pageNumber == maxPages) {
      nextBtn.setAttribute('disabled', 'true');
    }
    prevBtn.removeAttribute('disabled');
    renderList(pageNumber);
    curBtn.textContent = pageNumber + 1;
  } else if (classList.contains('btn-prev') && pageNumber > 0) {
    pageNumber--;
    if (pageNumber == 0) {
      prevBtn.setAttribute('disabled', 'true');
    }
    nextBtn.removeAttribute('disabled');
    renderList(pageNumber);
    curBtn.textContent = pageNumber + 1;
  }
}

$('.pagination-btn').on('click', e => pagination(e));
