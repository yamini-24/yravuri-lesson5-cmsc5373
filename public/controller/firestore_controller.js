import {
    getFirestore,
    collection,
    addDoc,
    orderBy,
    getDocs,
    getDoc,
    query,
    doc,
    where,
    deleteDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js"
import { app } from "./firebase_core.js"
import { CollectionName } from "../model/constants.js";
import { Thread } from "../model/Thread.js";
import { Reply } from "../model/Reply.js";

const db = getFirestore(app);

export async function addThread(thread){
    const collRef = collection(db, CollectionName.threads);
    const docRef = await addDoc(collRef, thread.toFirestore())
    return docRef.id;
}

export async function addReply(reply) {
    const collRef = collection(db, CollectionName.replies);
    const docRef = await addDoc(collRef, reply.toFirestore());
    return docRef.id;
}


export async function getThreadList() {
    let threadList = [];
    const q = query(collection(db, CollectionName.threads),
        orderBy('timestamp', 'desc'));
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const t = new Thread(doc.data());
        t.set_docId(doc.id);
        threadList.push(t);
    });
    return threadList;
}

export async function getThreadById(threadId){
    if(threadId == null) return null;
    const docRef = doc(db, CollectionName.threads, threadId);
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null;
    const t = new Thread(docSnap.data());
    t.set_docId(threadId);
    return t;
}

export async function getReplyList(threadId, thread){
    const q = query(collection(db, CollectionName.replies),
        where('threadId', '==', threadId),
        orderBy('timestamp'));
    const snapShot = await getDocs(q);

    const replies = [];
    snapShot.forEach(doc => {
        const r = new Reply(doc.data());
        r.set_docId(doc.id);
        replies.push(r);
    })
    return replies;
}

export async function deleteReply(docId){
    const docRef = doc(db, CollectionName.replies, docId);
    await deleteDoc(docRef);
}

export async function updateReply(docId, update){
    //update = {key1: value1, key2: value2}
    const docRef = doc(db, CollectionName.replies, docId);
    await updateDoc(docRef, update);
}