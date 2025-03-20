"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transiton: {
      duration: 1,
      staggerChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      className="py-12 mb-16 bg-white"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          variants={itemVariants}
          className="my-12 text-center"
        >
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Discover
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find Your Dream Rental Property today!
          </p>
          <p className="mt-2 text-gray-500 max-w-3xl mx-auto">
            Searching for your dream rental property has never been easier. With
            our user-friendly search feature, you can quickly find the perfect
            home that meets all your needs. Start your search today and discover
            your dream rental property!
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((index) => {
            return (
              <motion.div key={index} variants={itemVariants}>
                <DiscoverCard
                  imageSrc={[
                    "/landing-icon-wand.png",
                    "/landing-icon-calendar.png",
                    "/landing-icon-heart.png",
                  ][index]}
                  title={
                    [
                      "Search for Properties",
                      "Book your Rental",
                      "Enjoy your New Home",
                    ][index]
                  }
                  description={
                    [
                      "Browse through our extensive collection of rental properties in your desired location.",
                      "Once you've found the perfect rental property, easily book it online with just a few clicks.",
                      "Move into your new rental property and start enjoying your dream home",
                    ][index]
                  }
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-72 text-center">
      <div className="bg-primary-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
        <Image
          src={imageSrc}
          width={50}
          height={50}
          className="w-full h-full"
          alt={title}
        />
      </div>
      <h3 className="text-xl font-medium mt-4 text-gray-800">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{description}</p>
    </div>
  );
};

export default DiscoverSection;
