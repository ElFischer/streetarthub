import { collection, query, getDocs, limit } from "firebase/firestore";
import { db } from '@/lib/firebase';

// Predefined categories
const predefinedCategories = [
  "stencil",
  "graffiti", 
  "wheatpaste",
  "tape art",
  "installation",
  "mural",
  "animals",
  "portrait",
  "abstract",
  "political",
  "typography",
  "3d",
  "mosaic",
  "sculpture",
  "performance",
  "digital"
];

export async function getAllCategories(): Promise<string[]> {
  try {
    // Get all posts and extract unique categories
    const postsQuery = query(collection(db, "streetart"), limit(1000));
    const snapshot = await getDocs(postsQuery);
    
    const categoriesFromPosts = new Set<string>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.category && Array.isArray(data.category)) {
        data.category.forEach((cat: string) => {
          if (cat && typeof cat === 'string') {
            categoriesFromPosts.add(cat.toLowerCase().trim());
          }
        });
      }
    });

    // Combine predefined categories with categories from posts
    const allCategories = new Set([
      ...predefinedCategories,
      ...Array.from(categoriesFromPosts)
    ]);

    return Array.from(allCategories).sort();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return predefinedCategories;
  }
}

export async function searchCategories(searchTerm: string): Promise<string[]> {
  try {
    const allCategories = await getAllCategories();
    
    if (!searchTerm || searchTerm.trim().length === 0) {
      return allCategories;
    }

    const searchTermLower = searchTerm.toLowerCase();
    
    return allCategories.filter(category => 
      category.toLowerCase().includes(searchTermLower)
    );
  } catch (error) {
    console.error("Error searching categories:", error);
    return predefinedCategories.filter(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export function checkCategoryExists(name: string, existingCategories: string[]): boolean {
  return existingCategories.some(category => 
    category.toLowerCase() === name.toLowerCase()
  );
}
