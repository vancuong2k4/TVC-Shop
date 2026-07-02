import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb component
 * @param {Array} items - Array of objects { name: string, path: string }
 * If path is not provided or empty, it will be rendered as active text.
 */
const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-black transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-black">{item.name}</span>
            )}
            
            {!isLast && (
              <ChevronRight size={12} className="mx-2 text-gray-300 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
