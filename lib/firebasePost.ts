
import { collection, query, where, startAfter, limit, getDocs, doc, getDoc, setDoc, Timestamp, updateDoc, orderBy } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { PostsFeed, Post } from "./models/Posts"
import { PostSchema } from "./models/Posts"

export async function postsNextBatch(key?: string): Promise<PostsFeed | undefined> {

    try {
        let fbResponse
        if (key) {
            fbResponse = query(collection(db, "streetart"), limit(25), orderBy("date", "desc"), startAfter(key));
        } else {
            fbResponse = query(collection(db, "streetart"), limit(25), orderBy("date", "desc"));
        }

        const documentSnapshots = await getDocs(fbResponse);

        const docs = documentSnapshots.docs.map(doc => {
            const postData = doc.data();
            const validatedData = PostSchema.parse(postData);
            return { ...validatedData, id: doc.id };
        });

        const data: PostsFeed = {
            docs,
            lastVisible: documentSnapshots.docs[documentSnapshots.docs.length - 1]
        }

        return data
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function getPosts(filter?: any): Promise<PostsFeed | undefined> {
    try {
        let fbResponse
        fbResponse = query(collection(db, "streetart"), where("author.id", "==", filter.where.authorId), limit(25), orderBy("createdAt"));

        const documentSnapshots = await getDocs(fbResponse);

        const docs = documentSnapshots.docs.map(doc => {
            const postData = doc.data();
            const validatedData = PostSchema.parse(postData);
            return { ...validatedData, id: doc.id };
        });

        const data: PostsFeed = {
            docs,
            lastVisible: documentSnapshots.docs[documentSnapshots.docs.length - 1]
        }

        return data
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function getPost(id: string): Promise<Post | undefined> {
    try {
        let fbResponse = doc(db, "streetart", id);
        const docSnap = await getDoc(fbResponse);

        if (docSnap.exists()) {
            const validatedData = PostSchema.parse(docSnap.data());
            return validatedData
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

        return undefined
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function setPost(data: object): Promise<String | undefined> {
    try {
        const newItemRef = doc(collection(db, "streetart"));
        const date = new Date();
        let newItemData = { ...data, id: newItemRef.id, createdAt: Timestamp.fromDate(new Date()), updatedAt: Timestamp.fromDate(new Date()), date: date.getTime() }

        await setDoc(newItemRef, newItemData);

        return newItemRef.id
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function updatePost(data: object, id: string): Promise<String | undefined> {
    try {
        const newItemRef = doc(db, "streetart", id);
        let newItemData = { ...data, updatedAt: Timestamp.fromDate(new Date()) }

        await updateDoc(newItemRef, newItemData);

        return newItemRef.id
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}