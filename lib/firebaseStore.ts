import { getStorage, ref, uploadBytes } from "firebase/storage";

export async function uploadFile(file: File, name: string): Promise<String | undefined> {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `${name}`);

        const snapshot = await uploadBytes(storageRef, file)
        const escapedName = encodeURIComponent(snapshot.metadata.fullPath)
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/${escapedName}?alt=media`
        return fileUrl
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}