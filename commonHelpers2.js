import"./assets/modulepreload-polyfill-3cfb730f.js";/* empty css                      */import{i as c}from"./assets/vendor-ff3e2015.js";const r="/goit-js-hw-10/assets/fulfilledIcon-897e83b5.svg",n="/goit-js-hw-10/assets/rejectedIcon-9956cb73.svg";function u(){const e=l.delay,o=l.isSuccess;new Promise((s,t)=>{setTimeout(()=>{o?s(`Fulfilled promise in ${e}ms`):t(`Rejected promise in ${e}ms`)},e)}).then(s=>i(s,e)).catch(s=>i(s,e))}function i(e,o){e.includes("Fulfilled")?console.log(`✅ Fulfilled promise in ${o}ms`):console.log(`❌ Rejected promise in ${o}ms`),c.show({class:"js-izitoast-message",title:e.includes("Fulfilled")?"OK":"Error",titleColor:"#FFFFFF",message:e,messageColor:"#FFFFFF",messageSize:"16px",position:"topRight",backgroundColor:e.includes("Fulfilled")?"#59A10D":"#EF4040",progressBarColor:e.includes("Fulfilled")?"#326101":"#B51B1B",iconUrl:e.includes("Fulfilled")?r:n,close:!1})}const l={form:document.querySelector(".form"),delayInput:document.querySelector(".form").elements.delay,fieldset:document.querySelector(".form > fieldset"),isSuccess:null,delay:null};l.fieldset.addEventListener("click",e=>{e.target.nodeName==="INPUT"&&(l.isSuccess=e.target.value==="fulfilled")});l.form.addEventListener("submit",e=>{e.preventDefault(),l.delay=l.delayInput.value,u(),l.form.reset(),l.delayInput.focus()});
//# sourceMappingURL=commonHelpers2.js.map