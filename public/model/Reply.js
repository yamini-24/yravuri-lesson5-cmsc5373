export class Reply {
    constructor(data) {
        this.threadId = data.threadId;
        this.threadUid = data.threadUid;   //owners uid
        this.uid = data.uid;
        this.email = data.email;
        this.timestamp = data.timestamp;
        this.content = data.content;
    }

    set_docId(id) {
        this.docId = id;
    }

    toFirestore() {
        return {
            threadId: this.threadId,
            threadUid: this.threadUid,
            uid: this.uid,
            email: this.email,
            timestamp: this.timestamp,
            content: this.content,
        };
    }
}