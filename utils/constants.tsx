import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL("https://brignano.io"),
  title: "Anthony Brignano | Platform Engineering & DevSecOps",
  description:
    "Anthony Brignano's personal portfolio website showcasing projects, skills, and experience.",
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: "Anthony Brignano | Platform Engineering & DevSecOps",
    description:
      "Explore Anthony Brignano's portfolio and full-stack development experience.",
    url: "https://brignano.io",
    siteName: "Anthony Brignano Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Anthony Brignano Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Brignano | Platform Engineering & DevSecOps",
    description:
      "Platform engineering and DevSecOps leader building secure, scalable CI/CD and cloud-native systems, with deep experience across enterprise platforms.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://brignano.io",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const socialLinks = [
  {
    name: "GitHub",
    href: "https://www.github.com/brignano",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        ></path>
      </svg>
    ),
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/brignano",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
      </svg>
    ),
  },
  {
    name: "WakaTime",
    href: "https://wakatime.com/@brignano",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 256 256"
        className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path d="M128,0 C57.308,0 0,57.308 0,128 C0,198.693 57.308,256 128,256 C198.693,256 256,198.693 256,128 C256,57.308 198.693,0 128,0 M128,33.805 C179.939,33.805 222.195,76.061 222.195,128 C222.195,179.94 179.939,222.195 128,222.195 C76.061,222.195 33.805,179.94 33.805,128 C33.805,76.061 76.061,33.805 128,33.805 M115.4993,155.6431 L115.3873,155.6431 C113.4353,155.6081 111.6083,154.6751 110.4343,153.1151 L81.5593,114.7321 C79.4553,111.9351 80.0173,107.9611 82.8143,105.8561 C85.6123,103.7511 89.5853,104.3131 91.6903,107.1111 L115.6833,139.0051 L122.5463,130.5271 C123.7493,129.0411 125.5603,128.1771 127.4723,128.1771 L127.4803,128.1771 C129.3973,128.1791 131.2093,129.0471 132.4103,130.5411 L139.0003,138.7281 L176.6923,90.1341 C178.8353,87.3681 182.8173,86.8651 185.5843,89.0111 C188.3493,91.1561 188.8533,95.1371 186.7073,97.9041 L144.1003,152.8371 C142.9143,154.3681 141.0883,155.2721 139.1503,155.2901 L139.0933,155.2901 C137.1743,155.2901 135.3583,154.4221 134.1553,152.9261 L127.4583,144.6071 L120.4253,153.2931 C119.2213,154.7811 117.4103,155.6431 115.4993,155.6431"></path>
        </g>
      </svg>
    ),
  },
  /*
  {
    name: "Instagram",
    href: "https://instagram.com/_brignano",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="flex-shrink-0 h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
        <circle cx="16.806" cy="7.207" r="1.078"></circle>
        <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"></path>
      </svg>
    ),
  },
  {
    name: "Stack Overflow",
    href: "https://stackoverflow.com/users/5574831/anthony",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="flex-shrink-0 h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.24 19.399v-4.804h1.6V21H4.381v-6.405h1.598v4.804H17.24zM7.582 17.8h8.055v-1.604H7.582V17.8zm.195-3.64 7.859 1.641.34-1.552-7.861-1.642-.338 1.553zm1.018-3.794 7.281 3.398.678-1.463-7.281-3.399-.678 1.454v.01zm2.037-3.589 6.166 5.142 1.018-1.216-6.162-5.14-1.016 1.213-.006.001zm3.982-3.778-1.311.969 4.803 6.454 1.313-.971-4.807-6.452h.002z"></path>
      </svg>
    ),
  },
  {
    name: "Hack The Box",
    href: "https://app.hackthebox.com/profile/1336058",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.9958 0.000802989C11.9768 0.000985126 11.9578 0.00165201 11.9388 0.00280299C11.8583 0.00874818 11.779 0.0254986 11.703 0.052603C11.6454 0.073294 11.5901 0.0997622 11.5378 0.131603L1.93561 5.675C1.80048 5.75304 1.68828 5.86527 1.61027 6.00042C1.53226 6.13556 1.4912 6.28886 1.49121 6.4449C1.49121 6.4509 1.49161 6.4577 1.49181 6.4641C1.49161 6.4711 1.49181 6.4781 1.49181 6.4853V17.556C1.49178 17.7168 1.53538 17.8747 1.61798 18.0127C1.70057 18.1507 1.81905 18.2637 1.96081 18.3397L11.5591 23.8813C11.5771 23.8915 11.5951 23.901 11.6131 23.91V23.912C11.6401 23.9251 11.6679 23.9367 11.6961 23.9468C11.6961 23.9478 11.7061 23.9498 11.7081 23.9508C11.7361 23.9608 11.7641 23.9685 11.7931 23.9753C11.8031 23.9763 11.8041 23.9783 11.8091 23.9793C11.8371 23.9853 11.8661 23.9905 11.8951 23.9939C11.8951 23.9944 11.9051 23.9948 11.9091 23.9949C11.9391 23.9979 11.9701 23.9999 12.0001 23.9999C12.0301 23.9999 12.0611 23.9979 12.0911 23.9949C12.0911 23.9944 12.1011 23.994 12.1051 23.9939C12.1341 23.9909 12.1628 23.986 12.1911 23.9793C12.2011 23.9783 12.2021 23.9773 12.2071 23.9753C12.2358 23.9685 12.2642 23.9603 12.2921 23.9508C12.2921 23.9498 12.3021 23.9478 12.3041 23.9468C12.3324 23.9367 12.3601 23.9251 12.3871 23.9121V23.9101C12.4054 23.901 12.4234 23.8915 12.4411 23.8814L22.0397 18.3398C22.1814 18.2638 22.2999 18.1508 22.3825 18.0128C22.4651 17.8748 22.5087 17.7169 22.5086 17.5561V6.4786C22.5086 6.4696 22.508 6.4614 22.5078 6.4528H22.5081V6.4448C22.5081 6.31637 22.4802 6.18948 22.4264 6.07286C22.3725 5.95625 22.2941 5.85268 22.1964 5.7693C22.1864 5.7613 22.1774 5.7531 22.1674 5.7452C22.1674 5.7432 22.1574 5.7402 22.1574 5.7382C22.1233 5.71217 22.0874 5.68861 22.05 5.6677L12.4532 0.126703C12.313 0.0424783 12.1522 -0.0013357 11.9886 0.000102989L11.9958 0.000802989ZM12.0058 2.2531C12.0778 2.2531 12.1501 2.2718 12.2148 2.3091L18.7514 6.0831C19.0303 6.2441 19.0303 6.6464 18.7514 6.8074L12.2147 10.5814C12.1511 10.6181 12.079 10.6374 12.0056 10.6374C11.9322 10.6374 11.8601 10.6181 11.7965 10.5814L5.25991 6.8074C4.98111 6.6465 4.98101 6.2441 5.25991 6.0831L11.7967 2.3091C11.8603 2.27247 11.9323 2.25316 12.0057 2.2531H12.0058ZM3.92571 8.7111C4.00119 8.71001 4.07553 8.72954 4.14071 8.7676L10.6647 12.5342C10.7281 12.5708 10.7808 12.6234 10.8174 12.6868C10.854 12.7503 10.8733 12.8222 10.8733 12.8954V20.428C10.8733 20.7492 10.5256 20.95 10.2473 20.7893L3.72361 17.0227C3.66019 16.9861 3.60752 16.9334 3.57091 16.87C3.53429 16.8066 3.51501 16.7346 3.51501 16.6614V9.1288C3.51501 8.888 3.71051 8.7148 3.92571 8.7111ZM20.0856 8.7111C20.3006 8.7151 20.4963 8.8879 20.4963 9.1288V16.6613C20.4963 16.8103 20.4163 16.9481 20.2876 17.0227L13.7637 20.7893C13.4857 20.9499 13.1379 20.7492 13.1379 20.4279V12.8954C13.1379 12.7464 13.2179 12.6087 13.3465 12.5341L19.8703 8.7675C19.9356 8.72943 20.01 8.7099 20.0855 8.711L20.0856 8.7111Z" />
      </svg>
    ),
  },
  {
    name: "CodeWars",
    href: "https://www.codewars.com/users/brignano",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        role="img"
        viewBox="0 0 24 24"
        className="flex-shrink-0 h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title></title>
        <path d="M1.072.142A1.072 1.072 0 0 0 0 1.214v21.572a1.072 1.072 0 0 0 1.072 1.072h21.856A1.072 1.072 0 0 0 24 22.786V1.214A1.072 1.072 0 0 0 22.928.142zm9.736 1.818a.904.904 0 0 1 .828.539.784.784 0 0 1 1.274.493.639.639 0 0 1 .29-.06c.33.008.59.262.625.575a1.322 1.322 0 0 1 .624-.515 1.325 1.325 0 0 1 1.718.71 1.098 1.098 0 0 1 .306-.236 1.102 1.102 0 0 1 1.483.479 1.094 1.094 0 0 1 .12.47.994.994 0 0 1 1.322 1.214.904.904 0 0 1 .874 1.438.784.784 0 0 1 .176 1.356.639.639 0 0 1 .19.224.642.642 0 0 1-.011.613 1.326 1.326 0 0 1 .482.235 1.334 1.334 0 0 1 .258 1.842 1.098 1.098 0 0 1 .35.15 1.102 1.102 0 0 1 .337 1.516 1.094 1.094 0 0 1-.344.344.994.994 0 0 1 .228 1.318 1.006 1.006 0 0 1-.605.434.904.904 0 0 1-.803 1.482.814.814 0 0 0-.008-.04.784.784 0 0 1-1.075.873.639.639 0 0 1-.098.28.625.625 0 0 1-.43.288 1.33 1.33 0 0 1 .023.456 1.334 1.334 0 0 1-1.44 1.173 1.098 1.098 0 0 1 .054.377 1.102 1.102 0 0 1-1.128 1.072 1.098 1.098 0 0 1-.47-.12.994.994 0 0 1-1.696.583.904.904 0 0 1-1.685.075.784.784 0 0 1-1.274-.493.639.639 0 0 1-.29.064.64.64 0 0 1-.621-.58l.004-.007a1.326 1.326 0 0 1-.632.523 1.334 1.334 0 0 1-1.718-.706 1.098 1.098 0 0 1-.306.232 1.102 1.102 0 0 1-1.48-.478 1.094 1.094 0 0 1-.123-.471.994.994 0 0 1-1.318-1.21.904.904 0 0 1-.874-1.442.784.784 0 0 1-.176-1.356.639.639 0 0 1-.194-.224.642.642 0 0 1 .011-.61l.019.004a1.326 1.326 0 0 1-.497-.239 1.334 1.334 0 0 1-.262-1.845 1.098 1.098 0 0 1-.35-.146 1.102 1.102 0 0 1-.337-1.52 1.094 1.094 0 0 1 .347-.34A.994.994 0 0 1 2.88 9a.904.904 0 0 1 .803-1.48.784.784 0 0 1 1.083-.836.639.639 0 0 1 .098-.28.649.649 0 0 1 .433-.288 1.33 1.33 0 0 1-.026-.452A1.334 1.334 0 0 1 6.716 4.49a1.098 1.098 0 0 1-.06-.377 1.101 1.101 0 0 1 1.13-1.073 1.094 1.094 0 0 1 .47.115.994.994 0 0 1 1.696-.579.904.904 0 0 1 .857-.617zM3.683 7.519a.784.784 0 0 0 .008.041l-.004-.04a.904.904 0 0 0-.004-.001zM17.502 19.61a1.098 1.098 0 0 0-.002-.004h-.037a1.334 1.334 0 0 0 .039.004zM13.825 3.507a1.322 1.322 0 0 0-.008.012l.008-.011zm-2.369-.014l-.003.003a.9.9 0 0 1-.665.27.896.896 0 0 1-.583-.232.994.994 0 0 1-.986.732.99.99 0 0 1-.362-.075 1.098 1.098 0 0 1-1.061 1.046 1.326 1.326 0 0 1 .123.736 1.334 1.334 0 0 1-.725 1.035 1.1 1.1 0 0 1 .307.795 1.106 1.106 0 0 1-.232.65c.321.18.53.523.523.915a1.016 1.016 0 0 1-.07.337.915.915 0 0 1 .82.937.923.923 0 0 1-.01.138.74.74 0 0 1 .157-.01c.343.007.627.25.702.57a.661.661 0 0 1 .38-.111c.31.007.561.224.632.511a.418.418 0 0 1 .381-.015 1.352 1.352 0 0 1 .303-.63.418.418 0 0 1-.12-.143.422.422 0 0 1 .004-.392.665.665 0 0 1-.325-1.117.736.736 0 0 1-.359-.336.74.74 0 0 1 .385-1.023.747.747 0 0 0-.06.026.915.915 0 0 1-.201-.262.915.915 0 0 1 .623-1.315V6.53a1.02 1.02 0 0 1 .437-1.371 1.012 1.012 0 0 1 .553-.112 1.11 1.11 0 0 1 .598-1.054 1.12 1.12 0 0 1 .06-.026.642.642 0 0 1-.109-.21.784.784 0 0 1-.455.132.784.784 0 0 1-.662-.396zm4.573 1.512a1.326 1.326 0 0 1-.587.46 1.334 1.334 0 0 1-1.255-.142v-.011a1.11 1.11 0 0 1-.553.66 1.106 1.106 0 0 1-.683.113 1.02 1.02 0 0 1-.553.889 1.016 1.016 0 0 1-.329.105.918.918 0 0 1-.43 1.169.923.923 0 0 1-.127.056.74.74 0 0 1 .086.13.738.738 0 0 1-.168.89.661.661 0 0 1 .28.283.655.655 0 0 1-.149.796.418.418 0 0 1 .153.164c.019.034.03.068.038.101a1.356 1.356 0 0 1 .672-.015.422.422 0 0 1 .056-.142.422.422 0 0 1 .34-.194.665.665 0 0 1 .796-.848.736.736 0 0 1 .112-.478.733.733 0 0 1 1.016-.224.915.915 0 0 1 .127-.306.915.915 0 0 1 1.27-.28.915.915 0 0 1 .179.153 1.02 1.02 0 0 1 1.408-.314 1.012 1.012 0 0 1 .374.422c.355-.24.833-.261 1.214-.015a1.11 1.11 0 0 1 .209.172.642.642 0 0 1 .082-.108.784.784 0 0 1-.332-.337.784.784 0 0 1 .03-.77.9.9 0 0 1-.553-.455.896.896 0 0 1-.075-.624.994.994 0 0 1-1.117-.511.994.994 0 0 1-.104-.359 1.098 1.098 0 0 1-1.427-.43zM5.249 7.37a.784.784 0 0 1-.124.46.784.784 0 0 1-.68.362c.06.235.026.49-.112.71a.896.896 0 0 1-.5.377c.31.325.373.829.12 1.225a.99.99 0 0 1-.255.269 1.098 1.098 0 0 1 .351 1.45 1.326 1.326 0 0 1 .691.276 1.334 1.334 0 0 1 .512 1.154c.28-.064.579-.019.84.15a1.106 1.106 0 0 1 .438.53 1.02 1.02 0 0 1 1.05.03 1.016 1.016 0 0 1 .257.231.914.914 0 0 1 1.225-.224.919.919 0 0 1 .112.086.74.74 0 0 1 .071-.142.74.74 0 0 1 .852-.306.661.661 0 0 1 .1-.381.664.664 0 0 1 .763-.273.418.418 0 0 1 .246-.373 1.36 1.36 0 0 1-.358-.523v-.008a.418.418 0 0 1-.25.075.422.422 0 0 1-.344-.19.665.665 0 0 1-1.132-.243.736.736 0 0 1-.47.149.733.733 0 0 1-.718-.755.915.915 0 0 1-.329.049.915.915 0 0 1-.855-1.177h-.004a1.016 1.016 0 0 1-.993-1.042 1.012 1.012 0 0 1 .168-.534 1.11 1.11 0 0 1-.64-1.035 1.11 1.11 0 0 1 .068-.358.65.65 0 0 1-.1-.019zm11.127 2.133a.913.913 0 0 1-1.225.224.926.926 0 0 1-.112-.082.74.74 0 0 1-.067.142.74.74 0 0 1-.852.302.661.661 0 0 1-.105.385.662.662 0 0 1-.762.277.418.418 0 0 1-.063.212.426.426 0 0 1-.075.086 1.356 1.356 0 0 1 .314.564.418.418 0 0 1 .187-.04.422.422 0 0 1 .343.194.665.665 0 0 1 1.136.242.736.736 0 0 1 .467-.153c.41.008.728.348.72.755a.74.74 0 0 1 0 .008v-.005a.915.915 0 0 1 .326-.052.915.915 0 0 1 .896.941.919.919 0 0 1-.037.236c.564.015 1.008.482.993 1.046a1.012 1.012 0 0 1-.168.534 1.11 1.11 0 0 1 .647 1.035 1.11 1.11 0 0 1-.075.362l.004-.007.1.018a.784.784 0 0 1 .124-.46.784.784 0 0 1 .68-.362.9.9 0 0 1 .112-.71.896.896 0 0 1 .504-.373.994.994 0 0 1-.123-1.225.99.99 0 0 1 .257-.269 1.098 1.098 0 0 1-.35-1.453 1.326 1.326 0 0 1-.696-.273h-.003a1.334 1.334 0 0 1-.512-1.158 1.082 1.082 0 0 1-.837-.145 1.106 1.106 0 0 1-.44-.535 1.02 1.02 0 0 1-1.05-.026 1.016 1.016 0 0 1-.258-.235zm-.094 3.116l-.007.066a.74.74 0 0 0 .007-.066zm-2.864-.259a1.36 1.36 0 0 1-.363.598.418.418 0 0 1 .194.187.422.422 0 0 1-.007.396.665.665 0 0 1 .329 1.113.736.736 0 0 1 .358.336.739.739 0 0 1-.32.994.915.915 0 0 1 .197.261.91.91 0 0 1-.396 1.233.919.919 0 0 1-.224.082v.004a1.02 1.02 0 0 1-.44 1.374 1.012 1.012 0 0 1-.55.109 1.11 1.11 0 0 1-.661 1.083.642.642 0 0 1 .112.21.026.026 0 0 1-.004 0v.003a.784.784 0 0 1 .456-.134.784.784 0 0 1 .661.392.9.9 0 0 1 .665-.27.896.896 0 0 1 .587.236.994.994 0 0 1 .982-.736.99.99 0 0 1 .362.079v.022a1.1 1.1 0 0 1 1.061-1.072 1.326 1.326 0 0 1-.123-.736c.056-.46.34-.837.725-1.035l.003.004a1.102 1.102 0 0 1-.31-.795 1.106 1.106 0 0 1 .232-.654 1.02 1.02 0 0 1-.452-1.251.915.915 0 0 1-.822-.934.923.923 0 0 1 .011-.142.74.74 0 0 1-.157.015.74.74 0 0 1-.698-.572.661.661 0 0 1-.385.112.667.667 0 0 1-.627-.512.418.418 0 0 1-.217.053.418.418 0 0 1-.18-.045zm-.964.93a1.36 1.36 0 0 1-.336.042c-.112 0-.22-.012-.322-.038a.418.418 0 0 1-.06.295.422.422 0 0 1-.343.195.665.665 0 0 1-.792.844.736.736 0 0 1-.112.478.74.74 0 0 1-1.02.224.915.915 0 0 1-.127.306.915.915 0 0 1-1.266.28.919.919 0 0 1-.183-.153v.004a1.02 1.02 0 0 1-1.408.31 1.012 1.012 0 0 1-.374-.418c-.355.239-.83.261-1.214.015a1.113 1.113 0 0 1-.21-.172.65.65 0 0 1-.081.105.784.784 0 0 1 .336.336.784.784 0 0 1-.034.77.89.89 0 0 1 .553.455.896.896 0 0 1 .075.624.994.994 0 0 1 1.12.515.99.99 0 0 1 .101.355 1.098 1.098 0 0 1 1.431.43 1.326 1.326 0 0 1 .587-.46c.43-.172.896-.104 1.255.142a1.106 1.106 0 0 1 .549-.65 1.106 1.106 0 0 1 .683-.108 1.02 1.02 0 0 1 .553-.893 1.02 1.02 0 0 1 .333-.104.916.916 0 0 1 .425-1.17.919.919 0 0 1 .131-.052.736.736 0 0 1-.09-.134.738.738 0 0 1 .169-.886.661.661 0 0 1-.28-.284.67.67 0 0 1 .149-.799.418.418 0 0 1-.15-.164.418.418 0 0 1-.048-.24z"></path>
      </svg>
    ),
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/brignano/",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        role="img"
        viewBox="0 0 24 24"
        className="flex-shrink-0 h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z" />
      </svg>
    ),
  },
  {
    name: "CodePen",
    href: "https://codepen.io/brignano",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21.838 8.445c0-.001-.001-.001 0 0l-.003-.004-.001-.001v-.001a.809.809 0 0 0-.235-.228l-9.164-6.08a.834.834 0 0 0-.898 0L2.371 8.214A.786.786 0 0 0 2 8.897v6.16a.789.789 0 0 0 .131.448v.001l.002.002.01.015v.002h.001l.001.001.001.001c.063.088.14.16.226.215l9.165 6.082a.787.787 0 0 0 .448.139.784.784 0 0 0 .45-.139l9.165-6.082a.794.794 0 0 0 .371-.685v-6.16a.793.793 0 0 0-.133-.452zm-9.057-4.172 6.953 4.613-3.183 2.112-3.771-2.536V4.273zm-1.592 0v4.189l-3.771 2.536-3.181-2.111 6.952-4.614zm-7.595 6.098 2.395 1.59-2.395 1.611v-3.201zm7.595 9.311-6.96-4.617 3.195-2.15 3.765 2.498v4.269zm.795-5.653-3.128-2.078 3.128-2.105 3.131 2.105-3.131 2.078zm.797 5.653v-4.27l3.766-2.498 3.193 2.15-6.959 4.618zm7.597-6.11-2.396-1.611 2.396-1.59v3.201z"></path>
      </svg>
    ),
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/id/brignano",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="flex-shrink-0 h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8.21 17.32 7 16.8a2.13 2.13 0 1 0 1.17-2.93l1.28.53a1.58 1.58 0 0 1-1.22 2.92z"></path>
        <path d="M12 2a10 10 0 0 0-10 9.34l5.38 2.21a2.31 2.31 0 0 1 .47-.24A2.62 2.62 0 0 1 9 13.1l2.44-3.56a3.8 3.8 0 1 1 3.8 3.8h-.08l-3.51 2.5a2.77 2.77 0 0 1-5.47.68l-3.77-1.6A10 10 0 1 0 12 2z"></path>
        <path d="M17.79 9.5a2.53 2.53 0 1 0-2.53 2.5 2.54 2.54 0 0 0 2.53-2.5zm-4.42 0a1.9 1.9 0 1 1 1.9 1.91 1.9 1.9 0 0 1-1.9-1.92z"></path>
      </svg>
    ),
  },
  */
];

export type Project = {
  title: string;
  description: string;
  tech: string[];
  links?: { label: string; url: string }[];
};

export const highlights = [
  "Cloud-native architecture (AWS / GCP)",
  "DevSecOps & security-first delivery",
  "CI/CD automation & developer experience",
  "Platform engineering & internal tooling",
  "Observability & reliability",
  "Test automation & test data strategy",
];

export const projects: Project[] = [];

export const jobs = [
  {
    company: "The Hartford",
    logo: "the-hartford.svg",
    url: "https://www.thehartford.com/",
    title: "Senior Staff Software Engineer — Enterprise Platform Engineering",
    summary:
      "Owner of the enterprise developer platform ecosystem, spanning CI/CD, security, artifact management, and observability across thousands of repositories.",
    bullets: [
      "Drove enterprise migration from GitHub Enterprise Server to GitHub Enterprise Cloud (**11,000+ repositories**)",
      "Built and operated scalable CI/CD execution, governance, and observability platforms",
      "Led rollout of next-generation CI/CD tooling and reduced developer-reported incidents",
      "Recognized with the 2023 Enterprise Tech Data & Cyber Award for platform adoption and productivity",
    ],
    tech: "GitHub Actions, GitHub Enterprise, Terraform, AWS, Harness, Dynatrace",
    startDate: "2023",
    endDate: "Present",
    topic: "DevSecOps",
    location: "The Hartford",
  },
  {
    company: "The Hartford",
    logo: "the-hartford.svg",
    url: "https://www.thehartford.com/",
    title: "Staff Software Engineer — Enterprise Quality Engineering",
    summary:
      "Drove standardization of enterprise quality engineering platforms, enabling scalable, reliable end-to-end validation.",
    bullets: [
      "Led multiple teams delivering automated testing solutions across critical systems",
      "Built enterprise test data management and automated validation platforms",
      "Established SDLC and automation standards across the organization",
      "Reduced end-to-end test execution time by **30%+**",
    ],
    startDate: "2021",
    endDate: "2023",
    topic: "Quality Engineering",
    location: "The Hartford",
  },
  {
    company: "The Hartford",
    logo: "the-hartford.svg",
    url: "https://www.thehartford.com/",
    title: "Senior Software Engineer — Batch Processing Modernization",
    summary:
      "Owned modernization of enterprise batch processing pipelines supporting financial and regulatory reporting.",
    bullets: [
      "Transformed policy administration data into general ledger flat files for premium reporting",
      "Consolidated **108 legacy applications** into a single modern policy administration platform",
      "Established CI/CD, monitoring, and reliability standards for batch delivery",
    ],
    tech: "Jenkins, uDeploy, .NET, Oracle, Dynatrace, Sumo Logic",
    startDate: "2020",
    endDate: "2021",
    topic: "Batch Processing",
    location: "The Hartford",
  },
  {
    company: "The Hartford",
    logo: "the-hartford.svg",
    url: "https://www.thehartford.com/",
    title: "Software Engineer — Full-Stack Development",
    summary:
      "Built and supported customer-facing policy quoting and issuance platforms for Personal Lines insurance, enabling real-time pricing and issuance workflows.",
    bullets: [
      "Developed Java microservices and Angular-based frontend features supporting quoting and issuance",
      "Integrated Oracle databases and third-party services for pricing and issuance",
      "Supported scalable production deployments and reliability initiatives",
    ],
    startDate: "2018",
    endDate: "2020",
    topic: "Full-Stack Development",
    location: "The Hartford",
  },
  {
    company: "The Hartford",
    logo: "the-hartford.svg",
    url: "https://www.thehartford.com/",
    title: "Multi-Stack Engineer - Reliability Engineering",
    summary:
      "Owned application platforms and production operations, focusing on reliability, modernization, and DevOps enablement across the application portfolio.",
    bullets: [
      "Served as the primary point of ownership for full-stack applications spanning software, databases, platforms, and infrastructure",
      "Led triage and restoration of high-impact production incidents, minimizing service disruption",
      "Drove root cause analysis and problem management practices to prevent recurring issues",
      "Championed migration to open-source platforms, containerization, and public cloud deployment",
      "Led adoption of DevOps tools and best practices across the application portfolio",
      "Influenced major technical design decisions in partnership with architecture and delivery teams",
    ],
    startDate: "2017",
    endDate: "2018",
    topic: "Reliability Engineering",
    location: "The Hartford",
  },
  {
    company: "The Hartford",
    logo: "the-hartford.svg",
    url: "https://www.thehartford.com/",
    title: "Developer - Personal Lines Insurance",
    summary:
      "Drove delivery and production stability for an internal policy quoting and issuance application, supporting Personal Insurance agents.",
    bullets: [
      "Led an Agile scrum team in the design and architecture of a new internal application for quoting and issuing Personal Insurance policies",
      "Integrated multiple internal and external web services to streamline workflows and reduce agent handling time",
      "Resolved **1,500+ production defects and incidents**, ensuring reliable application performance",
      "Supported ongoing enhancements and operational stability for a mission-critical internal system",
    ],
    startDate: "2016",
    endDate: "2017",
    topic: "Production Support",
    location: "Windsor, Connecticut · On-site",
  },
];
