#' highlight_tips_regex
#'
#' this function allows you to pass options for tips to be highlighted using a regex
#'
#' @export
highlight_tips_regex <- function(phytree,
                           tipregex,
                           column='strain',
                           highlight_color='#60AA9E',
                           highlight_color_stroke=NULL,
                           highlight_size=NULL,
                           highlight_stroke_width=NULL,
                           add_dash=FALSE,
                           opacity=NULL) {

  highlights <- phytree$x$highlights

  # add highlight to growing list
  if (is.null(highlights)) {
    highlightslot <- 1
  } else {
    highlightslot <- length(highlights) + 1
  }

  #
  #if (is.null(highlight_color_stroke)) highlight_color_stroke <- highlight_color

  # put highlight data into the params list.
  phytree$x$highlights[[highlightslot]] <- list(
    tipregex=tipregex,
    column=column,
    highlight_color=highlight_color,
    highlight_color_stroke=highlight_color_stroke,
    highlight_size=highlight_size,
    highlight_stroke_width=highlight_stroke_width,
    add_dash=add_dash,
    opacity=opacity
  )

  phytree
}

#' highlight_tips_list
#'
#' this function allows you to pass options for tips to be highlighted using a membership list
#'
#' @export
highlight_tips_list <- function(phytree,
                                 nodenames,
                                 column='strain',
                                 highlight_color=NULL,
                                 highlight_color_stroke=NULL,
                                 highlight_size=NULL,
                                 highlight_stroke_width=NULL,
                                 add_dash=FALSE,
                                 opacity=NULL) {


  highlights <- phytree$x$highlightlists

  # add highlight to growing list
  if (is.null(highlights)) {
    highlightslot <- 1
  } else {
    highlightslot <- length(highlights) + 1
  }

  #
  #if (is.null(highlight_color_stroke)) highlight_color_stroke <- highlight_color

  # put highlight data into the params list.
  phytree$x$highlightlists[[highlightslot]] <- list(
    nodenames=nodenames,
    column=column,
    highlight_color=highlight_color,
    highlight_color_stroke=highlight_color_stroke,
    highlight_size=highlight_size,
    highlight_stroke_width=highlight_stroke_width,
    dasharray=add_dash,
    opacity=opacity
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

#' scale_branchthickness
#'
#' change scale_branchthickness
#'
#' @export
scale_branchthickness <- function(phytree, scale="linear", size=NULL) {
  phytree$x$branchThickness <- scale
  phytree
}

#' change_layout
#'
#' change the layout
#'
#' @export
change_layout <- function(phytree, layout) {
  valid_layouts <- c('radial', 'rect', 'unrooted', 'clock')
  if (!layout %in% valid_layouts)
    stop (paste("Invalid layout. Layout must be one of ", valid_layouts))

  phytree$x$layout <- layout
  phytree
}


