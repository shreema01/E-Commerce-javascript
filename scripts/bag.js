const CONVENIENCE_FEES = 99;
let bagItemObjects;
onLoad();

function onLoad() {
  loadBagItemObjects();
  displayBagItems();
  displayBagSummary();
}

function displayBagSummary() {
  let bagSummaryElement = document.querySelector('.bag-summary');
  let totalItem = bagItemObjects.length;
  let totalMRP = 0;
  let totalDiscount = 0;
  bagItemObjects.forEach(bagItem => {
    totalMRP += bagItem.original_price * bagItem.quantity;
    totalDiscount += (bagItem.original_price - bagItem.current_price) * bagItem.quantity;
  });
  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;
  bagSummaryElement.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItem} Items) </div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">₹${totalMRP}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value priceDetail-base-discount">-₹${totalDiscount}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">₹99</span>
      </div>
      <hr>
      <div class="price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">₹${finalPayment}</span>
      </div>
    </div>
  `;
}

function loadBagItemObjects() {
  console.log(bagItems);
  bagItemObjects = bagItems.map(itemId => {
    for (let i = 0; i < items.length; i++) {
      if (itemId == items[i].id) {
        // Adding the initial quantity of 1 for each item
        items[i].quantity = 1;
        return items[i];
      }
    }
  });
  console.log(bagItemObjects);
}

function displayBagItems() {
  let containerElement = document.querySelector('.bag-items-container');
  let innerHTML = '';
  bagItemObjects.forEach(bagItem => {
    innerHTML += generateItemHTML(bagItem);
  });
  containerElement.innerHTML = innerHTML;
}

function removeFromBag(itemId) {
  bagItems = bagItems.filter(bagItemId => bagItemId != itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  loadBagItemObjects();
  displayBagIcon();
  displayBagItems();
  displayBagSummary();
}

function generateItemHTML(item) {
  return `<div class="bag-item-container">
    <div class="item-left-part">
      <img class="bag-item-img" src="../${item.image}">
    </div>
    <div class="item-right-part">
      <div class="company">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price-container">
        <span class="current-price">Rs ${item.current_price * item.quantity}</span>
        <span class="original-price">Rs ${item.original_price * item.quantity}</span>
        <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
      </div>
      <div class="return-period">
        <span class="return-period-days"> Return available till: ${item.return_period} days </span>
      </div>
      <div class="delivery-details">
        Delivery by
        <span class="delivery-details-days">${item.delivery_date}</span>
      </div>
    <div class="quantity-section">
  <label for="quantity" class="quantity-label">Quantity:</label>
  <div class="quantity-controls">
    <button id="decrease-${item.id}" class="quantity-btn decrease-btn">-</button>
    <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1" class="quantity-input">
    <button id="increase-${item.id}" class="quantity-btn increase-btn">+</button>
  </div>
</div>
    </div>
    <div class="remove-from-cart" onclick="removeFromBag(${item.id})">
      <i class="fa-solid fa-xmark"></i>
    </div>
  </div>`;
}
// Event listeners for quantity change buttons
bagItemObjects.forEach(item => {
  const quantityInput = document.getElementById(`quantity-${item.id}`);
  const decreaseButton = document.getElementById(`decrease-${item.id}`);
  const increaseButton = document.getElementById(`increase-${item.id}`);

  decreaseButton.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
      item.quantity = currentValue - 1;
      displayBagSummary();
    }
  });

  increaseButton.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
    item.quantity = currentValue + 1;
    displayBagSummary();
  });
});
