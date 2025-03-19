'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity : 0, y: 50},
  visible: {
    opacity: 1,
    y: 0,
    transiton : {
      duration: 1,
      staggerChildren: 0.5
    }
  }
}

const itemVariants = {
  hidden : { opacity : 0, y: 20},
  visible: { opacity: 1, y: 0 }
}

const FeaturesSection = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true}}
      className='py-24 px-6 sm:px-12 xl:px-16 bg-white'>
        <div className='max-w-4xl xl:max-w-6xl mx-auto'>
          <motion.h2
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true}}
            className='text-3xl font-bold text-center mb-12 w-full sm:w-2/3 mx-auto'>
              Quickly find the home you want using our effective search filters!
            </motion.h2>
            <div className='gri grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16'>
              {[0,1,2].map((index) => {
                <motion.div
                key={index}
                variants={itemVariants}
                >
                  
                </motion.div>
              })}
            </div>
        </div>
      </motion.div>
  )
}

const FeatureCard = ({
  imageSrc,
  title,
  description,
  linkText,
  linkHref
} :{
  imageSrc : string,
  title : string,
  description : string,
  linkText : string,
  linkHref : string
}) => {
  <div className='text-center'>
    <div className='p-4 rounded-lg mb-4 flex items-center justify-center h-48'>
      <Image
      src={imageSrc}
      width={400}
      height={400}
      className='w-full h-full object-contain'
      alt={title} />
    </div>
    <h3 className='text-xl font-semibold mb-2'>{title}</h3>
    <p className='mb-4'>{description}</p>
    <Link></Link>
  </div>
}
 
export default FeaturesSection