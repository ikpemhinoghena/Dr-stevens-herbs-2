/* Cart and checkout share the catalogue and bag state loaded by app.js. */
const commerceIcons={bag:'<path d="M6 7h12l2 14H4L6 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',check:'<path d="m5 12 4 4L19 6"/>'};
const commerceIcon=name=>`<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${commerceIcons[name]||commerceIcons.bag}</svg>`;
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let checkoutMessage='';let checkoutReady=false;
function bagEntries(){return Object.entries(bag).map(([id,quantity])=>({product:catalogue.find(p=>p.id===id),quantity})).filter(x=>x.product)}
function preserveCartFocus(action){const focused=document.activeElement?.id;action();if(focused)document.getElementById(focused)?.focus()}
window.renderShoppingBag=function(){
 const entries=bagEntries(),units=entries.reduce((n,x)=>n+x.quantity,0),target=$('#cart-items');
 if(target){
  $('#cart-lines').textContent=entries.length;$('#cart-units').textContent=units;$('#cart-item-count').textContent=`${units} item${units===1?'':'s'}`;
  const checkoutLink=$('#go-checkout');checkoutLink.setAttribute('aria-disabled',String(!units));checkoutLink.href=units?'/checkout/':'/shop/';checkoutLink.textContent=units?'Continue to checkout →':'Browse the herbs →';
  target.replaceChildren();
  if(!entries.length){target.innerHTML=`<div class="empty empty-bag">${commerceIcon('bag')}<h2>A little room for curiosity.</h2><p>Your bag is empty. Explore a herb and add the items you would like to discuss.</p><a href="/shop/" class="button">Explore the herb shop</a></div>`;}
  for(const {product:p,quantity} of entries){
   const id=p.id,item=document.createElement('article');item.className='cart-item';
   item.innerHTML=`<a class="cart-thumbnail ${escapeHtml(p.tone)}" href="/herbs/${id}/" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(p.image)}" alt="" width="100" height="120"></a><div class="cart-item-info"><p class="eyebrow">${escapeHtml(p.reference)} / ${escapeHtml(p.type)} · ${escapeHtml(p.category)}</p><h2><a href="/herbs/${id}/">${escapeHtml(p.name)}</a></h2><p>Discuss details & pricing with Dr Stevens</p><div class="cart-controls"><div class="quantity-stepper"><button type="button" id="minus-${id}" data-quantity="minus" aria-label="Decrease quantity of ${escapeHtml(p.name)}" ${quantity===1?'disabled':''}>${commerceIcon('minus')}</button><input id="qty-${id}" type="number" min="1" max="99" value="${quantity}" aria-label="Quantity for ${escapeHtml(p.name)}"><button type="button" id="plus-${id}" data-quantity="plus" aria-label="Increase quantity of ${escapeHtml(p.name)}" ${quantity===99?'disabled':''}>${commerceIcon('plus')}</button></div><button type="button" class="remove-item icon-link" aria-label="Remove ${escapeHtml(p.name)}">${commerceIcon('trash')} Remove</button></div></div>`;
   const update=n=>{if(!Number.isInteger(n)||n<1||n>99){item.querySelector('input').value=quantity;toast('Choose a quantity from 1 to 99.');return}preserveCartFocus(()=>{bag[id]=n;saveBag()})};
   item.querySelector('input').addEventListener('change',e=>update(Number(e.target.value)));
   item.querySelector('[data-quantity=minus]').addEventListener('click',()=>update(quantity-1));
   item.querySelector('[data-quantity=plus]').addEventListener('click',()=>update(quantity+1));
   item.querySelector('.remove-item').addEventListener('click',()=>{delete bag[id];saveBag();toast('Herb removed from your bag.');$('#cart-items input')?.focus()});
   target.append(item);
  }
 }
 renderCheckoutSummary(entries,units);
};
function renderCheckoutSummary(entries=bagEntries(),units=entries.reduce((n,x)=>n+x.quantity,0)){
 if(!$('#checkout-form'))return;
 const hasItems=entries.length>0;
 $('#checkout-empty').hidden=hasItems;$('#checkout-content').hidden=!hasItems;$('#checkout-aside').hidden=!hasItems;$('#checkout-progress').hidden=!hasItems;
 $('#checkout-units').textContent=units;
 $('#checkout-items').innerHTML=entries.map(({product:p,quantity})=>`<article class="checkout-line"><img src="${escapeHtml(p.image)}" width="56" height="64" alt="${escapeHtml(p.imageAlt)}"><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.reference)} / ${escapeHtml(p.type)} · Qty ${quantity}</p><span>Price discussed with Dr Stevens</span></div></article>`).join('');
 if(checkoutReady){showCheckoutForm();toast('Your bag changed. Please review the updated items before sending.');}
}
const detailFields=['customer-name','customer-phone','customer-email','customer-country','customer-state','customer-city','customer-postcode','customer-address','customer-notes'];
function detailsFromForm(){return Object.fromEntries(detailFields.map(id=>[id,$('#'+id).value.trim()]))}
function validateCheckout(){
 const form=$('#checkout-form');for(const id of detailFields){const input=$('#'+id);input.setCustomValidity('');if(input.required&&!input.value.trim())input.setCustomValidity('Please complete this field.');}
 const phone=$('#customer-phone');const digits=phone.value.replace(/\D/g,'');if(phone.value.trim()&&(!/^[+\d\s().-]+$/.test(phone.value)||digits.length<7||digits.length>15))phone.setCustomValidity('Enter a valid phone number, including your country code.');
 return form.reportValidity();
}
function orderText(details,entries){
 const lines=entries.map(({product:p,quantity},i)=>`${i+1}. ${p.name} (${p.reference})\n   Format: ${p.type} | Quantity: ${quantity}\n   Details and price to be discussed with Dr Stevens`);
 return `DR STEVENS HERBS — ORDER ENQUIRY\n\nHello, I would like to enquire about the following items.\n\nMY CART\n${lines.join('\n\n')}\n\nTotal items: ${entries.reduce((n,x)=>n+x.quantity,0)}\nProduct total: To be discussed with Dr Stevens\nDelivery fee: Please quote for my location\nFinal total: To be agreed with Dr Stevens before payment\n\nCONTACT\nName: ${details['customer-name']}\nPhone / WhatsApp: ${details['customer-phone']}${details['customer-email']?'\nEmail: '+details['customer-email']:''}\n\nDELIVERY\nAddress: ${details['customer-address']}\nCity / town: ${details['customer-city']}\nState / region: ${details['customer-state']}\nCountry: ${details['customer-country']}${details['customer-postcode']?'\nPostal code: '+details['customer-postcode']:''}${details['customer-notes']?'\nDelivery notes: '+details['customer-notes']:''}\n\nPlease confirm actual products, ingredients, suitability, stock, final prices, payment arrangements and delivery timing. I would like to discuss the exact herbs and agree the order with Dr Stevens before payment.`;
}
function showCheckoutForm(){
 checkoutReady=false;checkoutMessage='';$('#checkout-form').hidden=false;$('#checkout-review').hidden=true;$('#handoff-note').hidden=true;
 $('#checkout-progress li:nth-child(2)').className='current';$('#checkout-progress li:nth-child(2)').setAttribute('aria-current','step');$('#checkout-progress li:nth-child(3)').className='';$('#checkout-progress li:nth-child(3)').removeAttribute('aria-current');
}
function initCheckout(){
 const form=$('#checkout-form');if(!form)return;
 form.addEventListener('input',e=>{e.target.setCustomValidity?.('')});
 form.addEventListener('submit',e=>{
  e.preventDefault();if(!validateCheckout())return;const entries=bagEntries();if(!entries.length){renderCheckoutSummary();return}
  const d=detailsFromForm();checkoutMessage=orderText(d,entries);checkoutReady=true;
  const address=[d['customer-address'],d['customer-city'],d['customer-state'],d['customer-postcode'],d['customer-country']].filter(Boolean);
  $('#review-details').innerHTML=`<article><p class="eyebrow">CONTACT</p><h3>${escapeHtml(d['customer-name'])}</h3><p>${escapeHtml(d['customer-phone'])}${d['customer-email']?'<br>'+escapeHtml(d['customer-email']):''}</p></article><article><p class="eyebrow">DELIVERY ADDRESS</p><p>${address.map(escapeHtml).join('<br>')}</p>${d['customer-notes']?`<p><strong>Delivery notes:</strong><br>${escapeHtml(d['customer-notes'])}</p>`:''}</article><article class="wide"><p class="eyebrow">YOUR COLLECTIONS</p>${entries.map(({product:p,quantity})=>`<div class="review-product"><span>${escapeHtml(p.name)}<small>${escapeHtml(p.reference)} / ${escapeHtml(p.type)} · Discuss details with Dr Stevens</small></span><strong>× ${quantity}</strong></div>`).join('')}</article>`;
  $('#order-message').textContent=checkoutMessage;$('#checkout-send').href=whatsapp(checkoutMessage);$('#checkout-form').hidden=true;$('#checkout-review').hidden=false;
  $('#checkout-progress li:nth-child(2)').className='complete';$('#checkout-progress li:nth-child(2)').removeAttribute('aria-current');$('#checkout-progress li:nth-child(3)').className='current';$('#checkout-progress li:nth-child(3)').setAttribute('aria-current','step');
  $('#checkout-review').focus();$('#checkout-review').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 });
 $('#edit-checkout').addEventListener('click',()=>{showCheckoutForm();$('#customer-name').focus()});
 $('#checkout-send').addEventListener('click',e=>{if(!checkoutReady||!checkoutMessage){e.preventDefault();toast('Please review your order enquiry first.');return}$('#handoff-note').hidden=false;});
 $('#copy-order').addEventListener('click',async()=>{if(!checkoutReady)return;try{await navigator.clipboard.writeText(checkoutMessage);toast('Order message copied. Paste it into your chat with Dr Stevens.')}catch{$('.message-details').open=true;const selection=getSelection();const range=document.createRange();range.selectNodeContents($('#order-message'));selection.removeAllRanges();selection.addRange(range);$('#order-message').scrollIntoView({block:'center'});toast('Select and copy the message shown below.')}});
}
initCheckout();if(catalogue.length)window.renderShoppingBag();

