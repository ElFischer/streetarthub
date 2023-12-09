
import { collection, query, where, startAfter, limit, getDocs, doc, getDoc, setDoc, Timestamp, updateDoc, orderBy } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { CollectionsFeed, Collection } from "@/lib/models/Collections"
import { CollectionSchema } from "@/lib/models/Collections"

import type { PostsFeed, Post } from "@/lib/models/Posts"
import { PostSchema } from "@/lib/models/Posts"

export async function getCollections(key?: string): Promise<CollectionsFeed | undefined> {

    try {
        let fbResponse
        if (key) {
            fbResponse = query(collection(db, "collections"), limit(25), startAfter(key));
        } else {
            fbResponse = query(collection(db, "collections"), limit(25));
        }

        const documentSnapshots = await getDocs(fbResponse);

        const docs = documentSnapshots.docs.map(doc => {
            const postData = doc.data();
            const validatedData = CollectionSchema.parse(postData);
            return { ...validatedData, id: doc.id };
        });

        const data: CollectionsFeed = {
            docs,
            lastVisible: documentSnapshots.docs[documentSnapshots.docs.length - 1]
        }

        return data
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function getCollection(id: string): Promise<Collection | undefined> {
    try {
        let fbResponse = doc(db, "collections", id);
        const docSnap = await getDoc(fbResponse);

        if (docSnap.exists()) {
            const validatedData = CollectionSchema.parse(docSnap.data());
            return validatedData
        } else {
            console.log("No such document!");
        }

        return undefined
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}
