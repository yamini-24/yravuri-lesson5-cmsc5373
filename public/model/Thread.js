export class Thread {
    constructor(data) {
        this.uid = data.uid;
        this.email = data.email;
        this.title = data.title;
        this.content = data.content;
        this.timestamp = data.timestamp;
    }

    set_docId(id) {
        this.docId = id;
    }

    toFirestore() {
        return {
            uid: this.uid,
            email : this.email,
            title: this.title,
            timestamp: this.timestamp,
            content: this.content,
        };
    }

}