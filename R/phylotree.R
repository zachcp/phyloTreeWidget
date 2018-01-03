#' phylotree html widget
#'
#' <Add Description>
#'
#' @import htmlwidgets
#' @import htmltools
#'
#' @export
phylotree <- function(message, width = NULL, height = NULL, elementId = NULL) {

  #
  library(jsonlite)
  zikatree   <- system.file("exampledata/treejson/zika_tree.json",
                          package="phylotree")

  zikajson <- jsonlite::read_json(zikatree)
  #jsonlite::write_json(zikajson)

  # forward options using x
  params = list(
    message = message,
    zika = zikajson
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'phylotree',
    params,
    width = width,
    height = height,
    package = 'phylotree',
    elementId = elementId
  )
}

#' Shiny bindings for phyloTree
#'
#' Output and render functions for using phyloTree within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a phyloTree
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name phylotree-shiny
#'
#' @export
phylotreeOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'phylotree', width, height, package = 'phylotree')
}

#' @rdname phylotree-shiny
#' @export
renderPhylotree <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, phylotreeOutput, env, quoted = TRUE)
}


phylotree_html <- function(id, style, class, width, height, ...) {
    list(tags$div(id = id,
                  style=style,
                  class=class,
                  HTML(sprintf("<svg width=%s height=%s id='treeplot'></svg>", width, height))))

  }
