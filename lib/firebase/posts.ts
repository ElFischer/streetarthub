import { collection, query, where, limit, startAfter, getDocs, orderBy, QueryConstraint, WhereFilterOp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PostSchema, type PostsFeed } from "@/lib/models/Posts";

interface FetchPostsArgs {
    key?: string;
    limitValue?: number;
    filterField?: 'category' | 'artist' | 'author.id' | 'location.country.long_name' | 'location.locality.long_name';
    filterValue?: string;
    filterOperator?: WhereFilterOp;
}

export async function fetchPosts({ key, limitValue = 25, filterField, filterValue, filterOperator = 'array-contains' }: FetchPostsArgs): Promise<PostsFeed | undefined> {
    try {
        const constraints: QueryConstraint[] = [
            limit(limitValue),
            orderBy("createdAt", "desc")
        ];

        if (filterField && filterValue) {
            constraints.push(where(filterField, filterOperator, filterValue));
        }

        if (key) {
            constraints.push(startAfter(key));
        }

        const fbQuery = query(collection(db, "streetart"), ...constraints);

        const documentSnapshots = await getDocs(fbQuery);

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
        console.error("Error fetching posts:", error);
        // Optional: Fehlerbehandlung oder Standardwert zurückgeben
    }
}
