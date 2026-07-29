const PACKING_ICONS = {
passport:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-YxxWewuwXdRncaZSbQNORwOieVOP39.png" x="0" y="0" width="20" height="20"/></svg>`,
id_card:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-L5zctAjYpsgWJCCiLRhRHOitYnxfv6.png" x="0" y="0" width="20" height="20"/></svg>`,
cash:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wnzXfGqb6aI838iS9TCufJSh2ToJP8.png" x="0" y="0" width="20" height="20"/></svg>`,
credit_card:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-xylXWxjRoBYdaH9IPOx1080olvl5Ur.png" x="0" y="0" width="20" height="20"/></svg>`,
phone:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-4InIbjutnVbO2RgfQjb4X5InSQnbWH.png" x="0" y="0" width="20" height="20"/></svg>`,
charger:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KuYCB2ggXWqJ9fLErN8ArVlWCqFtTU.png" x="0" y="0" width="20" height="20"/></svg>`,
headphones:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/headphones.png" x="0" y="0" width="20" height="20"/></svg>`,
power_bank:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KUiU6Lyx7ucBrdj6KmS1tmfbFOuHht.png" x="0" y="0" width="20" height="20"/></svg>`,
travel_adapter:`<img src="img/travel-adapter.png" style="object-fit:contain;display:block;">`,
keys:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-1p1eEnprVg951vyBF9s7lYXmSCVSEY.png" x="0" y="0" width="20" height="20"/></svg>`,
sleep_mask:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-InGWJKD06MYNFrQzbIWEbQlf3amAfq.png" x="0" y="0" width="20" height="20"/></svg>`,
toothbrush:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-F5zA09gQTWbAIIRCjJTQ5FT7mORctP.png" x="0" y="0" width="20" height="20"/></svg>`,
toothpaste:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ZbpP6jzw8ZxBokD0Go2PDaOSMhotke.png" x="0" y="0" width="20" height="20"/></svg>`,
conditioner:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-MbZzUetKofCRz1fZChkwXYAeCuL4JI.png" x="0" y="0" width="20" height="20"/></svg>`,
body_wash:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-iJFK52Qh7S0h9qlUdzOko2I4N2xsps.png" x="0" y="0" width="20" height="20"/></svg>`,
moisturizer:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SR2FSFFLNsBRu5p1nohMqKGcahlWUx.png" x="0" y="0" width="20" height="20"/></svg>`,
mouthwash:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AddCZZif2hlITBVkWKAeXZXYwii2lo.png" x="0" y="0" width="20" height="20"/></svg>`,
makeup_remover:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-MVz8IK9yFOBJ4bPcwo1g6mZKBUOveb.png" x="0" y="0" width="20" height="20"/></svg>`,
wipes_pack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OFjrhU0iMwWJN2wokugkAkar7QmhOl.png" x="0" y="0" width="20" height="20"/></svg>`,
antibacterial_wipes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-NB6ynt4KVjucDWUAJn9mWzIgOp8MSt.png" x="0" y="0" width="20" height="20"/></svg>`,
hand_sanitizer:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/hand_sanitizer.png" x="0" y="0" width="20" height="20"/></svg>`,
hairspray:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/hairspray.png" x="0" y="0" width="20" height="20"/></svg>`,
face_mask:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/face_mask.png" x="0" y="0" width="20" height="20"/></svg>`,
allergy_medication:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/allergy_medication.png" x="0" y="0" width="20" height="20"/></svg>`,
prescription_medication:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/prescription_medication.png" x="0" y="0" width="20" height="20"/></svg>`,
spray_bottle:`<svg viewBox="0 0 20 20" fill="none"><rect x="6.5" y="7.5" width="7" height="11" rx="2.5" fill="#14532d" opacity="0.35"/><rect x="7" y="7" width="7" height="11" rx="2.5" fill="#166534"/><rect x="6" y="6.5" width="7" height="11" rx="2.5" fill="#16a34a"/><rect x="6" y="6.5" width="7" height="4.5" rx="2.5" fill="#22c55e"/><path d="M13 8 L16 8 L16 5" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 5 L18.5 5" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round"/><rect x="8.5" y="3.5" width="3" height="3.5" rx="1.5" fill="#14532d"/><rect x="8" y="2.5" width="4" height="1.5" rx="0.5" fill="#4ade80"/><ellipse cx="8" cy="7.5" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.3)"/></svg>`,
shampoo:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KBuzBkev8p7CT4ixZUl0i6hzyjsQgM.png" x="0" y="0" width="20" height="20"/></svg>`,
perfume:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-USYWgntKCcn9OMx7jLXrlx2zKxF9gA.png" x="0" y="0" width="20" height="20"/></svg>`,
makeup_palette:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-n8G31Cqh3JyKkxXgC4UC1NDwW6tD3A.png" x="0" y="0" width="20" height="20"/></svg>`,
hair_gel:`<svg viewBox="0 0 20 20" fill="none"><rect x="6.5" y="4.5" width="8" height="13" rx="2.5" fill="#1e3a5f" opacity="0.3"/><rect x="7" y="4" width="8" height="13" rx="2.5" fill="#1e40af"/><rect x="6" y="3.5" width="8" height="13" rx="2.5" fill="#3b82f6"/><rect x="6" y="3.5" width="8" height="5" rx="2.5" fill="#60a5fa"/><rect x="7.5" y="1" width="5" height="3" rx="1.5" fill="#1e40af"/><rect x="8" y="0.5" width="4" height="1.2" rx="0.5" fill="#93c5fd"/><line x1="7" y1="10.5" x2="14" y2="10.5" stroke="#1e3a8a" stroke-width="0.8"/><ellipse cx="8" cy="4.5" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.35)"/></svg>`,
hair_styling:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-RCs6a5lnmDpabnkGxGlPRFAZV2yCV3.png" x="0" y="0" width="20" height="20"/></svg>`,
portable_fan:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-khBy1zgHQ8zb5pt9AZnBflDKfviFIX.png" x="0" y="0" width="20" height="20"/></svg>`,
portable_speaker:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/portable_speaker.png" x="0" y="0" width="20" height="20"/></svg>`,
bottle:`<svg viewBox="0 0 20 20" fill="none"><rect x="6.5" y="5.5" width="6" height="12" rx="2.5" fill="#0369a1" opacity="0.35"/><rect x="7" y="5" width="6" height="12" rx="2.5" fill="#0369a1"/><rect x="6" y="4.5" width="6" height="12" rx="2.5" fill="#38bdf8"/><rect x="6" y="4.5" width="6" height="5" rx="2.5" fill="#7dd3fc"/><rect x="7.5" y="2" width="3" height="3" rx="1.5" fill="#0284c7"/><rect x="8.5" y="1" width="1.5" height="1.5" rx="0.5" fill="#0ea5e9"/><line x1="7" y1="9.5" x2="11.5" y2="9.5" stroke="#bae6fd" stroke-width="0.7" opacity="0.8"/><ellipse cx="7.5" cy="5.5" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.35)"/></svg>`,
deodorant:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ZItoIQlaF0DEvRmduhr0U6hTHSE4sC.png" x="0" y="0" width="20" height="20"/></svg>`,
razor:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-f9yGhonZlOCD6T8TK90BDDYxg8d0YK.png" x="0" y="0" width="20" height="20"/></svg>`,
nail_clippers:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/nail_clippers.png" x="0" y="0" width="20" height="20"/></svg>`,
sunscreen:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ixp9yadIpp3NmeQqoOdHkQHpqiwkwR.png" x="0" y="0" width="20" height="20"/></svg>`,
lip_balm:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-dRTPgE3MmCK504LAdEjKyEec0G0Iiy.png" x="0" y="0" width="20" height="20"/></svg>`,
hair_brush:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-pJqISMaDiCKUTHyyVYaaBEa6MvD2lu.png" x="0" y="0" width="20" height="20"/></svg>`,
tshirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-52nIRaI3O8Vzt3QLTNxUusBjCMUmRd.png" x="0" y="0" width="20" height="20"/></svg>`,
dress_shirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_dress_shirt.png" x="0" y="0" width="20" height="20"/></svg>`,
button_down:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_button_down.png" x="0" y="0" width="20" height="20"/></svg>`,
shorts:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-krulqyuU0RnW7gD5cmNGVFYWTp04K3.png" x="0" y="0" width="20" height="20"/></svg>`,
pants:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DHJqVcVymFgjko5ZSqVFp0Rhb4fFr3.png" x="0" y="0" width="20" height="20"/></svg>`,
chinos:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DULdzV3uEdmGmIzORCmUox0QGw8W1z.png" x="0" y="0" width="20" height="20"/></svg>`,
dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-sjnsZFCzT6VnSOqmWOg9YE53KR68pi.png" x="0" y="0" width="20" height="20"/></svg>`,
skirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ynfndwK4Pc7POcdzbtavaLFyf9MQZG.png" x="0" y="0" width="20" height="20"/></svg>`,
jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-elw4GyvNsROSSzsDAUmaiKotqamYXy.png" x="0" y="0" width="20" height="20"/></svg>`,
hoodie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DFu4wXyJkFJaFa9c4eNam36XjlHHR0.png" x="0" y="0" width="20" height="20"/></svg>`,
socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8rJkcLK2xgsgnmscdQmDusIkoRlkQn.png" x="0" y="0" width="20" height="20"/></svg>`,
wool_socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wsHayAtLFxk5o1f2ZhsJOhwe1keftG.png" x="0" y="0" width="20" height="20"/></svg>`,
hiking_socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-5nM8u1foXqXsb2bZcquSCHWwEGFoSS.png" x="0" y="0" width="20" height="20"/></svg>`,
thermal_socks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_thermal_socks.png" x="0" y="0" width="20" height="20"/></svg>`,
gloves:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-f6aak6Yv0iNA0ticTbBK4UWIFFmhbc.png" x="0" y="0" width="20" height="20"/></svg>`,
scarf:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Qt5El3U2ZF2YXGHQzXibfjhxrRGHFu.png" x="0" y="0" width="20" height="20"/></svg>`,
beanie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SK0Aaj1m2uTI5PZjoFR0OG5vvC2LnS.png" x="0" y="0" width="20" height="20"/></svg>`,
swimsuit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-C6d9HfLLNfniScaSDDzYHYzQf06hr5.png" x="0" y="0" width="20" height="20"/></svg>`,
underwear:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-j311WLBz7dERAzTfAqZqpCAlh8Kv3T.png" x="0" y="0" width="20" height="20"/></svg>`,
sneaker:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kDQMGK825nue93CX9JpWUWLCVJsD98.png" x="0" y="0" width="20" height="20"/></svg>`,
walking_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/walking_shoes.png" x="0" y="0" width="20" height="20"/></svg>`,
sandal:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DWMYeBZmNCGvylKhjqjHV3CRGeQvDR.png" x="0" y="0" width="20" height="20"/></svg>`,
boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8FdFcdbAGGWvjntzWv0JfI4ZXopXxB.png" x="0" y="0" width="20" height="20"/></svg>`,
heels:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-KjfXgQXsBKzA8UjO5mY2h8W1af3YD1.png" x="0" y="0" width="20" height="20"/></svg>`,
laptop:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UsyTZyMk2er8VfZu1T68Z4BbnfHYL1.png" x="0" y="0" width="20" height="20"/></svg>`,
laptop_charger:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-gzCDnX3TBsxwYWr2LuYrOQdNGa79ZD.png" x="0" y="0" width="20" height="20"/></svg>`,
camera:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/camera.png" x="0" y="0" width="20" height="20"/></svg>`,
action_camera:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AmqZZr6gQE3C9i2NzN6ZywoONrlwQD.png" x="0" y="0" width="20" height="20"/></svg>`,
drone:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_drone.png" x="0" y="0" width="20" height="20"/></svg>`,
sunglasses:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-0CfnFe8TfwtwCzUStRx2sclgeZgqGI.png" x="0" y="0" width="20" height="20"/></svg>`,
sun_hat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-tMMTRyfcwkP5GmHmEsBD2lZdN12BRz.png" x="0" y="0" width="20" height="20"/></svg>`,
backpack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-53doFZDyMbmChPPHfnbbPjt0Zvlzq7.png" x="0" y="0" width="20" height="20"/></svg>`,
rain_cover:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AbvH02C2XqrfmyICpipznmKPdgtcc1.png" x="0" y="0" width="20" height="20"/></svg>`,
towel:`<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="6.5" width="15" height="9.5" fill="#0369a1" opacity="0.3"/><rect x="2.5" y="6" width="15" height="9.5" fill="#0284c7"/><ellipse cx="10" cy="6" rx="7.5" ry="2.5" fill="#38bdf8"/><ellipse cx="10" cy="15.5" rx="7.5" ry="2.5" fill="#0369a1"/><line x1="2.5" y1="9" x2="17.5" y2="9" stroke="#0369a1" stroke-width="1.5"/><line x1="2.5" y1="12.5" x2="17.5" y2="12.5" stroke="#0369a1" stroke-width="1.5"/><ellipse cx="8" cy="6" rx="3" ry="1.2" fill="rgba(255,255,255,0.35)"/></svg>`,
water_bottle:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-bmzLfyohXRZfMKDJgxQZocCGuZP9sC.png" x="0" y="0" width="20" height="20"/></svg>`,
reusable_water_bottle:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_reusable_water_bottle.png" x="0" y="0" width="20" height="20"/></svg>`,
umbrella:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UoaYOG517tIhHK4E1CCxU83D6Add6c.png" x="0" y="0" width="20" height="20"/></svg>`,
portable_umbrella:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_portable_umbrella.png" x="0" y="0" width="20" height="20"/></svg>`,
ear_plugs:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_ear_plugs.png" x="0" y="0" width="20" height="20"/></svg>`,
goggles:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-6LkDZ8sF7kNrYLtUzmFAQEcD16oX4l.png" x="0" y="0" width="20" height="20"/></svg>`,
ski_goggles:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-dMjIw4NmjsDY6WCoBsMDEN6vj2bgsw.png" x="0" y="0" width="20" height="20"/></svg>`,
ski_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_ski_jacket.png" x="0" y="0" width="20" height="20"/></svg>`,
ski_pants:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_ski_pants.png" x="0" y="0" width="20" height="20"/></svg>`,
insect_repellent:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-AkYUY4ijrAx50lIj9SJ1z5oVjn0uee.png" x="0" y="0" width="20" height="20"/></svg>`,
tent:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ctCiP3glZeziQjunHWJqFIWQ66zGZ3.png" x="0" y="0" width="20" height="20"/></svg>`,
sleeping_bag:`<svg viewBox="2 2 16 16" xmlns="http://www.w3.org/2000/svg"><image href="img/item_sleeping_bag.png" x="0" y="0" width="20" height="20"/></svg>`,
fanny_pack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-C4cs8NtrXH5SzfJv6lMYisyGQu4QcO.png" x="0" y="0" width="20" height="20"/></svg>`,
snacks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-nVpWHTp7s7T6Mhp1BjGdOUOhBSqWns.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_bottle:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OGmaUYElcQxL0MXidTpKtrdWi3UztG.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_clothes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OwYoHmyqGQ3XlXi2ANnhOTkf1HgwB9.png" x="0" y="0" width="20" height="20"/></svg>`,
diapers:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DpGKizvzkJZGDFt78F1l4Rg9PLzMHb.png" x="0" y="0" width="20" height="20"/></svg>`,
stroller:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-1slpvZJNJz3whlluyHiHoaIPoyP9t1.png" x="0" y="0" width="20" height="20"/></svg>`,
blazer:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kMTBDO8YMouYhgo7LcVhz6KO8yiWWM.png" x="0" y="0" width="20" height="20"/></svg>`,
tie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ANhLFkrdwMpU4LhXbqhD0DfgddYVvj.png" x="0" y="0" width="20" height="20"/></svg>`,
notebook:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-PBF0FeYZPH4cDOId8eP4Rb1N9kvBIY.png" x="0" y="0" width="20" height="20"/></svg>`,
travel_guidebook:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/travel_guidebook.png" x="0" y="0" width="20" height="20"/></svg>`,
travel_pillow:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-smLqiLswTcAJ08IJnAfs3gyvfv0hlS.png" x="0" y="0" width="20" height="20"/></svg>`,
hand_warmers:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-n73OaxtUraodRbDA5Brm726CXkRqNO.png" x="0" y="0" width="20" height="20"/></svg>`,
food_pouch:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jwAc5vxJ9fw8SIBITV0G4MLATKUrC5.png" x="0" y="0" width="20" height="20"/></svg>`,
food:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-33VvJwhvBY6bLifBr7b19hHHUyYgOv.png" x="0" y="0" width="20" height="20"/></svg>`,
tank_top:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-fBmSahOe73AFveP9atGtcZX8Q9Pcyx.png" x="0" y="0" width="20" height="20"/></svg>`,
long_sleeve:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-XfbHO3vWK3OEjtxdSeZfWpEq3CrYhi.png" x="0" y="0" width="20" height="20"/></svg>`,
polo:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Q8xyu6uY6PDvgIiOduAKN7uwEMoeUV.png" x="0" y="0" width="20" height="20"/></svg>`,
rain_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-97KKWtM9HV87QqJDQH21dYGk2ZZRgL.png" x="0" y="0" width="20" height="20"/></svg>`,
poncho:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_poncho.png" x="0" y="0" width="20" height="20"/></svg>`,
coat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-TkrQWYF1crUX72Bw695CydmHg0CmD2.png" x="0" y="0" width="20" height="20"/></svg>`,
raincoat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DUVLvs4tjPQsFuRiqVeKL31PJOsEI1.png" x="0" y="0" width="20" height="20"/></svg>`,
windbreaker:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-97KKWtM9HV87QqJDQH21dYGk2ZZRgL.png" x="0" y="0" width="20" height="20"/></svg>`,
puffer_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-GGEzZp2bzlrsQLZ4zt9vfa6dvCCDP0.png" x="0" y="0" width="20" height="20"/></svg>`,
sweater:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-JOVC2aaccDU3vjeJccY71hS0itv7qc.png" x="0" y="0" width="20" height="20"/></svg>`,
cardigan:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-cHSIjhsD6PtejH1h02XWWHZFrK6UkN.png" x="0" y="0" width="20" height="20"/></svg>`,
vest:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-h87B7sZdXGUqx5uQSWcde5ryodAbPK.png" x="0" y="0" width="20" height="20"/></svg>`,
jeans:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DULdzV3uEdmGmIzORCmUox0QGw8W1z.png" x="0" y="0" width="20" height="20"/></svg>`,
sweatpants:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-hHw4TLJq4bb7NXCeCV9rH51aCDi4W6.png" x="0" y="0" width="20" height="20"/></svg>`,
leggings:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-fWfhhhUqJ8AHxeuYJgRMP9Jd96T6NB.png" x="0" y="0" width="20" height="20"/></svg>`,
thermal_base_layer:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-gOFI7RBtT9KlBFX9GpJ9cfJD8zAKFH.png" x="0" y="0" width="20" height="20"/></svg>`,
pajamas:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ayTfnTrdL87tTq5ustqIVn8YP2GWhi.png" x="0" y="0" width="20" height="20"/></svg>`,
hiking_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-IggFBTZj6FLZJOSOZIjFlIU8ntmuyv.png" x="0" y="0" width="20" height="20"/></svg>`,
dress_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Q8LmT9GbMpWUZdjn0alFYIi2QU47Yl.png" x="0" y="0" width="20" height="20"/></svg>`,
loafers:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Q8LmT9GbMpWUZdjn0alFYIi2QU47Yl.png" x="0" y="0" width="20" height="20"/></svg>`,
ski_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_ski_boots.png" x="0" y="0" width="20" height="20"/></svg>`,
flip_flops:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jVQKf4o5VsajzoHbIU37DMrJwowKUm.png" x="0" y="0" width="20" height="20"/></svg>`,
usb_drive:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-t28cyW0ZqUKV1htNhbo0SzC8il3KPY.png" x="0" y="0" width="20" height="20"/></svg>`,
tripod:`<svg viewBox="0 0 20 20" fill="none"><rect x="8.5" y="1.5" width="4" height="6" rx="2" fill="#1f2937" opacity="0.35"/><rect x="9" y="1" width="4" height="6" rx="2" fill="#374151"/><rect x="8" y="0.5" width="4" height="6" rx="2" fill="#4b5563"/><rect x="8" y="0.5" width="4" height="2.5" rx="2" fill="#6b7280"/><line x1="10" y1="6.5" x2="3" y2="19" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="6.5" x2="10" y2="19" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/><line x1="10" y1="6.5" x2="17" y2="19" stroke="#374151" stroke-width="2.5" stroke-linecap="round"/><circle cx="10" cy="6.5" r="2.5" fill="#6b7280"/><circle cx="10" cy="6.5" r="1.2" fill="#374151"/></svg>`,
selfie_stick:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/selfie_stick.png" x="0" y="0" width="20" height="20"/></svg>`,
beach_towel:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ttKfYZ4l4M0s8G8tY5sxxdsai6ROmm.png" x="0" y="0" width="20" height="20"/></svg>`,
gym_towel:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UiLLbLcRMRZ5D6QgrgEYHvx2ut3ZGR.png" x="0" y="0" width="20" height="20"/></svg>`,
beach_bag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_beach_bag.png" x="0" y="0" width="20" height="20"/></svg>`,
clutch_purse:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-SssavTgpvON3oMwRMAlyQWUbD9H3xB.png" x="0" y="0" width="20" height="20"/></svg>`,
diaper_bag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_diaper_bag.png" x="0" y="0" width="20" height="20"/></svg>`,
tote_bag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-pDLFY2aJ6Wy7iz4f6hQ9Gz8XKDf4HP.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_wipes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-nKj5LX1UWFA7mrHpVCmlabiLyJgWjB.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_blanket:`<svg viewBox="0 0 20 20" fill="none"><path d="M2 6.5 Q2 4.5 4 4.5 L16 4.5 Q18 4.5 18 6.5 L18 14.5 Q18 16.5 16 16.5 L4 16.5 Q2 16.5 2 14.5Z" fill="#92400e" opacity="0.25"/><path d="M2 6 Q2 4 4 4 L16 4 Q18 4 18 6 L18 14 Q18 16 16 16 L4 16 Q2 16 2 14Z" fill="#fbbf24"/><path d="M2 6 Q2 4 4 4 L16 4 Q18 4 18 6 L18 9 Q10 10 2 9Z" fill="#fef3c7"/><path d="M2 6 Q2 4 4 4 L16 4 Q18 4 18 5 Q10 5.5 2 5Z" fill="rgba(255,255,255,0.4)"/><line x1="5" y1="7" x2="15" y2="7" stroke="#d97706" stroke-width="1"/><line x1="5" y1="10" x2="15" y2="10" stroke="#d97706" stroke-width="1"/><line x1="5" y1="13" x2="15" y2="13" stroke="#d97706" stroke-width="1"/></svg>`,
car_blanket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-kXz5iXsbc2bca5Rn9pDHS2tpN0NVHl.png" x="0" y="0" width="20" height="20"/></svg>`,
baby_carrier:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-MSKYQPyjJlVazzoB0biPJTXKccgumv.png" x="0" y="0" width="20" height="20"/></svg>`,
onesie:`<svg viewBox="0 0 20 20" fill="none"><path d="M5 2.5 L1 4.5 L3 8.5 L5 7.5 L5 12.5 L15 12.5 L15 7.5 L17 8.5 L19 4.5 L15 2.5 Q13 5.5 10 5.5 Q7 5.5 5 2.5Z" fill="#d97706" opacity="0.4"/><path d="M5 2 L1 4 L3 8 L5 7 L5 12 L15 12 L15 7 L17 8 L19 4 L15 2 Q13 5 10 5 Q7 5 5 2Z" fill="#fbbf24"/><path d="M5 2 Q6.5 4.5 10 4.5 Q13.5 4.5 15 2 L14.5 2.5 Q13 5 10 5 Q7 5 5.5 2.5Z" fill="#fcd34d"/><path d="M5 2 L1 4 L3 8 L5 7 L5 8" fill="#fcd34d"/><path d="M5 12 L6 18 Q6 19.5 10 19.5 Q14 19.5 14 18 L15 12Z" fill="#f59e0b"/><line x1="10" y1="12" x2="10" y2="18" stroke="#d97706" stroke-width="0.8"/><circle cx="7" cy="15" r="1" fill="#fef9c3"/><circle cx="13" cy="15" r="1" fill="#fef9c3"/></svg>`,
swim_cap:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-sN6BdGo5TEUdURfnV9nfcfDBT95P6d.png" x="0" y="0" width="20" height="20"/></svg>`,
hydration_pack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-aPBr0yfDJZNTeT5rBB6KUpr6PcK7xp.png" x="0" y="0" width="20" height="20"/></svg>`,
hair_ties:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-rq5WXNd7FvStgmMw5LSv8HDsZfIisf.png" x="0" y="0" width="20" height="20"/></svg>`,
comb:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-q97kccfhVQKROudjY5J3vdVm23krQO.png" x="0" y="0" width="20" height="20"/></svg>`,
sleeping_pad:`<svg viewBox="0 0 20 20" fill="none"><rect x="1" y="7.5" width="18" height="8" rx="3.5" fill="#14532d" opacity="0.35"/><rect x="1" y="7" width="18" height="8" rx="3.5" fill="#15803d"/><rect x="1" y="7" width="18" height="3.5" rx="3.5" fill="#22c55e"/><ellipse cx="4" cy="7.8" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.25)"/><line x1="5" y1="10.5" x2="5" y2="15" stroke="#14532d" stroke-width="1.8"/><line x1="8.5" y1="10.5" x2="8.5" y2="15" stroke="#14532d" stroke-width="1.8"/><line x1="12" y1="10.5" x2="12" y2="15" stroke="#14532d" stroke-width="1.8"/><line x1="15.5" y1="10.5" x2="15.5" y2="15" stroke="#14532d" stroke-width="1.8"/></svg>`,
camp_stove:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ZczH3AguUVgIBE56Xtz4ZxR9qf00k3.png" x="0" y="0" width="20" height="20"/></svg>`,
workout_clothes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-mFyQc7fQv5gAOQ5uwEbgDeh0UdsiVp.png" x="0" y="0" width="20" height="20"/></svg>`,
car_charger:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-bw97fEWUphTdmGN6BLK1Eg3J4nFGKl.png" x="0" y="0" width="20" height="20"/></svg>`,
car_sunshade:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_car_sunshade.png" x="0" y="0" width="20" height="20"/></svg>`,
generic:`<svg viewBox="0 0 20 20" fill="none"><rect x="3.5" y="3.5" width="13" height="13" rx="3.5" fill="#475569" opacity="0.35"/><rect x="3" y="3" width="13" height="13" rx="3.5" fill="#64748b"/><rect x="3" y="3" width="13" height="5" rx="3.5" fill="#94a3b8"/><ellipse cx="5.5" cy="3.8" rx="1.5" ry="0.7" fill="rgba(255,255,255,0.3)"/><line x1="6" y1="11" x2="14" y2="11" stroke="#f1f5f9" stroke-width="1.2" stroke-linecap="round"/><line x1="6" y1="13.5" x2="11" y2="13.5" stroke="#f1f5f9" stroke-width="1" stroke-linecap="round"/></svg>`,
beret:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OvLfJkKY0Vrm7QLseh7IT6Bm6dJWaW.png" x="0" y="0" width="20" height="20"/></svg>`,
bra:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-lj1Ph4UkPsqBhFZHr36WlqE0DUrkX3.png" x="0" y="0" width="20" height="20"/></svg>`,
sports_bra:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_sports_bra.png" x="0" y="0" width="20" height="20"/></svg>`,
bomber_jacket:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-nrcvXJr22VXWX9PBtXNZ5UrplwAfhj.png" x="0" y="0" width="20" height="20"/></svg>`,
platform_sandals:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-foHQsqKXIma8sVkPZ4InkOTIhlxVnp.png" x="0" y="0" width="20" height="20"/></svg>`,
crocs:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-UaDOopPLRhMS296mFjwtpnyb41NCad.png" x="0" y="0" width="20" height="20"/></svg>`,
visor:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-buxqomwSVEJaZQ4HmLwMDGa9qiXUGo.png" x="0" y="0" width="20" height="20"/></svg>`,
blouse:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-R0WhSAAz3gy2fa55CqAiEIIxhpC52J.png" x="0" y="0" width="20" height="20"/></svg>`,
canvas_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-25Y9Z8CPr2GbrCOJekFo5jLy0sg3ce.png" x="0" y="0" width="20" height="20"/></svg>`,
mittens:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Gv9RgCBoA64VLOWBH3yaV6uddea7fJ.png" x="0" y="0" width="20" height="20"/></svg>`,
bandana:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-83b2IeYjhg1sMlMwkBt4QgKBpsb5BN.png" x="0" y="0" width="20" height="20"/></svg>`,
tracksuit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-5e7bMEeXHT9InsR4B0TQO7pIfAjFAx.png" x="0" y="0" width="20" height="20"/></svg>`,
fleece_vest:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8TNOX5UwrO9W6xkFHdrxIne1tJRjQs.png" x="0" y="0" width="20" height="20"/></svg>`,
puffer_vest:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-8uXJHTpTD5jAsJSl5mCS3oEShP97vo.png" x="0" y="0" width="20" height="20"/></svg>`,
tennis_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wzmb2LUWgt0zxCRp3ZqEvNf1qduRuR.png" x="0" y="0" width="20" height="20"/></svg>`,
trench_coat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-DDKn2PTWGR8G1qAhmPXK04tkF0FAfc.png" x="0" y="0" width="20" height="20"/></svg>`,
headband:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-D0E2Fef6bWCImoSudI6fkKR0DVHeq9.png" x="0" y="0" width="20" height="20"/></svg>`,
ballet_flats:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-2b6oQmI4jp05liyQbylh2v3DxNbule.png" x="0" y="0" width="20" height="20"/></svg>`,
platform_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OICN6o1XPZdTbj3Kgh74Q29d7engGR.png" x="0" y="0" width="20" height="20"/></svg>`,
handbag:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-OAYK6HWr7j9IxNH5mk3vkntjQCJnwc.png" x="0" y="0" width="20" height="20"/></svg>`,
silk_robe:`<svg viewBox="2 2 16 16" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-spcAZqVLpmLepvdPcNiQR9rfJA4mCX.png" x="0" y="0" width="20" height="20"/></svg>`,
clear_backpack:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jNbReRdCpjzASHqX6wl70Mmw8SPtov.png" x="0" y="0" width="20" height="20"/></svg>`,
swimming_trunks:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Hr614argQcTnSMkYH6BFodSeiuWjXl.png" x="0" y="0" width="20" height="20"/></svg>`,
bikini:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-fQUj5KYmAXrOyLMN48aHnBHYzzlsvP.png" x="0" y="0" width="20" height="20"/></svg>`,
rain_boots:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-GD1SIJA3DzHDREMulql6zjPWFazsgS.png" x="0" y="0" width="20" height="20"/></svg>`,
lingerie:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wI99neuCjazgkbgcqQ5fIk7TImpMWv.png" x="0" y="0" width="20" height="20"/></svg>`,
high_waisted_jeans:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-Ge13nYg6DvdP52OPecVxzbEsaZrbTG.png" x="0" y="0" width="20" height="20"/></svg>`,
business_cards:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-BWHskVIbPlrZ8Wh8PjiuAvT9E3GKa9.png" x="0" y="0" width="20" height="20"/></svg>`,
curling_iron:`<svg viewBox="0 0 20 20" fill="none"><rect x="9" y="1" width="3" height="12" rx="1.5" fill="#7c3aed"/><rect x="9" y="1" width="3" height="5" rx="1.5" fill="#a78bfa"/><path d="M10.5 13 Q14 13 14 16 Q14 19 10.5 19 Q7 19 7 16 Q7 13 10.5 13Z" fill="none" stroke="#7c3aed" stroke-width="1.5"/><circle cx="10.5" cy="16" r="1.5" fill="#c4b5fd"/></svg>`,
hair_straightener:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_hair_straightener.png" x="0" y="0" width="20" height="20"/></svg>`,
feminine_hygiene:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_feminine_hygiene.png" x="0" y="0" width="20" height="20"/></svg>`,
shaving_cream:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-jhrEvuxE1jo58gPPBZ1K17VWGqlytB.png" x="0" y="0" width="20" height="20"/></svg>`,
belt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-J9sd8MEDwlXFpu3F8AlkniC2BLmtCu.png" x="0" y="0" width="20" height="20"/></svg>`,
suit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-2eSeYYzqWreheiRapgbvisjDzfCpTj.png" x="0" y="0" width="20" height="20"/></svg>`,
mini_dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-IFAUCtCOj3POQwKUdSUl9TX29nMtEj.png" x="0" y="0" width="20" height="20"/></svg>`,
maxi_dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-YQn5FpNL17Scjgl6MSCTuXJU5IZX3V.png" x="0" y="0" width="20" height="20"/></svg>`,
watch:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-GMDUYJRKP7kEcXKVWjUVqk64HOpE0U.png" x="0" y="0" width="20" height="20"/></svg>`,
smart_watch:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_smartwatch.png" x="0" y="0" width="20" height="20"/></svg>`,
cowboy_hat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-R2D8r79JBRWYLJGB18GgsUjN2s4Dzb.png" x="0" y="0" width="20" height="20"/></svg>`,
jewelry:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-93uU08ntOedKehh82hj8kDnFYCfYuC.png" x="0" y="0" width="20" height="20"/></svg>`,
pencil_skirt:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_pencil_skirt.png" x="0" y="0" width="20" height="20"/></svg>`,
jumpsuit:`<svg viewBox="2 2 16 16" xmlns="http://www.w3.org/2000/svg"><image href="img/item_jumpsuit.png" x="0" y="0" width="20" height="20"/></svg>`,
waterproof_phone_case:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_waterproof_phone_case.png" x="0" y="0" width="20" height="20"/></svg>`,
floral_top:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/floral_top.png" x="0" y="0" width="20" height="20"/></svg>`,
beach_kimono:`<svg viewBox="2 2 16 16" xmlns="http://www.w3.org/2000/svg"><image href="img/item_beach_kimono.png" x="0" y="0" width="20" height="20"/></svg>`,
panama_hat:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/panama_hat.png" x="0" y="0" width="20" height="20"/></svg>`,
motion_sickness_med:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/motion_sickness_med.png" x="0" y="0" width="20" height="20"/></svg>`,
matching_set:`<svg viewBox="2 2 16 16" xmlns="http://www.w3.org/2000/svg"><image href="img/item_matching_set.png" x="0" y="0" width="20" height="20"/></svg>`,
cocktail_dress:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-tviL78KeLIxPWj8IfzBgmUoRVt8bOt.png" x="0" y="0" width="20" height="20"/></svg>`,
snorkel_set:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_snorkel_set.png" x="0" y="0" width="20" height="20"/></svg>`,
aqua_shoes:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_aqua_shoes.png" x="0" y="0" width="20" height="20"/></svg>`,
first_aid_kit:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_first_aid_kit.png" x="0" y="0" width="20" height="20"/></svg>`,
firestarter:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_firestarter.png" x="0" y="0" width="20" height="20"/></svg>`,
body_glitter:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_body_glitter.png" x="0" y="0" width="20" height="20"/></svg>`,
paper_map:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_paper_map.png" x="0" y="0" width="20" height="20"/></svg>`,
aloe_vera:`<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><image href="img/item_aloe_vera.png" x="0" y="0" width="20" height="20"/></svg>`,
};

const CAT_FALLBACK_ICONS = {
  'Essentials':'passport','Toiletries':'bottle','Clothing':'tshirt','Shoes':'sneaker',
  'Electronics':'laptop','Business Trip':'blazer','Gym':'water_bottle','Beach':'sunscreen',
  'Swimming':'goggles','Snow Sports':'goggles','Hiking':'backpack','Camping':'tent',
  'Night Out':'heels','Baby':'baby_bottle','Theme Park':'backpack','Festival':'fanny_pack',
  'Road Trip':'water_bottle','City Sightseeing':'backpack','Dining':'blazer','Cruise':'sunscreen',
  'Rainy Weather':'umbrella','Hot & Sunny Weather':'sunscreen','Snowy Weather':'boots',
  'Windy Weather':'jacket','Cold Weather':'boots',
};

function getItemIcon(name, cat) {
  const n = name.toLowerCase();
  // Essentials / Documents
  if (n.includes('passport'))                            return PACKING_ICONS.passport;
  if (n === 'id')                                        return PACKING_ICONS.id_card;
  if (n.includes('cash'))                                return PACKING_ICONS.cash;
  if (n.includes('credit card'))                         return PACKING_ICONS.credit_card;
  if (n.includes('business card'))                       return PACKING_ICONS.business_cards;
  if (n.includes('sleep mask') || n.includes('eye mask')) return PACKING_ICONS.sleep_mask;
  if (n.includes('pillow'))                              return PACKING_ICONS.travel_pillow;
  if (n === 'keys' || n === 'key')                       return PACKING_ICONS.keys;
  if (n.includes('guidebook') || n.includes('travel guide'))      return PACKING_ICONS.travel_guidebook;
  if (n.includes('notebook'))                                      return PACKING_ICONS.notebook;
  // Electronics
  if (n.includes('laptop charger'))                      return PACKING_ICONS.laptop_charger;
  if (n.includes('laptop'))                              return PACKING_ICONS.laptop;
  if (n.includes('headphone'))                           return PACKING_ICONS.headphones;
  if (n.includes('waterproof phone case'))               return PACKING_ICONS.waterproof_phone_case;
  if (n.includes('phone'))                               return PACKING_ICONS.phone;
  if (n.includes('drone'))                               return PACKING_ICONS.drone;
  if (n.includes('action camera') || n.includes('gopro')) return PACKING_ICONS.action_camera;
  if (n.includes('camera'))                              return PACKING_ICONS.camera;
  if (n.includes('power bank'))                          return PACKING_ICONS.power_bank;
  if (n.includes('car sunshade') || n.includes('sunshade') || n.includes('windshield shade')) return PACKING_ICONS.car_sunshade;
  if (n.includes('car charger'))                         return PACKING_ICONS.car_charger;
  if (n.includes('charger') || n.includes('charging'))   return PACKING_ICONS.charger;
  if (n.includes('adapter') || n.includes('adaptor'))    return PACKING_ICONS.travel_adapter;
  if (n.includes('usb'))                                 return PACKING_ICONS.usb_drive;
  if (n.includes('tripod'))                              return PACKING_ICONS.tripod;
  if (n.includes('selfie stick'))                        return PACKING_ICONS.selfie_stick;
  // Toiletries — each item unique
  if (n.includes('toothbrush'))                          return PACKING_ICONS.toothbrush;
  if (n.includes('toothpaste'))                          return PACKING_ICONS.toothpaste;
  if (n.includes('razor'))                               return PACKING_ICONS.razor;
  if (n.includes('nail clipper'))                        return PACKING_ICONS.nail_clippers;
  if (n.includes('sunscreen') || n.includes('spf'))      return PACKING_ICONS.sunscreen;
  if (n.includes('lip balm'))                            return PACKING_ICONS.lip_balm;
  if (n.includes('hair brush'))                          return PACKING_ICONS.hair_brush;
  if (n.includes('comb'))                                return PACKING_ICONS.comb;
  if (n.includes('deodorant'))                           return PACKING_ICONS.deodorant;
  if (n.includes('conditioner'))                         return PACKING_ICONS.conditioner;
  if (n.includes('body wash'))                           return PACKING_ICONS.body_wash;
  if (n.includes('moistur'))                             return PACKING_ICONS.moisturizer;
  if (n.includes('mouthwash'))                           return PACKING_ICONS.mouthwash;
  if (n.includes('makeup remover'))                      return PACKING_ICONS.makeup_remover;
  if (n.includes('antibacterial wipe')) return PACKING_ICONS.antibacterial_wipes;
  if (n.includes('makeup wipe') || n.includes('wipe')) return PACKING_ICONS.wipes_pack;
  if (n.includes('moisturizing spray') || n.includes('spray')) return PACKING_ICONS.spray_bottle;
  if (n.includes('shampoo'))                             return PACKING_ICONS.shampoo;
  if (n.includes('perfume') || n.includes('cologne'))    return PACKING_ICONS.perfume;
  if (n.includes('makeup kit') || n.includes('makeup palette') || n.includes('makeup')) return PACKING_ICONS.makeup_palette;
  if (n.includes('curling iron'))                         return PACKING_ICONS.curling_iron;
  if (n.includes('hair straightener') || n.includes('flat iron')) return PACKING_ICONS.hair_straightener;
  if (n.includes('hair styling') || n.includes('hair product'))        return PACKING_ICONS.hair_styling;
  if (n.includes('hair gel') || n.includes('hair wax'))                return PACKING_ICONS.hair_gel;
  if (n.includes('hairspray') || n.includes('hair spray'))             return PACKING_ICONS.hairspray;
  if (n.includes('hair tie') || n.includes('hair ties') || n.includes('scrunchie') || n.includes('hair band')) return PACKING_ICONS.hair_ties;
  if (n.includes('feminine hygiene') || n.includes('tampon') || n.includes('pad') && n.includes('hygiene')) return PACKING_ICONS.feminine_hygiene;
  if (n.includes('shaving cream') || n.includes('shaving gel') || n.includes('shave cream')) return PACKING_ICONS.shaving_cream;
  if (n.includes('insect') || n.includes('repellent') || n.includes('bug spray')) return PACKING_ICONS.insect_repellent;
  // Accessories
  if (n.includes('sunglasses'))                          return PACKING_ICONS.sunglasses;
  if (n.includes('visor'))                               return PACKING_ICONS.visor;
  if (n.includes('bandana'))                             return PACKING_ICONS.bandana;
  if (n.includes('beret'))                               return PACKING_ICONS.beret;
  if (n.includes('headband'))                            return PACKING_ICONS.headband;
  if (n.includes('cowboy hat'))                           return PACKING_ICONS.cowboy_hat;
  if (n.includes('panama hat') || n.includes('panama'))      return PACKING_ICONS.panama_hat;
  if (n.includes('sun hat') || (n.includes('hat') && !n.includes('beanie'))) return PACKING_ICONS.sun_hat;
  if (n.includes('beanie') || n.includes('ear muff'))    return PACKING_ICONS.beanie;
  if (n.includes('scarf'))                               return PACKING_ICONS.scarf;
  if (n.includes('mitten'))                              return PACKING_ICONS.mittens;
  if (n.includes('gloves'))                              return PACKING_ICONS.gloves;
  if (n.includes('tie'))                                 return PACKING_ICONS.tie;
  // Clothing — most specific first
  if (n.includes('bikini'))                              return PACKING_ICONS.bikini;
  if (n.includes('swimming trunk') || n.includes('swim trunk')) return PACKING_ICONS.swimming_trunks;
  if (n.includes('swimsuit'))                            return PACKING_ICONS.swimsuit;
  if (n.includes('sports bra'))                          return PACKING_ICONS.sports_bra;
  if (n.includes('lingerie'))                            return PACKING_ICONS.lingerie;
  if (n.includes('bra'))                                 return PACKING_ICONS.bra;
  if (n.includes('tracksuit'))                           return PACKING_ICONS.tracksuit;
  if (n.includes('workout') || n.includes('gym outfit') || n.includes('athletic wear')) return PACKING_ICONS.workout_clothes;
  if (n.includes('robe'))                                return PACKING_ICONS.silk_robe;
  if (n.includes('pajama') || n.includes('pyjama'))      return PACKING_ICONS.pajamas;
  if (n.includes('ski goggle'))                           return PACKING_ICONS.ski_goggles;
  if (n.includes('ski jacket'))                           return PACKING_ICONS.ski_jacket;
  if (n.includes('ski pant'))                             return PACKING_ICONS.ski_pants;
  if (n.includes('thermal sock'))                         return PACKING_ICONS.thermal_socks;
  if (n.includes('thermal') || n.includes('long john'))  return PACKING_ICONS.thermal_base_layer;
  if (n.includes('underwear') || n.includes('briefs') || n.includes('boxers')) return PACKING_ICONS.underwear;
  if (n.includes('poncho'))                              return PACKING_ICONS.poncho;
  if (n.includes('rain jacket'))                         return PACKING_ICONS.rain_jacket;
  if (n.includes('puffer') || n.includes('down jacket')) return PACKING_ICONS.puffer_jacket;
  if (n.includes('windbreaker'))                         return PACKING_ICONS.windbreaker;
  if (n.includes('trench'))                              return PACKING_ICONS.trench_coat;
  if (n.includes('raincoat'))                             return PACKING_ICONS.raincoat;
  if (n.includes('coat'))                                 return PACKING_ICONS.coat;
  if (n.includes('leather jacket'))                      return PACKING_ICONS.jacket;
  if (n.includes('bomber'))                              return PACKING_ICONS.bomber_jacket;
  if (n.includes('jacket'))                              return PACKING_ICONS.jacket;
  if (n.includes('jumpsuit'))                            return PACKING_ICONS.jumpsuit;
  if (n.includes('suit') && !n.includes('swimsuit') && !n.includes('tracksuit') && !n.includes('jumpsuit')) return PACKING_ICONS.suit;
  if (n.includes('blazer') || n.includes('suit jacket')) return PACKING_ICONS.blazer;
  if (n.includes('cardigan'))                            return PACKING_ICONS.cardigan;
  if (n.includes('hoodie'))                              return PACKING_ICONS.hoodie;
  if (n.includes('fleece vest'))                         return PACKING_ICONS.fleece_vest;
  if (n.includes('puffer vest'))                         return PACKING_ICONS.puffer_vest;
  if (n.includes('sweater') || n.includes('fleece'))     return PACKING_ICONS.sweater;
  if (n.includes('vest'))                                return PACKING_ICONS.vest;
  if (n.includes('dress shirt'))                         return PACKING_ICONS.dress_shirt;
  if (n.includes('blouse'))                              return PACKING_ICONS.blouse;
  if (n.includes('button-down') || n.includes('button down')) return PACKING_ICONS.button_down;
  if (n.includes('polo'))                                return PACKING_ICONS.polo;
  if (n.includes('tank top'))                            return PACKING_ICONS.tank_top;
  if (n.includes('long sleeve'))                         return PACKING_ICONS.long_sleeve;
  if (n.includes('matching set'))                              return PACKING_ICONS.matching_set;
  if (n.includes('beach kimono') || n.includes('kimono'))     return PACKING_ICONS.beach_kimono;
  if (n.includes('floral top') || n.includes('floral shirt')) return PACKING_ICONS.floral_top;
  if (n.includes('t-shirt') || n.includes('shirt'))      return PACKING_ICONS.tshirt;
  if (n.includes('shorts'))                              return PACKING_ICONS.shorts;
  if (n.includes('legging'))                             return PACKING_ICONS.leggings;
  if (n.includes('sweatpant'))                           return PACKING_ICONS.sweatpants;
  if (n.includes('high-waisted jeans') || n.includes('high waisted jeans')) return PACKING_ICONS.high_waisted_jeans;
  if (n.includes('jeans') || n.includes('denim'))        return PACKING_ICONS.jeans;
  if (n.includes('chino') || n.includes('dress pant') || n.includes('trouser')) return PACKING_ICONS.chinos;
  if (n.includes('pant'))                                return PACKING_ICONS.pants;
  if (n.includes('cocktail dress'))                      return PACKING_ICONS.cocktail_dress;
  if (n.includes('mini dress'))                          return PACKING_ICONS.mini_dress;
  if (n.includes('maxi dress'))                          return PACKING_ICONS.maxi_dress;
  if (n.includes('dress') && !n.includes('pant') && !n.includes('shirt') && !n.includes('shoe')) return PACKING_ICONS.dress;
  if (n.includes('pencil skirt'))                        return PACKING_ICONS.pencil_skirt;
  if (n.includes('skirt'))                               return PACKING_ICONS.skirt;
  if (n.includes('belt'))                                return PACKING_ICONS.belt;
  if (n.includes('onesie'))                              return PACKING_ICONS.onesie;
  if (n.includes('wool sock'))                            return PACKING_ICONS.wool_socks;
  if (n.includes('hiking sock'))                          return PACKING_ICONS.hiking_socks;
  if (n.includes('socks') || n.includes('sock'))         return PACKING_ICONS.socks;
  // Shoes — most specific first
  if (n.includes('ski boot'))                            return PACKING_ICONS.ski_boots;
  if (n.includes('hiking boot') || n.includes('hiking shoe') || n.includes('trail shoe')) return PACKING_ICONS.hiking_boots;
  if (n.includes('rain boot'))                           return PACKING_ICONS.rain_boots;
  if (n.includes('snow boot') || n.includes('winter boot') || n.includes('warm boot')) return PACKING_ICONS.boots;
  if (n.includes('loafer') || n.includes('slip-on'))     return PACKING_ICONS.loafers;
  if (n.includes('dress shoe') || n.includes('oxford') || n.includes('formal shoe')) return PACKING_ICONS.dress_shoes;
  if (n.includes('platform boot'))                       return PACKING_ICONS.platform_boots;
  if (n.includes('boot'))                                return PACKING_ICONS.boots;
  if (n.includes('heel'))                                return PACKING_ICONS.heels;
  if (n.includes('flip flop'))                           return PACKING_ICONS.flip_flops;
  if (n.includes('platform sandal'))                     return PACKING_ICONS.platform_sandals;
  if (n.includes('ballet flat') || n.includes('ballet shoe')) return PACKING_ICONS.ballet_flats;
  if (n.includes('croc'))                                return PACKING_ICONS.crocs;
  if (n.includes('sandal'))                              return PACKING_ICONS.sandal;
  if (n.includes('tennis shoe'))                         return PACKING_ICONS.tennis_shoes;
  if (n.includes('walking shoe'))                        return PACKING_ICONS.walking_shoes;
  if (n.includes('sneaker'))                             return PACKING_ICONS.canvas_shoes;
  if (n.includes('running shoe') || (n.includes('sport') && n.includes('shoe'))) return PACKING_ICONS.sneaker;
  // Bags
  if (n.includes('hydration pack'))                      return PACKING_ICONS.hydration_pack;
  if (n.includes('backpack cover') || n.includes('pack cover') || n.includes('waterproof cover')) return PACKING_ICONS.rain_cover;
  if (n.includes('clear backpack'))                      return PACKING_ICONS.clear_backpack;
  if (n.includes('backpack'))                            return PACKING_ICONS.backpack;
  if (n.includes('fanny pack'))                          return PACKING_ICONS.fanny_pack;
  if (n.includes('diaper bag'))                          return PACKING_ICONS.diaper_bag;
  if (n.includes('beach bag') || n.includes('beach tote')) return PACKING_ICONS.beach_bag;
  if (n.includes('clutch'))                              return PACKING_ICONS.clutch_purse;
  if (n.includes('jewelry') || n.includes('jewellery') || n.includes('necklace') || n.includes('bracelet') || n.includes('ring')) return PACKING_ICONS.jewelry;
  if (n.includes('smart watch') || n.includes('smartwatch')) return PACKING_ICONS.smart_watch;
  if (n.includes('watch'))                               return PACKING_ICONS.watch;
  if (n.includes('purse') || n.includes('handbag'))      return PACKING_ICONS.handbag;
  if (n.includes('tote'))                                return PACKING_ICONS.tote_bag;
  if (n.includes('sleeping bag'))                        return PACKING_ICONS.sleeping_bag;
  if (n.includes('bag'))                                 return PACKING_ICONS.tote_bag;
  // Towels
  if (n.includes('beach towel'))                         return PACKING_ICONS.beach_towel;
  if (n.includes('gym towel') || n.includes('sport towel')) return PACKING_ICONS.gym_towel;
  if (n.includes('towel'))                               return PACKING_ICONS.towel;
  // Water / Umbrella
  if (n.includes('reusable water bottle'))                return PACKING_ICONS.reusable_water_bottle;
  if (n.includes('water bottle'))                         return PACKING_ICONS.water_bottle;
  if (n.includes('ear plug') || n.includes('earplug'))   return PACKING_ICONS.ear_plugs;
  if (n.includes('portable umbrella'))                   return PACKING_ICONS.portable_umbrella;
  if (n.includes('umbrella'))                            return PACKING_ICONS.umbrella;
  // Swimming / Sports
  if (n.includes('first aid'))                           return PACKING_ICONS.first_aid_kit;
  if (n.includes('hand sanitizer'))                      return PACKING_ICONS.hand_sanitizer;
  if (n.includes('face mask'))                           return PACKING_ICONS.face_mask;
  if (n.includes('allergy'))                             return PACKING_ICONS.allergy_medication;
  if (n.includes('prescription'))                        return PACKING_ICONS.prescription_medication;
  if (n.includes('firestarter') || n.includes('fire starter') || n.includes('lighter') || n.includes('matches')) return PACKING_ICONS.firestarter;
  if (n.includes('body glitter') || n.includes('glitter'))   return PACKING_ICONS.body_glitter;
  if (n.includes('paper map') || n.includes('map'))          return PACKING_ICONS.paper_map;
  if (n.includes('aloe'))                                     return PACKING_ICONS.aloe_vera;
  if (n.includes('aqua shoe') || n.includes('aqua sho') || n === 'aqua shoes') return PACKING_ICONS.aqua_shoes;
  if (n.includes('snorkel'))                             return PACKING_ICONS.snorkel_set;
  if (n.includes('goggle'))                              return PACKING_ICONS.goggles;
  if (n.includes('swim cap'))                            return PACKING_ICONS.swim_cap;
  if (n.includes('portable fan'))                        return PACKING_ICONS.portable_fan;
  if (n.includes('portable speaker') || n.includes('bluetooth speaker')) return PACKING_ICONS.portable_speaker;
  // Camping / Outdoors
  if (n.includes('tent'))                                return PACKING_ICONS.tent;
  if (n.includes('sleeping pad') || n.includes('foam mat') || n.includes('camp mat')) return PACKING_ICONS.sleeping_pad;
  if (n.includes('camp stove') || n.includes('camping stove') || n.includes('stove')) return PACKING_ICONS.camp_stove;
  if (n.includes('hand warmer'))                         return PACKING_ICONS.hand_warmers;
  // Baby
  if (n.includes('stroller'))                            return PACKING_ICONS.stroller;
  if (n.includes('baby bottle'))                         return PACKING_ICONS.baby_bottle;
  if (n.includes('diaper') && !n.includes('bag'))        return PACKING_ICONS.diapers;
  if (n.includes('baby wipe'))                           return PACKING_ICONS.baby_wipes;
  if (n.includes('car blanket'))                           return PACKING_ICONS.car_blanket;
  if (n.includes('baby blanket') || n.includes('blanket')) return PACKING_ICONS.baby_blanket;
  if (n.includes('baby carrier') || n.includes('carrier')) return PACKING_ICONS.baby_carrier;
  if (n.includes('baby cloth'))                          return PACKING_ICONS.baby_clothes;
  if (n.includes('baby'))                                return PACKING_ICONS.baby_bottle;
  if (n.includes('motion sick'))                           return PACKING_ICONS.motion_sickness_med;
  // Food / Snacks
  if (n.includes('food pouch') || n.includes('baby food')) return PACKING_ICONS.food_pouch;
  if (n.includes('snack'))                                 return PACKING_ICONS.snacks;
  if (n.includes('food') && !n.includes('pouch'))         return PACKING_ICONS.food;
  return PACKING_ICONS[CAT_FALLBACK_ICONS[cat]] || PACKING_ICONS.generic;
}
