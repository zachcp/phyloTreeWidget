#' create_colormaps
#'
#' create colormaps for dataframe columns
#'
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
    nuniq        <- length(unique(df[[col]]))
    local_colors <- colormap_pal()(nuniq)
    colmap[col]  <- list(local_colors)
  }

  return(colmap)
}
