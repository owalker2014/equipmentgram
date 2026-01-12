import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

export function toTitleCase(str: string) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}

// Like a normal react useState, but persists the value in localStorage
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const storedValue = window?.localStorage.getItem(key);
    setValue(
      storedValue !== null && storedValue !== undefined
        ? JSON.parse(storedValue)
        : initialValue
    );
  }, []);

  function wipeValue() {
    window?.localStorage.removeItem(key);
  }

  function updateValue(newValue: T) {
    window?.localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  }

  return [value, updateValue, wipeValue];
}

// Like a normal react useState, but persists the value in query parameters using Nextjs router
export function useQueryState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  const router = useRouter();
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const storedValue = router.query[key];
    try {
      setValue(
        storedValue !== null && storedValue !== undefined
          ? JSON.parse(storedValue as string)
          : initialValue
      );
    } catch (e) {
      setValue(
        storedValue !== null && storedValue !== undefined
          ? (storedValue as unknown as T)
          : initialValue
      );
    }
  }, []);

  function wipeValue() {
    router.push(
      router.pathname,
      removeQueryParameters(router.pathname, [key]),
      {
        shallow: true,
      }
    );
  }

  function updateValue(newValue: T) {
    router.push(
      removeQueryParameters(router.pathname, [key]),
      addQueryParameter(router.pathname, key, JSON.stringify(newValue)),
      { shallow: true }
    );
    setValue(newValue);
  }

  return [value, updateValue, wipeValue];
}

function addQueryParameter(url: string, key: string, value: string) {
  // check if the URL already has query parameters
  const hasQueryParams = url.includes("?");

  // add the new query parameter to the URL
  if (hasQueryParams) {
    return `${url}&${key}=${value}`;
  } else {
    return `${url}?${key}=${value}`;
  }
}

export function removeQueryParameter(url: string, key: string) {
  // check if the URL already has query parameters
  const hasQueryParams = url.includes("?");
  if (!hasQueryParams) {
    return url;
  }

  // remove the query parameter from the URL
  const [baseUrl, queryParams] = url.split("?");
  const queryParamPairs = queryParams.split("&");
  const filteredQueryParamPairs = queryParamPairs.filter(
    (pair) => !pair.startsWith(`${key}=`)
  );
  const filteredQueryParams = filteredQueryParamPairs.join("&");
  return `${baseUrl}?${filteredQueryParams}`;
}

export function addQueryParameters(
  url: string,
  params: Record<string, string>
) {
  return Object.entries(params).reduce(
    (url, [key, value]) => addQueryParameter(url, key, value),
    url
  );
}

// Remove query parameters from a URL
export function removeQueryParameters(url: string, keys: string[]) {
  return keys.reduce((url, key) => removeQueryParameter(url, key), url);
}

export function sortedEntries(
  obj: { [s: string]: unknown } | ArrayLike<unknown>
) {
  const unsortedEntries = Object.entries(obj);
  const sortedEntries = unsortedEntries.sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB)
  );
  return sortedEntries;
}

export function clipObject(
  obj: { [s: string]: unknown } | ArrayLike<unknown>,
  keysToClip: string[]
) {
  const clippedObj = { ...obj };
  // @ts-ignore
  keysToClip.forEach((key: string) => delete clippedObj[key]);
  return clippedObj;
}

export const notify = (
  {
    title,
    message,
    color,
    clean,
  }: {
    title: ReactNode;
    message: ReactNode;
    color?: string;
    clean?: boolean;
  },
  isError: boolean
) => {
  if (clean) {
    notifications.clean();
  }

  notifications.show({
    title,
    message,
    color: isError ? color ?? "red" : "green",
  });
};
