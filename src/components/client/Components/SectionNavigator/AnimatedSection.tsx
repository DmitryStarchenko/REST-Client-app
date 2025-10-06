'use client';

import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

import { ReadonlyFC } from '@/types';

import styles from './SectionNavigator.module.css';
import { AnimatedSectionProps } from '../../types';

const fadeVariants = {
  enter: {
    opacity: 0,
    scale: 0.9,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
    },
  },
};

export const AnimatedSection: ReadonlyFC<AnimatedSectionProps> = ({
  activeSection,
  direction,
  requestSection,
  responseSection,
}) => {
  return (
    <Box className={styles.container}>
      <AnimatePresence mode="wait" custom={direction}>
        {activeSection === 'Request' ? (
          <motion.div
            key="Request"
            custom={direction}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={styles.section}
          >
            {requestSection}
          </motion.div>
        ) : (
          <motion.div
            key="Response"
            custom={direction}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={styles.section}
          >
            {responseSection}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
