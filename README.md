
<!-- README.md is generated from README.Rmd. Please edit that file -->
phylotree
=========

The goal of phylotree is to provide an R interface to the phyloTree JS library in order to make beautiful, interactive trees from any standard data source.

Installation
------------

You can install phylotree from github with:

``` r
# install.packages("devtools")
devtools::install_github("zachcp/phyloTreeWidget")

# note you will ALSO need python with the following
# libraries installed: click, biopython, pandas
```

Example
-------

This is a basic example which shows you how to generate a tree with data from ape.

``` r
library(ape)
data("bird.families")

# create a dataframe using the tips from the
# bird.families tree. first column must be "node"
birddata <- data.frame(
  node = bird.families$tip.label,
  col1 = sample(1:5, length(bird.families$tip.label), replace=T),
  col2 = sample(1:20, length(bird.families$tip.label), replace=T),
  col4 = sample(LETTERS[1:10], length(bird.families$tip.label), replace=T)
)

# currently colors are very simple.
# we can imagein a few ways of passing colors/colormaps into a widget
create_colormaps(birddata)

# plot the widget.
# note that the data -> JSOn converter requieres python with the following
# libraries installed: click, biopython, pands
# # phylotree(tree=bird.families, data=birddata, python="/Users/zach/anaconda3/bin/python")
phylotree(tree=bird.families, data=birddata)
phylotree(tree=bird.families, data=birddata, width=500, height=500)
```

![](phyloTreeWidget1.png) ![](phyloTreeWidget2.png) ![](phyloTreeWidget3.png)
