"use client";

import { useRouter } from "next/navigation";

const RedirectPage = () => {
  const navigation = useRouter();
  navigation.replace("/forms");
};

export default RedirectPage;
