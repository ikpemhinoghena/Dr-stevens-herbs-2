export const topics = [
  'Infections & PID',
  'Cancer',
  'Herpes',
  'Lupus',
  'Diabetes',
  'High blood pressure',
  'Arthritis',
  'Digestive concerns',
  'Skin concerns',
  'Sleep concerns',
  'Stress and wellbeing',
  'Respiratory concerns',
  'Kidney health',
  'Liver health',
  'Women’s health',
  'Men’s health',
  'General wellbeing'
];
export const slug = s => s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
export const products = [
  {
    "id": "life-herbal-plus",
    "name": "Life Herbal Plus by Steven",
    "type": "Powder Mixture",
    "category": "Powder Mixture",
    "tone": "green",
    "weight": "400g",
    "tag": "FAST CURE: INFECTIONS & PID",
    "tagline": "Fast herbal cure for infections, Staph, PID & Fallopian blockage",
    "desc": "A potent therapeutic botanical powder mixture formulated by Dr Stevens. Expertly compounded from deep-acting African roots, cleansing barks, and active rhizomes (including fortified Zingiber and medicinal bitters) to eradicate persistent systemic and reproductive tract infections. Target-crafted for stubborn Urinary Tract Infections (UTI), Staphylococcus, Gonorrhea, Syphilis, Candidiasis, and Chlamydia, while working deeply to resolve Pelvic Inflammatory Disease (PID), clear Fallopian tube blockages, and suppress Herpes flare-ups. Each 400g airtight bottle delivers a traditional concentrated herbal course designed to cleanse the bloodstream, balance mucosal flora, and restore reproductive vitality.",
    "reference": "Herb 01",
    "image": "/assets/life-herbal-plus.jpeg",
    "imageAlt": "Life Herbal Plus by Steven - 400g Powder Mixture sealed bottle",
    "ailments": [
      "Urinary Tract Infection (UTI)",
      "Staphylococcus",
      "Gonorrhea",
      "Syphilis",
      "Candidiasis",
      "Chlamydia",
      "Pelvic Inflammatory Diseases (PID)",
      "Fallopian Tube Blockage",
      "Herpes"
    ],
    "usage": "Take as guided by Dr Stevens according to your specific condition and body weight. Typically 1 level measuring spoon stirred into a glass of warm boiled water, unsweetened herbal tea, or warm light pap twice daily (morning and evening). Drink consistently for the full duration of your recommended course. Dr Stevens will provide personalized guidance tailored to your symptom history.",
    "suitability": "Ideal for adults seeking strong, natural botanical defense against acute or recurrent infections. Suitable for both men and women. Dr Stevens provides free one-on-one WhatsApp guidance to discuss your specific symptoms, confirm suitability, answer questions about any conventional antibiotics or medications you are taking, and guide your dosage.",
    "ingredientsInfo": "100% pure wild-harvested African roots, fortified medicinal ginger (Zingiber officinale), antimicrobial botanical bitters, and active cleansing barks. Finely milled into an active, easy-to-dissolve herbal powder. Free from artificial fillers, chemicals, or synthetic preservatives. Batch-sealed in an airtight 400g bottle."
  },
  {
    "id": "dried-leaf-collection",
    "name": "Dr Stevens HPV, Warts & Cancer Botanical Decoction",
    "type": "Bottled",
    "category": "Botanical Decoction",
    "tone": "olive",
    "tag": "HPV, WARTS & CANCERS",
    "tagline": "Antiviral cleansing for HPV, asymptomatic infections, warts & cancer defense",
    "desc": "An intensive, deep-acting African botanical decoction masterfully prepared by Dr Stevens. Specially formulated from rare wild-harvested antiviral barks, cytotoxic healing roots, and cellular-cleansing leaves traditional practitioners have long trusted to combat Human Papillomavirus (HPV), eradicate stubborn internal and external warts, clear asymptomatic viral carriers, and fortify immune defense against abnormal cellular growths and cancers. Brewed and bottled into a potent, concentrated liquid extract designed to neutralize cellular pathogens, detoxify the bloodstream, and re-energize the body's natural defense systems.",
    "reference": "Herb 02",
    "image": "/assets/cancer1.jpeg",
    "images": [
      "/assets/cancer1.jpeg",
      "/assets/cancer-2.jpeg",
      "/assets/cancer-3.jpeg"
    ],
    "imageAlt": "Dr Stevens HPV, Warts and Cancer Botanical Decoction bottles",
    "ailments": [
      "HPV (Human Papillomavirus)",
      "Asymptomatic Viral Infections",
      "Genital & Skin Warts",
      "Cancers & Abnormal Cellular Growth",
      "Immune System Fortification"
    ],
    "usage": "Administer as specifically directed by Dr Stevens for your viral or cellular diagnosis. Typically 1 standard shot glass (approx. 50ml) taken twice daily (morning and evening) on an empty stomach. Drink consistently throughout your recommended cycle. For localized warts, Dr Stevens will advise safe topical application alongside the oral cleansing course.",
    "suitability": "Formulated for adults diagnosed with HPV, recurring warts, asymptomatic viral carrier states, or those seeking deep botanical immune restoration alongside medical care. Consultation with Dr Stevens is completely free to evaluate your symptom history, stage, and suitability before ordering.",
    "ingredientsInfo": "100% natural wild-extracted African medicinal roots, immune-modulating tree barks, bitter cellular purifiers, and active bioflavonoids. Slow-extracted in pure water without alcohol, artificial chemicals, preservatives, or colorants. Freshly sealed with tamper-evident caps."
  },
  {
    "id": "fresh-botanical-collection",
    "name": "Dr Stevens Lupus & Autoimmune Botanical Formula",
    "type": "Packaged & Bottled",
    "category": "Botanical Compound",
    "tone": "gold",
    "tag": "LUPUS & AUTOIMMUNE RELIEF",
    "tagline": "Deep restorative remission formula for Systemic Lupus & chronic inflammation",
    "desc": "An advanced, multi-phase African botanical therapy compounded by Dr Stevens to naturally modulate hyperactive immune responses and reverse chronic autoimmune damage. Handcrafted from rare wild-harvested immunoregulatory tree barks, anti-inflammatory whole roots, and cell-reparative mountain herbs. Specifically formulated to target Systemic Lupus Erythematosus (SLE), discoid lupus skin rashes, debilitating joint stiffness, and chronic inflammatory tissue stress. This dual-action course combines water-soluble golden powder infusions with a concentrated herbal decoction to cool cellular blood heat, protect kidney and microvascular health, and guide the body toward sustained remission without toxic immune suppression.",
    "reference": "Herb 03",
    "image": "/assets/lupus1.jpeg",
    "images": [
      "/assets/lupus1.jpeg",
      "/assets/lupus-2.jpeg"
    ],
    "imageAlt": "Dr Stevens Lupus botanical pouches and liquid decoction course",
    "ailments": [
      "Systemic Lupus Erythematosus (SLE)",
      "Autoimmune Flare-ups & Inflammation",
      "Chronic Joint Pain & Swelling",
      "Skin Lesions & Butterfly Rash",
      "Chronic Fatigue & Tissue Damage",
      "Immune System Balancing & Remission"
    ],
    "usage": "Follow Dr Stevens' personalized protocol tailored to your symptom severity and flare frequency. Typically involves taking 1 level spoon of the botanical gold powder infused in warm water in the morning, followed by 50ml of the concentrated liquid decoction in the evening before bed. Maintain consistently through your guided cycle. Dr Stevens provides continuous WhatsApp monitoring.",
    "suitability": "Formulated for adults diagnosed with Systemic Lupus Erythematosus (SLE), suspected autoimmune flare-ups, or persistent chronic inflammation. Completely free consultation is provided by Dr Stevens to review your current medical treatments, lab values, and symptom history to customize your dosage.",
    "ingredientsInfo": "100% wild-harvested African immunomodulatory tree barks, cellular anti-inflammatory roots, bioactive flavonoids, and natural blood-purifying bitters. Milled and extracted under sterile conditions with zero steroids, synthetic chemicals, preservatives, or artificial additives."
  },
  {
    "id": "diabetes-vitality-formula",
    "name": "Dr Stevens Diabetes, Erectile Dysfunction & Hepatitis B Botanical Decoction",
    "type": "Bottled",
    "category": "Botanical Decoction",
    "tone": "clay",
    "tag": "DIABETES, ED & HEPATITIS B",
    "tagline": "Restorative herbal cleanser for Diabetes (Types 1-4), Hepatitis B & male vitality",
    "desc": "A powerhouse triple-action botanical decoction masterfully formulated by Dr Stevens to address interlinked metabolic, hepatic, and vascular conditions. Compounded from deep-cleansing African bitter roots, hepatoprotective barks, and circulation-invigorating wild rhizomes. Engineered to stimulate pancreatic beta cells, regenerate cellular insulin sensitivity, and restore glycemic control across Type 1, Type 2, Type 3, Type 4 Diabetes, and Pre-diabetes. In parallel, it actively suppresses Hepatitis B viral replication, detoxifies liver parenchyma, and removes microvascular blockages to restore penile blood flow and conquer erectile dysfunction naturally.",
    "reference": "Herb 04",
    "image": "/assets/dibetes-1.jpeg",
    "images": [
      "/assets/dibetes-1.jpeg",
      "/assets/dibetes-2.jpeg"
    ],
    "imageAlt": "Dr Stevens Diabetes, Erectile Dysfunction and Hepatitis B botanical bottles",
    "ailments": [
      "Diabetes Type 1",
      "Diabetes Type 2",
      "Type 3 Diabetes",
      "Type 4 Diabetes",
      "Pre-diabetes & Metabolic Balance",
      "Erectile Dysfunction (ED) & Male Vitality",
      "Hepatitis B & Liver Cellular Detox",
      "Blood Sugar Regulation & Vascular Health"
    ],
    "usage": "Administer as directed by Dr Stevens according to your blood glucose readings and health goals. Typically 1 measuring cup (50ml) taken twice daily—30 minutes before breakfast and 30 minutes before dinner. Blood sugar levels should be checked regularly as the pancreas and insulin receptors regain natural equilibrium.",
    "suitability": "Designed for men and women dealing with elevated blood sugar, all stages of diabetes, chronic Hepatitis B, or men experiencing diabetic-related erectile dysfunction and low stamina. Dr Stevens offers free one-on-one WhatsApp guidance to discuss your test results, confirm suitability, and oversee your regimen.",
    "ingredientsInfo": "100% pure wild-harvested African bitter roots, potent hepatoprotective tree barks, nitric-oxide enhancing rhizomes, and cellular antioxidants. Traditional aqueous extraction without alcohol, sugar, synthetic chemicals, or preservatives. Freshly bottled in food-grade, tamper-evident containers."
  },
  {
    "id": "high-blood-pressure-formula",
    "name": "Dr Stevens High Blood Pressure & Cardiovascular Botanical Decoction",
    "type": "Bottled",
    "category": "Botanical Decoction",
    "tone": "rose",
    "tag": "HIGH BLOOD PRESSURE & HYPERTENSION",
    "tagline": "Restorative arterial cleanser to lower high blood pressure & protect cardiovascular health",
    "desc": "A profound cardioprotective botanical decoction masterfully brewed by Dr Stevens to naturally regulate blood pressure, soften stiff arterial walls, and restore healthy vascular circulation. Compounded from wild-harvested African cardiac roots, vasodilator tree barks, and potassium-rich botanical extracts long utilized in traditional medicine to calm hypertensive strain. Formulated to safely lower elevated systolic and diastolic blood pressure, reduce arterial plaque congestion, ease chest tightness and palpitations, and protect delicate kidney micro-vessels and the brain from hypertensive crisis. Prepared as a concentrated, easy-to-absorb oral herbal decoction that works with your body to maintain stable, balanced blood pressure without synthetic dependency.",
    "reference": "Herb 05",
    "image": "/assets/highblodpre.jpeg",
    "images": [
      "/assets/highblodpre.jpeg",
      "/assets/highblodpre-2.jpeg"
    ],
    "imageAlt": "Dr Stevens High Blood Pressure & Cardiovascular Botanical Decoction bottles",
    "ailments": [
      "High Blood Pressure (Hypertension)",
      "Systolic & Diastolic Blood Pressure Regulation",
      "Arterial Stiffness & Poor Vascular Circulation",
      "Heart Palpitations & Cardiovascular Stress",
      "Hypertensive Headaches & Dizziness",
      "Kidney Microvascular Protection"
    ],
    "usage": "Administer strictly as advised by Dr Stevens based on your baseline blood pressure readings. Typically 1 standard glass (approx. 50ml) taken twice daily—once in the morning before breakfast and once in the evening before dinner. Monitor your blood pressure regularly using a standard cuff while taking this formula to observe progress. Dr Stevens is available on WhatsApp for ongoing dosage adjustments and consultation.",
    "suitability": "Formulated for adults diagnosed with primary or secondary hypertension, chronic elevated blood pressure readings, or cardiovascular strain. Safe to discuss alongside existing antihypertensive medications. Dr Stevens offers free one-on-one WhatsApp consultations to review your recent BP numbers, answer questions, and tailor your regimen.",
    "ingredientsInfo": "100% natural wild-harvested African cardio-active roots, arterial-soothing barks, organic bioflavonoids, and bitter vascular purifiers. Extracted in pure mountain water with zero alcohol, artificial colors, chemical preservatives, or added sodium. Bottled fresh under hygienic conditions with tamper-evident seal caps."
  },
  {
    "id": "arthritis-relief-formula",
    "name": "Dr Stevens Arthritis, Rheumatism & Joint Relief Botanical Root Infusion",
    "type": "Bottled",
    "category": "Botanical Infusion",
    "tone": "amber",
    "tag": "ARTHRITIS & JOINT PAIN",
    "tagline": "Deep-penetrating root & bark steep for osteoarthritis, rheumatoid pain & joint flexibility",
    "desc": "An authentic, whole-root botanical steep masterfully compounded by Dr Stevens to dismantle chronic joint inflammation and reverse debilitating arthritic pain. Hand-assembled from whole wild African anti-rheumatic roots, healing barks, and bioactive woody rhizomes directly visible inside every bottle. Crafted to dissolve excess uric acid crystal deposits, cool burning inflammation in joint cartilage, lubricate stiff synovial membranes, and relieve chronic swelling across knees, hips, fingers, and the spine. Targeted for both Osteoarthritis wear-and-tear and Rheumatoid autoimmune flare-ups, restoring painless mobility, flexibility, and daily strength.",
    "reference": "Herb 06",
    "image": "/assets/arthitis.jpeg",
    "imageAlt": "Dr Stevens Arthritis and Joint Relief whole root and bark botanical infusion bottles",
    "ailments": [
      "Osteoarthritis & Cartilage Wear",
      "Rheumatoid Arthritis & Autoimmune Joint Flare-ups",
      "Gout & Uric Acid Crystal Accumulation",
      "Chronic Knee, Hip & Spine Stiffness",
      "Joint Inflammation, Swelling & Redness",
      "Morning Stiffness & Restricted Mobility"
    ],
    "usage": "Drink as personally directed by Dr Stevens based on the severity and location of your joint condition. Typically 1 standard shot glass (approx. 50ml) twice daily (morning and night) after light meals. The whole roots and barks remain in the bottle, continuously steeping and releasing active therapeutic compounds throughout your course. Contact Dr Stevens for replenishment and individualized guidance.",
    "suitability": "Ideal for adults suffering from chronic arthritis pain, recurring gout attacks, swollen finger or knee joints, or general joint stiffness. Consultation with Dr Stevens is 100% free to assess your mobility symptoms, previous x-rays or uric acid tests, and confirm optimal usage.",
    "ingredientsInfo": "100% whole wild-harvested African analgesic roots, anti-inflammatory tree barks, and therapeutic resinous rhizomes steeping in purified botanical extract. Contains zero chemical painkillers, steroids, artificial preservatives, or synthetic additives. Hand-bottled in food-grade bottles with airtight seal caps."
  },
  {
    "id": "root-and-bark-collection",
    "name": "Agbo (to be changed to real one)",
    "type": "Bottled",
    "category": "Agbo",
    "tone": "clay",
    "desc": "Speak with Dr Stevens about this Agbo listing. Confirm the actual herb name, ingredients, preparation, pack size and price before ordering.",
    "tag": "HERPES CURE",
    "reference": "Herb 07",
    "image": "/assets/agbo-bottles.jpeg",
    "imageAlt": "Two dark bottles with sealed red caps",
    "isTemporary": true
  },
  {
    "id": "botanical-powder-collection",
    "name": "Agbo (to be changed to real one)",
    "type": "Packaged",
    "category": "Agbo",
    "tone": "gold",
    "desc": "Speak with Dr Stevens about this Agbo listing. Confirm the actual herb name, ingredients, preparation, pack size and price before ordering.",
    "tag": "BOTANICAL PREVIEW",
    "reference": "Herb 08",
    "image": "/assets/agbo-pouches.jpeg",
    "imageAlt": "Three sealed gold pouches",
    "isTemporary": true
  }
];
