
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

export async function searchArtists(searchTerm: string): Promise<(Artist & { id: string })[]> {
    try {
        if (!searchTerm || searchTerm.trim().length === 0) {
            const data = await getArtists();
            return data?.docs || [];
        }

        const searchTermLower = searchTerm.toLowerCase();
        
        // Firebase doesn't support full-text search, so we use range queries
        // This searches for names that start with the search term
        const fbResponse = query(
            collection(db, "artists"),
            orderBy("name"),
            where("name", ">=", searchTerm),
            where("name", "<=", searchTerm + '\uf8ff'),
            limit(50)
        );

        const documentSnapshots = await getDocs(fbResponse);

        const docs = documentSnapshots.docs.map(doc => {
            const postData = doc.data();
            const validatedData = ArtistSchema.parse(postData);
            return { ...validatedData, id: doc.id };
        });

        // Additional client-side filtering for case-insensitive contains search
        const filteredDocs = docs.filter(artist => 
            artist.name.toLowerCase().includes(searchTermLower)
        );

        return filteredDocs;
    } catch (error) {
        if (error instanceof Error) console.log(error.stack);
        return [];
    }
}

export async function checkArtistExists(name: string): Promise<boolean> {
    try {
        const searchResult = await searchArtists(name);
        return searchResult.some(artist => 
            artist.name.toLowerCase() === name.toLowerCase()
        );
    } catch (error) {
        if (error instanceof Error) console.log(error.stack);
        return false;
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
