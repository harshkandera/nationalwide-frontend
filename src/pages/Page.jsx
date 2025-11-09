import React from "react";
import { Link } from "react-router-dom";
import Img1 from "../assests/img1.png";
import { Button } from "../component/ui/button";
const Page = () => {
  return (
    <main class="grid min-h-full place-items-center bg-white px-6 py-20 sm:py-32 lg:px-8">
      <div class="text-center flex flex-col justify-center items-center">
        <p class="text-base font-semibold text-indigo-600 w-80">
          <img src={Img1} alt="" />
        </p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p class="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/">
            <Button>Go Back To Home</Button>
          </Link>

          <Link>
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;
