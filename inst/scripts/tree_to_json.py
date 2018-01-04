#
#
#  Convert Newick Trees to JSON consumable by phyloTree
#
#

import json
from io import StringIO

import click

import pandas as pd

from Bio import Phylo


class PhyloTree(object):
    """
    Data  Tree and optional Dataframe and return JSON ready for consumption with PhyloTree js.


    phytree = PhyloTree(tree = Phylo.read(StringIO("(A, (B, C), (D, E), F)"), "newick"),
                        data = pd.DataFrame({"node": ["A", "B", "C", "D", "E", "F"],
                          "lat": [10,11,12,13,14, 15],
                          "kind": ["AA", "BA", "CA", "DA", "EA", "FA"]}))

    phytree.write_json("data/testdata.json")


    """
    def __init__(self, tree, data):
      
        print('Loading data')
        self.tree = tree
        #print(self.tree)
        self.data = data
        # Phylo.draw_ascii(self.tree)

        print('Adorning Tree')
        self.jsontree = self.adorntree(self.tree, self.data)
        print("JSON Tree")
        #print(self.jsontree)
        #print(self.tree)
        
        print('Preparing Json')
        self.json = self.tree_to_json(self.jsontree)


    def adorntree(self, tree, dataframe):
        """

        """
        dataframe = dataframe.set_index("node")
        nodevals  = dataframe.to_dict("index")

        nodes     = set(nodevals.keys())
        rowprops  = dataframe.columns

        nodenum=0
        #print(tree)
        
        for treenode in tree.find_clades():

            if treenode.name in nodes:
                for attr in rowprops:
                    treenode.__setattr__(attr, nodevals[treenode.name][attr])
            else:
                treenode.__setattr__("node", "NODE_{:06d}".format(nodenum))

            nodenum+=1
        return tree


    def tree_to_json(self,
                     tree,
                     exclude_attr = ['clades'],
                     default_branch_length=0.01):

        
        tree_json = {}
        #print("tree_to_json: tree")
        #print(tree)
        node      = tree.root
        nodeprops = {key: value for key, value in node.__dict__.items()
                     if not key.startswith("__")
                     and key not in exclude_attr}

        if "name" in nodeprops.keys():
            tree_json["strain"] = nodeprops['name']
        if "id" in nodeprops.keys():
            tree_json["strain"] = nodeprops['id']
        if "node" in nodeprops.keys():
            tree_json["strain"] = nodeprops['node']

        # add node data
        for key, value in nodeprops.items():
            if value is None:
                if key == "branch_length":
                    tree_json["branch_length"] = default_branch_length
            else:
                tree_json[key] = value

        # recur
        if node.clades:
            tree_json["children"] = []
            for ch in node.clades:
                tree_json["children"].append(self.tree_to_json(ch, exclude_attr))
        return tree_json


    def write_json(self, file_name, indent=1):
        try:
            handle = open(file_name, 'w')
        except IOError:
            pass
        else:
            json.dump(self.json, handle, indent=indent)
            handle.close()

@click.command()
@click.option('--newick', help='File with newick string.')
@click.option('--nodedata', help='File with nodedata.')
@click.option('--jsonout', help='Output file.')
def process_tree(newick, nodedata, jsonout):
    """convert tree and node data to JSON"""
    
    try:
      tree = Phylo.read(newick, "newick")
      if isinstance(tree, tuple):
        tree = tree[0]
      #print("tree is loaded:", tree)
    except:
      raise ValueError('newick file unreadable')
      
    try:
      nodedf = pd.read_table(nodedata)
      #print("data is loaded:", nodedf)
    except:
      print("cannot read the node table")
    
    # else:
    #   names = [clade.name for clade in tree.get_terminals()]
    #   nodedata = pd.DataFrame({"nodes": names})

    print('Processing Tree')
    phytree = PhyloTree(tree = tree, data = nodedf)
    print('Writing Json')
    phytree.write_json(jsonout)
        

if __name__ == '__main__':
    process_tree()
