"use client";

import Link from "next/link";
import Image from "next/image";

const buildTools = [
  {
    name: "Next.js",
    url: "https://nextjs.org/",
    logo: "nextjs.svg",
  },
  {
    name: "Terraform",
    url: "https://developer.hashicorp.com/terraform",
    logo: "terraform.svg",
  },
  {
    name: "AWS",
    url: "https://aws.amazon.com",
    logo: "aws.svg",
  },
];

export default function Footer() {
    return (
      <footer className="border-t dark:border-zinc-800 border-zinc-100 mt-10 sm:mt-32 lg:mt-24 lg:min-h-[250px] min-h-full relative">
        <div className="max-w-7xl mx-auto flex lg:flex-row flex-col items-center lg:justify-between justify-center gap-y-4 md:px-16 px-6 py-16">
          <div className="flex md:flex-row flex-col items-center gap-x-2">
            <h3 className="font-inter">Built with: </h3>
            <ul className="flex items-center gap-x-2 text-sm dark:text-zinc-400 text-zinc-500 md:mt-0 mt-3">
              {buildTools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.url}
                    target="_blank"
                    className="flex items-center gap-x-2 dark:text-white text-zinc-600 hover:underline"
                  >
                    <Image
                      alt={`${tool.name} Logo`}
                      src={tool.logo}
                      width={20}
                      height={20}
                      className="dark:invert"
                    />
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col lg:items-end items-center lg:text-start text-center">
            <small className="text-zinc-600 dark:text-zinc-400">
              Copyright © Anthony Brignano {new Date().getFullYear()} All rights
              Reserved
            </small>
          </div>
        </div>
      </footer>
    );
}
