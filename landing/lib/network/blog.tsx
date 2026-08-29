"use client";

import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../firebaseConfig/init";
import { notifications } from "@mantine/notifications";

export interface IBlog {
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  imageUrl?: string;
  category: ICategory;
  /** The readable part of the URL, e.g. "how-to-inspect-an-excavator". */
  slug?: string;
  /** The ~155 character summary Google shows under the search result. */
  excerpt?: string;
  author?: string;
}

export interface IBlogWithId extends IBlog {
  id: string;
}

interface ICategory {
  name: string;
}
interface ICategoryWithId extends ICategory {
  id: string;
}

export const BlogsCollection = "blogs";
export const CategoriesCollection = "categories";

export const useBlogs = () => {
  return useQuery<IBlogWithId[], Error>([BlogsCollection], async () => {
    const snapshot = await getDocs(collection(db, BlogsCollection));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IBlogWithId));
  });
};

export const useBlogById = (id: string) => {
  return useQuery<IBlogWithId, Error>([BlogsCollection, id], async () => {
    const snapshot = await getDoc(doc(db, BlogsCollection, id));
    return { id: snapshot.id, ...snapshot.data() } as IBlogWithId;
  });
};

export const useBlogByCategory = (category: string) => {
  return useQuery<IBlogWithId[], Error>([BlogsCollection, category], async () => {
    const q = query(collection(db, BlogsCollection), where("category.name", "==", category));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IBlogWithId));
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (blog: IBlog) => {
      return addDoc(collection(db, BlogsCollection), blog);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([BlogsCollection]);
        queryClient.refetchQueries([BlogsCollection]);
      },
    }
  );
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, ...blog }: IBlogWithId) => {
      // Previously this wrote `{ blog: {...} }`, nesting every field one level
      // too deep and corrupting the document. Spread the fields instead.
      return updateDoc(doc(db, BlogsCollection, id), { ...blog, updated_at: new Date().toISOString() });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([BlogsCollection]);
        queryClient.refetchQueries([BlogsCollection]);
      },
    }
  );
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (category: string) => {
      // get category by name and if it exists, return it
      // otherwise create new category
      const q = query(collection(db, CategoriesCollection), where("name", "==", category));
      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        console.log(snapshot);

        throw "Category already exists";
      }

      return addDoc(collection(db, CategoriesCollection), {
        name: category,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CategoriesCollection]);
        queryClient.refetchQueries([CategoriesCollection]);
      },
      onError: (error: string) => {
        notifications.show({
          message: <div>{error}</div>,
          color: "red",
        });
      },
    }
  );
};

export const useCategories = () => {
  return useQuery<ICategory[], Error>([CategoriesCollection], async () => {
    const snapshot = await getDocs(collection(db, CategoriesCollection));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ICategoryWithId));
  });
};
