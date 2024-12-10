"use client"
import { motion, Variants } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

interface AccordionItemProps {
  title: string
  content: string
  isExpanded: boolean
  onToggle: () => void
}

interface AccordionProps {
  items: Array<{
    title: string
    content: string
  }>
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isExpanded,
  onToggle,
}) => {
  const cardVariants: Variants = {
    collapsed: {
      height: '60px',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
    expanded: {
      height: 'auto',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  }

  const contentVariants: Variants = {
    collapsed: { opacity: 0 },
    expanded: {
      opacity: 1,
      transition: { delay: 0.1 },
    },
  }

  const chevronVariants: Variants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
  }

  return (
    <motion.div
      className={`w-full my-4 h-full cursor-pointer select-none overflow-hidden rounded-lg border border-gray-700`}
      variants={cardVariants}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      onClick={onToggle}
      style={{
        background: 'linear-gradient(100deg, rgba(253, 70, 109, 0.8) 20%, rgba(137, 82, 222, 0.8) 100%)'
      }}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="m-0 text-lg font-semibold text-gray-100">{title}</h2>
        <motion.div variants={chevronVariants}>
          <ChevronDown size={18} />
        </motion.div>
      </div>
      <motion.div
        className="text-md w-full max-w-[40rem] select-none px-4 py-4 overflow-y-auto"
        style={{ maxHeight: '20rem' }} // Set a maximum height for the content area
        variants={contentVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
      >
        <p className="m-0 text-sm flex flex-wrap text-gray-300">
          {content}
        </p>
      </motion.div>
    </motion.div>
  )
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="space-y-4 w-[22rem] sm:w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isExpanded={expandedIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  )
}

const accordionItems = [
    {
        title: 'What is BarterClub?',
        content: 'BarterClub is a platform that allows you to trade goods and services with other users. You can list items you want to trade, and browse items that other users have listed. When you find something you want, you can make an offer to trade with the other user.'
    },
    {
        title: 'How does BarterClub work?',
        content: 'To get started with BarterClub, you need to create an account. Once you have an account, you can list items you want to trade, and browse items that other users have listed. When you find something you want, you can make an offer to trade with the other user. If the other user accepts your offer, you can arrange to meet up and complete the trade.'
    },
    {
        title: 'Is BarterClub free to use?',
        content: 'Yes, BarterClub is completely free to use. There are no fees or charges for listing items or making trades. However, you will need to arrange to meet up with other users to complete trades, so you may incur costs for travel or shipping  we also have premium plans which has its own benefits. like listing your product in our social community, Free points every months, Invitation to community programs, product discounts etc.'
    },
    {
        title: 'Is BarterClub safe?',
        content: 'BarterClub takes the safety and security of its users very seriously. We have a number of measures in place to protect users and prevent fraud. However, it is important to exercise caution when making trades with other users, and to follow our safety guidelines.'
    },
    {
        title: 'How can I contact BarterClub?',
        content: 'If you have any questions or concerns about BarterClub, you can contact us by email '
    }
]

const AccordionExample: React.FC = () => {
  return (
    <div>
      <div className="p-8 flex items-center justify-center w-full">
        <Accordion items={accordionItems} />
      </div>
    </div>
  )
}

export default AccordionExample