"use client";

import { Button, ButtonGroup, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

type Props = {};

const navLinks = [
  {
    title: "About us",
    link: "#",
  },
  {
    title: "Pricing ",
    link: "#",
  },
  /*{
    title: "Blog ",
    link: "#",
  },*/
  {
    title: "Contact Us",
    link: "#",
  },
];

const Navbar = (props: Props) => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <header className="sticky top-0 z-30 w-full px-2 py-4 bg-white shadow-xl sm:px-4">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <a href="/">
            <div className="text-xl font-extrabold text-blue-700">EquipmentGram</div>
          </a>
          <ul className="flex-col hidden p-4 mt-4 font-medium border border-gray-100 rounded-lg md:flex md:p-0 bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white ">
            {navLinks.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <div className="space-x-2">
              <Button variant="outline">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
            <div className="inline-flex md:hidden">
              <Button>Open</Button>
            </div>
          </div>
        </div>
      </header>

      <Drawer opened={opened} onClose={close} title="Authentication" position="right">
        {/* Drawer content */}
      </Drawer>
    </>
  );
};

export default Navbar;
