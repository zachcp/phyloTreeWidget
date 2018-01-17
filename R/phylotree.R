#' phylotree html widget
#'
#' <Add Description>
#'
#' @import htmlwidgets
#' @import htmltools
#'
#' @export
phylotree <- function(tree,
                      data=NULL,
                      layout="radial",
                      distance="div",
                      tipFontSize=8,
                      orientation_x=1,
                      orientation_y=1,
                      margins = 70,
                      #callbacks:{},  Still need to implement callbacks
                      zoomLevel_x =1,
                      zoomLevel_y =1,
                      pan_x =0,
                      pan_y =0,
                      tipRadius=10.0,
                      tipMinRadius=1,
                      tipMaxRadius=15,
                      tipStroke="#555",
                      tipFill="#555",
                      tipStrokeWidth=1.0,
                      branchStroke="#555",
                      branchStrokeWidth=2.0,
                      branchOpacity=0.3,
                      autoTipSize=TRUE,
                      width = NULL,
                      height = NULL,
                      elementId = NULL,
                      highlight_color="#FF0000",
                      highlight_size=30) {

  treejson <- process_tree(tree, data)

  # named list of color HEX values
  colors   <- create_colormaps(data)
  sizes    <- create_sizemaps(data)

  # forward options using x
  params = list(
    colors   = colors,
    sizes    = sizes,
    treejson = treejson,
    layout   = layout,
    distance = distance,
    highlights  = NULL,
    highlightlists = NULL,
    tipFontSize = tipFontSize,
    orientation_x = orientation_x,
    orientation_y = orientation_y,
    margins = margins,
    #callbacks:{},  Still need to implement callbacks
    zoomLevel_x = zoomLevel_x,
    zoomLevel_y = zoomLevel_y,
    pan_x = pan_x,
    pan_y = pan_y,
    tipRadius=tipRadius,
    tipMinRadius=tipMinRadius,
    tipMaxRadius=tipMaxRadius,
    tipStroke=tipStroke,
    tipFill=tipFill,
    tipStrokeWidth=tipStrokeWidth,
    branchStroke=branchStroke,
    branchThickness=NULL,
    branchOpacity=branchOpacity,
    autoTipSize=autoTipSize,
    controlpanel=TRUE,
    highlight_color = highlight_color,
    highlight_size = highlight_size
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



######################################################
## HTML Helpers
##


layout_control <- function(id) {
  div(class="columns",
      div(class="column is-one-third", tags$label(class="label"," Layout")),
      div(class="column one",
          div(class="field",
              div(class="control is-expanded",
                  div(class="select is-fullwidth",
                      HTML(sprintf(
                        '<select id="%s-layout">
                        <option value="radial">radial</option>
                        <option value="rect">rectangular</option>
                        <option value="unrooted">unrooted</option>
                        <option value="clock">clock</option>
                        </select>', id)))))))
}

distance_control <- function(id) {
  div(class="columns",
      div(class="column is-one-third", tags$label(class="label", "Distance")),
      div(class="column",
          div(class="field",
              div(class="control is-expanded",
                  div(class="select is-fullwidth",
                      HTML(sprintf(
                        '	<select id="%s-distance">
                            <option value="div">divergence</option>
                            <option value="num_date">time</option>
                            <option value="level">level</option>
                          </select>', id)))))))
}


color_control <- function(id) {
  div(class="columns",
      div(class="column is-one-third", tags$label(class="label", "Color")),
      div(class="column",
          div(class="field",
              div(class="control is-expanded",
                  div(class="select is-fullwidth",
                      HTML(sprintf('<select id="%s-colorby"> </select>', id)))))))
}

size_control <- function(id) {
  div(class="columns",
      div(class="column is-one-third", tags$label(class="label is-expanded", "Size")),
      div(class="column",
          div(class="field",
              div(class="control is-expanded",
                  div(class="select is-fullwidth",
                      HTML(sprintf('<select id="%s-sizeby">SELECT </select>', id)))))))
}


#' Using Bulma Extension CSS for Switch Behavior
tiplabel_control_switch <- function(id) {
  div(class="columns",
      div(class="column is-one-third", tags$label(class="label", "Tip Labels")),
      div(class="column",
          div(class="field",
              tags$input(class="switch",
                         id=sprintf("%s-tiplabels", id),
                         name="switchMedium",
                         type="checkbox"),
              HTML(sprintf('<label for="%s-tiplabels">Tip Labels</label>', id)))))

}

regex_highlight_switch <- function(id) {
  div(class="field has-addons has-addons-right",
      tags$p(class="control",
             tags$input(class="input",
                        id=sprintf("%s-regexinput", id),
                        type="text",
                        placeholder="Regex Selection")),
      tags$p(class="control",
             tags$span(class="select",
                       tags$select(id=sprintf("%s-regexselectbox", id))))
      )
}

reset_control <- function(id) {
  div(class="columns",
      div(class="column",
          div(class="buttons control",
              tags$span(id=sprintf("%s-reset",id), class="button is-info is-small ", "Zoom"),
              tags$span(id=sprintf("%s-resettipsize",id), class="button is-info is-small", "Tip Size"),
              tags$span(id=sprintf("%s-resetbranchsize",id), class="button is-info is-small", "Branch Size"),
              tags$span(id=sprintf("%s-resettipcolor",id), class="button is-info is-small", "Tip Color"))))
}


modal <- function() {
  div(class="modal",
      div(class="modal-background"),
      div(class="modal-card",
          tags$header(class="modal-card-head",
                      # add title here
                      HTML(sprintf('<p class="modal-card-title"></p>')),
                      HTML(sprintf('<button class="delete modal-close" aria-label="close"></button>'))),
          tags$section(class="modal-card-body")))
}


#' This is the HTML Widget custom render html fn.
#'
phylotree_html <- function(id, style, class, width, height, ...) {
  div(id = id,
      style=style,
      class=class,

      #svg and controls
      div(class="container is-widescreen",
          div(class="columns",
             div(class="column is-one-quarter", id = sprintf("%s-controlpanel", id),
                  div(class="box",
                      tags$p(align="center", "phylotree controls"),
                      tags$hr(),
                      layout_control(id=id),
                      distance_control(id=id),
                      color_control(id=id),
                      size_control(id=id),
                      tiplabel_control_switch(id=id),
                      regex_highlight_switch(id=id),
                      tags$hr(),
                      tags$p(align="center", "resets"),
                      reset_control(id=id))),

            div(class="column",
                # Tree SVG
                HTML(sprintf("<svg width=%s height=%s id='%s-treeplot'></svg>",
                             width, height, id)))
          )
        ),
      #modal
      modal(),

      #tooltip
      div(id=sprintf('%s-tooltip', id), class="tooltip notification is-info", style=css(opacity=0))
    )
}



