library(phylotree)

context("Testing Basic phylotree Widget Creation")


test_that("tree-only widget creation works", {

  tree   <- ape::rtree(200)
  widget <- phylotree(tree)
  widget
  expect_is(widget, "phylotree")

})

