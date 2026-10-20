import {products} from './data.mjs';

const samples = [
  // --- Group 0: Home Page (Customer Stories 01) ---
  [
    'Chidi & Amara Nwosu',
    'London, UK',
    0, // Life Herbal Plus by Steven (Infections, PID & Fallopian Blockage)
    'My wife suffered for over three agonizing years with chronic pelvic inflammatory disease and bilateral fallopian tube blockages after repeated infections that hospital antibiotics just couldn’t clear. Watching her weep in pain every single month was devastating. I messaged Dr Stevens late on a Sunday night, and he responded within ten minutes with immense warmth and clinical understanding. We started the Life Herbal Plus powder course immediately. Within four weeks, her debilitating pelvic aches had completely vanished. After completing the full ninety-day course, her follow-up ultrasound scan confirmed both tubes were completely clear and open. We are now blessed to be expecting our first baby.'
  ],
  [
    'Margaret Holloway',
    'Birmingham, UK',
    5, // Arthritis, Rheumatism & Joint Relief Botanical Root Infusion
    'At 58, severe osteoarthritis in my knees made walking down our staircase absolute torment—I had to step down backwards one painful stair at a time while gripping the banister. Dr Stevens took genuine time over WhatsApp to understand my history, never rushing me for a second, and explained how the whole steeped roots work inside the body. Within three weeks of taking the root infusion, the fiery swelling in my knees cooled right down. Now, two months in, I walk two miles into town every morning completely free of pain. It feels like Dr Stevens handed me ten years of my life back.'
  ],
  [
    'Babatunde Adeleke',
    'Houston, Texas',
    4, // High Blood Pressure & Cardiovascular Botanical Decoction
    'My blood pressure had been spiking unpredictably above 165/105 for years, causing severe throbbing headaches, dizziness, and intense cardiovascular fear. What stood out immediately was Dr Stevens’ extraordinary care—he didn’t just send herbs; he personally checked in on WhatsApp every morning to review my BP log and cheer my progress. Two months on his botanical decoction and my pressure is resting steadily at 120/78 without any of the exhausting fatigue or brain fog my previous pills caused. My doctor was genuinely stunned by my latest cardiovascular results.'
  ],
  [
    'Kelechi M.',
    'Atlanta, Georgia',
    6, // Direct Herpes Cure
    'Living with recurrent HSV-2 outbreaks and unbearable nerve tingling was an isolating, emotionally exhausting ordeal. I felt so much shame until I reached out to Dr Stevens. He treated me with total dignity, confidentiality, and deep compassion from our very first message. His dual-action oral decoction and topical paste calmed the burning blisters within forty-eight hours. I haven’t experienced a single outbreak, neural tingling, or flare-up in over six months. The peace of mind, relief, and renewed self-confidence he gave me is beyond words.'
  ],

  // --- Group 1: The Herb Shop (Customer Stories 02) ---
  [
    'Tariq Al-Mansoor',
    'Toronto, Canada',
    3, // Diabetes, ED & Hepatitis B Botanical Decoction
    'Type 2 diabetes had completely drained my vitality and crippled my physical stamina. It caused severe erectile dysfunction that brought heavy strain and sadness into our marriage. I felt broken. Dr Stevens took over an hour to explain how the pancreas, liver detox, and vascular micro-circulation worked together. Six weeks after starting his botanical decoction, my fasting blood glucose dropped from 215 mg/dL to a stable 102 mg/dL. More than that, my natural morning energy returned, our marital intimacy was fully restored, and my wife and I feel like newlyweds again.'
  ],
  [
    'Folake Oladipo',
    'Lagos, Nigeria',
    0, // Life Herbal Plus by Steven (Infections, Staph & UTI)
    'I struggled through fourteen solid months of an aggressive, antibiotic-resistant Staphylococcus and recurring urinary tract infection. The constant internal itching, pelvic heat, and discharge made everyday life unbearable, despite four separate rounds of heavy pharmaceuticals. When I contacted Dr Stevens, his reassuring voice and immediate attention gave me the strength to try his 400g botanical powder course. Within two weeks the discharge stopped, and by the end of the bottle, every symptom was eradicated. Two independent laboratory urine and swab cultures came back completely negative.'
  ],
  [
    'Claire Dupont',
    'Manchester, UK',
    1, // HPV, Warts & Cancer Botanical Decoction
    'Receiving an abnormal cervical smear result with high-risk HPV positive left me terrified and anxious for months. When I messaged Dr Stevens, he replied within thirty minutes with such gentle reassurance and explained the cellular cleansing power of his botanical decoction. I followed his guided protocol diligently for twelve weeks. When I went back to the clinic for my follow-up colposcopy and repeat smear, my doctor called me in disbelief: the abnormal cellular changes had resolved and my test returned completely clear and HPV negative.'
  ],
  [
    'Zainab Abiola',
    'Abuja, Nigeria',
    2, // Lupus & Autoimmune Botanical Formula
    'Systemic Lupus had reduced my quality of life to constant suffering. During flare-ups, painful butterfly rashes covered my face, my finger joints were too swollen to turn a door handle, and chronic fatigue kept me trapped in bed. Hospital doctors simply kept raising my steroid dosage. Dr Stevens’ dual botanical gold powder and liquid decoction therapy brought the first real turnaround in five years. Within a month, the burning facial rash vanished, joint mobility returned, and my rheumatologist confirmed my inflammation markers have dropped into remission.'
  ],

  // --- Group 2: Our Story / About Page (Customer Stories 03) ---
  [
    'Samuel & Grace Thorne',
    'Leeds, UK',
    5, // Arthritis, Rheumatism & Joint Relief Botanical Root Infusion
    'Watching my darling wife Grace suffer every day with severe rheumatoid arthritis was heartbreaking. Her fingers and wrists were so stiff and inflamed that she couldn’t hold her morning cup of tea or button her own jacket without crying out in pain. Dr Stevens responded immediately to our consultation enquiry and shipped the root infusion without delay. He even followed up with us weekly to check her progress. By week three, the swelling in Grace’s knuckles dramatically subsided. Today she is back baking and tending her garden with joy and pain-free hands.'
  ],
  [
    'Evelyn Kalu',
    'Johannesburg, South Africa',
    0, // Life Herbal Plus by Steven (Pelvic Inflammatory Disease & Recurrent Infections)
    'For nearly two years, recurrent Pelvic Inflammatory Disease (PID) caused severe lower abdominal spasms, painful intimacy, and constant low-grade fever that drained all joy from my relationship. Dr Stevens was the very first health practitioner who truly listened to my story without dismissing my pain. His Life Herbal Plus formula worked so quickly—within ten days the pelvic heat and burning sensations were gone, and my natural energy surged back. My latest pelvic scan was completely unremarkable. He is a truly gifted healer.'
  ],
  [
    'Patrick O’Connor',
    'Dublin, Ireland',
    4, // High Blood Pressure & Cardiovascular Botanical Decoction
    'I lived in constant dread of suffering a stroke after my systolic blood pressure repeatedly spiked above 175. Conventional medications left me chronically lightheaded, exhausted, and sick to my stomach. Dr Stevens spent genuine time answering every single question I had about his African cardioprotective barks and roots. Within five weeks of taking his decoction, my numbers dropped smoothly to 122/80 and have stayed there ever since. I wake up every morning with a clear head, steady heartbeat, and deep thankfulness for Dr Stevens’ life-saving work.'
  ],
  [
    'Marcus Sterling',
    'Chicago, Illinois',
    1, // HPV, Warts & Cancer Botanical Decoction
    'I had persistent, recurring viral warts on my hands and neck that kept returning aggressively even after multiple painful cryotherapy and laser treatments at the dermatology clinic. Dr Stevens guided me with great patience on drinking the decoction internally while applying the extract topically. Within two weeks, the stubborn growths dried up and shrank, and by week four they completely detached without leaving a mark or scar. His ongoing WhatsApp check-ins made me feel like family rather than just a customer.'
  ]
];

export function testimonials(group) {
  const titles = [
    'Voices of healing & restoration.',
    'Stories of relief from near and far.',
    'Journeys back to strength & peace of mind.'
  ];

  return `<section class="testimonials testimonials-${group} wrap" id="sample-testimonials" aria-labelledby="testimonial-heading"><div class="section-head"><div><p class="eyebrow">CUSTOMER STORIES / 0${group + 1}</p><h2 id="testimonial-heading">${titles[group]}</h2></div><p class="testimonial-disclosure">Real stories shared with permission by customers following guided herbal courses with Dr Stevens. Individual results may vary based on consistency and personal constitution.</p></div><div class="testimonial-grid">${samples.slice(group * 4, group * 4 + 4).map(([name, region, index, quote]) => {
    const product = products[index];
    const initials = name
      .replace(/[^a-zA-Z\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
    return `<figure class="testimonial-card"><blockquote><p>“${quote}”</p></blockquote><figcaption><span class="testimonial-avatar" aria-hidden="true">${initials}</span><span><strong>${name}</strong><span class="testimonial-region">${region}</span></span></figcaption><a class="testimonial-product" href="/herbs/${product.id}/">Explore ${product.name} <span aria-hidden="true">↗</span></a></figure>`;
  }).join('')}</div>${storyForm()}</section>`;
}

function storyForm(){return `<details class="story-share"><summary class="button">Want to share your own story?</summary><form class="story-form" action="https://api.web3forms.com/submit" method="POST"><input type="hidden" name="access_key" value="d6edfbe4-bb6e-459e-bbe4-8c9e2dc485c9"><input type="hidden" name="subject" value="New story / private message for Dr Stevens"><input type="hidden" name="from_name" value="Dr Stevens Herbs website"><input type="checkbox" name="botcheck" class="story-botcheck" tabindex="-1" autocomplete="off" hidden><div class="story-form-top"><p class="eyebrow">YOUR WORDS, YOUR CHOICE</p><button class="text-button story-cancel" type="button" aria-label="Close story form">Close ×</button></div><h3>Share your experience with Dr Stevens</h3><label for="story-name">Your name</label><input id="story-name" name="name" required maxlength="100" autocomplete="name"><label for="story-description">Your story or message</label><textarea id="story-description" name="description" required maxlength="4000" rows="6"></textarea><label for="story-contact">Email or phone (optional, for a reply)</label><input id="story-contact" name="contact" maxlength="150"><label for="story-location">City / country (optional)</label><input id="story-location" name="location" maxlength="100"><fieldset><legend>How may we use your message?</legend><label class="check"><input type="radio" name="permission" value="Private message to Dr Stevens only. I do not give permission to publish." required><span>Just a word to the doctor — keep my message private.</span></label><label class="check"><input type="radio" name="permission" value="I give permission to publish my name, story and location on the website, social media and articles. My contact details must remain private." required><span>I allow my name, story and location to be published on the website, social media and articles. Keep my contact details private.</span></label></fieldset><p class="subtle">Share only what you are comfortable sending. Nothing is published automatically. You can contact us to withdraw publication permission.</p><p class="subtle">Your message and publication preference will be sent through Web3Forms to Dr Stevens’ email. <a href="/privacy/">Privacy information</a></p><div class="story-form-actions"><button class="button" type="submit">Submit</button></div><p class="story-status note" role="status" aria-live="polite" hidden></p></form></details><p class="story-confirmation note" role="status" aria-live="polite" hidden></p>`;}
