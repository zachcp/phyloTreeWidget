library(phylotree)

context("Testing Coercion of Tree Types")


test_that("handle data conversion of phylo trees to phylo4d", {

  tree   <- ape::rtree(200)
  df     <- data.frame(column1=tree$tip.label,
                       column2=tree$tip.label,
                       column3=tree$tip.label)

  phy1     <- coerce_to_phy4d(tree, data=NULL)
  phy1data <- phylobase:::.phylo4ToDataFrame(phy1)


  expect_is(phy1, "phylo4d")
  expect_equal(length(names(phy1data)), 7)
  expect_setequal(names(phy1data),
                  c("label", "node", "ancestor", "edge.length", "node.type",
                    "node", "col1"))

  phy2     <- coerce_to_phy4d(tree, data=df)
  phy2data <- phylobase:::.phylo4ToDataFrame(phy2)
  expect_is(phy2, "phylo4d")
  expect_equal(length(names(phy2data)), 8)
  expect_setequal(names(phy2data),
                  c("label", "node", "ancestor", "edge.length", "node.type",
                    "column1","column2", "column3"))

})


test_that("handle phylo4 inputs", {

  data(geospiza)

  geospizadata <-  phylobase:::.phylo4ToDataFrame(geospiza)
  expect_equal(length(names(geospizadata)), 10)

  # remove the extra data
  geophy4  <- as(geospiza, "phylo4")
  phy1     <- coerce_to_phy4d(geophy4, data=NULL)
  phy1data <- phylobase:::.phylo4ToDataFrame(phy1)

  expect_is(phy1, "phylo4d")
  expect_equal(length(names(phy1data)), 7)
  expect_setequal(names(phy1data),
                  c("label", "node", "ancestor", "edge.length", "node.type",
                    "node", "col1"))

  geophy4data <- tdata(geospiza)
  phy2        <- coerce_to_phy4d(geophy4, data=geophy4data)
  phy2data    <- phylobase:::.phylo4ToDataFrame(phy2)
  expect_is(phy2, "phylo4d")
  expect_equal(length(names(phy2data)), 10)
  expect_setequal(names(phy2data),
                  c("label", "node", "ancestor", "edge.length", "node.type",
                    "wingL", "tarsusL",  "culmenL", "beakD", "gonysW"))

})
