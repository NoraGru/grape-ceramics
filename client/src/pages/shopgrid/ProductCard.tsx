import React from 'react';
import {
  getProductLayoutClasses,
  getImageHeightClasses,
  capitalizeFirstLetter,
} from './ProductLayoutUtils';
import { ProductCardProps } from './types';

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onClick,
}) => {
  return (
    <div
      className={getProductLayoutClasses(index)}
      onClick={() => onClick(product.id)}
    >
      {/* Produktbild */}
      <div
        className={`w-full ${getImageHeightClasses(index)} bg-gray-100 overflow-hidden`}
      >
        <img
          src={product.images[0].src}
          alt={product.images[0].alt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Produktnamn och pris */}
      <div className="mt-2 ml-3 flex flex-col justify-between">
        <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
          {capitalizeFirstLetter(product.name)}
        </span>
        <div className="flex text-right font-light mr-2 mt-2 mb-2">
          {product.sale_price ? (
            <>
              <span className="text-xs line-through text-gray-400">
                {product.regular_price} SEK
              </span>
              <br />
              <span className="text-xs ml-2">{product.price} SEK</span>
            </>
          ) : (
            <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
              {product.price} SEK
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
