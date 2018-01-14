#' highlight_tips
#'
#' this function allows you to pass options for tips to be highlighted
#'
#' @export
highlight_tips <- function(phytree, 
                           tipregex, 
                           column='strain', 
                           highlight_color='#60AA9E', 
                           highlight_size=10) {
  
  highlights <- phytree$x$highlights
  
  if (is.null(highlights)) {
    highlightslot <- 1
  } else {
    highlightslot <- length(highlights) + 1
  }
    
  phytree$x$highlights[[highlightslot]] <- list(
    tipregex=tipregex,
    column=column, 
    highlight_color=highlight_color,
    highlight_size=highlight_size
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
