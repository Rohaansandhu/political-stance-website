import { HStack, Button, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
  disabled = false
}: PaginationProps) {
  
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  // Calculate page range to display
  const getPageRange = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate smart page range
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);

      // Adjust if we're near the beginning
      if (currentPage <= halfVisible) {
        endPage = Math.min(totalPages, maxVisiblePages);
      }

      // Adjust if we're near the end
      if (currentPage > totalPages - halfVisible) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      // Add visible page range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageRange = getPageRange();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  return (
    <HStack justify="center" gap={2} py={4}>
      {/* First Page Button */}
      {showFirstLast && (
        <IconButton
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || disabled}
          size="sm"
          variant="ghost"
          aria-label="First page"
        >
          <ChevronsLeft size={18} />
        </IconButton>
      )}

      {/* Previous Button */}
      <IconButton
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        size="sm"
        variant="ghost"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </IconButton>

      {/* Page Numbers */}
      {pageRange.map((page, index) => {
        if (page === '...') {
          return (
            <Text key={`ellipsis-${index}`} color="text" px={2}>
              ...
            </Text>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            onClick={() => handlePageClick(pageNum)}
            size="sm"
            variant={isActive ? 'solid' : 'ghost'}
            colorScheme={isActive ? 'blue' : 'gray'}
            disabled={disabled}
            minW="40px"
            fontWeight={isActive ? 'bold' : 'normal'}
          >
            {pageNum}
          </Button>
        );
      })}

      {/* Next Button */}
      <IconButton
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        size="sm"
        variant="ghost"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </IconButton>

      {/* Last Page Button */}
      {showFirstLast && (
        <IconButton
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || disabled}
          size="sm"
          variant="ghost"
          aria-label="Last page"
        >
          <ChevronsRight size={18} />
        </IconButton>
      )}

      {/* Page Info Text */}
      <Text fontSize="sm" color="text" ml={4} display={{ base: 'none', md: 'block' }}>
        Page {currentPage} of {totalPages}
      </Text>
    </HStack>
  );
}