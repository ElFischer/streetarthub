
import { collection, query, where, startAfter, limit, getDocs, doc, getDoc, setDoc, Timestamp, updateDoc, orderBy, deleteDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { PostsFeed, Post } from "./models/Posts"
import { PostSchema } from "./models/Posts"
import { deleteFile } from './firebaseStore';

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

export async function deletePost(id: string): Promise<boolean> {
    try {
        const docRef = doc(db, "streetart", id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        if (error instanceof Error) console.log(error.stack);
        return false;
    }
}

export async function deletePostWithImages(id: string): Promise<boolean> {
    try {
        // First, get the post to extract image URLs
        const post = await getPost(id);
        
        if (!post) {
            console.error("Post not found");
            return false;
        }

        // Extract image URLs from content blocks
        const imageUrls: string[] = [];
        
        if (post.content && post.content.blocks) {
            post.content.blocks.forEach((block: any) => {
                if (block.type === 'image' && block.data && block.data.file && block.data.file.url) {
                    imageUrls.push(block.data.file.url);
                }
            });
        }

        // Delete all images from storage
        const deleteImagePromises = imageUrls.map(url => deleteFile(url));
        await Promise.all(deleteImagePromises);

        // Delete the post document
        const deleteSuccess = await deletePost(id);
        
        return deleteSuccess;
    } catch (error) {
        if (error instanceof Error) console.log(error.stack);
        return false;
    }
}