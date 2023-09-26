import { root } from "./elements.js";
import { signinFirebase } from "../controller/firebase_auth.js";

export async function signinPageView() {
    const responce = await fetch('/view/templates/signin_page_template.html',
    {cache: 'no-store'}
    );

    const divWrapper = document.createElement('div');
    divWrapper.style.width = "400px";
    divWrapper.classList.add('m-4', 'p-4');
    divWrapper.innerHTML =  await responce.text();

    //attach form submit event listener
    const form = divWrapper.getElementsByTagName('form')[0];
    form.onsubmit = signinFirebase;

    root.innerHTML = '';
    root.appendChild(divWrapper);
}