import { Thread } from "../model/Thread.js";
import { DEV } from "../model/constants.js";
import { prependThread } from "../view/home_page.js";
import { progressMessage } from "../view/progress_view.js";
import { threadPageView } from "../view/thread_page.js";
import { currentUser } from "./firebase_auth.js";
import { addThread } from "./firestore_controller.js";
import { routePathnames } from "./route_controler.js";

export function onClickCreateButton(e) {
    showTextArea();
}

function showTextArea() {
    const divModals = document.querySelectorAll('.create-modal');
    const divButton = divModals[0];
    const divTextArea = divModals[1];
    divButton.classList.replace('d-block', 'd-none');
    divTextArea.classList.replace('d-none', 'd-block');
}

function hideTextArea() {
    const divModals = document.querySelectorAll('.create-modal');
    const divButton = divModals[0];
    const divTextArea = divModals[1];
    divButton.classList.replace('d-none', 'd-block');
    divTextArea.classList.replace('d-block', 'd-none');
}

export async function onSubmitCreateMessage(e) {
    e.preventDefault();
    if(e.submitter.value == 'cancel'){
        hideTextArea();
        return;
    }
    //'save'
    const title = e.target.title.value;
    const content = e.target.content.value;
    const uid = currentUser.uid;
    const email = currentUser.email;
    const timestamp = Date.now();
    const thread = new Thread({
        title, uid, content, email, timestamp,}
    );

    const div = document.createElement('div');
    div.innerHTML = progressMessage('Saving....');
    e.target.parentElement.appendChild(div);

    try{
        const docId = await addThread(thread);
        thread.set_docId(docId);
        prependThread(thread);
        hideTextArea();
        e.target.reset();
    } catch(e){
        if(DEV) console.log('addThread error', e);
        alert('Failed to create message: ' + JSON.stringify(e));
    }
    div.remove();
}

export function onClickViewButton(e) {
    const threadId = e.target.id;
    history.pushState(null, null, routePathnames.THREAD+'#'+threadId);
    threadPageView(threadId);
}