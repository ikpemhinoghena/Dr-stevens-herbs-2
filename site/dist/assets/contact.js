/* Shared contact options preserve the message prepared by checkout or consultation. */
(()=>{
const email='orderherbs.steven@gmail.com',phone='+18509960700';
const emailLink=(subject,message)=>'mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);
const dialog=document.createElement('dialog');dialog.className='contact-dialog';dialog.setAttribute('aria-labelledby','contact-title');
dialog.innerHTML='<button type="button" class="contact-close text-button" aria-label="Close contact options">Close ×</button><p class="eyebrow">YOUR CONVERSATION, YOUR CHOICE</p><h2 id="contact-title">How would you like to get in touch?</h2><p>Choose the way that suits you.</p><div class="contact-actions"><a class="button" data-channel="whatsapp" target="_blank" rel="noopener">WhatsApp ↗</a><a class="button" data-channel="call">Call Dr Stevens ↗</a><a class="button" data-channel="email">Email Dr Stevens ↗</a></div><p class="subtle contact-help"></p>';
document.body.append(dialog);let trigger;
// Handle Escape explicitly, including when the popup is embedded in a preview.
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open){e.preventDefault();e.stopPropagation();dialog.close();}},true);
dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>trigger?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('click',e=>{
 const a=e.target.closest('a');if(!a||dialog.contains(a)||a.closest('.story-preview'))return;
 const href=a.getAttribute('href')||'';if(!/^https:\/\/wa.me\//.test(href)&&!href.startsWith('tel:')&&!href.startsWith('mailto:'))return;
 if(e.defaultPrevented)return;e.preventDefault();trigger=a;
 let message='Hello Dr Stevens Herbs, I would like to get in touch.';
 if(href.startsWith('https://wa.me/'))message=new URL(href).searchParams.get('text')||message;
 const order=a.id==='checkout-send';
 dialog.querySelector('[data-channel=whatsapp]').href='https://wa.me/18484487130?text='+encodeURIComponent(message);
 dialog.querySelector('[data-channel=call]').href='tel:'+phone;
 dialog.querySelector('[data-channel=email]').href=emailLink(order?'Order enquiry — Dr Stevens Herbs':'Enquiry — Dr Stevens Herbs',message);
 dialog.querySelector('.contact-help').textContent=order?'WhatsApp and email include your reviewed order details. For a call, keep the order summary open to discuss it. Press Send in your chosen app; opening it does not place an order.':'WhatsApp and email open your chosen app. Review your message and press Send there. Call: +1 (850) 996-0700. Email: '+email+'.';
 dialog.showModal();
});
for(const form of document.querySelectorAll('.story-form')){
 const status=form.querySelector('.story-status'),button=form.querySelector('button[type=submit]'),cancel=form.querySelector('.story-cancel'),panel=form.closest('.story-share'),confirmation=panel.nextElementSibling;let sending=false;
 cancel.addEventListener('click',()=>{panel.open=false;panel.querySelector('summary').focus()});
 panel.addEventListener('toggle',()=>{if(panel.open)confirmation.hidden=true});
 form.addEventListener('input',()=>{if(!sending)status.hidden=true});
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(sending||!form.reportValidity())return;
  for(const name of ['name','description']){const field=form.elements.namedItem(name);if(!field.value.trim()){field.setCustomValidity('Please complete this field.');field.reportValidity();field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});return}}
  if(form.elements.namedItem('botcheck').checked)return;
  const data=Object.fromEntries(new FormData(form));delete data.botcheck;data.source_page=location.origin+location.pathname;
  sending=true;button.disabled=true;cancel.disabled=true;button.textContent='Submitting…';form.setAttribute('aria-busy','true');status.hidden=false;status.textContent='Sending your message…';
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data),signal:controller.signal});
   const result=await response.json();if(!response.ok||result.success!==true)throw new Error('Submission rejected');
   form.reset();status.hidden=true;confirmation.textContent='Thank you. Your message has been submitted to Dr Stevens. Nothing is published automatically.';confirmation.hidden=false;panel.open=false;panel.querySelector('summary').focus();
  }catch{status.textContent='We could not confirm your submission. Your message is still here. Please try again, or contact Dr Stevens if the problem continues.';}
  finally{clearTimeout(timeout);sending=false;button.disabled=false;cancel.disabled=false;button.textContent='Submit';form.removeAttribute('aria-busy');}
 });
}
})();
