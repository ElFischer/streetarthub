
import { collection, query, where, startAfter, limit, getDocs, doc, getDoc, setDoc, Timestamp, updateDoc, orderBy } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { PlacesFeed, Place } from "@/lib/models/Places"
import { PlaceSchema } from "@/lib/models/Places"

export async function getPlaces(key?: string): Promise<PlacesFeed | undefined> {

    try {
        let fbResponse
        if (key) {
            fbResponse = query(collection(db, "locations"), limit(25), startAfter(key));
        } else {
            fbResponse = query(collection(db, "locations"), limit(25));
        }

        const documentSnapshots = await getDocs(fbResponse);

        const docs = documentSnapshots.docs.map(doc => {
            const postData = doc.data();
            const validatedData = PlaceSchema.parse(postData);
            return { ...validatedData, id: doc.id };
        });

        const data: PlacesFeed = {
            docs,
            lastVisible: documentSnapshots.docs[documentSnapshots.docs.length - 1]
        }

        return data
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function getAllCountries(): Promise<{ code: string; name: string; }[]> {
    try {
        const fbResponse = query(collection(db, "locations"));
        const documentSnapshots = await getDocs(fbResponse);

        const countries = documentSnapshots.docs.map(doc => {
            const data = doc.data();
            return {
                code: data.code || doc.id,
                name: data.country || 'Unknown'
            };
        });

        // Entferne Duplikate basierend auf dem code
        const uniqueCountries = countries.filter((country, index, self) => 
            index === self.findIndex((c) => c.code === country.code)
        );

        return uniqueCountries;
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
        return [];
    }
}

export async function getCountry(id: string): Promise<Place | undefined> {
    try {
        let fbResponse = doc(db, "locations", id);
        const docSnap = await getDoc(fbResponse);

        if (docSnap.exists()) {
            const validatedData = PlaceSchema.parse(docSnap.data());
            return validatedData
        } else {
            console.log("No such document!");
        }

        return undefined
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function getCity(id: string): Promise<Place | undefined> {
    try {
        let fbResponse = doc(db, "locations", id);
        const docSnap = await getDoc(fbResponse);

        if (docSnap.exists()) {
            const validatedData = PlaceSchema.parse(docSnap.data());
            return validatedData
        } else {
            console.log("No such document!");
        }

        return undefined
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

