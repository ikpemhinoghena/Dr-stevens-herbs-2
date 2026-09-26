// Small, consistent line icons. Decorative icons always accompany accessible labels.
const paths={
 bag:'<path d="M6 7h12l2 14H4L6 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
 leaf:'<path d="M20 4c0 10-4 16-10 16a6 6 0 0 1-6-6C4 8 10 4 20 4Z"/><path d="m4 20 11-11"/>',
 chat:'<path d="M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 21l1.8-5A9 9 0 1 1 21 11Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
 truck:'<path d="M3 5h11v12H3zM14 9h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
 shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 minus:'<path d="M5 12h14"/>',
 trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
 phone:'<path d="m5 3 4 4-2 3a15 15 0 0 0 7 7l3-2 4 4-2 3C9 22 2 15 2 5l3-2Z"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 heart:'<path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-5 5 3 11 8 15 5-4 13-10 8-15Z"/>',
 user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 clipboard:'<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 3h6v4H9zM9 12h6M9 16h4"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
 youtube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>',
 facebook:'<path d="M14 21v-9h3l1-4h-4V6c0-1 1-2 2-2h2V1h-3c-3 0-5 2-5 5v2H7v4h3v9"/>',
 music:'<path d="M14 3v12a4 4 0 1 1-4-4M14 3c0 4 3 6 6 6"/>'
};
export const icon=(name,cls='')=>`<svg class="icon ${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.leaf}</svg>`;
export const photo=(cls='',alt='Conceptual still life of fresh leaves, dried botanicals and earthenware')=>`<img class="botanical-photo ${cls}" src="/assets/botanical-story.png" alt="${alt}" width="1536" height="1024" loading="lazy">`;
export const progress=active=>`<ol class="checkout-progress" aria-label="Order steps">${[['bag','Your bag','/cart/'],['user','Your details','/checkout/'],['clipboard','Review & send',null]].map(([i,t,url],n)=>`<li ${n===active?'aria-current="step" class="current"':n<active?'class="complete"':''}>${n<active?icon('check'):icon(i)}${url&&n<active?`<a href="${url}">${t}</a>`:`<span>${t}</span>`}</li>`).join('')}</ol>`;
