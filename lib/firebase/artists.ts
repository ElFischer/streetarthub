
import { collection, query, where, startAfter, limit, getDocs, doc, getDoc, setDoc, Timestamp, updateDoc, orderBy, getCountFromServer } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { ArtistsFeed, Artist } from "@/lib/models/Artists"
import { ArtistSchema } from "@/lib/models/Artists"

import type { PostsFeed, Post } from "@/lib/models/Posts"
import { PostSchema } from "@/lib/models/Posts"

export async function getArtists(key?: string): Promise<ArtistsFeed | undefined> {
    
    try {
        let fbResponse
        if (key) {
            fbResponse = query(collection(db, "artists"), limit(25), startAfter(key));
        } else {
            fbResponse = query(collection(db, "artists"), limit(25));
        }

        const documentSnapshots = await getDocs(fbResponse);

        const docs = documentSnapshots.docs.map(doc => {
            const postData = doc.data();
            const validatedData = ArtistSchema.parse(postData);
            return { ...validatedData, id: doc.id };
        });

        const data: ArtistsFeed = {
            docs,
            lastVisible: documentSnapshots.docs[documentSnapshots.docs.length - 1]
        }

        return data
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function getArtist(id: string): Promise<Artist | undefined> {
    try {
        let fbResponse = doc(db, "artists", id);
        const docSnap = await getDoc(fbResponse);

        if (docSnap.exists()) {
            const validatedData = ArtistSchema.parse(docSnap.data());
            return validatedData
        } else {
            console.log("No such document!");
        }

        return undefined
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function getArtistPosts(key?: string, name?: string): Promise<PostsFeed | undefined> {
    try {
        let fbResponse
        if (key) {
            fbResponse = query(collection(db, "streetart"), limit(25), where('artist', 'array-contains', name), startAfter(key));
        } else {
            fbResponse = query(collection(db, "streetart"), limit(25), where('artist', 'array-contains', name));
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