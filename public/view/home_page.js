import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./protected_view.js";
import { onClickCreateButton, onSubmitCreateMessage,
    onClickViewButton,
} from "../controller/home_controller.js";
import { getThreadList } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";
import { progressMessage } from "./progress_view.js";

export async function homePageView() {
    if(!currentUser){
        root.innerHTML= await protectedView();
        return;
    }

    root.innerHTML = progressMessage('Loading....');

    let threadList;
    try {
       threadList = await getThreadList();
    } catch(e){
        if(DEV) console.log('getThreadList error', e);
        alert('Failed to get threads: ' + JSON.stringify(e));

    }

    const responce = await fetch('/view/templates/home_page_template.html',
        {cache: 'no-store'});
    const divWrapper= document.createElement('div');
    divWrapper.innerHTML = await responce.text();
    divWrapper.classList.add('m-4', 'p-4')

    const createButton = divWrapper.querySelector('#create-button');
    createButton.onclick = onClickCreateButton;

    const form = divWrapper.querySelector('form');
    form.onsubmit = onSubmitCreateMessage;

    root.innerHTML = '';
    root.appendChild(divWrapper);

    // render thread list into tbody tag
    const tbody = divWrapper.querySelector('tbody');
    threadList.forEach(thread => tbody.appendChild(createMessageRow(thread)));
    //threadList.forEach(thread => tbody.appendChild(createMessageRow(thread)));

} 

export function prependThread(thread) {
    const tr = createMessageRow(thread);
    const tbody = document.querySelector('tbody');
    tbody.prepend(tr);
}

/*export function createMessageRow(thread) {
    const tdAction = document.createElement('td');
    tdAction.innerHTML = `
        <button id="${thread.docId}" class="btn btn-outline-primary">
            View</button>
    `;
    tdAction.querySelector('button').onclick = onClickViewButton;

    const tdTitle = document.createElement('td');
    tdTitle.textContent = thread.title;
    const tdEmail = document.createElement('td');
    tdEmail.textContent = thread.email;
    const tdContent = document.createElement('td');
    tdContent.textContent = thread.content;
    const tdTimestamp = document.createElement('td');
    tdTimestamp.textContent = new Date(thread.timestamp).toLocaleString();

    const tr = document.createElement('tr');
    tr.appendChild(tdAction);
    tr.appendChild(tdTitle);
    tr.appendChild(tdEmail);
    tr.appendChild(tdContent);
    tr.appendChild(tdTimestamp);
}*/

export function createMessageRow(thread) {
    const tdAction = document.createElement('td');
    tdAction.innerHTML = `
        <button id="${thread.docId}" class="btn btn-outline-primary">
            View</button>
    `;
    tdAction.querySelector('button').onclick = onClickViewButton;

    const tdTitle = document.createElement('td');
    tdTitle.textContent = thread.title;
    const tdEmail = document.createElement('td');
    tdEmail.textContent = thread.email;
    const tdContent = document.createElement('td');
    tdContent.textContent = thread.content;
    const tdTimestamp = document.createElement('td');
    tdTimestamp.textContent = new Date(thread.timestamp).toLocaleString();

    const tr = document.createElement('tr');
    tr.appendChild(tdAction);
    tr.appendChild(tdTitle);
    tr.appendChild(tdEmail);
    tr.appendChild(tdContent);
    tr.appendChild(tdTimestamp);

    return tr; // Add this line to return the created table row
}
