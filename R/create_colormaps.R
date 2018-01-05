#' create_colormaps
#'
#' create colormaps for dataframe columns
#'
#' @param df Required. A dataframe containing infornation about nodes in the tree.
#' @param custommaps. Optional. Curently a stub. There needs to be a way to pass in custom colors.
#' @importFrom colormap colormap_pal
#'
#' @export
create_colormaps <- function(df, custommaps=NULL) {
  if (!names(df)[1] == "node") stop("input dataframe must have first
                               column labelled 'node'")

  colmap <- list()
  cols   <- names(df)[2:length((names(df)))]

  # for now simply assign colors based on discrete scale of uniques.
  # TODO: handle, options, continuous,etc.
  for (col in cols) {
    colvals        <- as.character(sort(unique(df[[col]])))
    local_colors   <- colormap_pal()(length(colvals))
    # keep hex tag and 6 characters to ignore the alpha channel
    local_colors   <- as.character(Map(function(d){substr(d,1,7)}, local_colors))
    localcolorlist <- list()

    for (i in seq_along(colvals)) {
      localcolorlist[[colvals[i] ]] <- local_colors[i]
    }

    colmap[col]  <- list(localcolorlist)
  }

  return(colmap)
}

