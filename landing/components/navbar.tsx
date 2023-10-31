"use client";

import { useAuth } from "@/lib/authContext";
import { navLinks } from "@/utils/nav-links";
import { ActionIcon, Button, CloseButton, Divider, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu } from "@tabler/icons-react";
import Link from "next/link";
import NavUserMenu from "./nav-user-menu";

type Props = {};

const Navbar = ({}: Props) => {
  const [opened, { open, close }] = useDisclosure();
  const { user } = useAuth();
  console.log(user);

  return (
    <>
      <header className="sticky top-0 z-30 w-full px-2 py-4 bg-white border border-b sm:px-4">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <Link href="/">
            <div className="text-xl font-extrabold text-blue-700">EquipmentGram</div>
          </Link>
          <ul className="flex-col hidden p-4 mt-4 font-medium border border-gray-100 rounded-lg md:flex md:p-0 bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white ">
            {navLinks.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.link}
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
                >
                  {item.title}
                </Link>
              </li>
            ))}
            {/* <li>
              <Link
                href="/admin/inspection-requests"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
              >
                Admin
              </Link>
            </li> */}
          </ul>
          <div className="flex gap-2">
            {!user ? (
              <div className="space-x-2 hidden md:block">
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
                <Link href="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            ) : (
              <NavUserMenu />
            )}
            <div className="md:hidden inline-flex ">
              <ActionIcon onClick={open} variant="white" color="dark">
                <IconMenu />
              </ActionIcon>
            </div>
          </div>
        </div>
      </header>

      <Drawer withCloseButton={false} opened={opened} onClose={close} position="right">
        <div className="flex justify-between">
          <a href="/">
            <div className="text-xl font-extrabold text-blue-700">EquipmentGram</div>
          </a>
          <CloseButton onClick={close} />
        </div>
        <ul className="flex flex-col gap-4 mt-4 font-medium ">
          {navLinks.map((item, i) => (
            <li key={i}>
              <a href={item.link} className="underline text-gray-900 rounded text-xl  hover:text-blue-700 ">
                {item.title}
              </a>
            </li>
          ))}

          <Divider />

          <div className="grid grid-cols-2 gap-2">
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </ul>
      </Drawer>
    </>
  );
};

export default Navbar;
