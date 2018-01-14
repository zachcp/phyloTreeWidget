#' highlight_tips
#'
#' this function allows you to pass options for tips to be highlighted
#'
#' @export
highlight_tips <- function(phytree,
                           tipregex,
                           column='strain',
                           highlight_color='#60AA9E',
                           highlight_color_stroke=NULL,
                           highlight_size=10,
                           highlight_stroke_width=2) {

  highlights <- phytree$x$highlights

  # add highlight to growing list
  if (is.null(highlights)) {
    highlightslot <- 1
  } else {
    highlightslot <- length(highlights) + 1
  }

  #
  if (is.null(highlight_color_stroke)) highlight_color_stroke <- highlight_color

  # put highlight data into the params list.
  phytree$x$highlights[[highlightslot]] <- list(
    tipregex=tipregex,
    column=column,
    highlight_color=highlight_color,
    highlight_color_stroke=highlight_color_stroke,
    highlight_size=highlight_size,
    highlight_stroke_width=highlight_stroke_width
  )

  phytree
}

#' hide_controls
#'
#' hide the controls
#'
#' @export
hide_controls <- function(phytree) {
  phytree$x$controlpanel <- FALSE
  phytree
}

#' change_tipsize
#'
#' change tipsize
#'
#' @export
change_tipsize <- function(phytree, size=10) {
  phytree$x$tipRadius <- size
  phytree
}
