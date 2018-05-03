#' create_sizemaps
#'
#' create size-maps. Find numeric/integer columns of a dataframe and get the max/min values.
#'
#' @param df Required. A dataframe containing infornation about nodes in the tree.
#' @param custommaps. Optional. Curently a stub. There needs to be a way to pass in custom colors.
#'
#' @export
create_sizemaps <- function(df, custommaps=NULL, exclude_attr = c('node', 'ancestor', 'node.type')) {

  sizemap <- list()

  for (col in names(df)) {

    if (!col %in% exclude_attr) {
      if (class(df[[col]]) %in% c('integer', 'numeric')) {
        coldata <- df[[col]]
        maxcol  <- max(coldata)
        mincol  <- min(coldata)
        sizemap[[col]]  <- list(max=maxcol, min=mincol)
      }
    }
  }
  return(sizemap)
}

