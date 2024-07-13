export const productCardVariants = (currentPage, totalPages) => ({
    hidden: {
      width: `${totalPages * 100}%`,
      transform: `translateX(-${currentPage * 100}%)`,
      transition: { type: 'tween' }
    },
    visible: {
      width: `${totalPages * 100}%`,
      transform: `translateX(-${currentPage * 100}%)`,
      transition: { type: 'tween' }
    }
  });