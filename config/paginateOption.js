const myCustomLabels = {
    docs: 'data',
    totalDocs: 'totalCount',
    limit: 'perPageLimit',
    page: 'currentPage',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'totalPageCount',
    pagingCounter: false,
    hasPrevPage: false,
    hasNextPage: false
  };
  
  const paginateOption = (page = 1, limit = 20)=>{
      return {
          page,
          limit,
          customLabels: myCustomLabels,
      }
  }

  module.exports = paginateOption