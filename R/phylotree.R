#' phylotree html widget
#'
#' <Add Description>
#'
#' @import htmlwidgets
#' @import htmltools
#'
#' @export
phylotree <- function(tree, data=NULL, python="python", width = NULL, height = NULL, elementId = NULL) {

  treejson <- process_tree(tree, data, python)

  # named list of color HEX values
  colors   <- create_colormaps(data)
  print(colors)

  # forward options using x
  params = list(
    message  = message,
    colors   = colors,
    treejson = treejson
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
    list(
      tags$div(
        id = id,
        style=style,
        class=class,
        HTML(sprintf("<svg width=%s height=%s id='treeplot'></svg>", width, height))),

      # Controls
      tags$div(
        tags$h4("Layout"),
        HTML(sprintf(
          '<select id="%s-layout">
		          <option value="rect">rectangular</option>
              <option value="radial">radial</option>
              <option value="unrooted">unrooted</option>
              <option value="clock">clock</option>
         </select>', id)),

        tags$h4("Distance"),
        HTML(sprintf(
          '	<select id="%s-distance">
	            <option value="div">divergence</option>
              <option value="num_date">time</option>
              <option value="level">level</option>
         </select>', id))),

      tags$h4("Color-By"),
      HTML(sprintf(
        '<select id="%s-colorby">

        </select>', id)),

        tags$h4("View Changes"),
        tags$div(
          HTML(sprintf('<button id="size">Random Size</button>')),
          HTML(sprintf('<button id="color">Random Color</button>')),
          HTML(sprintf('<button id="both">Random Both</button>')),
          HTML(sprintf('<button id="reset">Reset View</button>')))
      )
  }
