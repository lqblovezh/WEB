
export function wrapPage(page) {
  page.pageBoundary = getPageBoundary(page);
  if (page.pageNumber > 1) {
    page.prePage = page.pageNumber - 1;
  } else {
    page.prePage = 1;
  }
  if (page.pageNumber < page.countPage) {
    page.nextPage = page.pageNumber + 1;
  } else {
    page.nextPage = page.countPage;
  }
}


export function getPageBoundary(page) {
  var start = 0;
  var end = 10;
  if (page.pageNumber > 5 && page.pageNumber + 5 < page.countPage) {
    start = page.pageNumber - 4;
    end = page.pageNumber + 5;
  }
  if (page.pageNumber <= 5 && page.pageNumber + 5 < page.countPage) {
    start = 1;
    if (page.countPage >= 10) {
      end = 10;
    } else {
      end = page.countPage;
    }
  }
  if (page.pageNumber > 5 && page.pageNumber + 5 >= page.countPage) {
    start = page.pageNumber - 4;
    if (page.countPage >= 10) {
      if (page.pageNumber + 5 > page.countPage) {
        start = page.countPage - 9;
        end = page.countPage;
      } else {
        end = page.pageNumber + 5;
      }
    } else {
      start = 1;
      end = page.countPage;
    }
  }
  if (page.pageNumber <= 5 && page.pageNumber + 5 >= page.countPage) {
    start = 1;
    if (page.countPage >= 10) {
      end = page.pageNumber + 5;
    } else {
      end = page.countPage;
    }

  }
  return {
    start,
    end
  }
}