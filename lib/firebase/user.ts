
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { User } from "@/lib/models/User"
import { UserSchema } from "@/lib/models/User"

export async function getUser(id: string): Promise<User | undefined> {
    try {
        let fbResponse = doc(db, "users", id);
        const docSnap = await getDoc(fbResponse);

        if (docSnap.exists()) {
            const validatedData = UserSchema.parse({ ...docSnap.data(), id: docSnap.id });
            return validatedData
        } else {
            console.log("No such document!");
        }

        return undefined
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}
