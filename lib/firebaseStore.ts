import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export async function uploadFile(file: File, name: string): Promise<String | undefined> {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `${name}`);

        const snapshot = await uploadBytes(storageRef, file)
        const escapedName = encodeURIComponent(snapshot.metadata.fullPath)
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/${escapedName}?alt=media`
        return fileUrl
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}

export async function deleteFile(fileUrl: string): Promise<boolean> {
    try {
        const storage = getStorage();
        
        // Extract file path from URL
        const urlPattern = /\/o\/(.+?)\?alt=media/;
        const match = fileUrl.match(urlPattern);
        
        if (!match) {
            console.error("Invalid file URL format");
            return false;
        }
        
        const filePath = decodeURIComponent(match[1]);
        const fileRef = ref(storage, filePath);
        
        await deleteObject(fileRef);
        return true;
    } catch (error) {
        if (error instanceof Error) console.log(error.stack);
        return false;
    }
}