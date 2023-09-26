import { root } from "./elements.js";
import { currentUser } from "../controller/firebase_auth.js";
import { getReplyList, getThreadById } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";
import { onSubmitAddReply, onSubmitEditReply } from "../controller/thread_controller.js";
import { progressMessage } from "./progress_view.js";
import { protectedView } from "./protected_view.js";

export async function threadPageView(threadId) {
    if(!currentUser){
        root.innerHTML= await protectedView();
        return;
    }

    const responce = await fetch('/view/templates/thread_page_template.html',
        {cache: 'no-store'});
    const divWrapper= document.createElement('div');
    divWrapper.innerHTML = await responce.text();
    divWrapper.classList.add('m-4', 'p-4')

    root.innerHTML = progressMessage('Loading threads/replies ...');

    let thread;
    let replyList;
    try{
        thread = await getThreadById(threadId);
        if(!thread) throw 'Thread not exist by id: ' + threadId;
        replyList = await getReplyList(thread.docId);
    }catch(e){
        if(DEV) console.log('failed to load thread/replies', e);
        alert('Failed to load a thread/replies: ' + JSON.stringify(e));
        root.innerHTML = progressMessage('Failed to load thread/replies');
        return;
    }

    // display the message tread
    divWrapper.querySelector('#message-title').textContent = thread.title;
    divWrapper.querySelector('#message-email-timestamp').innerHTML = `
        ${thread.email}<br>${new Date(thread.timestamp).toLocaleString()}
    `
    divWrapper.querySelector('#message-content').textContent = thread.content;

    //display replies to this page
    const tbodyReply = divWrapper.querySelector('#reply-tbody');
    replyList.forEach(reply => {
        const tr = createReplyView(reply);
        tbodyReply.appendChild(tr);
    });

    //form to add new reply
    const formAddReply = divWrapper.querySelector('#form-add-reply');
    const replyAddButton = formAddReply.querySelector('button');
    replyAddButton.id = threadId;
    replyAddButton.value = thread.uid;  //thread owner's uid
    formAddReply.onsubmit = onSubmitAddReply;

    root.innerHTML = '';
    root.appendChild(divWrapper);
}

export function renderReply(reply){
    const tr = createReplyView(reply);
    document.querySelector('#reply-tbody').appendChild(tr);

}

function createReplyView(reply){
    const tr = document.createElement('tr');
    tr.classList.add('mt-3', 'pt-3');
    const tdContent = document.createElement('td');
    if(currentUser.email == reply.email){
        tdContent.innerHTML = `
        <form method ="post">
            <textarea class="form-control" placeholder="Leave a Reply"
                required minlength="5" disabled style="height: 100px;"
            >${reply.content}</textarea>
            <button type="submit" class="d-inline-block btn btn-outline-primary"
                value="edit">Edit</button>
            <button type="submit" class="d-inline-block btn btn-outline-danger"
                value="delete">Delete</button>
            <button type="submit" class="d-none btn btn-outline-primary"
                value="update">Update</button>
            <button type="submit" formnovalidate class="d-none btn btn-outline-secondary"
                value="cancel">Cancel</button>
        </form>
        `;
        const editForm = tdContent.querySelector('form');
        editForm.onsubmit = e => onSubmitEditReply(e, reply);
    }else {
        tdContent.innerHTML = reply.content;
    }
    //tdContent.innerHTML = reply.content;
    const tdEmailTimestamp = document.createElement('td');
    tdEmailTimestamp.innerHTML = `
        ${reply.email}<br>(${new Date(reply.timestamp).toLocaleString()})
    `;
    tr.appendChild(tdContent);
    tr.appendChild(tdEmailTimestamp);
    return tr;
}